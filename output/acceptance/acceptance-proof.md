# Acceptance Proof

Target flow: load the production site, verify the educational archive overview renders, open the guided setup sheet, and confirm that the curated diary and tool-map sections remain usable across desktop and mobile captures.

Expected behavior:

- the page loads without runtime console errors
- the archive hero explains the workflow in plain language
- the quick-start button reveals a setup sheet with concrete steps
- the diary section shows curated entries based on generated local activity data
- the tool-map section remains readable at narrow and tablet widths
- screenshot review passes at normal desktop, wide desktop, and mobile widths

Observed behavior:

- the production site loaded successfully at [https://workflow-garden.vercel.app](https://workflow-garden.vercel.app)
- the hero rendered the new archive presentation with real repo copy and live diary stats
- the quick-start sheet opened and rendered the four-step setup path
- the diary section rendered the featured record plus dated archive groups from the generated feed
- the narrow and tablet tool-map captures stayed readable without overlapping controls or collapsed content
- browser console logs stayed clean across the overview, interactive sheet, diary, and mobile captures

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](/Users/rajeev/Code/workflow-garden/output/acceptance/proof-artifacts.json)
- Desktop console log: [desktop console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-normal/.playwright-cli/console-2026-03-21T20-37-34-718Z.log)
- Wide console log: [wide console](/Users/rajeev/Code/workflow-garden/output/playwright/desktop-wide/.playwright-cli/console-2026-03-21T20-37-40-034Z.log)
- Mobile console log: [mobile console](/Users/rajeev/Code/workflow-garden/output/playwright/mobile/.playwright-cli/console-2026-03-21T20-37-45-304Z.log)
- Interactive sheet screenshot: [quick-start-sheet.png](/Users/rajeev/Code/workflow-garden/output/playwright/interactive/.playwright-cli/quick-start-sheet.png)
- Diary screenshot: [daily-diary.png](/Users/rajeev/Code/workflow-garden/output/playwright/diary/.playwright-cli/daily-diary.png)
- Tools narrow screenshot: [tools-narrow.png](/Users/rajeev/Code/workflow-garden/output/playwright/tools-narrow/.playwright-cli/tools-narrow.png)
- Tools tablet screenshot: [tools-tablet.png](/Users/rajeev/Code/workflow-garden/output/playwright/tools-tablet/.playwright-cli/tools-tablet.png)

Residual risk:

- The activity diary depends on running `pnpm activity:refresh` before proof and deploy, so stale content is possible if someone skips that step.
- The proof harness still emits repeated npm environment warnings from the wrapper shell, but the browser console for the exercised page remained clean.
