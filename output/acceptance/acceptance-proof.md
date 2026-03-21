# Acceptance Proof

Target flow: load the local site, verify the educational archive overview renders, move into an article, inspect a project page, open a diary detail route, and confirm that search returns cross-content results.

Expected behavior:

- the page loads without runtime console errors
- the archive hero explains the workflow in plain language
- article routes render as readable standalone destinations
- project routes expose repo and live URL context
- diary detail routes show curated entries based on generated local activity data
- search returns mixed content types for a workflow term
- screenshot review passes at normal desktop, wide desktop, and mobile widths

Observed behavior:

- the local site loaded successfully at `http://localhost:3001`
- the hero rendered the updated archive overview with article and project entry points
- the article route rendered readable long-form content with working internal links
- the project route exposed repo and live URL context without leaving the archive design system
- the diary detail route rendered curated entries from the generated feed
- the search route returned mixed project and concept results for the query `proof`
- browser console logs stayed clean across the overview, article, project, diary, search, and mobile captures

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](/Users/rajeev/Code/workflow-garden/output/acceptance/proof-artifacts.json)
- Desktop console log: [desktop console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/console-2026-03-21T22-30-33-569Z.log)
- Wide console log: [wide console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/console-2026-03-21T22-30-39-361Z.log)
- Mobile console log: [mobile console](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/console-2026-03-21T22-30-45-001Z.log)
- Article screenshot: [article.png](/Users/rajeev/Code/workflow-garden/output/playwright/article/.playwright-cli/article.png)
- Project screenshot: [project.png](/Users/rajeev/Code/workflow-garden/output/playwright/project/.playwright-cli/project.png)
- Diary screenshot: [diary.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary/.playwright-cli/diary.png)
- Search screenshot: [search.png](/Users/rajeev/Code/workflow-garden/output/playwright/search/.playwright-cli/search.png)

Residual risk:

- The activity diary still depends on running `pnpm activity:refresh` before proof and deploy, so stale content is possible if someone skips that step.
- The proof harness still emits repeated npm environment warnings from the wrapper shell, but the browser console for the exercised routes remained clean.
