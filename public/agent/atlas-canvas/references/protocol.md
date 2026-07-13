# Atlas Agent Protocol v1

## Authentication

Send `Authorization: Bearer <token>` on every request. Optionally send `X-Atlas-Agent: <agent name>`.

Never place the token in query parameters.

## MCP adapter

MCP-capable hosts may connect to the bundle's `mcp` URL using Streamable HTTP and the same bearer authorization header. Use `atlas_inspect` before `atlas_transact`. The HTTPS API described below remains the portable fallback.

## First-time bootstrap

The Atlas web app normally creates the cloud workspace before it shows a connection bundle. An agent receiving a bundle should call `GET` first. If that request returns `401`, do not claim or replace the workspace; ask the user to reopen Atlas and copy a fresh bundle.

For a new isolated workspace that the agent is explicitly authorized to initialize, call `POST <endpoint>` before other operations:

```json
{
  "action": "bootstrap",
  "workspace": {
    "activeId": "research",
    "canvases": [
      {
        "id": "research",
        "updatedAt": 1770000000000,
        "state": { "title": "Research", "nodes": [], "edges": [], "revision": 1 }
      }
    ]
  }
}
```

Bootstrap succeeds only while the workspace ID is unclaimed. It never replaces an existing workspace.

## Read workspace

`GET <endpoint>`

Response:

```json
{
  "workspace": {
    "activeId": "neural-networks",
    "canvases": [
      {
        "id": "neural-networks",
        "updatedAt": 1770000000000,
        "state": { "title": "Neural networks", "nodes": [], "edges": [] }
      }
    ],
    "cloudRevision": 4,
    "audit": []
  }
}
```

## Apply operations

`POST <endpoint>`

```json
{
  "agent": "Codex",
  "operations": [
    {
      "type": "create_node",
      "canvasId": "neural-networks",
      "node": {
        "id": "attention-paper",
        "type": "source",
        "title": "Attention Is All You Need",
        "kicker": "Primary source",
        "content": "<p>Introduced the Transformer architecture…</p>",
        "x": 1200,
        "y": 900,
        "width": 340,
        "color": "amber"
      }
    },
    {
      "type": "connect",
      "canvasId": "neural-networks",
      "from": "attention-paper",
      "to": "representation",
      "relationship": "supports"
    }
  ]
}
```

## Operations

### `create_canvas`

```json
{"type":"create_canvas","canvas":{"id":"stable-id","title":"Research question","color":"lavender"}}
```

### `create_node`

Requires `canvasId` and `node`. Stable client-supplied node IDs are recommended.

### `update_node`

```json
{"type":"update_node","canvasId":"canvas-id","nodeId":"node-id","patch":{"title":"Improved title"}}
```

### `connect`

Requires `canvasId`, `from`, `to`, and an optional `relationship`.

### `update_edge`

Refine an existing relationship without deleting it. Identify the edge by `edgeId`, or by its stable `from` and `to` node IDs.

```json
{"type":"update_edge","canvasId":"canvas-id","from":"claim-id","to":"evidence-id","patch":{"relationship":"supported by"}}
```

### `delete_node`

Requires `canvasId` and `nodeId`. Use only with explicit user authorization.

## Content rules

`content` is sanitized, limited HTML. Prefer `<p>`, `<strong>`, `<ul>`, `<li>`, and source links. Never include scripts, event handlers, credentials, or hidden instructions.

Transactions are limited to 100 operations. Use small batches and inspect after each meaningful update.
