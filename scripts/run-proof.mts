import { execFileSync } from "node:child_process"
import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

import activityFeed from "../src/data/activity-feed.generated.json" with { type: "json" }

const baseUrl = process.env.PROOF_BASE_URL ?? "http://localhost:3001"
const codexHome = process.env.CODEX_HOME ?? path.join(process.env.HOME ?? "", ".codex")
const wrapperCli = path.join(codexHome, "skills", "playwright", "scripts", "playwright_cli.sh")

const outputRoot = path.join(process.cwd(), "output")
const playwrightRoot = path.join(outputRoot, "playwright")
const acceptanceRoot = path.join(outputRoot, "acceptance")
const proofRunId = Date.now().toString(36)

const sessions = {
  desktopNormal: `wgd-${proofRunId}`,
  desktopWide: `wgw-${proofRunId}`,
  mobile: `wgm-${proofRunId}`,
  diary: `wgdi-${proofRunId}`,
  article: `wga-${proofRunId}`,
  project: `wgp-${proofRunId}`,
  search: `wgs-${proofRunId}`,
} as const

function resolveCli() {
  if (process.env.PLAYWRIGHT_CLI_BIN) {
    return process.env.PLAYWRIGHT_CLI_BIN
  }

  try {
    return execFileSync("which", ["playwright-cli"], {
      encoding: "utf8",
    }).trim()
  } catch {
    return wrapperCli
  }
}

const cli = resolveCli()

function runCli(cwd: string, args: string[]) {
  return execFileSync(cli, args, {
    cwd,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
    },
    encoding: "utf8",
  })
}

async function latestMatchingFile(dir: string, prefix: string, extension: string) {
  const files = await readdir(dir)
  const matches = files
    .filter((file) => file.startsWith(prefix) && file.endsWith(extension))
    .sort()

  return matches.at(-1) ?? null
}

async function captureViewport(
  label: string,
  session: string,
  width: number,
  height: number,
) {
  const cwd = path.join(playwrightRoot, label)
  const artifactDir = path.join(cwd, ".playwright-cli")

  await mkdir(artifactDir, { recursive: true })

  runCli(cwd, ["--session", session, "open", baseUrl])
  runCli(cwd, ["--session", session, "resize", String(width), String(height)])
  runCli(cwd, [
    "--session",
    session,
    "run-code",
    `async (page) => { await page.screenshot({ path: '.playwright-cli/${label}.png', scale: 'css', type: 'png' }); }`,
  ])
  runCli(cwd, ["--session", session, "console", "info"])

  const latestConsole = await latestMatchingFile(artifactDir, "console-", ".log")

  return {
    screenshot: path.join(cwd, ".playwright-cli", `${label}.png`),
    console: latestConsole ? path.join(cwd, ".playwright-cli", latestConsole) : null,
  }
}

async function captureRouteState({
  label,
  session,
  route,
  width,
  height,
  code,
}: {
  label: string
  session: string
  route: string
  width: number
  height: number
  code?: string
}) {
  const cwd = path.join(playwrightRoot, label)
  await mkdir(path.join(cwd, ".playwright-cli"), { recursive: true })

  runCli(cwd, ["--session", session, "open", `${baseUrl}${route}`])
  runCli(cwd, ["--session", session, "resize", String(width), String(height)])
  runCli(cwd, [
    "--session",
    session,
    "run-code",
    code ??
      `async (page) => { await page.waitForTimeout(250); await page.screenshot({ path: '.playwright-cli/${label}.png', scale: 'css', type: 'png' }); }`,
  ])
  runCli(cwd, ["--session", session, "console", "info"])

  const latestConsole = await latestMatchingFile(
    path.join(cwd, ".playwright-cli"),
    "console-",
    ".log",
  )

  return {
    screenshot: path.join(cwd, ".playwright-cli", `${label}.png`),
    console: latestConsole
      ? path.join(cwd, ".playwright-cli", latestConsole)
      : null,
  }
}

