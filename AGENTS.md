# Workflow Garden Agent Guide

## Purpose

This repo ships `Workflow Garden`, a public educational site that explains an issue-driven AI development workflow in plain language and shows a curated daily coding diary generated from local file activity under `/Users/rajeev/Code`.

## Repo posture

- Treat this repo as issue-driven delivery by default.
- Reuse the chain `write-a-prd -> prd-to-plan -> prd-to-issues` for new scope.
- Keep GitHub and Linear aligned. Linear owns planning metadata; GitHub owns repo execution.
- Default to one issue, one branch, and one PR for each implementation slice.

## Tooling

- Prefer `pnpm` for package management.
- Prefer `gh` for GitHub operations.
- Prefer `playwright-cli` or repo Playwright commands over browser MCP for proof.
- Use `context7` for current framework or component-library docs.
- Use `web` only when a referenced external site or current fact needs verification.

## Repo-specific commands

- `pnpm dev` starts the app locally.
- `pnpm lint` runs ESLint.
- `pnpm build` builds the production app.
- `pnpm activity:refresh` regenerates the curated activity feed from `/Users/rajeev/Code`.
- `pnpm test` runs the targeted automated checks.
- `pnpm proof` runs the browser proof flow and stores artifacts.

## Proof contract

- User-facing work is not complete without both design proof and acceptance proof.
- Screenshot review must pass at normal desktop, wide desktop, and mobile widths.
- Acceptance proof fails if screenshot review fails, even when behavior works.
- Keep proof summaries in `output/acceptance/` and browser artifacts in `output/playwright/`.
- Update `README.md` with current screenshots copied from proof artifacts when the UI changes.

## Activity feed contract

- The live site cannot read `/Users/rajeev/Code` at runtime on Vercel.
- Generate visitor-facing activity data locally with `pnpm activity:refresh`.
- Commit the generated dataset so the deployed site can render the latest curated diary.
- Only emit diary content when the generator detects meaningful activity.
- Keep generated copy understandable to non-developers. Never surface raw git logs verbatim.

## Hard escalation rule

If local shell inspection stops paying off after roughly `8-10` commands, switch tools, summarize the blocker, or make the smallest safe observability improvement instead of continuing the same loop.

## Docs to keep current

- `README.md`
- `plans/workflow-garden-mvp.md`
- `docs/ops/secrets.md`
- `docs/ops/vendor-auth.md`
- proof summaries under `output/acceptance/`
