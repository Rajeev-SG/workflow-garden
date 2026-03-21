import { execFileSync } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import activityIntelligence, {
  type ActivityCommit,
  type ActivityFeed,
  type ActivitySnapshot,
  type DiaryContentContext,
} from "../src/lib/activity-intelligence"
import entitySourceModule from "../src/lib/content-entities-source"

const SCAN_ROOT =
  process.env.WORKFLOW_GARDEN_ACTIVITY_ROOT ?? "/Users/rajeev/Code"

const MAX_DAYS = Number(process.env.WORKFLOW_GARDEN_MAX_ACTIVITY_DAYS ?? "7")
const MEANINGFUL_SNAPSHOT_SCORE = Number(
  process.env.WORKFLOW_GARDEN_MEANINGFUL_SNAPSHOT_SCORE ?? "12",
)
const FULL_REFRESH_SIGNAL_THRESHOLD = Number(
  process.env.WORKFLOW_GARDEN_FULL_REFRESH_SIGNAL_THRESHOLD ?? "32",
)
const SPOTLIGHT_SIGNAL_THRESHOLD = Number(
  process.env.WORKFLOW_GARDEN_SPOTLIGHT_SIGNAL_THRESHOLD ?? "20",
)
const MIN_MEANINGFUL_SNAPSHOTS = Number(
  process.env.WORKFLOW_GARDEN_MIN_MEANINGFUL_SNAPSHOTS ?? "2",
)
const OPENROUTER_MODEL =
  process.env.WORKFLOW_GARDEN_DIARY_MODEL ?? "z-ai/glm-5-turbo"
const OPENROUTER_TIMEOUT_MS = Number(
  process.env.WORKFLOW_GARDEN_OPENROUTER_TIMEOUT_MS ?? "45000",
)
const OPENROUTER_PROVIDER_ORDER = (
  process.env.WORKFLOW_GARDEN_OPENROUTER_PROVIDER_ORDER ?? ""
)
  .split(",")
  .map((provider) => provider.trim())
  .filter(Boolean)
const FORCE_FULL_REFRESH =
  process.env.WORKFLOW_GARDEN_FORCE_FULL_REFRESH === "1" ||
  process.env.WORKFLOW_GARDEN_FORCE_FULL_REFRESH === "true"

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
  /\.(png|jpe?g|gif|ico|webp|avif)$/i,
]

type ArticleRecord = {
  slug: string
  title: string
  summary: string
  relatedSlugs: string[]
  tags: string[]
}

type ProjectRecord = {
  slug: string
  title: string
  description: string
  repoName: string
  relatedSlugs: string[]
  tags: string[]
}

type ConceptRecord = {
  slug: string
  title: string
  shortDefinition: string
  relatedSlugs: string[]
  aliases?: string[]
  tags: string[]
}

function shouldIgnoreFile(relativeFile: string) {
  return IGNORED_FILE_PATTERNS.some((pattern) => pattern.test(relativeFile))
}

function filterFiles(files: string[]) {
  return [...new Set(files)]
    .filter((file) => {
      const leaf = file.split("/").at(-1) ?? file
      if (leaf.startsWith(".") && !ALLOWED_HIDDEN_FILES.has(leaf)) {
        return false
      }

      return !shouldIgnoreFile(file)
    })
    .sort()
}

function repoDir(root: string, repoName: string) {
  return path.join(root, repoName)
}

