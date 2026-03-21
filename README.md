# Workflow Garden

Workflow Garden is a public educational site that explains an issue-driven AI development workflow in plain language. It is designed for curious non-developers and motivated newcomers who want to understand the workflow, browse related articles and projects, search across concepts without leaving the site, and read curated diary entries generated from meaningful local repo activity.

Live URL: [workflow-garden.vercel.app](https://workflow-garden.vercel.app)

Current visual direction: the approved Stitch `B` archive treatment, extended into a multi-page archive with repo-native React and Next components rather than copied export markup.

## Screenshots

### Landing overview

![Workflow Garden landing overview](./public/readme/landing-overview.png)

### Article overview

![Workflow Garden article overview](./public/readme/article-overview.png)

### Curated diary state

![Workflow Garden daily diary](./public/readme/daily-diary.png)

### Search overview

![Workflow Garden search overview](./public/readme/search-overview.png)

### Mobile overview

![Workflow Garden mobile overview](./public/readme/mobile-overview.png)

## What the current site covers

- a route-driven homepage that points visitors into deeper reading instead of forcing one long scroll
- evergreen articles for skills, workflow concepts, and proof expectations
- project pages that connect repos, live URLs, and related diary evidence
- concept pages for repeated terms like `PRD`, `proof`, and `issue branch`
- a curated daily diary generated from meaningful file activity under `/Users/rajeev/Code`
- cross-content search across articles, projects, concepts, and diary entries

## Local commands

```bash
pnpm install
pnpm content:build
pnpm activity:refresh
pnpm dev
```

## Validation and proof

```bash
pnpm lint
pnpm test
pnpm build
pnpm proof
PROOF_BASE_URL=https://workflow-garden.vercel.app pnpm proof
```

Proof outputs live in:

- `output/acceptance/`
- `output/playwright/`

## Activity diary model

The deployed site cannot read `/Users/rajeev/Code` directly at runtime, so the repo generates a committed dataset before proof and deploy.

- `pnpm activity:refresh` scans `/Users/rajeev/Code`
- `pnpm content:build` regenerates typed content indices and the Pagefind index
- low-signal churn is ignored
- meaningful repo-day activity is translated into curated diary entries
- the app renders the generated JSON statically on Vercel

## Source of truth

- Product workflow: [AGENTS.md](./AGENTS.md)
- Approved visual spec: [.stitch/DESIGN.md](./.stitch/DESIGN.md)
- Current plan: [plans/workflow-garden-mvp.md](./plans/workflow-garden-mvp.md)
- Secrets contract: [docs/ops/secrets.md](./docs/ops/secrets.md)
- Vendor auth checks: [docs/ops/vendor-auth.md](./docs/ops/vendor-auth.md)
- Proof summaries: [output/acceptance/design-proof.md](./output/acceptance/design-proof.md), [output/acceptance/acceptance-proof.md](./output/acceptance/acceptance-proof.md)
