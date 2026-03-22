import Link from "next/link"
import type { ActivityDay, ActivityFeed, DiaryEntry } from "@/lib/activity-intelligence"

const CATEGORY_LABELS: Record<string, string> = {
  interface: "Interface work",
  content: "Educational content",
  workflow: "Workflow setup",
  automation: "Automation",
  docs: "Plain-language docs",
  testing: "Targeted checks",
  config: "Configuration",
  styling: "Visual refinement",
  proof: "Proof and validation",
}

function entryKindLabel(kind: DiaryEntry["kind"]) {
  switch (kind) {
    case "article":
      return "Article"
    case "tutorial":
      return "Tutorial"
    case "showcase":
      return "Showcase"
    case "explainer":
      return "Explainer"
    default:
      return "Diary note"
  }
}

function momentumLabel(value: number) {
  if (value >= 100) {
    return "Deep move"
  }

  if (value >= 25) {
    return "Broad move"
  }

  if (value >= 8) {
    return "Steady move"
  }

  return "Small move"
}

function accentClass(index: number) {
  switch (index % 4) {
    case 0:
      return "archive-paper-stack archive-surface-high md:col-span-7"
    case 1:
      return "archive-surface-low md:col-span-5 md:mt-16"
    case 2:
      return "bg-white/80 md:col-span-5"
    default:
      return "archive-surface md:col-span-7 md:-mt-8"
  }
}

function groupedDays(feed: ActivityFeed) {
  const firstDay = feed.days[0]

  return feed.days
    .map((day, index) => ({
      ...day,
      entries: index === 0 ? day.entries.slice(1) : day.entries,
    }))
    .filter((day) => day.entries.length > 0 || day !== firstDay)
}

export interface DiaryArchiveSectionProps {
  feed: ActivityFeed
}

interface FeaturedEntryPanelProps {
  day: ActivityDay
  entry: DiaryEntry
  feed: ActivityFeed
}

