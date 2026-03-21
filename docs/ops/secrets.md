# Secrets

Workflow Garden does not require private runtime secrets for the MVP, but this repo still follows the shared secret contract so future deploy work stays predictable.

## Source of truth

Infisical is the source of truth for app secrets.

- project: `personal-agent-secrets`
- local environment: `dev`
- preview environment: `staging`
- production environment: `prod`

## Current variables

- `WORKFLOW_GARDEN_ACTIVITY_ROOT`
- `WORKFLOW_GARDEN_MAX_ACTIVITY_DAYS`
- `WORKFLOW_GARDEN_MEANINGFUL_CHANGE_THRESHOLD`
- `NEXT_PUBLIC_SITE_URL`

## Usage

- Use `.env.example` for names only.
- Use `infisical run --env=dev -- pnpm <command>` if this repo gains real secrets later.
- Do not commit populated `.env` files.
