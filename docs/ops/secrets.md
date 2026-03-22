# Secrets

Workflow Garden does not require private runtime secrets for the MVP, but the diary-generation pipeline can use operator auth for OpenRouter copy enhancement. The repo still follows the shared secret contract so future deploy work stays predictable.

## Source of truth

Infisical is the source of truth for app secrets.

- project: `personal-agent-secrets`
- local environment: `dev`
- preview environment: `staging`
- production environment: `prod`

## Current variables

- `WORKFLOW_GARDEN_ACTIVITY_ROOT`
- `WORKFLOW_GARDEN_MAX_ACTIVITY_DAYS`
- `WORKFLOW_GARDEN_MEANINGFUL_SNAPSHOT_SCORE`
- `WORKFLOW_GARDEN_FULL_REFRESH_SIGNAL_THRESHOLD`
- `WORKFLOW_GARDEN_SPOTLIGHT_SIGNAL_THRESHOLD`
- `WORKFLOW_GARDEN_MIN_MEANINGFUL_SNAPSHOTS`
- `WORKFLOW_GARDEN_DIARY_MODEL`
- `WORKFLOW_GARDEN_OPENROUTER_PROVIDER_ORDER`
- `WORKFLOW_GARDEN_OPENROUTER_TIMEOUT_MS`
- `WORKFLOW_GARDEN_FORCE_FULL_REFRESH`
- `NEXT_PUBLIC_SITE_URL`
- `OPENROUTER_API_KEY` for the optional Kimi rewrite step

## Usage

- Use `.env.example` for names only.
- Use `infisical run --env=dev -- pnpm <command>` if this repo gains real secrets later.
- OpenRouter auth is operator-only for the diary refresh. Do not commit keys into the repo.
- The automation fallback sources `~/.config/claude-openrouter/env.sh` when `OPENROUTER_API_KEY` is not already present.
- Do not commit populated `.env` files.