function gitLogSince(repoPath: string, sinceIso: string) {
  return execFileSync(
    "git",
    [
      "-C",
      repoPath,
      "log",
      "--since",
      sinceIso,
      "--date=iso-strict",
      "--no-merges",
      "--pretty=format:__COMMIT__%n%H%n%cI%n%s",
      "--name-only",
      "--",
      ".",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  )
}

function parseGitLog(raw: string): ActivityCommit[] {
  const lines = raw.split("\n")
  const commits: ActivityCommit[] = []
  let cursor = 0

  while (cursor < lines.length) {
    if (lines[cursor] !== "__COMMIT__") {
      cursor += 1
      continue
    }

    const hash = lines[cursor + 1]?.trim()
    const committedAt = lines[cursor + 2]?.trim()
    const subject = lines[cursor + 3]?.trim()
    cursor += 4

    const files: string[] = []
    while (cursor < lines.length && lines[cursor] !== "__COMMIT__") {
      const file = lines[cursor]?.trim()
      if (file) {
        files.push(file)
      }
      cursor += 1
    }

    if (hash && committedAt && subject) {
      commits.push({
        hash,
        committedAt,
        subject,
        files: filterFiles(files),
      })
    }
  }

  return commits
}

async function collectFallbackFiles(repoName: string, root: string, cutoffMs: number) {
  const buckets = new Map<
    string,
    { files: string[]; latestTouchedAt: string; commits: ActivityCommit[] }
  >()

  async function walk(currentPath: string, relativePath = "") {
    const entries = await readdir(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith(".")) {
          continue
        }

        const nextRelative = relativePath
          ? path.posix.join(relativePath, entry.name)
          : entry.name

        await walk(path.join(currentPath, entry.name), nextRelative)
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

      if (fileStat.mtimeMs < cutoffMs) {
        continue
      }

      const relativeFile = relativePath
        ? path.posix.join(relativePath, entry.name)
        : entry.name

      if (shouldIgnoreFile(relativeFile)) {
        continue
      }

      const day = new Date(fileStat.mtimeMs).toISOString().slice(0, 10)
      const bucket = buckets.get(day) ?? {
        files: [],
        latestTouchedAt: new Date(fileStat.mtimeMs).toISOString(),
        commits: [],
      }

      bucket.files.push(relativeFile)
      if (bucket.latestTouchedAt < new Date(fileStat.mtimeMs).toISOString()) {
        bucket.latestTouchedAt = new Date(fileStat.mtimeMs).toISOString()
      }

      buckets.set(day, bucket)
    }
  }

  await walk(repoDir(root, repoName))

  return [...buckets.entries()].map(([day, bucket]) => ({
    repoName,
    day,
    files: filterFiles(bucket.files),
    latestTouchedAt: bucket.latestTouchedAt,
    commits: bucket.commits,
  }))
}

async function collectSnapshots(root: string) {
  const rootEntries = await readdir(root, { withFileTypes: true })
  const cutoffMs = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000
  const sinceIso = new Date(cutoffMs).toISOString()
  const snapshots: ActivitySnapshot[] = []

  for (const entry of rootEntries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) {
      continue
    }

    const repoName = entry.name
    const repoPath = repoDir(root, repoName)
    const gitDir = path.join(repoPath, ".git")

    if (existsSync(gitDir)) {
      try {
        const commits = parseGitLog(gitLogSince(repoPath, sinceIso))
        const buckets = new Map<
          string,
          { files: Set<string>; latestTouchedAt: string; commits: ActivityCommit[] }
        >()

        for (const commit of commits) {
          const day = commit.committedAt.slice(0, 10)
          const bucket = buckets.get(day) ?? {
            files: new Set<string>(),
            latestTouchedAt: commit.committedAt,
            commits: [],
          }

          commit.files.forEach((file) => bucket.files.add(file))
          bucket.latestTouchedAt =
            bucket.latestTouchedAt < commit.committedAt
              ? commit.committedAt
              : bucket.latestTouchedAt
          bucket.commits.push(commit)
          buckets.set(day, bucket)
        }

        snapshots.push(
          ...[...buckets.entries()].map(([day, bucket]) => ({
            repoName,
            day,
            files: filterFiles([...bucket.files]),
            latestTouchedAt: bucket.latestTouchedAt,
            commits: bucket.commits.sort((left, right) =>
              right.committedAt.localeCompare(left.committedAt),
            ),
          })),
        )
        continue
      } catch {
        // Fall back to mtime-based scanning when git inspection is unavailable.
      }
    }

    snapshots.push(...(await collectFallbackFiles(repoName, root, cutoffMs)))
  }

  return snapshots.sort((left, right) =>
    right.latestTouchedAt.localeCompare(left.latestTouchedAt),
  )
}

async function loadContentContext(): Promise<DiaryContentContext> {
  const veliteData = (await import("../.velite/index.js").catch(() => null)) as
    | {
        articles: ArticleRecord[]
        concepts: ConceptRecord[]
        projects: ProjectRecord[]
      }
    | null
  const { entitySource } = entitySourceModule

  return {
    entities: entitySource
      .filter((entity) => entity.kind === "article" || entity.kind === "project" || entity.kind === "concept")
      .map((entity) => ({
        label: entity.label,
        href: entity.href,
        kind: entity.kind,
        aliases: entity.aliases,
      })),
    articles: veliteData?.articles ?? [],
    concepts: veliteData?.concepts ?? [],
    projects: veliteData?.projects ?? [],
  }
}

