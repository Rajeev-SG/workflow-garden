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
  interactive: "wgi",
  diary: "wgdi",
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

async function captureInteractiveState() {
  const cwd = path.join(playwrightRoot, "interactive")
  await mkdir(path.join(cwd, ".playwright-cli"), { recursive: true })

  runCli(cwd, ["--session", sessions.interactive, "open", baseUrl])
  runCli(cwd, ["--session", sessions.interactive, "resize", "1440", "1400"])
  runCli(cwd, [
    "--session",
    sessions.interactive,
    "run-code",
    "async (page) => { await page.getByRole('button', { name: /Try the guided setup/i }).click(); await page.waitForTimeout(250); await page.screenshot({ path: '.playwright-cli/quick-start-sheet.png', scale: 'css', type: 'png' }); }",
  ])
  runCli(cwd, ["--session", sessions.interactive, "console", "info"])

  const latestConsole = await latestMatchingFile(
    path.join(cwd, ".playwright-cli"),
    "console-",
    ".log",
  )

  return {
    screenshot: path.join(cwd, ".playwright-cli", "quick-start-sheet.png"),
    console: latestConsole
      ? path.join(cwd, ".playwright-cli", latestConsole)
      : null,
  }
}

async function captureDiaryState() {
  const cwd = path.join(playwrightRoot, "diary")
  await mkdir(path.join(cwd, ".playwright-cli"), { recursive: true })

  runCli(cwd, ["--session", sessions.diary, "open", baseUrl])
  runCli(cwd, ["--session", sessions.diary, "resize", "1440", "1400"])
  runCli(cwd, [
    "--session",
    sessions.diary,
    "run-code",
    "async (page) => { await page.locator('#daily-diary').scrollIntoViewIfNeeded(); await page.waitForTimeout(250); await page.screenshot({ path: '.playwright-cli/daily-diary.png', scale: 'css', type: 'png' }); }",
  ])
  runCli(cwd, ["--session", sessions.diary, "console", "info"])

  const latestConsole = await latestMatchingFile(
    path.join(cwd, ".playwright-cli"),
    "console-",
    ".log",
  )

  return {
    screenshot: path.join(cwd, ".playwright-cli", "daily-diary.png"),
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
  const quickStart = await captureInteractiveState()
  const diary = await captureDiaryState()

  const manifest = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    artifacts: {
      desktopNormal,
      desktopWide,
      mobile,
      quickStart,
      diary,
    },
  }

  await writeFile(
    path.join(acceptanceRoot, "proof-artifacts.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  )

  console.log("Saved output/acceptance/proof-artifacts.json")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
