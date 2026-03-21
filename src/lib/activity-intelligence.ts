import { createHash } from "node:crypto"

export type EntryKind =
  | "article"
  | "diary"
  | "tutorial"
  | "showcase"
  | "explainer"

export type DiaryLinkKind = "article" | "project" | "concept"

export type ActivityCommit = {
  hash: string
  subject: string
  committedAt: string
  files: string[]
}

export type ActivitySnapshot = {
  repoName: string
  day: string
  files: string[]
  latestTouchedAt: string
  commits?: ActivityCommit[]
}

export type DiaryRelatedLink = {
  slug: string
  title: string
  href: string
  kind: DiaryLinkKind
  reason: string
}

export type DiaryEntry = {
  id: string
  kind: EntryKind
  title: string
  summary: string
  narrative: string
  whyItMatters: string
  exploreNext: string
  repoName: string
  repoLabel: string
  changedFileCount: number
  commitCount: number
  signalScore: number
  categories: string[]
  highlights: string[]
  notableChanges: string[]
  relatedSlugs: string[]
  relatedLinks: DiaryRelatedLink[]
  searchText: string
}

export type ActivityDay = {
  date: string
  label: string
  summary: string
  spotlight: string
  entries: DiaryEntry[]
}

export type RefreshDecision = "generated" | "skipped" | "quiet"

export type RefreshGate = {
  decision: RefreshDecision
  reason: string
  aggregateSignalScore: number
  meaningfulSnapshotCount: number
  spotlightSignalScore: number
  previousFingerprint: string | null
}

export type ActivityFeed = {
  schemaVersion: number
  generatedAt: string
  scanRoot: string
  meaningfulActivityDetected: boolean
  headline: string
  subhead: string
  sourceFingerprint: string
  generationMethod: "heuristic" | "llm"
  generationModel: string | null
  refreshGate: RefreshGate
  stats: {
    activeRepoCount: number
    changedFileCount: number
    commitCount: number
    curatedEntryCount: number
    topTheme: string
    daysScanned: number
    aggregateSignalScore: number
  }
  days: ActivityDay[]
}

export type DiaryContentContext = {
  entities: Array<{
    label: string
    href: string
    kind: DiaryLinkKind
    aliases?: string[]
  }>
  articles: Array<{
    slug: string
    title: string
    summary: string
    relatedSlugs: string[]
    tags: string[]
  }>
  concepts: Array<{
    slug: string
    title: string
    shortDefinition: string
    relatedSlugs: string[]
    aliases?: string[]
    tags: string[]
  }>
  projects: Array<{
    slug: string
    title: string
    description: string
    repoName: string
    relatedSlugs: string[]
    tags: string[]
  }>
}

type FeedOptions = {
  scanRoot: string
  meaningfulSnapshotScore: number
  fullRefreshSignalThreshold: number
  spotlightSignalThreshold: number
  minMeaningfulSnapshots: number
  maxDays: number
  forceFullRefresh?: boolean
}

type ScoredSnapshot = ActivitySnapshot & {
  categories: string[]
  signalScore: number
  signalReasons: string[]
}

const SCHEMA_VERSION = 2

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
  "styling",
] as const

