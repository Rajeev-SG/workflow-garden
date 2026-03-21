export type EntryKind =
  | "article"
  | "diary"
  | "tutorial"
  | "showcase"
  | "explainer"

export type ActivitySnapshot = {
  repoName: string
  day: string
  files: string[]
  latestTouchedAt: string
}

export type DiaryEntry = {
  id: string
  kind: EntryKind
  title: string
  summary: string
  whyItMatters: string
  repoName: string
  repoLabel: string
  changedFileCount: number
  categories: string[]
  highlights: string[]
}

export type ActivityDay = {
  date: string
  label: string
  summary: string
  entries: DiaryEntry[]
}

export type ActivityFeed = {
  generatedAt: string
  scanRoot: string
  meaningfulActivityDetected: boolean
  headline: string
  subhead: string
  stats: {
    activeRepoCount: number
    changedFileCount: number
    curatedEntryCount: number
    topTheme: string
    daysScanned: number
  }
  days: ActivityDay[]
}

type FeedOptions = {
  scanRoot: string
  meaningfulChangeThreshold: number
  maxDays: number
}

const CATEGORY_LABELS: Record<string, string> = {
  docs: "plain-language docs",
  interface: "interface work",
  styling: "visual refinement",
  proof: "proof and validation",
  testing: "testing",
  workflow: "workflow setup",
  config: "configuration",
  automation: "automation",
  content: "educational content",
}

const CATEGORY_PRIORITY = [
  "interface",
  "content",
  "proof",
  "workflow",
  "automation",
  "docs",
  "testing",
  "config",
] as const

