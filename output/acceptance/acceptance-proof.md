# Acceptance Proof

Target flow: open the public site, verify the educational overview loads, confirm the quick-start sheet opens, and verify the generated diary content is visible on the live deployment.

Expected behavior:

- the page loads without runtime console errors
- the hero explains the workflow in plain language
- the quick-start button reveals a setup sheet with concrete steps
- the diary section shows curated entries based on generated local activity data
- screenshot review passes at normal desktop, wide desktop, and mobile widths

Observed behavior:

- the deployed site loaded successfully at [https://workflow-garden.vercel.app](https://workflow-garden.vercel.app)
- the quick-start sheet opened and rendered the four-step setup path
- the diary section rendered curated repo-day entries
- production console logs were clean across the overview, interactive sheet, and diary captures
- the original screenshot verdict was invalid because the shipped mobile hero still had a real overflow bug
- the corrected live rerun now shows the hero fitting a `390px` viewport with stacked CTAs and no horizontal overflow
- the fresh screenshot set now passes the composition gate on the deployed URL
- the proof set now also includes targeted tools-section captures at `402px` and `838px` so wrapped tab rows are checked directly

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](/Users/rajeev/Code/workflow-garden/output/acceptance/proof-artifacts.json)
- Desktop console log: [desktop console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/console-2026-03-21T18-33-20-644Z.log)
- Wide console log: [wide console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/console-2026-03-21T18-33-26-295Z.log)
- Mobile console log: [mobile console](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/console-2026-03-21T18-33-31-401Z.log)
- Interactive sheet screenshot: [quick-start-sheet.png](/Users/rajeev/Code/workflow-garden/output/playwright/interactive/.playwright-cli/quick-start-sheet.png)
- Diary screenshot: [daily-diary.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary/.playwright-cli/daily-diary.png)
- Tools narrow screenshot: [tools-narrow.png](/Users/rajeev/Code/workflow-garden/output/playwright/tools-narrow/.playwright-cli/tools-narrow.png)
- Tools tablet screenshot: [tools-tablet.png](/Users/rajeev/Code/workflow-garden/output/playwright/tools-tablet/.playwright-cli/tools-tablet.png)

Residual risk:

- The activity diary depends on running `pnpm activity:refresh` before proof and deploy, so stale content is possible if someone skips that step.
- The proof harness still emits repeated npm environment warnings from the wrapper shell, but the browser console for the exercised page remained clean.
