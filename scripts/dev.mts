import { spawn } from "node:child_process"

function run(command: string, args: string[]) {
  return spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  })
}

const velite = run("pnpm", ["exec", "velite", "dev", "--clean"])
const next = run("pnpm", ["exec", "next", "dev"])

function shutdown(code = 0) {
  velite.kill("SIGTERM")
  next.kill("SIGTERM")
  process.exit(code)
}

velite.on("exit", (code) => {
  if (code && code !== 0) {
    shutdown(code)
  }
})

next.on("exit", (code) => {
  shutdown(code ?? 0)
})

process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))
