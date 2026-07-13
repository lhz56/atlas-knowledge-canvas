import './styles.css';

const STORAGE_KEY = 'atlas-workspace-v2';
const LEGACY_KEY = 'atlas-knowledge-canvas-v1';
const CLOUD_CREDS_KEY = 'atlas-cloud-credentials-v1';

const seedNodes = [
  {
    id: 'orientation', x: 220, y: 180, width: 320, color: 'dark', type: 'overview',
    kicker: 'Start here', title: 'A map of neural networks',
    content: `<p>Neural networks learn useful representations by repeatedly adjusting connections between simple computational units.</p><div class="tag-row"><span class="tag">architecture</span><span class="tag">learning</span><span class="tag">history</span><span class="tag">open questions</span></div>`
  },
  {
    id: 'architecture', x: 650, y: 105, width: 330, color: 'blue', type: 'concept',
    kicker: 'Core concept', title: 'Architecture',
    content: `<div class="diagram"><svg viewBox="0 0 280 110"><g opacity=".8"><line x1="42" y1="20" x2="138" y2="26"/><line x1="42" y1="20" x2="138" y2="55"/><line x1="42" y1="20" x2="138" y2="84"/><line x1="42" y1="55" x2="138" y2="26"/><line x1="42" y1="55" x2="138" y2="55"/><line x1="42" y1="55" x2="138" y2="84"/><line x1="42" y1="90" x2="138" y2="26"/><line x1="42" y1="90" x2="138" y2="55"/><line x1="42" y1="90" x2="138" y2="84"/><line x1="138" y1="26" x2="238" y2="55"/><line x1="138" y1="55" x2="238" y2="55"/><line x1="138" y1="84" x2="238" y2="55"/></g><g fill="#fff" stroke="#607fa8"><circle cx="42" cy="20" r="8"/><circle cx="42" cy="55" r="8"/><circle cx="42" cy="90" r="8"/><circle cx="138" cy="26" r="8" fill="#bcd4f1"/><circle cx="138" cy="55" r="8" fill="#bcd4f1"/><circle cx="138" cy="84" r="8" fill="#bcd4f1"/><circle cx="238" cy="55" r="9" fill="#769cc7"/></g></svg></div><p>Information moves through layers of weighted connections. Depth allows later layers to compose simpler features into richer representations.</p><ul><li><strong>Input:</strong> observed features</li><li><strong>Hidden layers:</strong> learned transformations</li><li><strong>Output:</strong> prediction or representation</li></ul>`
  },
  {
    id: 'neuron', x: 1080, y: 70, width: 300, color: '', type: 'concept',
    kicker: 'Building block', title: 'The artificial neuron',
    content: `<p>A neuron combines its inputs using learned weights, adds a bias, then passes the result through a nonlinear activation.</p><div class="formula">y = σ(w · x + b)</div><p>The nonlinearity is crucial: without it, many stacked layers collapse into a single linear transformation.</p>`
  },
  {
    id: 'learning', x: 650, y: 480, width: 350, color: 'purple', type: 'concept',
    kicker: 'Core concept', title: 'How networks learn', agent: true,
    content: `<p>Learning is an iterative feedback loop. The model makes a prediction, measures its error, and nudges parameters toward better behavior.</p><h3>THE TRAINING LOOP</h3><ul><li>Run examples through the network</li><li>Compare predictions with expected outputs</li><li>Propagate responsibility backward</li><li>Update weights and repeat</li></ul>`
  },
  {
    id: 'backprop', x: 1110, y: 410, width: 330, color: 'green', type: 'concept',
    kicker: 'Learning algorithm', title: 'Backpropagation', agent: true,
    content: `<p>Backpropagation applies the chain rule to efficiently compute how much every parameter contributed to the final error.</p><h3>THE CENTRAL INSIGHT</h3><p>Reuse intermediate derivatives while moving backward through the computation graph. This makes training large networks tractable.</p><div class="formula">∂L/∂w = ∂L/∂y · ∂y/∂w</div>`
  },
  {
    id: 'gradient', x: 1540, y: 460, width: 330, color: 'amber', type: 'concept',
    kicker: 'Optimization', title: 'Gradient descent',
    content: `<p>The gradient points toward the steepest increase in loss. Training takes a small step in the opposite direction.</p><div class="formula">θₜ₊₁ = θₜ − η∇L(θₜ)</div><ul><li><strong>θ</strong> — model parameters</li><li><strong>η</strong> — learning rate</li><li><strong>∇L</strong> — loss gradient</li></ul>`
  },
  {
    id: 'representation', x: 1490, y: 105, width: 350, color: 'rose', type: 'concept',
    kicker: 'Why depth matters', title: 'Hierarchical representations',
    content: `<p>Deep networks tend to organize information in stages. In vision, early layers respond to edges; middle layers combine them into textures and shapes; later layers respond to whole objects.</p><p>This hierarchy is not programmed by hand—it emerges from the training objective and data.</p>`
  },
  {
    id: 'history', x: 285, y: 570, width: 310, color: '', type: 'timeline',
    kicker: 'Timeline', title: 'Three waves of progress',
    content: `<h3>1958 · PERCEPTRON</h3><p>Rosenblatt demonstrates a trainable linear classifier.</p><h3>1986 · BACKPROP REVIVAL</h3><p>Rumelhart, Hinton, and Williams popularize multilayer training.</p><h3>2012 · DEEP LEARNING BREAKTHROUGH</h3><p>AlexNet transforms large-scale image recognition.</p>`
  },
  {
    id: 'source', x: 570, y: 900, width: 340, color: '', type: 'source',
    kicker: 'Primary source', title: 'Deep learning',
    content: `<p>A landmark overview explaining how multilayer computational models learn representations with multiple levels of abstraction.</p><div class="source-meta"><span class="source-badge">PDF</span><span><strong>LeCun, Bengio & Hinton</strong><small>Nature · 2015 · 9 pages</small></span></div>`
  },
  {
    id: 'question', x: 1030, y: 865, width: 340, color: 'question', type: 'question',
    kicker: 'Research question', title: 'How do transformers learn representations without recurrence?', agent: true,
    content: `<p>Compare attention-based representation learning with the hierarchical features learned by convolutional networks.</p>`
  },
  {
    id: 'insight', x: 1510, y: 850, width: 350, color: '', type: 'insight',
    kicker: 'Synthesis', title: 'The bigger picture',
    content: `<p>The story of neural networks is not just about larger models. Progress came from the interaction of <strong>better algorithms</strong>, <strong>more data</strong>, and <strong>specialized hardware</strong>.</p><p>Each factor amplified the others—and changed what researchers believed was possible.</p>`
  }
];

