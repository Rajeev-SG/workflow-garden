# Acceptance Proof

Target flow: load the site, verify the educational archive overview renders, move into an article, inspect a project page, open the latest diary detail route, and confirm that search returns cross-content results.

Target URL: `https://workflow-garden.vercel.app`

Expected behavior:

- the page loads without runtime browser-console errors for the exercised routes
- the archive hero explains the workflow in plain language
- article routes render as readable standalone destinations with internal links
- project routes expose repo and live URL context
- diary detail routes show curated entries from the generated activity dataset
- search returns mixed content types for a workflow term
- screenshot review passes at normal desktop, wide desktop, and mobile widths

Observed behavior:

- the site loaded successfully at `https://workflow-garden.vercel.app`
- the homepage rendered the archive overview with article, project, diary, and search entry points
- the article route rendered readable long-form content with working internal links
- the project route exposed repo and live URL context without leaving the archive design system
- the latest diary detail route `https://workflow-garden.vercel.app/diary/2026-03-22` rendered curated entries from the generated feed
- the search route returned mixed project and concept results for the query `proof`
- the exercised browser-console captures stayed free of warnings and errors beyond local dev-tooling info logs
- screenshot review passed at normal desktop, wide desktop, and mobile widths

Reachability and completion:

- the diary detail page was proven reachable and rendered the latest generated day
- the search route was proven actionable by filling the query input and capturing populated results

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](/Users/rajeev/Code/workflow-garden/output/acceptance/proof-artifacts.json)
- Desktop screenshot: [desktop-normal.png](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/desktop-normal.png)
- Wide screenshot: [desktop-wide.png](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/desktop-wide.png)
- Mobile screenshot: [mobile.png](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/mobile.png)
- Diary screenshot: [diary.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary/.playwright-cli/diary.png)
- Article screenshot: [article.png](/Users/rajeev/Code/workflow-garden/output/playwright/article/.playwright-cli/article.png)
- Project screenshot: [project.png](/Users/rajeev/Code/workflow-garden/output/playwright/project/.playwright-cli/project.png)
- Search screenshot: [search.png](/Users/rajeev/Code/workflow-garden/output/playwright/search/.playwright-cli/search.png)
- Desktop console log: [desktop console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/console-2026-03-22T20-56-40-828Z.log)
- Wide console log: [wide console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/console-2026-03-22T20-56-46-474Z.log)
- Mobile console log: [mobile console](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/console-2026-03-22T20-56-52-624Z.log)
- Diary console log: [diary console](/Users/rajeev/Code/workflow-garden/output/playwright/diary/.playwright-cli/console-2026-03-22T20-56-58-928Z.log)
- Article console log: [article console](/Users/rajeev/Code/workflow-garden/output/playwright/article/.playwright-cli/console-2026-03-22T20-57-05-204Z.log)
- Project console log: [project console](/Users/rajeev/Code/workflow-garden/output/playwright/project/.playwright-cli/console-2026-03-22T20-57-11-149Z.log)
- Search console log: [search console](/Users/rajeev/Code/workflow-garden/output/playwright/search/.playwright-cli/console-2026-03-22T20-57-18-443Z.log)

Residual risk:

- The proof run depends on the production deployment already being live before `pnpm proof` is executed against it.
- The shell wrapper still prints repeated npm environment warnings, but those did not surface as browser-console failures in the exercised routes.