const HUMANIZED_PATHS: Array<[RegExp, string]> = [
  [/^README\.md$/i, "the plain-language README"],
  [/^plans\//i, "the step-by-step plan"],
  [/^docs\//i, "the support docs"],
  [/^src\/app\/page\.(t|j)sx?$/i, "the main visitor-facing page"],
  [/^src\/app\/globals\.css$/i, "the visual system"],
  [/^src\/components\//i, "the reusable interface pieces"],
  [/^scripts\//i, "the automation scripts"],
  [/playwright/i, "the browser proof setup"],
  [/vitest/i, "the targeted test coverage"],
  [/package\.json$/i, "the repo command surface"],
  [/AGENTS\.md$/i, "the repo workflow guide"],
  [/CLAUDE\.md$/i, "the repo Claude guidance"],
  [/\.env\.example$/i, "the environment contract"],
]

const EMPTY_FEED_SUBHEAD =
  "No meaningful local file activity cleared the curation bar yet, so the diary stays quiet instead of pretending that noise is progress."

function repoLabelFromSlug(repoName: string) {
  return repoName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatList(items: string[]) {
  if (items.length === 0) {
    return ""
  }

  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`
}

function categoryForPath(file: string) {
  const lower = file.toLowerCase()

  if (lower.includes("playwright") || lower.includes("acceptance")) {
    return "proof"
  }

  if (
    lower.endsWith(".test.ts") ||
    lower.endsWith(".test.tsx") ||
    lower.endsWith(".spec.ts") ||
    lower.endsWith(".spec.tsx") ||
    lower.includes("vitest")
  ) {
    return "testing"
  }

  if (
    lower.startsWith("src/app") ||
    lower.startsWith("src/components") ||
    lower.endsWith(".tsx") ||
    lower.endsWith(".jsx")
  ) {
    return lower.includes("globals.css") ? "styling" : "interface"
  }

  if (
    lower.endsWith(".css") ||
    lower.endsWith(".scss") ||
    lower.endsWith(".svg")
  ) {
    return "styling"
  }

  if (
    lower.startsWith("docs/") ||
    lower === "readme.md" ||
    lower.startsWith("plans/")
  ) {
    return lower.startsWith("plans/") ? "workflow" : "docs"
  }

  if (
    lower.startsWith("scripts/") ||
    lower.includes("automation") ||
    lower.includes("workflow")
  ) {
    return "automation"
  }

  if (
    lower === "agents.md" ||
    lower === "claude.md" ||
    lower.startsWith(".github/")
  ) {
    return "workflow"
  }

  if (
    lower.endsWith(".json") ||
    lower.endsWith(".mjs") ||
    lower.endsWith(".mts") ||
    lower.endsWith(".ts") ||
    lower.includes("config") ||
    lower === "package.json"
  ) {
    return "config"
  }

  return "content"
}

function orderedCategories(files: string[]) {
  const set = new Set(files.map(categoryForPath))

  return CATEGORY_PRIORITY.filter((category) => set.has(category))
}

export function isMeaningfulSnapshot(
  snapshot: ActivitySnapshot,
  threshold: number,
) {
  const categories = orderedCategories(snapshot.files)
  const hasKeyNarrativeFile = snapshot.files.some((file) => {
    const lower = file.toLowerCase()

    return (
      lower === "readme.md" ||
      lower.startsWith("plans/") ||
      lower.startsWith("src/app/") ||
      lower.startsWith("src/components/") ||
      lower.includes("playwright") ||
      lower.endsWith(".test.ts") ||
      lower.endsWith(".test.tsx")
    )
  })

  return (
    snapshot.files.length >= threshold ||
    categories.length >= 2 ||
    hasKeyNarrativeFile
  )
}

function humanizeHighlight(file: string) {
  for (const [pattern, label] of HUMANIZED_PATHS) {
    if (pattern.test(file)) {
      return label
    }
  }

  const tail = file.split("/").at(-1) ?? file
  const cleaned = tail
    .replace(/^\.+/, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim()

  return cleaned || "repo housekeeping"
}

function dedupe<T>(items: T[]) {
  return [...new Set(items)]
}

function pickEntryKind(categories: string[]): EntryKind {
  if (categories.includes("proof")) {
    return "explainer"
  }

  if (categories.includes("interface") || categories.includes("styling")) {
    return "showcase"
  }

  if (categories.includes("workflow") || categories.includes("docs")) {
    return "tutorial"
  }

  if (categories.includes("automation")) {
    return "article"
  }

  return "diary"
}

function whyItMatters(categories: string[]) {
  if (categories.includes("proof")) {
    return "It gives visitors visible evidence instead of asking them to trust a vague claim that the workflow works."
  }

  if (categories.includes("interface") || categories.includes("styling")) {
    return "It turns internal workflow ideas into a surface that someone can understand at a glance."
  }

  if (categories.includes("workflow")) {
    return "It lowers the setup barrier, which is exactly what new adopters need before they try the workflow themselves."
  }

  if (categories.includes("automation")) {
    return "It reduces repeat work and makes the diary feel curated instead of manually stitched together."
  }

  return "It helps the workflow read as a guided system rather than a pile of developer-only notes."
}

function entryTitle(
  kind: EntryKind,
  repoLabel: string,
  categories: string[],
  changedFileCount: number,
) {
  if (kind === "explainer") {
    return `${repoLabel} focused on proof that people can actually inspect`
  }

  if (kind === "showcase") {
    return `${repoLabel} shaped a clearer visitor-facing experience`
  }

  if (kind === "tutorial") {
    return `${repoLabel} translated workflow steps into something teachable`
  }

  if (kind === "article") {
    return `${repoLabel} turned repeated work into a more dependable system`
  }

  const categoryLabel =
    CATEGORY_LABELS[categories[0] ?? "content"] ?? "focused product work"

  return `${repoLabel} logged a steady round of ${categoryLabel} across ${changedFileCount} touched files`
}

function entrySummary(
  repoLabel: string,
  categories: string[],
  changedFileCount: number,
) {
  const focus = formatList(
    categories.slice(0, 3).map((category) => CATEGORY_LABELS[category]),
  )
  const momentum =
    changedFileCount >= 100
      ? "a deep round of momentum"
      : changedFileCount >= 25
        ? "a broad round of momentum"
        : changedFileCount >= 8
          ? "a steady round of momentum"
          : "a small but clear signal"

  return `${repoLabel} moved through ${focus} with ${momentum}, then condensed that movement into a short update that a non-developer can follow.`
}

function dayLabel(date: string, generatedAt: string) {
  const generatedDay = generatedAt.slice(0, 10)

  if (date === generatedDay) {
    return "Today"
  }

  const dateValue = new Date(`${date}T12:00:00`)

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(dateValue)
}

function daySummary(entries: DiaryEntry[]) {
  const repos = dedupe(entries.map((entry) => entry.repoLabel))
  const themes = dedupe(entries.flatMap((entry) => entry.categories))
    .slice(0, 3)
    .map((category) => CATEGORY_LABELS[category])

  return `${repos.length} project${repos.length === 1 ? "" : "s"} produced visitor-worthy movement, with most of the visible momentum landing in ${formatList(themes)}.`
}

function topTheme(entries: DiaryEntry[]) {
  const counts = new Map<string, number>()

  entries.flatMap((entry) => entry.categories).forEach((category) => {
    counts.set(category, (counts.get(category) ?? 0) + 1)
  })

  const winner = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

  return winner ? CATEGORY_LABELS[winner] : "quiet focus"
}

function feedHeadline(days: ActivityDay[]) {
  const entries = days.flatMap((day) => day.entries)
  const repos = dedupe(entries.map((entry) => entry.repoLabel))
  const theme = topTheme(entries)

  if (repos.length === 1) {
    return `${repos[0]} carried the day with strong ${theme}.`
  }

  return `${repos.length} projects moved forward with a visible mix of ${theme}.`
}

function feedSubhead(days: ActivityDay[], daysScanned: number) {
  const entries = days.flatMap((day) => day.entries)

  return `The diary surfaced ${entries.length} curated update${entries.length === 1 ? "" : "s"} after scanning the last ${daysScanned} day${daysScanned === 1 ? "" : "s"} of local repo activity and translating the strongest signals into plain-language progress notes.`
}

export function buildCuratedFeed(
  snapshots: ActivitySnapshot[],
  options: FeedOptions,
  generatedAt = new Date().toISOString(),
): ActivityFeed {
  const meaningfulSnapshots = snapshots.filter((snapshot) =>
    isMeaningfulSnapshot(snapshot, options.meaningfulChangeThreshold),
  )

  const entries = meaningfulSnapshots.map((snapshot) => {
    const repoLabel = repoLabelFromSlug(snapshot.repoName)
    const categories = orderedCategories(snapshot.files)
    const kind = pickEntryKind(categories)

    return {
      id: `${snapshot.repoName}-${snapshot.day}`,
      kind,
      title: entryTitle(kind, repoLabel, categories, snapshot.files.length),
      summary: entrySummary(repoLabel, categories, snapshot.files.length),
      whyItMatters: whyItMatters(categories),
      repoName: snapshot.repoName,
      repoLabel,
      changedFileCount: snapshot.files.length,
      categories,
      highlights: dedupe(snapshot.files.map(humanizeHighlight)).slice(0, 3),
    } satisfies DiaryEntry
  })

  const entriesByDay = meaningfulSnapshots.reduce<Record<string, DiaryEntry[]>>(
    (acc, snapshot, index) => {
      const entry = entries[index]
      acc[snapshot.day] = acc[snapshot.day] ?? []
      acc[snapshot.day].push(entry)
      return acc
    },
    {},
  )

  const orderedDays = Object.keys(entriesByDay)
    .sort((left, right) => right.localeCompare(left))
    .map((date) => {
      const dayEntries = entriesByDay[date]
        .sort((left, right) => right.changedFileCount - left.changedFileCount)
        .slice(0, 3)

      return {
        date,
        label: dayLabel(date, generatedAt),
        summary: daySummary(dayEntries),
        entries: dayEntries,
      } satisfies ActivityDay
    })
    .slice(0, 3)

  const allEntries = orderedDays.flatMap((day) => day.entries)
  const activeRepoCount = dedupe(allEntries.map((entry) => entry.repoName)).length
  const changedFileCount = allEntries.reduce(
    (total, entry) => total + entry.changedFileCount,
    0,
  )

  if (orderedDays.length === 0) {
    return {
      generatedAt,
      scanRoot: options.scanRoot,
      meaningfulActivityDetected: false,
      headline: "The diary is quiet until the work is meaningfully visible.",
      subhead: EMPTY_FEED_SUBHEAD,
      stats: {
        activeRepoCount: 0,
        changedFileCount: 0,
        curatedEntryCount: 0,
        topTheme: "quiet focus",
        daysScanned: options.maxDays,
      },
      days: [],
    }
  }

  return {
    generatedAt,
    scanRoot: options.scanRoot,
    meaningfulActivityDetected: true,
    headline: feedHeadline(orderedDays),
    subhead: feedSubhead(orderedDays, options.maxDays),
    stats: {
      activeRepoCount,
      changedFileCount,
      curatedEntryCount: allEntries.length,
      topTheme: topTheme(allEntries),
      daysScanned: options.maxDays,
    },
    days: orderedDays,
  }
}

const activityIntelligence = {
  buildCuratedFeed,
  isMeaningfulSnapshot,
}

export default activityIntelligence