const seedEdges = [
  ['orientation','architecture'], ['orientation','learning'], ['orientation','history'],
  ['architecture','neuron'], ['architecture','representation'], ['learning','backprop'],
  ['backprop','gradient'], ['learning','question'], ['history','source'],
  ['gradient','insight'], ['representation','insight']
].map(([from,to], i) => ({ id: `edge-${i}`, from, to, agent: i === 5 || i === 6 }));

const workspace = loadWorkspace();
let state = workspace.canvases.find(canvas => canvas.id === workspace.activeId).state;
let view = { x: 35, y: 18, scale: .72 };
let selectedNode = null;
let connectMode = [];
let dragState = null;
let panState = null;
let toastTimer;
let activeTemplate = 'blank';
const undoStack = [];
const redoStack = [];
let cloudReady = false;
let cloudRevision = 0;
let cloudSyncTimer;

const els = {
  viewport: document.querySelector('#canvasViewport'), world: document.querySelector('#world'),
  nodes: document.querySelector('#nodes'), edges: document.querySelector('#edges'),
  zoomLabel: document.querySelector('#zoomLabel'), title: document.querySelector('#canvasTitle'),
  toast: document.querySelector('#toast'), palette: document.querySelector('#commandPalette'),
  searchInput: document.querySelector('#searchInput'), results: document.querySelector('#searchResults'),
  agentPanel: document.querySelector('#agentPanel'), sidebar: document.querySelector('#sidebar'),
  nodeActions: document.querySelector('#nodeActions'), canvasMenu: document.querySelector('#canvasMenu'),
  canvasList: document.querySelector('#canvasList'), saveState: document.querySelector('.save-state')
};

function miniCanvas(title, color, topics) {
  const nodes = topics.map((topic, index) => ({
    id: `${title.toLowerCase().replace(/\W/g,'-')}-${index}`, x: 270 + (index % 2) * 430, y: 170 + Math.floor(index / 2) * 330,
    width: index === 0 ? 350 : 310, color: index === 0 ? 'dark' : color, type: index === 0 ? 'overview' : 'concept',
    kicker: index === 0 ? 'Overview' : 'Key idea', title: topic,
    content: `<p>${index === 0 ? `A visual starting point for exploring ${title.toLowerCase()}.` : `Capture evidence, explanations, and open questions related to ${topic.toLowerCase()}.`}</p>`
  }));
  const edges = nodes.slice(1).map((node, index) => ({ id: `mini-edge-${index}`, from: nodes[0].id, to: node.id }));
  return { title, nodes, edges, revision: 1 };
}

function defaultWorkspace() {
  let legacy = null;
  try {
    legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
  } catch (_) {}
  const neuralState = legacy?.nodes?.length ? legacy : { title: 'Neural networks', nodes: structuredClone(seedNodes), edges: structuredClone(seedEdges), revision: 1 };
  return {
    activeId: 'neural-networks',
    canvases: [
      { id:'neural-networks', color:'lavender', updatedAt:Date.now(), state:neuralState },
      { id:'solar-system', color:'gold', updatedAt:Date.now()-3600000, state:miniCanvas('The solar system','amber',['The solar system','Inner planets','Gas giants','Beyond Neptune']) },
      { id:'behavioral-economics', color:'blue', updatedAt:Date.now()-7200000, state:miniCanvas('Behavioral economics','blue',['How people really decide','Cognitive biases','Nudges and choice','Open questions']) },
      { id:'history-of-typography', color:'coral', updatedAt:Date.now()-10800000, state:miniCanvas('History of typography','rose',['From manuscript to screen','Movable type','Modernism','Variable fonts']) },
      { id:'quantum-computing', color:'mint', updatedAt:Date.now()-14400000, state:miniCanvas('Quantum computing','green',['Quantum computing','Qubits','Entanglement','Error correction']) }
    ]
  };
}

function loadWorkspace() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.canvases?.length && saved.canvases.some(c => c.id === saved.activeId)) return saved;
  } catch (_) {}
  return defaultWorkspace();
}

function saveState() {
  state.title = els.title.textContent.trim() || 'Untitled canvas';
  state.revision = (state.revision || 0) + 1;
  const active = workspace.canvases.find(canvas => canvas.id === workspace.activeId);
  active.state = state;
  active.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  flashSaved();
  renderCanvasList();
  scheduleCloudSync();
}