function findExistingFeed(targetFile: string) {
  if (!existsSync(targetFile)) {
    return null
  }

  return readFile(targetFile, "utf8")
    .then((contents) => JSON.parse(contents) as ActivityFeed)
    .catch(() => null)
}

function extractJsonCandidate(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]
  if (fenced) {
    return fenced.trim()
  }

  const firstBrace = raw.indexOf("{")
  const lastBrace = raw.lastIndexOf("}")
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1)
  }

  return raw.trim()
}

function contentFromMessage(messageContent: unknown) {
  if (typeof messageContent === "string") {
    return messageContent
  }

  if (Array.isArray(messageContent)) {
    return messageContent
      .map((part) => {
        if (typeof part === "string") {
          return part
        }

        if (
          typeof part === "object" &&
          part !== null &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text
        }

        return ""
      })
      .join("\n")
  }

  return ""
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return null
  }

  const strings = value.filter((item): item is string => typeof item === "string")
  return strings.length === value.length ? strings : null
}

function mergeEditorialRewrite(baseFeed: ActivityFeed, candidate: unknown, model: string) {
  if (
    typeof candidate !== "object" ||
    candidate === null ||
    !("days" in candidate) ||
    !Array.isArray(candidate.days)
  ) {
    return baseFeed
  }

  const dayMap = new Map(baseFeed.days.map((day) => [day.date, day]))

  for (const rawDay of candidate.days) {
    if (
      typeof rawDay !== "object" ||
      rawDay === null ||
      !("date" in rawDay) ||
      typeof rawDay.date !== "string"
    ) {
      continue
    }

    const day = dayMap.get(rawDay.date)
    if (!day) {
      continue
    }

    if ("summary" in rawDay && typeof rawDay.summary === "string") {
      day.summary = rawDay.summary
    }

    if ("spotlight" in rawDay && typeof rawDay.spotlight === "string") {
      day.spotlight = rawDay.spotlight
    }

    if ("entries" in rawDay && Array.isArray(rawDay.entries)) {
      const entryMap = new Map(day.entries.map((entry) => [entry.id, entry]))

      for (const rawEntry of rawDay.entries) {
        if (
          typeof rawEntry !== "object" ||
          rawEntry === null ||
          !("id" in rawEntry) ||
          typeof rawEntry.id !== "string"
        ) {
          continue
        }

        const entry = entryMap.get(rawEntry.id)
        if (!entry) {
          continue
        }

        const textFields = [
          "title",
          "summary",
          "narrative",
          "whyItMatters",
          "exploreNext",
        ] as const

        for (const field of textFields) {
          if (field in rawEntry && typeof rawEntry[field] === "string") {
            entry[field] = rawEntry[field]
          }
        }

        if ("notableChanges" in rawEntry) {
          const notableChanges = asStringArray(rawEntry.notableChanges)
          if (notableChanges) {
            entry.notableChanges = notableChanges.slice(0, 4)
          }
        }

        entry.searchText = [
          entry.summary,
          entry.narrative,
          entry.whyItMatters,
          entry.exploreNext,
          entry.repoLabel,
          ...entry.highlights,
          ...entry.notableChanges,
          ...entry.relatedLinks.map((link) => link.title),
        ].join(" ")
      }
    }
  }

  if ("headline" in candidate && typeof candidate.headline === "string") {
    baseFeed.headline = candidate.headline
  }

  if ("subhead" in candidate && typeof candidate.subhead === "string") {
    baseFeed.subhead = candidate.subhead
  }

  baseFeed.generationMethod = "llm"
  baseFeed.generationModel = model
  return baseFeed
}

