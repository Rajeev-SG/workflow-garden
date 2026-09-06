import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { QuickStartSheet } from "@/components/quick-start-sheet"
import type { Article, Project } from "@/lib/content"
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
  featuredArticle: Article
  featuredProject: Project
}

export function LandingHero({
  feed,
  reassuranceNotes,
  featuredArticle,
  featuredProject,
}: Readonly<LandingHeroProps>) {
  const leadEntry = feed.days[0]?.entries[0]
  const latestDay = feed.days[0]

  return (
    <section
      id="understand"
      className="archive-section mx-auto grid w-full max-w-[96rem] gap-10 px-5 pt-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-10 lg:pt-14"
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
          <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.6rem)] leading-[0.94] font-medium tracking-[-0.05em] text-primary">
            A practical guide to building with AI, without hiding the work.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-[1.14rem] md:leading-9">
            Workflow Garden explains an issue-driven AI workflow in plain
            language. Read the guide, inspect real repos, and follow an
            automated diary built from actual repository activity.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/articles"
            className="inline-flex min-h-12 items-center justify-between border border-primary/85 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/92 sm:w-auto"
          >
            Start with the guide
            <ArrowRight className="ml-3 size-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-12 items-center justify-between border border-primary/85 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/82 sm:w-auto"
          >
            See real projects
            <ArrowRight className="ml-3 size-4" />
          </Link>
          <QuickStartSheet />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="archive-card block p-5 transition-colors hover:bg-white"
          >
            <p className="archive-kicker text-primary/45">Start here</p>
            <h2 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
              {featuredArticle.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {featuredArticle.summary}
            </p>
          </Link>

          <Link
            href={`/projects/${featuredProject.slug}`}
            className="archive-card block p-5 transition-colors hover:bg-white"
          >
            <p className="archive-kicker text-primary/45">See it in practice</p>
            <h2 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
              {featuredProject.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {featuredProject.description}
            </p>
          </Link>

          <Link
            href="/diary"
            className="archive-card block p-5 transition-colors hover:bg-white"
          >
            <p className="archive-kicker text-primary/45">Follow the diary</p>
            <h2 className="mt-3 text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
              {leadEntry?.title ?? "Read the latest automated entry"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {leadEntry?.summary ??
                "The diary only publishes when the recent work is strong enough to explain in public."}
            </p>
          </Link>
        </div>
      </div>

      <aside className="relative">
        <div className="archive-paper-stack archive-surface-low relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-8 top-8 h-20 w-20 rotate-45 bg-[color:rgb(82_99_76_/_14%)]" />
          <div className="absolute bottom-14 left-8 h-12 w-24 -rotate-6 bg-[color:rgb(45_8_0_/_10%)]" />

          <div className="relative max-w-md space-y-5">
            <p className="archive-kicker">Latest signal</p>
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

          {leadEntry ? (
            <article className="archive-card relative mt-8 p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="archive-kicker text-primary/45">
                    {entryKindLabel(leadEntry.kind)}
                  </span>
                  <p className="text-sm font-medium tracking-[0.02em] text-secondary">
                    {leadEntry.repoLabel}
                  </p>
                </div>
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-primary/42">
                  {latestDay?.label ?? "Latest"}
                </span>
              </div>
              <h3 className="mt-4 text-2xl leading-snug font-medium tracking-[-0.03em] text-primary md:text-3xl">
                {leadEntry.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {leadEntry.summary}
              </p>
              <Link href="/diary" className="mt-5 inline-flex items-center gap-2 archive-inline-link text-sm">
                Open the automated diary
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ) : null}

          {latestDay ? (
            <div className="relative mt-6 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="border border-border/70 bg-white/76 p-5">
                <p className="archive-kicker text-primary/45">Day spotlight</p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  {latestDay.spotlight}
                </p>
              </div>
              <div className="border border-border/70 bg-white/76 p-5">
                <p className="archive-kicker text-primary/45">Why it exists</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  The diary stays quiet until the recent work becomes specific
                  enough to read like a real update.
                </p>
              </div>
            </div>
          ) : null}

          <p className="relative mt-8 text-[0.68rem] uppercase tracking-[0.24em] text-primary/48">
            Generated locally from {feed.scanRoot}
          </p>
        </div>
      </aside>
    </section>
  )
}
