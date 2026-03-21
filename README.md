# Workflow Garden

Workflow Garden is a public educational site that explains an issue-driven AI development workflow without assuming the visitor is a developer. It combines plain-language explanations, approachable setup guidance, short-form tutorials, and a curated diary of meaningful coding activity detected from `/Users/rajeev/Code`.

## Lifecycle stage

Planning is complete and the first MVP slice is in implementation on `RAJ-37` / GitHub issue `#2`.

## Source of truth

- Product workflow: [AGENTS.md](./AGENTS.md)
- Current implementation plan: [plans/workflow-garden-mvp.md](./plans/workflow-garden-mvp.md)
- Secrets contract: [docs/ops/secrets.md](./docs/ops/secrets.md)
- Vendor auth checks: [docs/ops/vendor-auth.md](./docs/ops/vendor-auth.md)

## Current goals

- explain the workflow in plain language
- teach the major tools and when to use them
- provide setup guidance that motivated newcomers can follow
- publish a curated daily activity diary only when meaningful local file activity exists
- validate the whole issue -> branch -> PR -> proof -> deploy -> merge loop

## Working commands

```bash
pnpm install
pnpm activity:refresh
pnpm dev
```

## Validation path

```bash
pnpm lint
pnpm test
pnpm build
pnpm proof
```

## Deploy assumption

The repo is designed for Vercel. The deployed site renders committed generated activity data. Local refresh of that data happens before proof and deploy.

## Next repo step

Finish the MVP implementation for `RAJ-37`, capture proof artifacts, update this README with current screenshots, deploy the site, and merge the issue branch.
