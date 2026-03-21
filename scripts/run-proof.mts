import { execFileSync } from "node:child_process"
import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

const baseUrl = process.env.PROOF_BASE_URL ?? "http://localhost:3001"
const codexHome = process.env.CODEX_HOME ?? path.join(process.env.HOME ?? "", ".codex")
const cli = path.join(codexHome, "skills", "playwright", "scripts", "playwright_cli.sh")

const outputRoot = path.join(process.cwd(), "output")
const playwrightRoot = path.join(outputRoot, "playwright")
const acceptanceRoot = path.join(outputRoot, "acceptance")

const sessions = {
  desktopNormal: "wgd",
  desktopWide: "wgw",
  mobile: "wgm",
  diary: "wgdi",
  article: "wga",
  project: "wgp",
  search: "wgs",
} as const

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
  const diary = await captureRouteState({
    label: "diary",
    session: sessions.diary,
    route: "/diary/2026-03-21",
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

  console.log("Saved output/acceptance/proof-artifacts.json")
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
