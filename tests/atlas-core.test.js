import { describe, expect, it } from 'vitest';
import { applyOperations, buildOfflineProposal, inferCapture, normalizeWorkspace, searchWorkspace } from '../src/atlas-core.js';

describe('workspace migration',()=>{
  it('adds v3 spaces and durable proposal collections to v2 data',()=>{
    const migrated=normalizeWorkspace({activeId:'one',canvases:[{id:'one',state:{title:'Old',nodes:[],edges:[]}}]});
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.canvases[0].spaceId).toBe('learning-lab');
    expect(migrated.canvases[0].state.pending).toEqual([]);
    expect(migrated.canvases[0].state.activity).toEqual([]);
  });
});

describe('universal capture',()=>{
  it('recognizes sources and creates safe linked content',()=>{
    const capture=inferCapture('https://example.com/research');
    expect(capture.type).toBe('source');
    expect(capture.sourceUrl).toBe('https://example.com/research');
    expect(capture.title).toContain('example.com');
  });

  it('recognizes questions',()=>{
    expect(inferCapture('What evidence would change this?').type).toBe('question');
  });
});

describe('operation reducer',()=>{
  const idFactory=prefix=>`${prefix}-fixed`;

  it('applies attributed, auditable proposals',()=>{
    const state={title:'Test',nodes:[{id:'a',title:'A',content:'<p>A</p>',x:0,y:0}],edges:[],activity:[],revision:1};
    const result=applyOperations(state,[{type:'create_node',node:{title:'B',type:'insight',kicker:'Synthesis',content:'<p>B</p>',x:300,y:0}},{type:'connect',from:'a',to:'node-fixed',relationship:'supports'}],'Atlas',{idFactory});
    expect(state.nodes[1].createdBy).toBe('Atlas');
    expect(state.edges[0].relationship).toBe('supports');
    expect(state.activity[0].operations).toBe(2);
    expect(result.createdIds).toEqual(['node-fixed']);
  });

  it('blocks destructive operations without explicit approval',()=>{
    const state={nodes:[{id:'a',title:'A'}],edges:[],activity:[]};
    expect(()=>applyOperations(state,[{type:'delete_node',nodeId:'a'}],'Atlas',{idFactory})).toThrow('explicit approval');
  });
});

describe('offline collaboration',()=>{
  it('returns a reviewable proposal when cloud AI is unavailable',()=>{
    const state={nodes:[{id:'a',title:'Claim',content:'<p>Claim</p>',x:10,y:20}],edges:[]};
    const proposal=buildOfflineProposal('Challenge the weakest assumption',state,'a');
    expect(proposal.operations[0].type).toBe('create_node');
    expect(proposal.operations[0].node.title).toContain('challenge');
  });

  it('searches across canvases',()=>{
    const workspace=normalizeWorkspace({activeId:'a',canvases:[{id:'a',state:{title:'First',nodes:[],edges:[]}},{id:'b',state:{title:'Second',nodes:[{id:'n',title:'Hidden connection',content:'<p>Useful</p>',x:0,y:0}],edges:[]}}]});
    expect(searchWorkspace(workspace,'hidden')[0].canvasId).toBe('b');
  });
});
