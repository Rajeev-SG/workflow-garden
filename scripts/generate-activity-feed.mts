import { mkdir, writeFile } from "node:fs/promises"
import { statSync } from "node:fs"
import path from "node:path"

import activityIntelligence from "../src/lib/activity-intelligence"
import type { ActivitySnapshot } from "../src/lib/activity-intelligence"

const SCAN_ROOT =
  process.env.WORKFLOW_GARDEN_ACTIVITY_ROOT ?? "/Users/rajeev/Code"

const MAX_DAYS = Number(process.env.WORKFLOW_GARDEN_MAX_ACTIVITY_DAYS ?? "7")
const MEANINGFUL_CHANGE_THRESHOLD = Number(
  process.env.WORKFLOW_GARDEN_MEANINGFUL_CHANGE_THRESHOLD ?? "3",
)

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vercel",
  ".pnpm-store",
  "__pycache__",
  ".cache",
  ".mypy_cache",
  ".pytest_cache",
  ".ruff_cache",
  ".venv",
  "venv",
  "_build",
  "output",
])

const ALLOWED_HIDDEN_FILES = new Set([
  ".env.example",
  ".gitignore",
  ".infisical.json",
])

const IGNORED_FILE_PATTERNS = [
  /\.log$/i,
  /\.tsbuildinfo$/i,
  /^next-env\.d\.ts$/i,
  /^pnpm-lock\.ya?ml$/i,
  /^package-lock\.json$/i,
  /^yarn\.lock$/i,
  /\.png$/i,
  /\.jpe?g$/i,
  /\.gif$/i,
  /\.ico$/i,
]

type RepoBucket = {
  files: string[]
  latestTouchedAt: string
}

async function collectSnapshots(root: string) {
  const rootDir = await import("node:fs/promises").then((fs) =>
    fs.readdir(root, { withFileTypes: true }),
  )

  const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000
  const buckets = new Map<string, RepoBucket>()

  function shouldIgnoreFile(relativeFile: string) {
    return IGNORED_FILE_PATTERNS.some((pattern) => pattern.test(relativeFile))
  }

  async function walk(repoName: string, currentPath: string, relativePath = "") {
    const entries = await import("node:fs/promises").then((fs) =>
      fs.readdir(currentPath, { withFileTypes: true }),
    )

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith(".")) {
          continue
        }

        const nextRelative = relativePath
          ? path.posix.join(relativePath, entry.name)
          : entry.name

        await walk(repoName, path.join(currentPath, entry.name), nextRelative)
        continue
      }

      if (entry.name.startsWith(".") && !ALLOWED_HIDDEN_FILES.has(entry.name)) {
        continue
      }

      const absoluteFile = path.join(currentPath, entry.name)
      let fileStat: ReturnType<typeof statSync>

      try {
        fileStat = statSync(absoluteFile)
      } catch {
        continue
      }

      if (fileStat.mtimeMs < cutoff) {
        continue
      }

      const day = new Date(fileStat.mtimeMs).toISOString().slice(0, 10)
      const relativeFile = relativePath
        ? path.posix.join(relativePath, entry.name)
        : entry.name

      if (shouldIgnoreFile(relativeFile)) {
        continue
      }

      const bucketKey = `${repoName}::${day}`
      const existing = buckets.get(bucketKey)

      if (existing) {
        existing.files.push(relativeFile)
        if (existing.latestTouchedAt < new Date(fileStat.mtimeMs).toISOString()) {
          existing.latestTouchedAt = new Date(fileStat.mtimeMs).toISOString()
        }
      } else {
        buckets.set(bucketKey, {
          files: [relativeFile],
          latestTouchedAt: new Date(fileStat.mtimeMs).toISOString(),
        })
      }
    }
  }

  for (const entry of rootDir) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) {
      continue
    }

    await walk(entry.name, path.join(root, entry.name))
  }

  return [...buckets.entries()]
    .map(([bucketKey, bucket]) => {
      const [repoName, day] = bucketKey.split("::")

      return {
        repoName,
        day,
        files: bucket.files.sort(),
        latestTouchedAt: bucket.latestTouchedAt,
      } satisfies ActivitySnapshot
    })
    .sort((left, right) => right.latestTouchedAt.localeCompare(left.latestTouchedAt))
}

async function main() {
  const snapshots = await collectSnapshots(SCAN_ROOT)
  const feed = activityIntelligence.buildCuratedFeed(snapshots, {
    scanRoot: SCAN_ROOT,
    meaningfulChangeThreshold: MEANINGFUL_CHANGE_THRESHOLD,
    maxDays: MAX_DAYS,
  })

  const targetDir = path.join(process.cwd(), "src", "data")
  const targetFile = path.join(targetDir, "activity-feed.generated.json")

  await mkdir(targetDir, { recursive: true })
  await writeFile(targetFile, `${JSON.stringify(feed, null, 2)}\n`, "utf8")

  console.log(
    `Generated ${feed.stats.curatedEntryCount} curated entr${
      feed.stats.curatedEntryCount === 1 ? "y" : "ies"
    } from ${feed.stats.activeRepoCount} active repos.`,
  )
  console.log(`Saved ${path.relative(process.cwd(), targetFile)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
