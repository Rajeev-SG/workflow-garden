import { ArrowRight } from "lucide-react"

import { QuickStartSheet } from "@/components/quick-start-sheet"
import type { ActivityFeed, DiaryEntry } from "@/lib/activity-intelligence"

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

export interface LandingHeroProps {
  feed: ActivityFeed
  reassuranceNotes: readonly string[]
}

export function LandingHero({
  feed,
  reassuranceNotes,
}: Readonly<LandingHeroProps>) {
  const leadEntries = feed.days[0]?.entries.slice(0, 2) ?? []

  return (
    <section
      id="understand"
      className="archive-section mx-auto grid w-full max-w-[96rem] gap-12 px-5 pt-12 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10 lg:pt-16"
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {reassuranceNotes.map((note) => (
            <span
              key={note}
              className="inline-flex border border-border/80 bg-white/72 px-3 py-2 text-[0.64rem] font-medium uppercase tracking-[0.22em] text-primary/78"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="space-y-6">
          <p className="archive-kicker">Workflow Garden</p>
          <h1 className="max-w-4xl text-[clamp(3.3rem,9vw,7.3rem)] leading-[0.94] font-medium tracking-[-0.05em] text-primary">
            A calmer way to understand the workflow behind the shipping.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-[1.2rem] md:leading-9">
            This site explains a modern issue-driven development workflow in
            plain language. It shows what each tool is for, how a newcomer can
            adopt it, and what meaningful daily progress looks like when you
            translate file activity into something a human can actually skim.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <QuickStartSheet />
          <a
            href="#daily-diary"
            className="inline-flex min-h-12 items-center justify-between border border-primary/85 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/82 sm:w-auto"
          >
            Read today&apos;s diary
            <ArrowRight className="ml-3 size-4" />
          </a>
        </div>
      </div>

      <aside className="relative">
        <div className="archive-paper-stack archive-surface-low relative min-h-[34rem] overflow-hidden p-6 md:p-8">
          <div className="absolute -right-8 top-8 h-20 w-20 rotate-45 bg-[color:rgb(82_99_76_/_14%)]" />
          <div className="absolute bottom-14 left-8 h-12 w-24 -rotate-6 bg-[color:rgb(45_8_0_/_10%)]" />

          <div className="relative max-w-sm space-y-5">
            <p className="archive-kicker">Daily pulse</p>
            <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
              {feed.headline}
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              {feed.subhead}
            </p>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-white/82 p-4">
              <p className="archive-kicker text-primary/45">Active repos</p>
              <p className="mt-3 text-3xl font-semibold text-primary">
                {feed.stats.activeRepoCount}
              </p>
            </div>
            <div className="bg-white/82 p-4">
              <p className="archive-kicker text-primary/45">Curated notes</p>
              <p className="mt-3 text-3xl font-semibold text-primary">
                {feed.stats.curatedEntryCount}
              </p>
            </div>
            <div className="bg-white/82 p-4 md:col-span-1">
              <p className="archive-kicker text-primary/45">Top theme</p>
              <p className="mt-3 text-base leading-6 font-semibold text-primary">
                {feed.stats.topTheme}
              </p>
            </div>
          </div>

          <div className="relative mt-8 space-y-4 lg:min-h-[18rem]">
            {leadEntries.map((entry, index) => (
              <article
                key={entry.id}
                className={`archive-card relative p-5 ${
                  index === 0
                    ? "lg:absolute lg:left-0 lg:top-0 lg:w-[70%] lg:-rotate-[2deg]"
                    : "lg:absolute lg:right-0 lg:top-20 lg:w-[58%] lg:rotate-[1.5deg]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="archive-kicker text-primary/45">
                    {entryKindLabel(entry.kind)}
                  </span>
                  <span className="text-[0.64rem] uppercase tracking-[0.22em] text-secondary">
                    {entry.repoLabel}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl leading-snug font-medium tracking-[-0.03em] text-primary">
                  {entry.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {entry.summary}
                </p>
              </article>
            ))}
          </div>

          <p className="relative mt-10 text-[0.68rem] uppercase tracking-[0.24em] text-primary/48">
            Generated locally from {feed.scanRoot}
          </p>
        </div>
      </aside>
    </section>
  )
}