function sanitizeContent(value) {
  const documentFragment = new DOMParser().parseFromString(`<body>${String(value || '')}</body>`, 'text/html');
  const allowedTags = new Set(['P','STRONG','EM','UL','OL','LI','A','H3','DIV','SPAN','BR','SVG','G','LINE','CIRCLE']);
  const allowedAttributes = new Set(['href','target','rel','class','viewBox','viewbox','x1','x2','y1','y2','cx','cy','r','fill','stroke','opacity']);
  [...documentFragment.body.querySelectorAll('*')].forEach(element => {
    if (!allowedTags.has(element.tagName)) { element.replaceWith(...element.childNodes); return; }
    [...element.attributes].forEach(attribute => { if (!allowedAttributes.has(attribute.name)) element.removeAttribute(attribute.name); });
    if (element.tagName === 'A') {
      const href = element.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) element.removeAttribute('href');
      element.setAttribute('target','_blank'); element.setAttribute('rel','noopener noreferrer');
    }
  });
  return documentFragment.body.innerHTML;
}

function cloudCredentials() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLOUD_CREDS_KEY));
    if (saved?.workspaceId && saved?.token) return saved;
  } catch (_) {}
  const bytes = new Uint8Array(32); crypto.getRandomValues(bytes);
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const credentials = { workspaceId:crypto.randomUUID(), token };
  localStorage.setItem(CLOUD_CREDS_KEY, JSON.stringify(credentials));
  return credentials;
}

function cloudEndpoint() {
  const credentials = cloudCredentials();
  return `${location.origin}/api/atlas/${credentials.workspaceId}`;
}

function agentBundle() {
  const credentials = cloudCredentials();
  return JSON.stringify({
    service:'Atlas Canvas', protocol:'atlas-agent-v1', endpoint:cloudEndpoint(), workspace:credentials.workspaceId,
    token:credentials.token, mcp:`${location.origin}/mcp/${credentials.workspaceId}`, skill:`${location.origin}/agent/atlas-canvas.skill`, instructions:`${location.origin}/agent/atlas-canvas/SKILL.md`
  }, null, 2);
}

async function cloudRequest(method, body) {
  const credentials = cloudCredentials();
  return fetch(cloudEndpoint(), {
    method,
    headers:{ 'authorization':`Bearer ${credentials.token}`, 'content-type':'application/json', 'x-atlas-agent':'Atlas web' },
    body:body ? JSON.stringify(body) : undefined,
  });
}

function applyRemoteWorkspace(remote) {
  if (!remote?.canvases?.length) return;
  workspace.canvases = remote.canvases;
  workspace.activeId = remote.canvases.some(canvas => canvas.id === workspace.activeId) ? workspace.activeId : remote.activeId;
  workspace.audit = remote.audit || [];
  workspace.cloudRevision = remote.cloudRevision || 0;
  cloudRevision = workspace.cloudRevision;
  state = workspace.canvases.find(canvas => canvas.id === workspace.activeId).state;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(workspace));
  els.title.textContent = state.title; renderCanvasList(); renderNodes(); applyView();
}

async function initializeCloud() {
  document.querySelector('#agentBundle').value = agentBundle();
  if (location.protocol === 'file:') return;
  try {
    let response = await cloudRequest('GET');
    if (response.status === 401) response = await cloudRequest('POST', { action:'bootstrap', workspace });
    if (!response.ok) throw new Error(`Cloud returned ${response.status}`);
    const result = await response.json();
    if (result.workspace) applyRemoteWorkspace(result.workspace);
    cloudReady = true;
    document.querySelector('#cloudStatus').textContent = 'Cloud workspace connected';
    document.querySelector('#cloudStatusDetail').textContent = 'Agents can make attributed changes while this browser is closed.';
    document.querySelector('.profile-button small').textContent = 'Cloud workspace connected';
  } catch (error) {
    document.querySelector('#cloudStatus').textContent = 'Local workspace ready';
    document.querySelector('#cloudStatusDetail').textContent = 'Cloud sync becomes available on the deployed Atlas site.';
  }
}

function scheduleCloudSync() {
  if (!cloudReady) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(syncCloud, 700);
}

async function syncCloud() {
  if (!cloudReady) return;
  try {
    const response = await cloudRequest('PUT', { workspace });
    if (!response.ok) throw new Error(`Cloud returned ${response.status}`);
    const result = await response.json(); cloudRevision = result.cloudRevision || cloudRevision;
  } catch (_) { document.querySelector('.profile-button small').textContent = 'Saved locally · sync retrying'; }
}

async function pollCloud() {
  if (!cloudReady || document.hidden) return;
  try {
    const response = await cloudRequest('GET'); if (!response.ok) return;
    const result = await response.json();
    if ((result.workspace?.cloudRevision || 0) > cloudRevision) { applyRemoteWorkspace(result.workspace); showToast('New agent changes synced'); }
  } catch (_) {}
}

function flashSaved() {
  els.saveState.classList.add('saving');
  els.saveState.lastChild.textContent = ' Saving…';
  clearTimeout(flashSaved.timer);
  flashSaved.timer = setTimeout(() => {
    els.saveState.classList.remove('saving');
    els.saveState.lastChild.textContent = ' Saved';
  }, 300);
}

function snapshot() {
  return JSON.stringify({ state, view });
}

function captureHistory() {
  undoStack.push(snapshot());
  if (undoStack.length > 60) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}

function restoreSnapshot(serialized) {
  const restored = JSON.parse(serialized);
  state = restored.state;
  view = restored.view || view;
  els.title.textContent = state.title;
  saveState(); renderNodes(); applyView(); selectNode(null); updateHistoryButtons();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  restoreSnapshot(undoStack.pop());
  showToast('Undid last change');
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  restoreSnapshot(redoStack.pop());
  showToast('Redid change');
}