async function rewriteFeedWithOpenRouter(feed: ActivityFeed) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.log(
      "Skipping OpenRouter rewrite because OPENROUTER_API_KEY is not available in the environment.",
    )
    return feed
  }

  const promptPayload = {
    headline: feed.headline,
    subhead: feed.subhead,
    days: feed.days.map((day) => ({
      date: day.date,
      label: day.label,
      summary: day.summary,
      spotlight: day.spotlight,
      entries: day.entries.map((entry) => ({
        id: entry.id,
        repoLabel: entry.repoLabel,
        categories: entry.categories,
        highlights: entry.highlights,
        notableChanges: entry.notableChanges,
        title: entry.title,
        summary: entry.summary,
        narrative: entry.narrative,
        whyItMatters: entry.whyItMatters,
        exploreNext: entry.exploreNext,
        relatedLinks: entry.relatedLinks.map((link) => ({
          title: link.title,
          kind: link.kind,
          reason: link.reason,
        })),
      })),
    })),
  }

  console.log(`Rewriting diary copy with OpenRouter model ${OPENROUTER_MODEL}...`)

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://workflow-garden.vercel.app",
        "X-OpenRouter-Title": "Workflow Garden diary archive",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.1,
        max_tokens: 4800,
        response_format: { type: "json_object" },
        reasoning: { effort: "none", exclude: true },
        provider:
          OPENROUTER_PROVIDER_ORDER.length > 0
            ? {
                order: OPENROUTER_PROVIDER_ORDER,
                allow_fallbacks: false,
                sort: "throughput",
              }
            : undefined,
        messages: [
          {
            role: "system",
            content:
              "You are editing a public-facing coding diary for curious non-developers. Keep every factual relationship, date, repo label, and related link intact. Rewrite only for specificity, clarity, warmth, and editorial interest. Avoid hype, repetition, and jargon. Return JSON only.",
          },
          {
            role: "user",
            content: `Rewrite the following diary archive copy. Keep the same day dates and entry ids. Do not add or remove entries or links. Return JSON with this shape only: { "headline": string, "subhead": string, "days": [{ "date": string, "summary": string, "spotlight": string, "entries": [{ "id": string, "title": string, "summary": string, "narrative": string, "whyItMatters": string, "exploreNext": string, "notableChanges": string[] }] }] }.\n\n${JSON.stringify(promptPayload, null, 2)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(OPENROUTER_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.log(`OpenRouter rewrite skipped after HTTP ${response.status}.`)
      return feed
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>
    }
    const content = contentFromMessage(payload.choices?.[0]?.message?.content)
    if (!content) {
      return feed
    }

    try {
      const parsed = JSON.parse(extractJsonCandidate(content))
      return mergeEditorialRewrite(feed, parsed, OPENROUTER_MODEL)
    } catch {
      console.log(
        "OpenRouter returned non-JSON diary copy, so the heuristic archive was kept.",
      )
      return feed
    }
  } catch (error) {
    console.log(
      `OpenRouter rewrite skipped after a network timeout or request error: ${error instanceof Error ? error.message : "unknown error"}.`,
    )
    return feed
  }
}

async function main() {
  const snapshots = await collectSnapshots(SCAN_ROOT)
  const contentContext = await loadContentContext()
  const targetDir = path.join(process.cwd(), "src", "data")
  const targetFile = path.join(targetDir, "activity-feed.generated.json")
  const previousFeed = await findExistingFeed(targetFile)

  const options = {
    scanRoot: SCAN_ROOT,
    meaningfulSnapshotScore: MEANINGFUL_SNAPSHOT_SCORE,
    fullRefreshSignalThreshold: FULL_REFRESH_SIGNAL_THRESHOLD,
    spotlightSignalThreshold: SPOTLIGHT_SIGNAL_THRESHOLD,
    minMeaningfulSnapshots: MIN_MEANINGFUL_SNAPSHOTS,
    maxDays: MAX_DAYS,
    forceFullRefresh: FORCE_FULL_REFRESH,
  }

  const { gate, meaningfulSnapshots } = activityIntelligence.buildRefreshGate(
    snapshots,
    options,
    previousFeed ?? undefined,
  )

  if (gate.decision === "skipped" && previousFeed) {
    console.log(`Skipped full diary regeneration: ${gate.reason}`)
    console.log(
      `Meaningful snapshots: ${gate.meaningfulSnapshotCount}, aggregate score: ${gate.aggregateSignalScore}.`,
    )
    return
  }

  let feed: ActivityFeed = activityIntelligence.buildCuratedFeed(
    meaningfulSnapshots,
    options,
    new Date().toISOString(),
    contentContext,
    gate,
  )

  if (gate.decision === "generated" && feed.days.length > 0) {
    feed = await rewriteFeedWithOpenRouter(feed)
  }

  await mkdir(targetDir, { recursive: true })
  await writeFile(targetFile, `${JSON.stringify(feed, null, 2)}\n`, "utf8")

  console.log(
    `${gate.decision === "generated" ? "Generated" : "Saved"} ${feed.stats.curatedEntryCount} curated entr${
      feed.stats.curatedEntryCount === 1 ? "y" : "ies"
    } from ${feed.stats.activeRepoCount} active repos.`,
  )
  console.log(`Diary gate: ${gate.decision} - ${gate.reason}`)
  console.log(`Saved ${path.relative(process.cwd(), targetFile)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