const HUMANIZED_PATHS: Array<[RegExp, string]> = [
  [/^README\.md$/i, "the plain-language README"],
  [/^plans\//i, "the execution plan"],
  [/^docs\//i, "the operator docs"],
  [/^content\/articles\//i, "the evergreen articles"],
  [/^content\/concepts\//i, "the glossary concepts"],
  [/^content\/projects\//i, "the project pages"],
  [/^src\/app\/diary\//i, "the diary routes"],
  [/^src\/app\/search\//i, "the search routes"],
  [/^src\/app\/projects\//i, "the project detail pages"],
  [/^src\/app\/articles\//i, "the article routes"],
  [/^src\/components\//i, "the reusable interface pieces"],
  [/^src\/data\//i, "the generated archive data"],
  [/^src\/generated\//i, "the content graph outputs"],
  [/^scripts\//i, "the automation scripts"],
  [/playwright/i, "the browser proof setup"],
  [/vitest/i, "the targeted test coverage"],
  [/package\.json$/i, "the repo command surface"],
  [/AGENTS\.md$/i, "the repo workflow guide"],
  [/\.env\.example$/i, "the environment contract"],
]

const CATEGORY_LINK_FALLBACKS: Record<string, string[]> = {
  proof: ["proof-vs-acceptance", "proof"],
  workflow: ["one-issue-one-branch-one-pr", "issue-branch"],
  automation: ["what-agent-skills-are"],
}

const EMPTY_FEED_SUBHEAD =
  "No recent repo activity cleared the archive bar yet, so Workflow Garden keeps the diary quiet instead of publishing dressed-up noise."

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

function dedupe<T>(items: T[]) {
  return [...new Set(items)]
}

function slugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? href
}

function normalizeSubject(subject: string, repoLabel?: string) {
  const cleaned = subject
    .replace(/^(feat|fix|chore|docs|refactor|test|build|ci|perf)(\([^)]+\))?:\s*/i, "")
    .replace(/^RAJ-\d+\s*/i, "")
    .replace(/^Issue #\d+:\s*/i, "")
    .replace(/^PRD:\s*/i, "")
    .replace(/^DESIGN:\s*/i, "")
    .replace(/\(#\d+\)\s*$/i, "")
    .replace(/\.$/, "")
    .trim()

  if (!repoLabel) {
    return cleaned
  }

  return cleaned
    .replace(new RegExp(escapeRegExp(repoLabel), "ig"), "the project")
    .replace(/\bthe the\b/gi, "the")
    .replace(/\s{2,}/g, " ")
    .trim()
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
    lower.startsWith("content/articles/") ||
    lower.startsWith("content/concepts/") ||
    lower.startsWith("content/projects/")
  ) {
    return "content"
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
    lower.startsWith(".github/") ||
    lower === ".env.example"
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

function humanizeCommitSubject(subject: string, repoLabel?: string) {
  const normalized = normalizeSubject(subject, repoLabel)
  return normalized || "shaped the working slice"
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

  if (categories.includes("automation") || categories.includes("config")) {
    return "article"
  }

  return "diary"
}

function scoreSnapshot(snapshot: ActivitySnapshot) {
  const categories = orderedCategories(snapshot.files)
  const commitCount = snapshot.commits?.length ?? 0
  const signalReasons: string[] = []
  let signalScore = 0

  const hasPublicSurface = snapshot.files.some((file) => {
    const lower = file.toLowerCase()
    return (
      lower.startsWith("src/app/") ||
      lower.startsWith("content/") ||
      lower.startsWith("src/components/") ||
      lower.startsWith("src/generated/") ||
      lower.startsWith("src/data/")
    )
  })

  const hasOperatorSurface = snapshot.files.some((file) => {
    const lower = file.toLowerCase()
    return (
      lower === "readme.md" ||
      lower.startsWith("docs/") ||
      lower.startsWith("plans/") ||
      lower.startsWith("scripts/")
    )
  })

  signalScore += Math.min(commitCount, 4) * 3
  if (commitCount > 0) {
    signalReasons.push(`${commitCount} recent commit${commitCount === 1 ? "" : "s"}`)
  }

  signalScore += Math.min(snapshot.files.length, 18)
  if (snapshot.files.length >= 6) {
    signalReasons.push(`${snapshot.files.length} touched files`)
  }

  signalScore += categories.length * 2
  if (categories.length >= 2) {
    signalReasons.push(`${categories.length} distinct activity categories`)
  }

  if (hasPublicSurface) {
    signalScore += 5
    signalReasons.push("visitor-facing surface changed")
  }

  if (hasOperatorSurface) {
    signalScore += 3
    signalReasons.push("operator workflow changed")
  }

  return {
    ...snapshot,
    categories,
    signalScore,
    signalReasons,
  } satisfies ScoredSnapshot
}

export function isMeaningfulSnapshot(
  snapshot: ActivitySnapshot,
  threshold: number,
) {
  return scoreSnapshot(snapshot).signalScore >= threshold
}

function compareSnapshots(left: ScoredSnapshot, right: ScoredSnapshot) {
  return (
    right.signalScore - left.signalScore ||
    right.latestTouchedAt.localeCompare(left.latestTouchedAt) ||
    left.repoName.localeCompare(right.repoName)
  )
}

export function computeSnapshotsFingerprint(snapshots: ActivitySnapshot[]) {
  const fingerprintInput = snapshots
    .map((snapshot) => {
      const commits = (snapshot.commits ?? [])
        .map((commit) => `${commit.hash}:${commit.committedAt}:${commit.subject}`)
        .sort()
        .join("|")
      const files = [...snapshot.files].sort().join("|")

      return `${snapshot.repoName}:${snapshot.day}:${snapshot.latestTouchedAt}:${files}:${commits}`
    })
    .sort()
    .join("\n")

  return createHash("sha256").update(fingerprintInput).digest("hex")
}

export function buildRefreshGate(
  snapshots: ActivitySnapshot[],
  options: FeedOptions,
  previousFeed?: ActivityFeed,
) {
  const scoredSnapshots = snapshots.map(scoreSnapshot)
  const meaningfulSnapshots = scoredSnapshots
    .filter((snapshot) => snapshot.signalScore >= options.meaningfulSnapshotScore)
    .sort(compareSnapshots)

  const aggregateSignalScore = meaningfulSnapshots.reduce(
    (total, snapshot) => total + snapshot.signalScore,
    0,
  )
  const spotlightSignalScore = meaningfulSnapshots[0]?.signalScore ?? 0
  const fingerprint = computeSnapshotsFingerprint(meaningfulSnapshots)
  const previousFingerprint = previousFeed?.sourceFingerprint ?? null

  if (meaningfulSnapshots.length === 0) {
    return {
      fingerprint,
      meaningfulSnapshots,
      gate: {
        decision: previousFeed ? "skipped" : "quiet",
        reason: "No recent repo-day activity cleared the meaningful-change score.",
        aggregateSignalScore,
        meaningfulSnapshotCount: 0,
        spotlightSignalScore,
        previousFingerprint,
      } satisfies RefreshGate,
    }
  }

  if (!options.forceFullRefresh && previousFingerprint && previousFingerprint === fingerprint) {
    return {
      fingerprint,
      meaningfulSnapshots,
      gate: {
        decision: "skipped",
        reason: "The meaningful activity fingerprint has not changed since the last full archive refresh.",
        aggregateSignalScore,
        meaningfulSnapshotCount: meaningfulSnapshots.length,
        spotlightSignalScore,
        previousFingerprint,
      } satisfies RefreshGate,
    }
  }

  const passesThreshold =
    options.forceFullRefresh ||
    aggregateSignalScore >= options.fullRefreshSignalThreshold ||
    meaningfulSnapshots.length >= options.minMeaningfulSnapshots ||
    spotlightSignalScore >= options.spotlightSignalThreshold

  return {
    fingerprint,
    meaningfulSnapshots,
    gate: {
      decision: passesThreshold ? "generated" : previousFeed ? "skipped" : "quiet",
      reason: options.forceFullRefresh
        ? "A forced refresh was requested for the diary archive."
        : passesThreshold
        ? "Recent repo activity cleared the refresh gate for a full diary regeneration."
        : "Recent activity was real, but the total signal stayed below the full refresh gate.",
      aggregateSignalScore,
      meaningfulSnapshotCount: meaningfulSnapshots.length,
      spotlightSignalScore,
      previousFingerprint,
    } satisfies RefreshGate,
  }
}

function formatDayLabel(date: string, generatedAt: string) {
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

function topTheme(entries: DiaryEntry[]) {
  const counts = new Map<string, number>()

  entries.flatMap((entry) => entry.categories).forEach((category) => {
    counts.set(category, (counts.get(category) ?? 0) + 1)
  })

  const winner = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  return winner ? CATEGORY_LABELS[winner] : "quiet focus"
}

function scoreReasonLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category
}

function entryTitle(snapshot: ScoredSnapshot, repoLabel: string) {
  const kind = pickEntryKind(snapshot.categories)

  if (kind === "explainer") {
    return `${repoLabel} turned recent work into proof people can inspect`
  }

  if (kind === "showcase") {
    return `${repoLabel} made the public surface easier to follow`
  }

  if (kind === "tutorial") {
    return `${repoLabel} made the workflow easier to learn`
  }

  if (kind === "article") {
    return `${repoLabel} made the archive less manual to maintain`
  }

  const leadingCategory = scoreReasonLabel(snapshot.categories[0] ?? "content")
  return `${repoLabel} moved its ${leadingCategory} story forward`
}

function entrySummary(snapshot: ScoredSnapshot, repoLabel: string) {
  const focus = formatList(
    snapshot.categories.slice(0, 3).map((category) => CATEGORY_LABELS[category]),
  )
  const topChanges = dedupe(
    [
      ...(snapshot.commits ?? []).map((commit) =>
        humanizeCommitSubject(commit.subject, repoLabel),
      ),
      ...snapshot.files.map(humanizeHighlight),
    ],
  )
    .slice(0, 2)
    .join(" and ")

  return `The strongest movement landed in ${focus || "the public archive"}${topChanges ? `, with visible work on ${topChanges}` : ""}.`
}

function entryNarrative(snapshot: ScoredSnapshot, repoLabel: string) {
  const changeHooks = dedupe(
    [
      ...(snapshot.commits ?? []).map((commit) =>
        humanizeCommitSubject(commit.subject, repoLabel),
      ),
      ...snapshot.files.map(humanizeHighlight),
    ],
  ).slice(0, 3)

  return `${repoLabel} spent the day on ${formatList(changeHooks)}.`
}

function whyItMatters(snapshot: ScoredSnapshot) {
  if (snapshot.categories.includes("proof")) {
    return "It turns workflow claims into something visitors can inspect instead of simply trust."
  }

  if (snapshot.categories.includes("interface") || snapshot.categories.includes("styling")) {
    return "It makes the workflow easier to understand at a glance, which is where public trust starts."
  }

  if (snapshot.categories.includes("workflow") || snapshot.categories.includes("docs")) {
    return "It lowers the barrier for someone who is curious about the workflow but not yet fluent in developer tooling."
  }

  if (snapshot.categories.includes("automation") || snapshot.categories.includes("config")) {
    return "It makes the archive more dependable and less reliant on manual cleanup or heroic memory."
  }

  return "It helps the site feel like a guided archive instead of a pile of implementation leftovers."
}

function findContentRecord(
  context: DiaryContentContext,
  slug: string,
): DiaryRelatedLink | null {
  const article = context.articles.find((item) => item.slug === slug)
  if (article) {
    return {
      slug,
      title: article.title,
      href: `/articles/${slug}`,
      kind: "article",
      reason: "This article gives the surrounding workflow context.",
    }
  }

  const project = context.projects.find((item) => item.slug === slug)
  if (project) {
    return {
      slug,
      title: project.title,
      href: `/projects/${slug}`,
      kind: "project",
      reason: "This public project page is tied to the same workstream.",
    }
  }

  const concept = context.concepts.find((item) => item.slug === slug)
  if (concept) {
    return {
      slug,
      title: concept.title,
      href: `/concepts/${slug}`,
      kind: "concept",
      reason: "This concept explains a repeated term behind the work.",
    }
  }

  return null
}

function mergeRelatedLinks(
  current: DiaryRelatedLink[],
  next: DiaryRelatedLink[],
  limit = 4,
) {
  const bySlug = new Map<string, DiaryRelatedLink>()

  for (const link of [...current, ...next]) {
    if (!bySlug.has(link.slug)) {
      bySlug.set(link.slug, link)
    }
  }

  return [...bySlug.values()].slice(0, limit)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function relatedLinksForSnapshot(
  snapshot: ScoredSnapshot,
  context?: DiaryContentContext,
) {
  if (!context) {
    return []
  }

  let relatedLinks: DiaryRelatedLink[] = []
  const project = context.projects.find((item) => item.repoName === snapshot.repoName)

  if (project) {
    relatedLinks = mergeRelatedLinks(relatedLinks, [
      {
        slug: project.slug,
        title: project.title,
        href: `/projects/${project.slug}`,
        kind: "project",
        reason: "This diary note comes from the same repo as the project page.",
      },
    ])

    relatedLinks = mergeRelatedLinks(
      relatedLinks,
      project.relatedSlugs
        .map((slug) => findContentRecord(context, slug))
        .filter((link): link is DiaryRelatedLink => link !== null),
    )
  }

  const haystack = [
    repoLabelFromSlug(snapshot.repoName),
    ...snapshot.files,
    ...snapshot.signalReasons,
    ...(snapshot.commits ?? []).map((commit) => commit.subject),
  ]
    .join(" ")
    .toLowerCase()

  const entityLinks = context.entities
    .map((entity) => {
      const terms = dedupe([entity.label, ...(entity.aliases ?? [])]).map((term) =>
        term.replace(/`/g, "").trim(),
      )

      const matched = terms.some((term) => {
        if (!term) {
          return false
        }

        return new RegExp(`\\b${escapeRegExp(term.toLowerCase())}\\b`, "i").test(
          haystack,
        )
      })

      if (!matched) {
        return null
      }

      return {
        slug: slugFromHref(entity.href),
        title: entity.label,
        href: entity.href,
        kind: entity.kind,
        reason: "The recent repo activity mentioned this term directly.",
      } satisfies DiaryRelatedLink
    })
    .filter((link): link is DiaryRelatedLink => link !== null)

  relatedLinks = mergeRelatedLinks(relatedLinks, entityLinks)

  const fallbackLinks = snapshot.categories.flatMap((category) =>
    (CATEGORY_LINK_FALLBACKS[category] ?? [])
      .map((slug) => findContentRecord(context, slug))
      .filter((link): link is DiaryRelatedLink => link !== null),
  )

  return mergeRelatedLinks(relatedLinks, fallbackLinks)
}

function buildEntrySearchText(entry: DiaryEntry) {
  return [
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

function buildDiaryEntry(
  snapshot: ScoredSnapshot,
  context?: DiaryContentContext,
) {
  const repoLabel = repoLabelFromSlug(snapshot.repoName)
  const relatedLinks = relatedLinksForSnapshot(snapshot, context)
  const highlights = dedupe(snapshot.files.map(humanizeHighlight)).slice(0, 4)
  const notableChanges = dedupe(
    [
      ...(snapshot.commits ?? []).map((commit) =>
        humanizeCommitSubject(commit.subject, repoLabel),
      ),
      ...highlights,
    ],
  ).slice(0, 4)

  const entry = {
    id: `${snapshot.repoName}-${snapshot.day}`,
    kind: pickEntryKind(snapshot.categories),
    title: entryTitle(snapshot, repoLabel),
    summary: entrySummary(snapshot, repoLabel),
    narrative: entryNarrative(snapshot, repoLabel),
    whyItMatters: whyItMatters(snapshot),
    exploreNext:
      relatedLinks[0] !== undefined
        ? `Explore ${relatedLinks[0].title} next to see the public context around this work.`
        : "Explore the surrounding archive pages to see how this work connects to the wider workflow.",
    repoName: snapshot.repoName,
    repoLabel,
    changedFileCount: snapshot.files.length,
    commitCount: snapshot.commits?.length ?? 0,
    signalScore: snapshot.signalScore,
    categories: snapshot.categories,
    highlights,
    notableChanges,
    relatedSlugs: relatedLinks.map((link) => link.slug),
    relatedLinks,
    searchText: "",
  } satisfies DiaryEntry

  entry.searchText = buildEntrySearchText(entry)
  return entry
}

function daySummary(entries: DiaryEntry[]) {
  const repos = dedupe(entries.map((entry) => entry.repoLabel))
  const themes = dedupe(entries.flatMap((entry) => entry.categories))
    .slice(0, 3)
    .map((category) => CATEGORY_LABELS[category])

  return `${repos.length} project${repos.length === 1 ? "" : "s"} produced archive-worthy movement, with the strongest signals landing in ${formatList(themes)}.`
}

function daySpotlight(entries: DiaryEntry[]) {
  const topEntry = entries[0]
  if (!topEntry) {
    return "The day stayed below the curation bar."
  }

  return `${topEntry.repoLabel} led the day with ${topEntry.notableChanges.slice(0, 2).join(" and ")}.`
}

function feedHeadline(days: ActivityDay[]) {
  const entries = days.flatMap((day) => day.entries)
  const repos = dedupe(entries.map((entry) => entry.repoLabel))
  const theme = topTheme(entries)

  if (repos.length === 1) {
    return `${repos[0]} carried the archive with clear ${theme}.`
  }

  return `${repos.length} projects generated public-facing movement with a strong thread of ${theme}.`
}

function feedSubhead(days: ActivityDay[], options: FeedOptions) {
  const entries = days.flatMap((day) => day.entries)
  return `After scanning the last ${options.maxDays} day${options.maxDays === 1 ? "" : "s"} of recent repo activity, the diary kept ${entries.length} archive-worthy updates and dropped the rest.`
}

export function buildCuratedFeed(
  snapshots: ActivitySnapshot[],
  options: FeedOptions,
  generatedAt = new Date().toISOString(),
  context?: DiaryContentContext,
  gate?: RefreshGate,
) {
  const scoredSnapshots = snapshots.map(scoreSnapshot)
  const meaningfulSnapshots = scoredSnapshots
    .filter((snapshot) => snapshot.signalScore >= options.meaningfulSnapshotScore)
    .sort(compareSnapshots)

  const sourceFingerprint = computeSnapshotsFingerprint(meaningfulSnapshots)

  if (meaningfulSnapshots.length === 0) {
    return {
      schemaVersion: SCHEMA_VERSION,
      generatedAt,
      scanRoot: options.scanRoot,
      meaningfulActivityDetected: false,
      headline: "The diary stays quiet until the work becomes worth reading.",
      subhead: EMPTY_FEED_SUBHEAD,
      sourceFingerprint,
      generationMethod: "heuristic",
      generationModel: null,
      refreshGate:
        gate ??
        ({
          decision: "quiet",
          reason: "No meaningful snapshots were available for archive generation.",
          aggregateSignalScore: 0,
          meaningfulSnapshotCount: 0,
          spotlightSignalScore: 0,
          previousFingerprint: null,
        } satisfies RefreshGate),
      stats: {
        activeRepoCount: 0,
        changedFileCount: 0,
        commitCount: 0,
        curatedEntryCount: 0,
        topTheme: "quiet focus",
        daysScanned: options.maxDays,
        aggregateSignalScore: 0,
      },
      days: [],
    } satisfies ActivityFeed
  }

  const entries = meaningfulSnapshots.map((snapshot) =>
    buildDiaryEntry(snapshot, context),
  )

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
        .sort((left, right) => right.signalScore - left.signalScore)
        .slice(0, 3)

      return {
        date,
        label: formatDayLabel(date, generatedAt),
        summary: daySummary(dayEntries),
        spotlight: daySpotlight(dayEntries),
        entries: dayEntries,
      } satisfies ActivityDay
    })
    .slice(0, 5)

  const allEntries = orderedDays.flatMap((day) => day.entries)
  const activeRepoCount = dedupe(allEntries.map((entry) => entry.repoName)).length
  const changedFileCount = allEntries.reduce(
    (total, entry) => total + entry.changedFileCount,
    0,
  )
  const commitCount = allEntries.reduce((total, entry) => total + entry.commitCount, 0)
  const aggregateSignalScore = allEntries.reduce(
    (total, entry) => total + entry.signalScore,
    0,
  )

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    scanRoot: options.scanRoot,
    meaningfulActivityDetected: true,
    headline: feedHeadline(orderedDays),
    subhead: feedSubhead(orderedDays, options),
    sourceFingerprint,
    generationMethod: "heuristic",
    generationModel: null,
    refreshGate:
      gate ??
      ({
        decision: "generated",
        reason: "Meaningful snapshots were available for a full archive generation.",
        aggregateSignalScore,
        meaningfulSnapshotCount: meaningfulSnapshots.length,
        spotlightSignalScore: meaningfulSnapshots[0]?.signalScore ?? 0,
        previousFingerprint: null,
      } satisfies RefreshGate),
    stats: {
      activeRepoCount,
      changedFileCount,
      commitCount,
      curatedEntryCount: allEntries.length,
      topTheme: topTheme(allEntries),
      daysScanned: options.maxDays,
      aggregateSignalScore,
    },
    days: orderedDays,
  } satisfies ActivityFeed
}

const activityIntelligence = {
  buildCuratedFeed,
  buildRefreshGate,
  computeSnapshotsFingerprint,
  isMeaningfulSnapshot,
}

export default activityIntelligence