function updateHistoryButtons() {
  document.querySelector('#undoButton').disabled = !undoStack.length;
  document.querySelector('#redoButton').disabled = !redoStack.length;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function nodeMarkup(node) {
  const provenance = node.agent ? `<span class="byline"><svg><use href="#i-spark"/></svg> Codex</span>` : '';
  const agentName = node.createdBy || node.updatedBy || 'Codex';
  const attributed = node.agent ? `<span class="byline"><svg><use href="#i-spark"/></svg> ${escapeHtml(agentName)}</span>` : provenance;
  return `<div class="node-handle"></div><div class="node-body"><div class="node-kicker"><span class="source-dot"></span>${escapeHtml(node.kicker || node.type)}${attributed}</div><h2 contenteditable="true" spellcheck="false">${escapeHtml(node.title)}</h2><div class="editable-content">${sanitizeContent(node.content)}</div></div>`;
}

function renderNodes() {
  els.nodes.replaceChildren();
  state.nodes.forEach(node => {
    const el = document.createElement('article');
    el.className = `node ${node.color || ''} ${node.type || ''} ${node.variant || ''}`;
    el.dataset.id = node.id;
    el.style.cssText = `left:${node.x}px;top:${node.y}px;width:${node.width || 310}px`;
    el.innerHTML = nodeMarkup(node);
    el.addEventListener('pointerdown', startNodeDrag);
    el.addEventListener('click', e => { e.stopPropagation(); handleNodeSelection(node.id); });
    el.querySelector('h2').addEventListener('pointerdown', e => e.stopPropagation());
    el.querySelector('h2').addEventListener('focus', () => { el.dataset.titleBefore = node.title; });
    el.querySelector('h2').addEventListener('blur', e => {
      const nextTitle = e.currentTarget.textContent.trim() || 'Untitled card';
      if (nextTitle !== node.title) { undoStack.push(JSON.stringify({ state: { ...structuredClone(state), nodes: state.nodes.map(n => n.id === node.id ? {...n, title: el.dataset.titleBefore || n.title} : n) }, view })); redoStack.length = 0; node.title = nextTitle; saveState(); updateHistoryButtons(); renderSearchResults(); }
    });
    els.nodes.appendChild(el);
  });
  requestAnimationFrame(renderEdges);
}

function renderEdges() {
  const parts = [];
  state.edges.forEach(edge => {
    const fromEl = document.querySelector(`.node[data-id="${CSS.escape(edge.from)}"]`);
    const toEl = document.querySelector(`.node[data-id="${CSS.escape(edge.to)}"]`);
    if (!fromEl || !toEl) return;
    const from = { left:fromEl.offsetLeft, top:fromEl.offsetTop, width:fromEl.offsetWidth, height:fromEl.offsetHeight };
    const to = { left:toEl.offsetLeft, top:toEl.offsetTop, width:toEl.offsetWidth, height:toEl.offsetHeight };
    const fromCenter = { x:from.left + from.width / 2, y:from.top + from.height / 2 };
    const toCenter = { x:to.left + to.width / 2, y:to.top + to.height / 2 };
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    let x1, y1, x2, y2, d;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const forward = dx >= 0;
      x1 = forward ? from.left + from.width : from.left;
      y1 = fromCenter.y;
      x2 = forward ? to.left : to.left + to.width;
      y2 = toCenter.y;
      const bend = Math.max(54, Math.abs(x2 - x1) * .44);
      d = `M ${x1} ${y1} C ${x1 + (forward ? bend : -bend)} ${y1}, ${x2 + (forward ? -bend : bend)} ${y2}, ${x2} ${y2}`;
    } else {
      const downward = dy >= 0;
      x1 = fromCenter.x;
      y1 = downward ? from.top + from.height : from.top;
      x2 = toCenter.x;
      y2 = downward ? to.top : to.top + to.height;
      const bend = Math.max(54, Math.abs(y2 - y1) * .44);
      d = `M ${x1} ${y1} C ${x1} ${y1 + (downward ? bend : -bend)}, ${x2} ${y2 + (downward ? -bend : bend)}, ${x2} ${y2}`;
    }
    const labelX = (x1 + x2) / 2;
    const labelY = (y1 + y2) / 2;
    const relationship = edge.relationship || '';
    const labelWidth = Math.min(154, Math.max(68, relationship.length * 5.7 + 20));
    const label = relationship && relationship !== 'related to' ? `<g class="edge-label" transform="translate(${labelX} ${labelY})"><rect x="-${labelWidth / 2}" y="-10" width="${labelWidth}" height="19" rx="7"/><text x="0" y="3">${escapeHtml(relationship)}</text></g>` : '';
    const kind = /supports|evidence|qualifies|measured by/i.test(relationship) ? 'evidence-edge' : /constrains|fails|contradicts|risk/i.test(relationship) ? 'caution-edge' : 'concept-edge';
    parts.push(`<path class="edge-path ${kind} ${edge.agent ? 'agent-edge' : ''}" d="${d}"/><circle class="edge-dot" cx="${x1}" cy="${y1}" r="3"/><circle class="edge-dot" cx="${x2}" cy="${y2}" r="3"/>${label}`);
  });
  els.edges.innerHTML = parts.join('');
}

function applyView() {
  els.world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  els.zoomLabel.textContent = `${Math.round(view.scale * 100)}%`;
}

function selectNode(id) {
  selectedNode = id;
  document.querySelectorAll('.node').forEach(el => el.classList.toggle('selected', el.dataset.id === id));
  els.nodeActions.hidden = !id;
  if (id) {
    const node = state.nodes.find(n => n.id === id);
    els.nodeActions.querySelectorAll('[data-color]').forEach(button => button.classList.toggle('active', button.dataset.color === (node?.color || '')));
  }
}