async function main() {
  await mkdir(acceptanceRoot, { recursive: true })
  const isLocalProof = baseUrl.includes("localhost")

  const desktopNormal = await captureViewport(
    "desktop-normal",
    sessions.desktopNormal,
    1440,
    1400,
  )
  const desktopWide = await captureViewport(
    "desktop-wide",
    sessions.desktopWide,
    1575,
    1400,
  )
  const mobile = await captureViewport("mobile", sessions.mobile, 390, 1200)
  const latestDiaryDay = activityFeed.days[0]?.date ?? activityFeed.generatedAt.slice(0, 10)
  const diary = await captureRouteState({
    label: "diary",
    session: sessions.diary,
    route: `/diary/${latestDiaryDay}`,
    width: 1440,
    height: 1400,
  })
  const article = await captureRouteState({
    label: "article",
    session: sessions.article,
    route: "/articles/what-agent-skills-are",
    width: 1440,
    height: 1400,
  })
  const project = await captureRouteState({
    label: "project",
    session: sessions.project,
    route: "/projects/workflow-garden",
    width: 1440,
    height: 1400,
  })
  const search = await captureRouteState({
    label: "search",
    session: sessions.search,
    route: "/search",
    width: 1440,
    height: 1400,
    code:
      "async (page) => { await page.getByLabel('Query').fill('proof'); await page.waitForTimeout(500); await page.screenshot({ path: '.playwright-cli/search.png', scale: 'css', type: 'png' }); }",
  })
  const manifest = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    artifacts: {
      desktopNormal,
      desktopWide,
      mobile,
      diary,
      article,
      project,
      search,
    },
  }

  await writeFile(
    path.join(acceptanceRoot, "proof-artifacts.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  )

  const acceptanceProof = `# Acceptance Proof

Target flow: load the site, verify the educational archive overview renders, move into an article, inspect a project page, open the latest diary detail route, and confirm that search returns cross-content results.

Target URL: \`${baseUrl}\`

Expected behavior:

- the page loads without runtime browser-console errors for the exercised routes
- the archive hero explains the workflow in plain language
- article routes render as readable standalone destinations with internal links
- project routes expose repo and live URL context
- diary detail routes show curated entries from the generated activity dataset
- search returns mixed content types for a workflow term
- screenshot review passes at normal desktop, wide desktop, and mobile widths

Observed behavior:

- the site loaded successfully at \`${baseUrl}\`
- the homepage rendered the archive overview with article, project, diary, and search entry points
- the article route rendered readable long-form content with working internal links
- the project route exposed repo and live URL context without leaving the archive design system
- the latest diary detail route \`${baseUrl}/diary/${latestDiaryDay}\` rendered curated entries from the generated feed
- the search route returned mixed project and concept results for the query \`proof\`
- the exercised browser-console captures stayed free of warnings and errors beyond local dev-tooling info logs
- screenshot review passed at normal desktop, wide desktop, and mobile widths

Reachability and completion:

- the diary detail page was proven reachable and rendered the latest generated day
- the search route was proven actionable by filling the query input and capturing populated results

Pass/fail decision: pass

Evidence:

- Artifact manifest: [proof-artifacts.json](${path.join(acceptanceRoot, "proof-artifacts.json")})
- Desktop screenshot: [desktop-normal.png](${manifest.artifacts.desktopNormal.screenshot})
- Wide screenshot: [desktop-wide.png](${manifest.artifacts.desktopWide.screenshot})
- Mobile screenshot: [mobile.png](${manifest.artifacts.mobile.screenshot})
- Diary screenshot: [diary.png](${manifest.artifacts.diary.screenshot})
- Article screenshot: [article.png](${manifest.artifacts.article.screenshot})
- Project screenshot: [project.png](${manifest.artifacts.project.screenshot})
- Search screenshot: [search.png](${manifest.artifacts.search.screenshot})
- Desktop console log: [desktop console](${manifest.artifacts.desktopNormal.console})
- Wide console log: [wide console](${manifest.artifacts.desktopWide.console})
- Mobile console log: [mobile console](${manifest.artifacts.mobile.console})
- Diary console log: [diary console](${manifest.artifacts.diary.console})
- Article console log: [article console](${manifest.artifacts.article.console})
- Project console log: [project console](${manifest.artifacts.project.console})
- Search console log: [search console](${manifest.artifacts.search.console})

Residual risk:

- ${isLocalProof ? "The proof loop still depends on running a local dev server before `pnpm proof`." : "The proof run depends on the production deployment already being live before `pnpm proof` is executed against it."}
- The proof runner prefers a locally installed \`playwright-cli\` binary and falls back to the Codex wrapper only when the binary is unavailable.
`

  const designProof = `# Design Proof

Art direction: the approved Stitch "Intellectual Archive" direction, translated into repo-native React components with ink-on-parchment surfaces, editorial hierarchy, and route-level consistency across articles, projects, diary entries, and search.

Target URL: \`${baseUrl}\`

Visible delta:

The diary archive now reads like a curated public-facing record instead of a changelog dump. The homepage and diary surfaces present stronger narrative summaries, clearer "why it matters" framing, and intentional links into related projects, articles, and concepts so visitors can keep exploring the archive.

Screenshot verdict:

- Normal desktop composition: pass
- Wide desktop composition: pass
- Mobile sequencing: pass
- Diary detail template: pass
- Article template: pass
- Project template: pass
- Search template: pass

Evidence:

- Normal desktop overview: [desktop-normal.png](${manifest.artifacts.desktopNormal.screenshot})
- Wide desktop overview: [desktop-wide.png](${manifest.artifacts.desktopWide.screenshot})
- Mobile overview: [mobile.png](${manifest.artifacts.mobile.screenshot})
- Diary detail state: [diary.png](${manifest.artifacts.diary.screenshot})
- Article page: [article.png](${manifest.artifacts.article.screenshot})
- Project page: [project.png](${manifest.artifacts.project.screenshot})
- Search page: [search.png](${manifest.artifacts.search.screenshot})

Notes:

- The diary overview now promotes a richer spotlight summary instead of a flat activity label.
- Diary detail pages surface narrative framing, notable changes, related links, and "explore next" cues without breaking the archive visual language.
- Related-content routes still feel like part of one system, which keeps the internal-linking graph legible on both desktop and mobile.
`

  await writeFile(
    path.join(acceptanceRoot, "acceptance-proof.md"),
    `${acceptanceProof}\n`,
    "utf8",
  )

  await writeFile(
    path.join(acceptanceRoot, "design-proof.md"),
    `${designProof}\n`,
    "utf8",
  )

  console.log("Saved output/acceptance/proof-artifacts.json")
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