function FeaturedEntryPanel({
  day,
  entry,
  feed,
}: Readonly<FeaturedEntryPanelProps>) {
  return (
    <article className="grid gap-10 border border-border/70 bg-white/78 p-6 md:p-8 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="archive-kicker text-primary/44">{entry.repoLabel}</span>
            <span className="archive-kicker text-secondary">
              {entryKindLabel(entry.kind)}
            </span>
          </div>
          <h3 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-6xl">
            {entry.title}
          </h3>
          <p className="text-base leading-8 text-muted-foreground md:text-lg">
            {entry.summary}
          </p>
        </div>

        <div className="archive-surface-low p-6">
          <p className="font-heading text-2xl leading-relaxed text-foreground italic">
            {entry.whyItMatters}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="archive-kicker text-primary/44">The what</p>
            <p className="mt-3 text-sm leading-7 text-foreground">
              {entry.narrative}
            </p>
          </div>
          <div>
            <p className="archive-kicker text-primary/44">So what</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {entry.whyItMatters}
            </p>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="archive-surface-high p-6">
          <p className="archive-kicker text-primary/45">Evidence file</p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="archive-kicker text-primary/35">Archival date</p>
              <p className="mt-2 text-2xl leading-tight font-medium text-primary">
                {day.date}
              </p>
              <p className="mt-1 text-sm text-secondary">{day.label}</p>
            </div>
            <div>
              <p className="archive-kicker text-primary/35">Impact radius</p>
              <p className="mt-2 text-sm leading-7 text-foreground">
                {momentumLabel(entry.changedFileCount)} across{" "}
                {entry.changedFileCount} changed files and {entry.commitCount} recent
                commit{entry.commitCount === 1 ? "" : "s"}.
              </p>
            </div>
            <div>
              <p className="archive-kicker text-primary/35">Day spotlight</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {day.spotlight}
              </p>
            </div>
            <div>
              <p className="archive-kicker text-primary/35">Top categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="bg-white/78 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-primary/78"
                  >
                    {CATEGORY_LABELS[category] ?? category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="archive-kicker text-primary/35">Scan root</p>
              <p className="mt-2 font-mono text-xs leading-6 text-muted-foreground">
                {feed.scanRoot}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-border/70 bg-white/76 p-5">
          <p className="archive-kicker text-primary/35">Observed highlights</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.highlights.map((highlight) => (
              <span
                key={highlight}
                className="bg-[color:rgb(229_226_218_/_72%)] px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-primary/74"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </article>
  )
}

interface DiaryEntryCardProps {
  entry: DiaryEntry
  index: number
}

function DiaryEntryCard({ entry, index }: Readonly<DiaryEntryCardProps>) {
  return (
    <article className={`${accentClass(index)} p-6 md:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="archive-kicker text-primary/45">{entry.repoLabel}</p>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-secondary">
            {entryKindLabel(entry.kind)}
          </p>
        </div>
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-primary/36">
          {momentumLabel(entry.changedFileCount)}
        </p>
      </div>

      <h4 className="mt-6 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
        {entry.title}
      </h4>

      <div className="mt-6 space-y-6">
        <div>
          <p className="archive-kicker text-primary/38">At a glance</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {entry.summary}
          </p>
        </div>
        <div>
          <p className="archive-kicker text-primary/38">The what</p>
          <p className="mt-3 text-base leading-7 text-foreground">
            {entry.narrative}
          </p>
        </div>
        <div>
          <p className="archive-kicker text-primary/38">So what</p>
          <p className="mt-3 border-l-2 border-[color:rgb(45_8_0_/_18%)] pl-4 text-sm leading-7 text-muted-foreground italic">
            {entry.whyItMatters}
          </p>
        </div>
        <div>
          <p className="archive-kicker text-primary/38">Explore next</p>
          <p className="mt-3 text-sm leading-7 text-foreground/80">
            {entry.exploreNext}
          </p>
        </div>
        <div>
          <p className="archive-kicker text-primary/38">Concrete moves</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground/85">
            {entry.notableChanges.slice(0, 3).map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {entry.highlights.map((highlight) => (
          <span
            key={highlight}
            className="bg-[color:rgb(255_255_255_/_68%)] px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-primary/70"
          >
            {highlight}
          </span>
        ))}
      </div>
    </article>
  )
}

export function DiaryArchiveSection({
  feed,
}: Readonly<DiaryArchiveSectionProps>) {
  const featuredDay = feed.days[0]
  const featuredEntry = featuredDay?.entries[0]
  const archiveDays = groupedDays(feed)

  return (
    <section
      id="daily-diary"
      className="archive-section archive-surface-low border-y border-border/70 py-20"
    >
      <div className="mx-auto w-full max-w-[96rem] space-y-14 px-5 md:px-8 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5">
            <p className="archive-kicker">Automated diary</p>
            <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
              Daily coding activity, filtered until it becomes worth reading.
            </h2>
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              The diary generator scans file changes under{" "}
              <span className="font-mono text-sm text-foreground">
                /Users/rajeev/Code
              </span>
              , looks for a meaningful signal, and only then creates entries.
              That keeps the public story curated and readable.
            </p>
            <Link href="/diary" className="archive-inline-link text-sm">
              Open the full diary archive
            </Link>
          </div>

          <div className="border border-border/70 bg-white/74 p-6">
            <p className="archive-kicker text-primary/45">
              What the generator ignores
            </p>
            <p className="mt-4 text-base leading-8 text-foreground">
              Tiny one-file nudges, noisy build output, and other low-signal
              churn do not become diary entries. The site would rather be quiet
              than noisy.
            </p>
          </div>
        </div>

        {featuredDay && featuredEntry ? (
          <FeaturedEntryPanel
            day={featuredDay}
            entry={featuredEntry}
            feed={feed}
          />
        ) : null}

        {feed.days.length === 0 ? (
          <article className="border border-dashed border-border/80 bg-white/76 p-6">
            <p className="archive-kicker">Nothing loud enough to publish</p>
            <p className="mt-4 text-base leading-8 text-foreground">
              The refresh command ran, but the scan did not find enough
              meaningful movement to create a public diary entry today.
            </p>
          </article>
        ) : (
          <div className="space-y-24">
            {archiveDays.map((day) => (
              <section
                key={day.date}
                className="grid gap-10 xl:grid-cols-[16rem_1fr]"
              >
                <div className="xl:sticky xl:top-28 xl:h-fit">
                  <div className="flex items-center gap-4 xl:mb-8">
                    <div className="archive-rule w-12" />
                    <span className="archive-kicker text-primary/45">
                      {day.label}
                    </span>
                  </div>
                  <h3 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
                    {day.date}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {day.summary}
                  </p>
                  <Link href={`/diary/${day.date}`} className="mt-4 inline-block archive-inline-link text-sm">
                    Read this day in detail
                  </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-12">
                  {day.entries.map((entry, index) => (
                    <DiaryEntryCard
                      key={entry.id}
                      entry={entry}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