function handleNodeSelection(id) {
  if (connectMode.length) {
    if (connectMode[0] === 'waiting') { connectMode = [id]; selectNode(id); showToast('Now choose a card to connect'); return; }
    if (connectMode[0] === id) { connectMode = []; endConnectMode(); return; }
    const from = connectMode[0];
    captureHistory();
    const exists = state.edges.some(edge => (edge.from === from && edge.to === id) || (edge.from === id && edge.to === from));
    if (!exists) state.edges.push({ id:`edge-${Date.now()}`, from, to:id, relationship:'related to' });
    saveState(); renderEdges(); endConnectMode(); selectNode(id);
    showToast(exists ? 'These cards are already connected' : 'Cards connected');
    return;
  }
  selectNode(id);
}

function beginConnectMode() {
  if (!selectedNode) {
    connectMode = ['waiting'];
    document.body.classList.add('connecting');
    document.querySelector('#addConnection').classList.add('active');
    showToast('Choose the first card');
    return;
  }
  connectMode = [selectedNode];
  document.body.classList.add('connecting');
  document.querySelector('#addConnection').classList.add('active');
  showToast('Now choose a card to connect');
}

function endConnectMode() {
  connectMode = [];
  document.body.classList.remove('connecting');
  document.querySelector('#addConnection').classList.remove('active');
}

function startNodeDrag(e) {
  if (e.target.closest('[contenteditable="true"]')) return;
  const id = e.currentTarget.dataset.id;
  const node = state.nodes.find(n => n.id === id);
  captureHistory();
  selectNode(id);
  dragState = { node, startX: e.clientX, startY: e.clientY, x: node.x, y: node.y, el: e.currentTarget };
  dragState.el.classList.add('dragging');
  dragState.el.setPointerCapture(e.pointerId);
  e.stopPropagation();
}

window.addEventListener('pointermove', e => {
  if (dragState) {
    dragState.node.x = Math.round(dragState.x + (e.clientX - dragState.startX) / view.scale);
    dragState.node.y = Math.round(dragState.y + (e.clientY - dragState.startY) / view.scale);
    dragState.el.style.left = `${dragState.node.x}px`;
    dragState.el.style.top = `${dragState.node.y}px`;
    renderEdges();
  } else if (panState) {
    view.x = panState.x + e.clientX - panState.startX;
    view.y = panState.y + e.clientY - panState.startY;
    applyView();
  }
});

window.addEventListener('pointerup', () => {
  if (dragState) { dragState.el.classList.remove('dragging'); saveState(); }
  if (panState) els.viewport.classList.remove('is-panning');
  dragState = null; panState = null;
});

els.viewport.addEventListener('pointerdown', e => {
  if (e.target !== els.viewport && e.target !== els.world && e.target !== els.nodes && !e.target.classList.contains('edges')) return;
  selectNode(null); endConnectMode(); els.canvasMenu.hidden = true;
  panState = { startX: e.clientX, startY: e.clientY, x: view.x, y: view.y };
  els.viewport.classList.add('is-panning');
});

els.viewport.addEventListener('wheel', e => {
  e.preventDefault();
  const rect = els.viewport.getBoundingClientRect();
  const pointerX = e.clientX - rect.left;
  const pointerY = e.clientY - rect.top;
  const oldScale = view.scale;
  const next = Math.min(1.35, Math.max(minimumScale(), oldScale * (e.deltaY > 0 ? .92 : 1.08)));
  view.x = pointerX - ((pointerX - view.x) / oldScale) * next;
  view.y = pointerY - ((pointerY - view.y) / oldScale) * next;
  view.scale = next;
  applyView();
}, { passive: false });

function zoomBy(delta) {
  const old = view.scale;
  const next = Math.min(1.35, Math.max(minimumScale(), old + delta));
  const cx = els.viewport.clientWidth / 2, cy = els.viewport.clientHeight / 2;
  view.x = cx - ((cx - view.x) / old) * next;
  view.y = cy - ((cy - view.y) / old) * next;
  view.scale = next; applyView();
}

function minimumScale() {
  if (window.innerWidth <= 540) return .12;
  if (window.innerWidth < 900) return .24;
  return .38;
}

function fitCanvas() {
  const bounds = state.nodes.reduce((b,n) => ({ minX: Math.min(b.minX,n.x), minY: Math.min(b.minY,n.y), maxX: Math.max(b.maxX,n.x+(n.width||310)), maxY: Math.max(b.maxY,n.y+330) }), {minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity});
  const scale = Math.min(.84, (els.viewport.clientWidth - 100)/(bounds.maxX-bounds.minX), (els.viewport.clientHeight - 130)/(bounds.maxY-bounds.minY));
  view.scale = Math.max(minimumScale(), scale);
  view.x = (els.viewport.clientWidth - (bounds.maxX-bounds.minX)*view.scale)/2 - bounds.minX*view.scale;
  view.y = (els.viewport.clientHeight - (bounds.maxY-bounds.minY)*view.scale)/2 - bounds.minY*view.scale;
  applyView();
}

function addNode(type = 'note', overrides = {}) {
  const centerX = (els.viewport.clientWidth / 2 - view.x) / view.scale;
  const centerY = (els.viewport.clientHeight / 2 - view.y) / view.scale;
  const node = {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, x: Math.round(centerX - 150), y: Math.round(centerY - 100), width: 310,
    type, color: type === 'source' ? 'amber' : '', kicker: type === 'source' ? 'New source' : 'New note',
    title: type === 'source' ? 'Untitled source' : 'A new idea',
    content: type === 'source' ? '<p>Paste a link or describe the source here.</p><div class="source-meta"><span class="source-badge">WEB</span><span><strong>Source details</strong><small>Added just now</small></span></div>' : '<p>Double-click the title to begin shaping this thought.</p>',
    ...overrides
  };
  captureHistory(); state.nodes.push(node); saveState(); renderNodes(); selectNode(node.id); showToast(`${type === 'source' ? 'Source' : 'Note'} added`); return node;
}

