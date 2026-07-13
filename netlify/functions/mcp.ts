import type { Config, Context } from "@netlify/functions";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import * as z from "zod/v4";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, mcp-protocol-version, mcp-session-id, last-event-id",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-expose-headers": "mcp-protocol-version, mcp-session-id",
};

const textResult = (value: unknown) => ({ content:[{ type:"text" as const, text:JSON.stringify(value,null,2) }] });

export default async (request: Request, context: Context) => {
  if (request.method === "OPTIONS") return new Response(null, { status:204, headers:cors });
  const workspaceId = (context.params.workspaceId || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0,100);
  const authorization = request.headers.get("authorization") || "";
  if (!workspaceId || !authorization) return new Response(JSON.stringify({ error:"Atlas connection bundle required" }), { status:401, headers:{...cors,"content-type":"application/json"} });

  const atlasEndpoint = new URL(`/api/atlas/${workspaceId}`, request.url).toString();
  const atlasFetch = (method: string, body?: unknown, agent = "MCP agent") => fetch(atlasEndpoint, {
    method,
    headers:{ authorization, "content-type":"application/json", "x-atlas-agent":agent },
    body:body ? JSON.stringify(body) : undefined,
  });

  const authCheck = await atlasFetch("GET");
  if (!authCheck.ok) return new Response(JSON.stringify({ error:"Invalid Atlas workspace credential" }), { status:401, headers:{...cors,"content-type":"application/json"} });
  const initialWorkspace = await authCheck.json();

  const server = new McpServer({ name:"atlas-canvas", version:"1.0.0" });
  server.registerTool("atlas_inspect", {
    title:"Inspect Atlas workspace",
    description:"Read the canvases, nodes, edges, revisions, and audit history in the connected Atlas workspace before making changes.",
    inputSchema:{},
  }, async () => textResult(initialWorkspace));

  server.registerTool("atlas_transact", {
    title:"Update Atlas canvas",
    description:"Apply a small atomic transaction of attributed Atlas operations. Supported types: create_canvas, create_node, update_node, connect, update_edge, delete_node. Inspect first and never delete human work without explicit permission.",
    inputSchema:{
      agent:z.string().min(1).max(80).describe("Name of the agent making the change"),
      operations:z.array(z.record(z.string(),z.unknown())).min(1).max(100).describe("Atlas protocol operations"),
    },
  }, async ({agent,operations}) => {
    const response = await atlasFetch("POST", {agent,operations}, agent);
    const result = await response.json();
    if (!response.ok) return { isError:true, ...textResult(result) };
    return textResult(result);
  });

  const transport = new WebStandardStreamableHTTPServerTransport();
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  const headers = new Headers(response.headers); Object.entries(cors).forEach(([key,value]) => headers.set(key,value));
  return new Response(response.body, { status:response.status, headers });
};

export const config: Config = {
  path:"/mcp/:workspaceId",
  method:["GET","POST","DELETE","OPTIONS"],
};
