import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const json = (body: unknown, status = 200, extra: Record<string,string> = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, content-type, x-atlas-agent",
    "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    ...extra,
  },
});

const hashToken = async (token: string) => {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2,"0")).join("");
};

const sanitizeWorkspaceId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 100);

const operationSummary = (operation:any) => {
  if (operation.type === "create_canvas") return `Created canvas “${operation.canvas?.title || "Agent research"}”`;
  if (operation.type === "create_node") return `Added “${operation.node?.title || "Untitled insight"}”`;
  if (operation.type === "update_node") return `Updated card ${operation.nodeId || ""}`.trim();
  if (operation.type === "connect") return `Connected two ideas as “${operation.relationship || "related to"}”`;
  if (operation.type === "update_edge") return "Updated a connection";
  if (operation.type === "delete_node") return `Deleted card ${operation.nodeId || ""}`.trim();
  return "Updated the canvas";
};

const applyOperation = (workspace: any, operation: any, actor: string) => {
  const canvas = workspace.canvases?.find((item: any) => item.id === (operation.canvasId || workspace.activeId));
  if (!canvas && operation.type !== "create_canvas") throw new Error(`Unknown canvas: ${operation.canvasId || workspace.activeId}`);
  const now = Date.now();
  switch (operation.type) {
    case "create_canvas": {
      const id = operation.canvas?.id || `agent-canvas-${now}`;
      workspace.canvases.push({ id, color: operation.canvas?.color || "lavender", updatedAt: now, state: { title: operation.canvas?.title || "Agent research", nodes: [], edges: [], revision: 1 } });
      break;
    }
    case "create_node": {
      const node = { ...operation.node, id: operation.node?.id || `agent-${now}-${Math.random().toString(36).slice(2,6)}`, x: Number(operation.node?.x ?? 420), y: Number(operation.node?.y ?? 280), width: Number(operation.node?.width ?? 320), type: operation.node?.type || "note", color: operation.node?.color || "", kicker: operation.node?.kicker || "Agent contribution", title: operation.node?.title || "Untitled insight", content: operation.node?.content || "<p>Agent contribution</p>", agent: true, createdBy: actor, createdAt: new Date().toISOString() };
      canvas.state.nodes.push(node); canvas.updatedAt = now; canvas.state.revision = (canvas.state.revision || 0) + 1;
      break;
    }
    case "update_node": {
      const node = canvas.state.nodes.find((item: any) => item.id === operation.nodeId);
      if (!node) throw new Error(`Unknown node: ${operation.nodeId}`);
      Object.assign(node, operation.patch || {}, { agent: true, updatedBy: actor, updatedAt: new Date().toISOString() }); canvas.updatedAt = now; canvas.state.revision++;
      break;
    }
    case "connect": {
      if (!canvas.state.nodes.some((node:any) => node.id === operation.from) || !canvas.state.nodes.some((node:any) => node.id === operation.to)) throw new Error("Both connection nodes must exist");
      canvas.state.edges.push({ id:`edge-${now}-${Math.random().toString(36).slice(2,5)}`, from:operation.from, to:operation.to, relationship:operation.relationship || "related to", agent:true, createdBy:actor }); canvas.updatedAt = now; canvas.state.revision++;
      break;
    }
    case "update_edge": {
      const edge = canvas.state.edges.find((item:any) => operation.edgeId ? item.id === operation.edgeId : item.from === operation.from && item.to === operation.to);
      if (!edge) throw new Error(`Unknown edge: ${operation.edgeId || `${operation.from}->${operation.to}`}`);
      const patch = operation.patch || {};
      const nextFrom = patch.from || edge.from;
      const nextTo = patch.to || edge.to;
      if (!canvas.state.nodes.some((node:any) => node.id === nextFrom) || !canvas.state.nodes.some((node:any) => node.id === nextTo)) throw new Error("Both connection nodes must exist");
      Object.assign(edge, patch, { agent:true, updatedBy:actor, updatedAt:new Date().toISOString() }); canvas.updatedAt = now; canvas.state.revision++;
      break;
    }
    case "delete_node": {
      canvas.state.nodes = canvas.state.nodes.filter((node:any) => node.id !== operation.nodeId); canvas.state.edges = canvas.state.edges.filter((edge:any) => edge.from !== operation.nodeId && edge.to !== operation.nodeId); canvas.updatedAt = now; canvas.state.revision++;
      break;
    }
    default: throw new Error(`Unsupported operation: ${operation.type}`);
  }
};