function deleteSelectedNode() {
  if (!selectedNode) return;
  captureHistory();
  state.nodes = state.nodes.filter(node => node.id !== selectedNode);
  state.edges = state.edges.filter(edge => edge.from !== selectedNode && edge.to !== selectedNode);
  selectedNode = null; saveState(); renderNodes(); selectNode(null); showToast('Card removed · press ⌘Z to undo');
}

function duplicateSelectedNode() {
  const original = state.nodes.find(node => node.id === selectedNode); if (!original) return;
  const duplicate = structuredClone(original);
  duplicate.id = `node-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  duplicate.x += 36; duplicate.y += 36; duplicate.title = `${original.title} copy`; duplicate.agent = false;
  captureHistory(); state.nodes.push(duplicate); saveState(); renderNodes(); selectNode(duplicate.id); showToast('Card duplicated');
}

function renderCanvasList() {
  els.canvasList.replaceChildren();
  [...workspace.canvases].sort((a,b) => b.updatedAt-a.updatedAt).slice(0,8).forEach(canvas => {
    const button = document.createElement('button');
    button.className = `recent-row ${canvas.id === workspace.activeId ? 'active' : ''}`;
    button.dataset.canvasId = canvas.id;
    button.innerHTML = `<span class="recent-dot ${escapeHtml(canvas.color || 'lavender')}"></span><span>${escapeHtml(canvas.state.title)}</span>${canvas.id === workspace.activeId ? '<svg><use href="#i-more"/></svg>' : ''}`;
    button.addEventListener('click', () => switchCanvas(canvas.id));
    els.canvasList.appendChild(button);
  });
}

function switchCanvas(id) {
  if (id === workspace.activeId) return;
  saveState();
  const next = workspace.canvases.find(canvas => canvas.id === id); if (!next) return;
  workspace.activeId = id; state = next.state; undoStack.length = 0; redoStack.length = 0;
  selectedNode = null; connectMode = []; els.title.textContent = state.title;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  renderCanvasList(); renderNodes(); updateHistoryButtons(); fitCanvas();
  if (window.innerWidth <= 850) els.sidebar.classList.remove('open');
  showToast(`Opened ${state.title}`);
}

function starterNodes(template, title) {
  if (template === 'blank') return [{ id:`start-${Date.now()}`, x:420, y:240, width:350, color:'dark', type:'overview', kicker:'Start here', title, content:'<p>Add notes, sources, and questions. Connect ideas as your understanding grows.</p><div class="tag-row"><span class="tag">Double-click to rename</span><span class="tag">⌘K to search</span></div>' }];
  if (template === 'literature') return [
    { id:`question-${Date.now()}`, x:360, y:210, width:360, color:'dark', type:'question', kicker:'Research question', title, content:'<p>Write the question that will guide your reading.</p>' },
    { id:`source-${Date.now()}`, x:840, y:150, width:330, color:'amber', type:'source', kicker:'First source', title:'Add a primary source', content:'<p>Capture the claim, method, and evidence.</p>' },
    { id:`synthesis-${Date.now()}`, x:840, y:470, width:330, color:'green', type:'insight', kicker:'Synthesis', title:'What the sources suggest', content:'<p>Track agreements, contradictions, and missing evidence.</p>' }
  ];
  return [
    { id:`topic-${Date.now()}`, x:360, y:210, width:360, color:'dark', type:'overview', kicker:'Research topic', title, content:'<p>Define the boundaries of the topic and what a useful answer would include.</p>' },
    { id:`known-${Date.now()}`, x:840, y:120, width:320, color:'blue', type:'concept', kicker:'Current understanding', title:'What I know', content:'<p>Capture your starting assumptions.</p>' },
    { id:`unknown-${Date.now()}`, x:840, y:430, width:320, color:'question', type:'question', kicker:'Open questions', title:'What I need to learn', content:'<p>List the questions that would change your understanding.</p>' }
  ];
}

function createCanvas(title, template = 'blank') {
  const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'untitled'}-${Date.now().toString(36)}`;
  const nodes = starterNodes(template, title);
  const edges = nodes.slice(1).map((node,index) => ({ id:`starter-edge-${index}`, from:nodes[0].id, to:node.id }));
  const canvas = { id, color:['lavender','blue','mint','coral','gold'][workspace.canvases.length%5], updatedAt:Date.now(), state:{ title, nodes, edges, revision:1 } };
  workspace.canvases.push(canvas); workspace.activeId = id; state = canvas.state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  els.title.textContent = title; undoStack.length = 0; redoStack.length = 0; renderCanvasList(); renderNodes(); fitCanvas(); updateHistoryButtons(); showToast('New canvas created');
}

function duplicateCanvas() {
  const source = workspace.canvases.find(canvas => canvas.id === workspace.activeId);
  const copy = structuredClone(source); copy.id = `${source.id}-copy-${Date.now().toString(36)}`; copy.state.title = `${source.state.title} — copy`; copy.updatedAt = Date.now();
  workspace.canvases.push(copy); workspace.activeId = copy.id; state = copy.state; localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  els.title.textContent = state.title; renderCanvasList(); renderNodes(); fitCanvas(); closeCanvasMenu(); showToast('Canvas duplicated');
}

function autoLayout() {
  if (!state.nodes.length) return;
  captureHistory();
  const columns = Math.max(2, Math.ceil(Math.sqrt(state.nodes.length * 1.45)));
  const incoming = new Map(state.nodes.map(node => [node.id, 0]));
  state.edges.forEach(edge => incoming.set(edge.to, (incoming.get(edge.to)||0)+1));
  const ordered = [...state.nodes].sort((a,b) => (incoming.get(a.id)||0)-(incoming.get(b.id)||0));
  ordered.forEach((node,index) => { node.x = 250 + (index % columns) * 430; node.y = 150 + Math.floor(index / columns) * 350; });
  saveState(); renderNodes(); setTimeout(fitCanvas,40); closeCanvasMenu(); showToast('Canvas auto-arranged');
}

