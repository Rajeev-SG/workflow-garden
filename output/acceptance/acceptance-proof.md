# Acceptance Proof

Target flow: load the site, verify the tightened homepage overview renders clearly, move into an article, inspect a project page, open the automated diary index and latest diary day, and confirm that search returns cross-content results.

Target URL: `https://workflow-garden.vercel.app`

Expected behavior:

- the page loads without runtime browser-console errors for the exercised routes
- the homepage uses above-the-fold space well and points visitors into articles, projects, and diary routes
- article routes render as readable standalone destinations with source links and internal links
- project routes expose GitHub, live URL, and proof context
- the automated diary index shows curated entries from the generated activity dataset
- diary detail routes keep the same source-linked evidence trail
- search returns mixed content types for a workflow term
- screenshot review passes at normal desktop, wide desktop, intermediate tablet, and mobile widths

Observed behavior:

- the site loaded successfully at `https://workflow-garden.vercel.app`
- the homepage rendered the tighter overview with article, project, diary, and search entry points visible without relying on the removed reading-room section
- the article route rendered readable long-form content with working internal links and external source links
- the project route exposed repo and live URL context without leaving the archive design system
- the diary index route `https://workflow-garden.vercel.app/diary` rendered the automated diary overview with the richer generated copy
- the latest diary detail route `https://workflow-garden.vercel.app/diary/2026-03-26` rendered curated entries from the generated feed
- the search route returned mixed project and concept results for the query `proof`
- the exercised browser-console captures stayed free of warnings and errors beyond local dev-tooling info logs
- screenshot review passed at normal desktop, wide desktop, intermediate tablet, and mobile widths

Reachability and completion:

- the automated diary index was proven reachable and scannable
- the diary detail page was proven reachable and rendered the latest generated day
- the search route was proven actionable by filling the query input and capturing populated results

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](/Users/rajeev/Code/workflow-garden/output/acceptance/proof-artifacts.json)
- Desktop screenshot: [desktop-normal.png](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/desktop-normal.png)
- Wide screenshot: [desktop-wide.png](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/desktop-wide.png)
- Tablet screenshot: [tablet.png](/Users/rajeev/Code/workflow-garden/output/playwright/tablet/.playwright-cli/tablet.png)
- Mobile screenshot: [mobile.png](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/mobile.png)
- Diary index screenshot: [diary-index.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary-index/.playwright-cli/diary-index.png)
- Diary day screenshot: [diary-day.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary-day/.playwright-cli/diary-day.png)
- Article screenshot: [article.png](/Users/rajeev/Code/workflow-garden/output/playwright/article/.playwright-cli/article.png)
- Project screenshot: [project.png](/Users/rajeev/Code/workflow-garden/output/playwright/project/.playwright-cli/project.png)
- Search screenshot: [search.png](/Users/rajeev/Code/workflow-garden/output/playwright/search/.playwright-cli/search.png)
- Desktop console log: [desktop console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/console-2026-03-26T20-09-14-320Z.log)
- Wide console log: [wide console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/console-2026-03-26T20-09-18-863Z.log)
- Tablet console log: [tablet console](/Users/rajeev/Code/workflow-garden/output/playwright/tablet/.playwright-cli/console-2026-03-26T20-09-22-534Z.log)
- Mobile console log: [mobile console](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/console-2026-03-26T20-09-26-994Z.log)
- Diary index console log: [diary index console](/Users/rajeev/Code/workflow-garden/output/playwright/diary-index/.playwright-cli/console-2026-03-26T20-09-31-003Z.log)
- Diary day console log: [diary day console](/Users/rajeev/Code/workflow-garden/output/playwright/diary-day/.playwright-cli/console-2026-03-26T20-09-36-238Z.log)
- Article console log: [article console](/Users/rajeev/Code/workflow-garden/output/playwright/article/.playwright-cli/console-2026-03-26T20-09-41-404Z.log)
- Project console log: [project console](/Users/rajeev/Code/workflow-garden/output/playwright/project/.playwright-cli/console-2026-03-26T20-09-46-760Z.log)
- Search console log: [search console](/Users/rajeev/Code/workflow-garden/output/playwright/search/.playwright-cli/console-2026-03-26T20-09-52-215Z.log)

Residual risk:

- The proof run depends on the production deployment already being live before `pnpm proof` is executed against it.
- The proof runner prefers a locally installed `playwright-cli` binary and falls back to the Codex wrapper only when the binary is unavailable.