export default async (request: Request, context: Context) => {
  if (request.method === "OPTIONS") return json({}, 204);
  const workspaceId = sanitizeWorkspaceId(context.params.workspaceId || "");
  if (!workspaceId) return json({ error:"workspace_id_required" }, 400);

  const store = getStore({ name:"atlas-workspaces", consistency:"strong" });
  const authKey = `auth/${workspaceId}`;
  const dataKey = `workspace/${workspaceId}`;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const tokenHash = token ? await hashToken(token) : "";
  const storedHash = await store.get(authKey, { type:"text" });

  if (!storedHash && request.method === "POST") {
    const body = await request.json().catch(() => null) as any;
    if (body?.action !== "bootstrap" || !token || !body.workspace?.canvases) return json({ error:"bootstrap_required" }, 409);
    const record = { ...body.workspace, cloudRevision:1, audit:[{ id:crypto.randomUUID(), actor:"Atlas web", action:"workspace_created", at:new Date().toISOString() }] };
    await store.set(authKey, tokenHash);
    await store.setJSON(dataKey, record);
    return json({ ok:true, workspace:record });
  }

  if (!storedHash || !token || storedHash !== tokenHash) return json({ error:"unauthorized" }, 401);
  const workspace = await store.get(dataKey, { type:"json" }) as any;
  if (!workspace) return json({ error:"workspace_not_found" }, 404);

  if (request.method === "GET") return json({ workspace });

  if (request.method === "PUT") {
    const body = await request.json().catch(() => null) as any;
    if (!body?.workspace?.canvases) return json({ error:"invalid_workspace" }, 400);
    if (Number.isFinite(body.baseRevision) && body.baseRevision !== (workspace.cloudRevision || 0)) return json({ error:"revision_conflict", cloudRevision:workspace.cloudRevision, workspace }, 409);
    const next = { ...body.workspace, cloudRevision:(workspace.cloudRevision || 0)+1, audit:(workspace.audit || []).slice(-199) };
    next.audit.push({ id:crypto.randomUUID(), actor:request.headers.get("x-atlas-agent") || "Atlas web", action:"workspace_synced", at:new Date().toISOString() });
    await store.setJSON(dataKey, next);
    return json({ ok:true, cloudRevision:next.cloudRevision });
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => null) as any;
    const operations = Array.isArray(body?.operations) ? body.operations : [];
    if (!operations.length || operations.length > 100) return json({ error:"operations_required", max:100 }, 400);
    const actor = String(body.agent || request.headers.get("x-atlas-agent") || "External agent").slice(0,80);
    try { operations.forEach((operation:any) => applyOperation(workspace, operation, actor)); }
    catch (error) { return json({ error:error instanceof Error ? error.message : "invalid_operation" }, 400); }
    workspace.cloudRevision = (workspace.cloudRevision || 0) + 1;
    const activityAt = new Date().toISOString();
    const affectedCanvasIds = new Set(operations.filter((operation:any) => operation.type !== "create_canvas").map((operation:any) => operation.canvasId || workspace.activeId));
    affectedCanvasIds.forEach((canvasId:any) => {
      const canvas = workspace.canvases.find((item:any) => item.id === canvasId);
      if (!canvas) return;
      canvas.state.activity = Array.isArray(canvas.state.activity) ? canvas.state.activity : [];
      canvas.state.activity.unshift({ id:crypto.randomUUID(), actor, at:activityAt, action:"agent_transaction", summaries:operations.filter((operation:any) => (operation.canvasId || workspace.activeId) === canvasId).map(operationSummary), operations:operations.length });
      canvas.state.activity = canvas.state.activity.slice(0,100);
    });
    workspace.audit = (workspace.audit || []).slice(-199);
    workspace.audit.push({ id:crypto.randomUUID(), actor, action:"agent_transaction", operations:operations.length, at:new Date().toISOString() });
    await store.setJSON(dataKey, workspace);
    return json({ ok:true, cloudRevision:workspace.cloudRevision, applied:operations.length, workspace });
  }

  return json({ error:"method_not_allowed" }, 405, { allow:"GET, POST, PUT, OPTIONS" });
};

export const config: Config = {
  path: "/api/atlas/:workspaceId",
  method: ["GET", "POST", "PUT", "OPTIONS"],
};