function exportCanvas() {
  const payload = JSON.stringify({ format:'atlas-canvas', version:2, exportedAt:new Date().toISOString(), canvas:state }, null, 2);
  const blob = new Blob([payload], {type:'application/json'}); const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `${state.title.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'atlas-canvas'}.atlas.json`; anchor.click(); URL.revokeObjectURL(url); closeCanvasMenu(); showToast('Canvas exported');
}

async function importCanvasFile(file) {
  try {
    const parsed = JSON.parse(await file.text()); const imported = parsed.canvas || parsed;
    if (!Array.isArray(imported.nodes) || !Array.isArray(imported.edges)) throw new Error('Invalid Atlas canvas');
    const title = `${imported.title || 'Imported canvas'}`; const id = `import-${Date.now().toString(36)}`;
    const canvas = { id, color:'blue', updatedAt:Date.now(), state:{...imported,title} }; workspace.canvases.push(canvas); workspace.activeId=id; state=canvas.state;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(workspace)); els.title.textContent=title; renderCanvasList(); renderNodes(); fitCanvas(); showToast('Canvas imported');
  } catch (error) { showToast(error.message || 'Could not import this file'); }
}

function closeCanvasMenu() { els.canvasMenu.hidden = true; }

function renderSearchResults(query = '') {
  const q = query.trim().toLowerCase();
  const matches = state.nodes.filter(n => !q || `${n.title} ${n.kicker} ${n.content.replace(/<[^>]*>/g,' ')}`.toLowerCase().includes(q)).slice(0, 8);
  els.results.innerHTML = `<p class="result-label">${q ? `${matches.length} results` : 'On this canvas'}</p>`;
  matches.forEach(node => {
    const button = document.createElement('button');
    button.className = 'search-result';
    button.innerHTML = `<span class="result-swatch ${node.color || ''}"></span><span><strong>${escapeHtml(node.title)}</strong><small>${escapeHtml(node.kicker || node.type)}</small></span>`;
    button.addEventListener('click', () => { focusNode(node.id); closePalette(); });
    els.results.appendChild(button);
  });
}

function focusNode(id) {
  const node = state.nodes.find(n => n.id === id); if (!node) return;
  view.scale = Math.max(view.scale, .78);
  view.x = els.viewport.clientWidth/2 - (node.x + (node.width||310)/2)*view.scale;
  view.y = els.viewport.clientHeight/2 - (node.y + 150)*view.scale;
  applyView(); selectNode(id);
}

function openPalette() { els.palette.hidden = false; renderSearchResults(); requestAnimationFrame(() => els.searchInput.focus()); }
function closePalette() { els.palette.hidden = true; els.searchInput.value = ''; }
function showToast(message) { clearTimeout(toastTimer); els.toast.textContent = message; els.toast.classList.add('show'); toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800); }

