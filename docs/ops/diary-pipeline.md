# Diary Pipeline

Workflow Garden now treats the diary archive as a gated content pipeline instead of a plain file-scan script.

## Operator command

```bash
pnpm activity:refresh
```

That wrapper does four things in order:

1. runs `pnpm content:source` so the latest article, concept, and project data exists
2. scans recent repo activity under `/Users/rajeev/Code`
3. decides whether the diary fingerprint has changed enough to justify a full refresh
4. rebuilds the derived content graph and Pagefind search output

## Refresh gate

The expensive full generation step only runs when at least one of these is true:

- the meaningful activity fingerprint changed since the last full archive run
- aggregate repo-day signal cleared the full refresh threshold
- enough meaningful repo-day snapshots accumulated
- a force-refresh was requested explicitly

If the fingerprint is unchanged, the script exits the diary-generation step cleanly and still rebuilds the downstream derived outputs.

## Activity source

The generator prefers recent git history per repo and falls back to file mtimes only when git inspection is unavailable.

Each repo-day snapshot captures:

- touched files
- recent commit subjects
- activity categories
- a weighted signal score

## LLM step

When a full refresh runs and `OPENROUTER_API_KEY` is available, the pipeline tries an OpenRouter rewrite with a fast JSON-friendly model.

- current default model: `z-ai/glm-5-turbo`
- optional provider pinning via `WORKFLOW_GARDEN_OPENROUTER_PROVIDER_ORDER`
- default timeout: `45000` ms
- the model only rewrites copy fields
- structure, relationships, slugs, and search metadata stay deterministic

If the request times out or returns invalid JSON, the pipeline keeps the deterministic heuristic archive and completes successfully.

## Force refresh

Use this when the fingerprint is unchanged but you intentionally want to retry the full generation step, for example after changing prompts or increasing the OpenRouter timeout.

```bash
WORKFLOW_GARDEN_FORCE_FULL_REFRESH=1 pnpm activity:refresh
```

Optional timeout override:

```bash
WORKFLOW_GARDEN_FORCE_FULL_REFRESH=1 WORKFLOW_GARDEN_OPENROUTER_TIMEOUT_MS=90000 pnpm activity:refresh
```

Optional model override examples:

```bash
WORKFLOW_GARDEN_FORCE_FULL_REFRESH=1 WORKFLOW_GARDEN_DIARY_MODEL=moonshotai/kimi-k2.5 pnpm activity:refresh
WORKFLOW_GARDEN_FORCE_FULL_REFRESH=1 WORKFLOW_GARDEN_DIARY_MODEL=x-ai/grok-4.20-multi-agent-beta pnpm activity:refresh
```

## Generated outputs

- `src/data/activity-feed.generated.json`
- `src/generated/content-index.ts`
- `src/generated/search-documents.json`
- `public/pagefind/`

The diary feed now includes:

- refresh-gate metadata
- signal scores
- richer narrative copy fields
- related archive slugs and links
- search-ready text
