export const SCHEMA_VERSION = 3;

export const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
}[character]));

export function textToHtml(value) {
  const paragraphs = String(value || '').trim().split(/\n{2,}/).filter(Boolean);
  return paragraphs.length ? paragraphs.map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g,'<br>')}</p>`).join('') : '<p></p>';
}

export function stripHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<\/p>|<\/li>|<\/h\d>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

export function normalizeWorkspace(input) {
  const workspace = input && typeof input === 'object' ? structuredClone(input) : {};
  workspace.schemaVersion = SCHEMA_VERSION;
  workspace.spaces = Array.isArray(workspace.spaces) && workspace.spaces.length ? workspace.spaces : [
    { id:'learning-lab', name:'Learning lab', color:'lavender' },
    { id:'ideas-essays', name:'Ideas & essays', color:'peach' },
    { id:'product-research', name:'Product research', color:'mint' }
  ];
  workspace.canvases = Array.isArray(workspace.canvases) ? workspace.canvases : [];
  workspace.canvases.forEach((canvas, index) => {
    canvas.spaceId ||= workspace.spaces[index % workspace.spaces.length]?.id || 'learning-lab';
    canvas.updatedAt ||= Date.now();
    canvas.state ||= { title:'Untitled canvas', nodes:[], edges:[], revision:1 };
    canvas.state.nodes = Array.isArray(canvas.state.nodes) ? canvas.state.nodes : [];
    canvas.state.edges = Array.isArray(canvas.state.edges) ? canvas.state.edges : [];
    canvas.state.activity = Array.isArray(canvas.state.activity) ? canvas.state.activity : [];
    canvas.state.pending = Array.isArray(canvas.state.pending) ? canvas.state.pending : [];
    canvas.state.intent ||= 'understand';
    canvas.state.nodes.forEach(node => {
      node.type ||= 'note';
      node.title ||= 'Untitled card';
      node.content ||= '<p></p>';
      node.width = Number(node.width || 310);
      node.x = Number(node.x || 0);
      node.y = Number(node.y || 0);
    });
  });
  if (!workspace.canvases.some(canvas => canvas.id === workspace.activeId)) workspace.activeId = workspace.canvases[0]?.id || null;
  workspace.activeSpaceId ||= workspace.canvases.find(canvas => canvas.id === workspace.activeId)?.spaceId || workspace.spaces[0]?.id || null;
  workspace.audit = Array.isArray(workspace.audit) ? workspace.audit : [];
  return workspace;
}

export function inferCapture(raw, explicitType = 'auto', explicitTitle = '') {
  const value = String(raw || '').trim();
  const isUrl = /^https?:\/\/\S+$/i.test(value);
  const type = explicitType === 'auto' ? (isUrl ? 'source' : /\?$/.test(value) ? 'question' : 'note') : explicitType;
  let title = String(explicitTitle || '').trim();
  let sourceUrl = '';
  if (isUrl) {
    sourceUrl = value;
    if (!title) {
      try {
        const url = new URL(value);
        title = `${url.hostname.replace(/^www\./,'')}${url.pathname === '/' ? '' : url.pathname}`.slice(0,100);
      } catch (_) { title = 'New source'; }
    }
  }
  if (!title) title = value.split(/\n/)[0].replace(/^[-#*\s]+/,'').slice(0,88) || 'Untitled card';
  const content = isUrl
    ? `<p><a href="${escapeHtml(value)}">${escapeHtml(value)}</a></p><p>Add the useful claim, evidence, and why this source matters.</p>`
    : textToHtml(value);
  return { type, title, sourceUrl, content, kicker:type === 'source' ? 'Source' : type === 'question' ? 'Open question' : type === 'insight' ? 'Insight' : 'Note' };
}

const operationId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

export function applyOperations(state, operations, actor = 'Atlas', options = {}) {
  const now = new Date().toISOString();
  const summaries = [];
  const createdIds = [];
  const idFactory = options.idFactory || operationId;
  operations.forEach(operation => {
    if (operation.type === 'create_node') {
      const node = {
        id:operation.node?.id || idFactory('node'), x:Number(operation.node?.x ?? 420), y:Number(operation.node?.y ?? 260),
        width:Number(operation.node?.width ?? 320), color:operation.node?.color || '', type:operation.node?.type || 'note',
        kicker:operation.node?.kicker || 'Atlas suggestion', title:operation.node?.title || 'Untitled insight',
        content:operation.node?.content || '<p></p>', sourceUrl:operation.node?.sourceUrl || '', agent:true,
        createdBy:actor, createdAt:now
      };
      state.nodes.push(node); createdIds.push(node.id); summaries.push(`Added “${node.title}”`);
      return;
    }
    if (operation.type === 'update_node') {
      const node = state.nodes.find(item => item.id === (operation.nodeId || operation.id));
      if (!node) throw new Error(`Unknown node: ${operation.nodeId || operation.id}`);
      Object.assign(node, operation.patch || {}, { agent:true, updatedBy:actor, updatedAt:now });
      summaries.push(`Updated “${node.title}”`); return;
    }
    if (operation.type === 'connect') {
      if (!state.nodes.some(node => node.id === operation.from) || !state.nodes.some(node => node.id === operation.to)) throw new Error('Both connection nodes must exist');
      if (!state.edges.some(edge => edge.from === operation.from && edge.to === operation.to)) state.edges.push({ id:idFactory('edge'), from:operation.from, to:operation.to, relationship:operation.relationship || 'related to', agent:true, createdBy:actor, createdAt:now });
      summaries.push(`Connected two ideas as “${operation.relationship || 'related to'}”`); return;
    }
    if (operation.type === 'update_edge') {
      const edge = state.edges.find(item => operation.edgeId ? item.id === operation.edgeId : item.from === operation.from && item.to === operation.to);
      if (!edge) throw new Error('Unknown connection');
      Object.assign(edge, operation.patch || {}, { agent:true, updatedBy:actor, updatedAt:now });
      summaries.push('Updated a connection'); return;
    }
    if (operation.type === 'delete_node') {
      if (!options.allowDelete) throw new Error('Deletion requires explicit approval');
      const node = state.nodes.find(item => item.id === operation.nodeId);
      state.nodes = state.nodes.filter(item => item.id !== operation.nodeId);
      state.edges = state.edges.filter(edge => edge.from !== operation.nodeId && edge.to !== operation.nodeId);
      summaries.push(`Deleted “${node?.title || 'a card'}”`); return;
    }
    throw new Error(`Unsupported operation: ${operation.type}`);
  });
  state.revision = (state.revision || 0) + 1;
  state.activity ||= [];
  const activity = { id:idFactory('activity'), actor, at:now, action:'transaction', summaries, operations:operations.length };
  state.activity.unshift(activity);
  state.activity = state.activity.slice(0,100);
  return { activity, createdIds };
}

export function buildOfflineProposal(prompt, state, scopeId = null) {
  const cleanPrompt = String(prompt || '').trim();
  const selected = state.nodes.find(node => node.id === scopeId);
  const center = selected ? { x:selected.x + 410, y:selected.y + 40 } : { x:420 + (state.nodes.length % 3) * 390, y:220 + Math.floor(state.nodes.length / 3) * 290 };
  const lower = cleanPrompt.toLowerCase();
  let type = 'question';
  let kicker = 'Question to explore';
  let title = cleanPrompt.replace(/[.!]+$/,'');
  let content = '<p>Use this question to test assumptions, locate evidence, and decide what would change your understanding.</p>';
  if (/connect|relationship/.test(lower) && selected && state.nodes.length > 1) {
    const target = state.nodes.find(node => node.id !== selected.id);
    return { title:'A possible connection', rationale:'Atlas found a nearby idea worth examining. This local proposal is available even when cloud AI is offline.', operations:[{ type:'connect', from:selected.id, to:target.id, relationship:'may connect to' }] };
  }
  if (/challenge|assumption|weak/.test(lower)) {
    kicker = 'Assumption check'; title = selected ? `What would challenge “${selected.title}”?` : 'Which assumption would change the conclusion?';
    content = '<p>Name the strongest counterexample, alternative explanation, or missing condition. Then attach evidence that would distinguish between them.</p>';
  } else if (/summar|synthes|bigger picture/.test(lower)) {
    type = 'insight'; kicker = 'Synthesis prompt'; title = selected ? `What “${selected.title}” changes` : 'The emerging pattern';
    content = `<p>${state.nodes.length} cards are in view. Identify the central claim, the strongest support, and the most important unresolved question.</p>`;
  } else if (/plan|next|action/.test(lower)) {
    type = 'note'; kicker = 'Next move'; title = 'The next useful action';
    content = '<p>Choose the smallest action that reduces uncertainty: find one primary source, test one assumption, or compare two competing explanations.</p>';
  } else if (!title || title.length > 110) {
    title = 'What important question is missing?';
  }
  const node = { type, kicker, title:title.slice(0,110), content, color:type === 'question' ? 'rose' : type === 'insight' ? 'green' : 'blue', x:center.x, y:center.y, width:340 };
  return { title:'A proposal for your canvas', rationale:'Preview this suggestion before adding it. Cloud AI will provide richer, context-specific proposals when available.', operations:[{ type:'create_node', node }] };
}

export function searchWorkspace(workspace, query) {
  const q = String(query || '').trim().toLowerCase();
  const results = [];
  workspace.canvases.forEach(canvas => canvas.state.nodes.forEach(node => {
    const haystack = `${canvas.state.title} ${node.title} ${node.kicker || ''} ${stripHtml(node.content)}`.toLowerCase();
    if (!q || haystack.includes(q)) results.push({ canvasId:canvas.id, canvasTitle:canvas.state.title, node });
  }));
  return results.slice(0,30);
}
