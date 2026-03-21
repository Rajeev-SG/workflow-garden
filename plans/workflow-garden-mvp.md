# Plan: Workflow Garden MVP

> Source PRD: GitHub issue #1, Linear issue RAJ-36

## Architectural decisions

- **Routes**: one primary public route at `/` for the MVP
- **Data shape**: generated local JSON for activity days and curated entries, now enriched with search text, related-content links, and refresh-gate metadata
- **Key models**: `ToolLens`, `SetupStep`, `LearningCard`, `ActivityDay`, `DiaryEntry`
- **Activity source**: recent repo activity detected inside `/Users/rajeev/Code`, scored by repo-day significance before diary generation
- **Deployment**: Vercel-hosted Next.js app
- **Proof**: Playwright-backed screenshots and summaries at normal desktop, wide desktop, and mobile widths

---

## Phase 1: Ship the educational MVP and curated diary

**User stories**: 1 through 15

### What to build

Create a polished public landing experience that teaches the workflow in approachable language, explains the major tools, walks visitors through setup, and displays a curated daily diary generated from meaningful file activity on the local machine. The slice includes proof artifacts, README screenshots, live deployment, and workflow close-out through the tracked issue branch and PR.

### Acceptance criteria

- [ ] Visitors can understand the workflow, tools, and setup path without developer jargon.
- [ ] The page composition is strong on normal desktop, wide desktop, and mobile.
- [ ] The generated diary appears only when meaningful local activity exists, reads like curated editorial content rather than a raw log, and links visitors into related projects, articles, and concepts.
- [ ] README screenshots come from current proof artifacts.
- [ ] The shipped slice is deployed and proven before merge.