document.querySelector('#zoomIn').addEventListener('click', () => zoomBy(.1));
document.querySelector('#zoomOut').addEventListener('click', () => zoomBy(-.1));
document.querySelector('#fitCanvas').addEventListener('click', fitCanvas);
document.querySelector('#addNote').addEventListener('click', () => addNode('note'));
document.querySelector('#addSource').addEventListener('click', () => addNode('source'));
document.querySelector('#addConnection').addEventListener('click', beginConnectMode);
document.querySelector('#searchButton').addEventListener('click', openPalette);
els.searchInput.addEventListener('input', e => renderSearchResults(e.target.value));
els.palette.addEventListener('pointerdown', e => { if (e.target === els.palette) closePalette(); });
document.querySelector('#agentButton').addEventListener('click', () => els.agentPanel.hidden = !els.agentPanel.hidden);
document.querySelector('#closeAgentPanel').addEventListener('click', () => els.agentPanel.hidden = true);
document.querySelector('#askAgent').addEventListener('click', () => { els.agentPanel.hidden = false; showToast('Agents can edit through the Atlas canvas API'); });
document.querySelector('#connectAgent').addEventListener('click', () => { document.querySelector('#agentBundle').value = agentBundle(); document.querySelector('#agentSetupModal').hidden = false; els.agentPanel.hidden = true; });
document.querySelector('#closeAgentSetup').addEventListener('click', () => document.querySelector('#agentSetupModal').hidden = true);
document.querySelector('#agentSetupModal').addEventListener('pointerdown', event => { if (event.target.id === 'agentSetupModal') event.currentTarget.hidden = true; });
document.querySelector('#copyAgentBundle').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(agentBundle()); showToast('Private agent bundle copied'); document.querySelector('#copyAgentBundle').innerHTML='<svg><use href="#i-check"/></svg>Connection bundle copied'; }
  catch (_) { document.querySelector('#agentBundle').select(); showToast('Select and copy the connection bundle'); }
});
document.querySelector('#themeButton').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('atlas-theme',document.body.classList.contains('dark')?'dark':'light'); });
document.querySelector('.sidebar-toggle').addEventListener('click', () => els.sidebar.classList.remove('open'));
document.querySelector('.mobile-sidebar').addEventListener('click', () => els.sidebar.classList.add('open'));
document.querySelector('#newCanvasButton').addEventListener('click', () => { document.querySelector('#newCanvasModal').hidden = false; setTimeout(() => document.querySelector('#newCanvasName').focus(),0); });
els.title.addEventListener('blur', saveState);
document.querySelector('#undoButton').addEventListener('click', undo);
document.querySelector('#redoButton').addEventListener('click', redo);
document.querySelector('#duplicateNode').addEventListener('click', duplicateSelectedNode);
document.querySelector('#focusNode').addEventListener('click', () => selectedNode && focusNode(selectedNode));
document.querySelector('#deleteNode').addEventListener('click', deleteSelectedNode);
els.nodeActions.querySelectorAll('[data-color]').forEach(button => button.addEventListener('click', () => {
  const node = state.nodes.find(item => item.id === selectedNode); if (!node) return; captureHistory(); node.color = button.dataset.color; saveState(); renderNodes(); selectNode(node.id);
}));
document.querySelector('#canvasMenuButton').addEventListener('click', e => { e.stopPropagation(); els.canvasMenu.hidden = !els.canvasMenu.hidden; });
document.querySelector('#autoLayout').addEventListener('click', autoLayout);
document.querySelector('#exportCanvas').addEventListener('click', exportCanvas);
document.querySelector('#importCanvas').addEventListener('click', () => document.querySelector('#importFile').click());
document.querySelector('#importFile').addEventListener('change', e => { if (e.target.files[0]) importCanvasFile(e.target.files[0]); e.target.value=''; });
document.querySelector('#duplicateCanvas').addEventListener('click', duplicateCanvas);
document.querySelector('#cancelNewCanvas').addEventListener('click', () => document.querySelector('#newCanvasModal').hidden = true);
document.querySelector('#newCanvasModal').addEventListener('pointerdown', e => { if (e.target.id === 'newCanvasModal') e.currentTarget.hidden = true; });
document.querySelectorAll('.template-option').forEach(button => button.addEventListener('click', () => { activeTemplate = button.dataset.template; document.querySelectorAll('.template-option').forEach(option => option.classList.toggle('selected',option===button)); }));
document.querySelector('#newCanvasForm').addEventListener('submit', e => { e.preventDefault(); const title=document.querySelector('#newCanvasName').value.trim(); if(!title)return; createCanvas(title,activeTemplate); e.currentTarget.reset(); document.querySelector('#newCanvasModal').hidden=true; });
document.querySelector('.review-button').addEventListener('click', e => { e.currentTarget.innerHTML='<svg><use href="#i-check"/></svg> All changes reviewed'; document.querySelector('#agentButton b').textContent='0'; showToast('Agent contributions accepted'); });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !e.target.closest('[contenteditable="true"], input')) { e.preventDefault(); undo(); }
  if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'z') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')) { e.preventDefault(); redo(); }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd' && selectedNode) { e.preventDefault(); duplicateSelectedNode(); }
  if (e.shiftKey && e.key.toLowerCase() === 'a' && !e.target.closest('[contenteditable="true"], input')) { e.preventDefault(); autoLayout(); }
  if (e.key === 'Escape') { closePalette(); els.agentPanel.hidden = true; closeCanvasMenu(); document.querySelector('#newCanvasModal').hidden=true; document.querySelector('#agentSetupModal').hidden=true; selectNode(null); endConnectMode(); }
  if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNode && !e.target.closest('[contenteditable="true"], input')) {
    deleteSelectedNode();
  }
});

// Stable API for Codex, MCP bridges, browser extensions, and other agents.
window.AtlasCanvas = Object.freeze({
  version: '2.0',
  getSnapshot: () => structuredClone(state),
  createNode: input => addNode(input.type || 'note', { ...input, agent: true, kicker: input.kicker || 'Agent contribution' }),
  listCanvases: () => workspace.canvases.map(canvas => ({id:canvas.id,title:canvas.state.title,updatedAt:canvas.updatedAt})),
  openCanvas: id => switchCanvas(id),
  createCanvas: (title,template='blank') => createCanvas(title,template),
  updateNode: (id, patch) => { const node = state.nodes.find(n => n.id === id); if (!node) throw new Error(`Unknown node: ${id}`); captureHistory(); Object.assign(node, patch, { agent: true }); saveState(); renderNodes(); return structuredClone(node); },
  connect: (from, to, relationship = 'related to') => { if (!state.nodes.some(n => n.id === from) || !state.nodes.some(n => n.id === to)) throw new Error('Both nodes must exist'); captureHistory(); const edge = { id: `edge-${Date.now()}`, from, to, relationship, agent: true }; state.edges.push(edge); saveState(); renderEdges(); return structuredClone(edge); },
  updateEdge: (selector, patch) => { const edge = state.edges.find(item => typeof selector === 'string' ? item.id === selector : item.from === selector.from && item.to === selector.to); if (!edge) throw new Error('Unknown edge'); captureHistory(); Object.assign(edge, patch, { agent:true }); saveState(); renderEdges(); return structuredClone(edge); },
  transact: operations => { captureHistory(); operations.forEach(op => { if(op.type==='create_node') state.nodes.push({...op.node,id:op.node.id||`agent-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,agent:true}); if(op.type==='connect') state.edges.push({id:`edge-${Date.now()}-${Math.random()}`,from:op.from,to:op.to,relationship:op.relationship||'related to',agent:true}); if(op.type==='update_node'){const n=state.nodes.find(item=>item.id===(op.id||op.nodeId));if(n)Object.assign(n,op.patch,{agent:true});} if(op.type==='update_edge'){const edge=state.edges.find(item=>op.edgeId?item.id===op.edgeId:item.from===op.from&&item.to===op.to);if(edge)Object.assign(edge,op.patch,{agent:true});} }); saveState(); renderNodes(); return structuredClone(state); },
  focus: focusNode,
  exportJSON: () => JSON.stringify(state, null, 2)
});

if (localStorage.getItem('atlas-theme') === 'dark') document.body.classList.add('dark');
els.title.textContent = state.title;
renderCanvasList();
renderNodes();
applyView();
updateHistoryButtons();
setTimeout(() => { if (window.innerWidth < 1200) fitCanvas(); }, 80);
initializeCloud();
setInterval(pollCloud, 15000);
