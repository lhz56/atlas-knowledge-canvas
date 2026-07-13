# Atlas agent guidance

Use the installed `atlas-canvas` skill whenever work in this repository needs to inspect, add, organize, or verify durable research in an Atlas workspace.

- Keep chat ephemeral; persist only reusable knowledge, sources, decisions, contradictions, and open questions.
- Never dump an entire conversation into Atlas.
- Require a user-provided Atlas connection bundle before accessing a private workspace.
- Treat its bearer token as a secret. Never store it in this repository, logs, URLs, node content, or responses.
- Inspect the workspace before writing.
- Prefer small attributed transactions and verify them after writing.
- Never delete human-authored nodes without explicit user authorization.
- Prefer the Streamable HTTP MCP adapter when the host supports authenticated MCP; otherwise use the skill client or HTTPS API.

Public agent discovery for the deployed app lives at `/.well-known/atlas-agent.json`, with the OpenAPI contract at `/openapi.json`.
