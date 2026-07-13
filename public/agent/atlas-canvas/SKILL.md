---
name: atlas-canvas
description: Maintain an Atlas visual knowledge canvas through its authenticated workspace API. Use when an agent is asked to log research, sources, insights, decisions, questions, or relationships in Atlas; inspect or organize an Atlas workspace; continue research from an Atlas connection bundle; or leave durable knowledge behind after a chat or coding task.
---

# Atlas Canvas

Use Atlas as durable shared memory. Keep chat for interaction; place reusable knowledge, evidence, conclusions, and open questions on the canvas.

## Connect

Require an Atlas connection bundle containing:

- `endpoint`: `https://<site>/api/atlas/<workspace-id>`
- `mcp`: `https://<site>/mcp/<workspace-id>` for Streamable HTTP MCP clients
- `token`: bearer write credential
- `workspace`: workspace ID

Treat the token as a secret. Never place it in card content, logs, commits, URLs, or responses. If no bundle is available, ask the user to open **Ask an agent → Connect an agent** in Atlas and copy one.

If the host supports MCP with custom authorization headers, prefer the bundle's `mcp` URL and pass the token as `Authorization: Bearer <token>`. The server exposes `atlas_inspect` and `atlas_transact`. Otherwise use the deterministic HTTP client below.

Use `scripts/atlas_client.py` for deterministic reads and writes. Set credentials only in environment variables:

```bash
export ATLAS_ENDPOINT='https://…/api/atlas/…'
export ATLAS_TOKEN='…'
python3 scripts/atlas_client.py inspect
```

Read [references/protocol.md](references/protocol.md) before constructing transactions directly.
The Atlas web app normally bootstraps the workspace. Use the documented bootstrap command only for an isolated workspace that the user explicitly authorized the agent to initialize.

## Workflow

1. Run `inspect` and identify the target canvas by title and ID.
2. Read the existing nodes and edges before adding anything.
3. Decide whether the new material is durable. Prefer:
   - sourced claims;
   - concise explanations;
   - decisions and their rationale;
   - contradictions and uncertainty;
   - useful questions and next steps.
4. Avoid transcript dumps, greetings, repeated information, private credentials, and unsupported certainty.
5. Reuse or update an existing node when it already represents the idea.
6. Create a small atomic transaction. Include the agent name and provenance in the request.
7. Connect new material to the ideas or evidence it depends on.
8. Read the returned workspace and verify the intended nodes and edges exist.
9. Report what was added or changed with canvas and node titles.

## Canvas grammar

Use these node types consistently:

- `overview`: central question or orientation
- `source`: paper, article, video, dataset, or primary evidence
- `concept`: explanation or definition
- `insight`: synthesis derived from multiple items
- `question`: unresolved or falsifiable question
- `timeline`: chronological development
- `note`: informal durable thought

Use relationship labels such as `supports`, `contradicts`, `explains`, `depends on`, `example of`, `caused by`, and `raises`.

## Research quality

- Separate source claims from agent synthesis.
- Preserve uncertainty explicitly.
- Put citations or source URLs in source-node content.
- Attribute agent-created material using the request-level `agent` field.
- Prefer five strong cards over twenty shallow cards.
- Do not reorganize human-authored regions without being asked.
- Never delete human-authored nodes unless the user explicitly requests deletion.

## Common operations

Inspect:

```bash
python3 scripts/atlas_client.py inspect
```

Apply a transaction file:

```bash
python3 scripts/atlas_client.py transact operations.json --agent "Codex"
```

The transaction file must be a JSON array of operations. Use server-returned IDs when later operations depend on newly created nodes; otherwise split into two transactions and inspect between them.
