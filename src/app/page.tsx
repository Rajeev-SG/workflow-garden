import { ArrowRight, ChartNoAxesColumn, CheckCircle2, NotebookPen } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import activityFeed from "@/data/activity-feed.generated.json"
import {
  learningCards,
  reassuranceNotes,
  setupSteps,
  workflowBeats,
} from "@/data/site-content"
import { QuickStartSheet } from "@/components/quick-start-sheet"
import { SetupAccordion } from "@/components/setup-accordion"
import { ToolLensTabs } from "@/components/tool-lens-tabs"
import type { ActivityFeed, DiaryEntry } from "@/lib/activity-intelligence"

const feed = activityFeed as ActivityFeed

function kindLabel(kind: DiaryEntry["kind"]) {
  switch (kind) {
    case "article":
      return "Short article"
    case "tutorial":
      return "Tutorial"
    case "showcase":
      return "Showcase"
    case "explainer":
      return "What changed today"
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

export default function Home() {
  const leadDay = feed.days[0]
  const leadEntries = leadDay?.entries.slice(0, 2) ?? []

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(214,177,123,0.22),transparent_50%),radial-gradient(circle_at_top_right,rgba(118,146,112,0.22),transparent_48%)]" />
      <div className="mx-auto flex w-full max-w-[98rem] flex-col gap-10 px-4 py-6 md:px-8 lg:gap-12 lg:px-10 lg:py-10">
        <section className="rounded-[2.3rem] border border-border/65 bg-white/84 px-5 py-6 shadow-[0_32px_90px_-48px_rgba(44,63,57,0.35)] backdrop-blur md:px-8 md:py-8 xl:px-10 xl:py-10">
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <article className="flex flex-col justify-between rounded-[2rem] border border-border/55 bg-[linear-gradient(135deg,rgba(250,246,239,0.96),rgba(255,255,255,0.88))] p-6 md:p-8 xl:p-10">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {reassuranceNotes.map((note) => (
                    <Badge
                      key={note}
                      variant="outline"
                      className="rounded-full border-primary/20 bg-primary/8 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-primary"
                    >
                      {note}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                    Workflow Garden
                  </p>
                  <h1 className="max-w-4xl text-[clamp(2.55rem,13vw,5.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-foreground">
                    A calmer way to understand the workflow behind the shipping.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                    This site explains a modern issue-driven development workflow
                    in plain language. It shows what each tool is for, how a
                    newcomer can adopt it, and what meaningful daily progress
                    looks like when you translate file activity into something a
                    human can actually skim.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <QuickStartSheet />
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-full border-border/70 bg-white/70 px-6 text-sm font-semibold"
                  >
                    <a href="#daily-diary">
                      Read today&apos;s diary
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-border/60 pt-6 md:grid-cols-2 xl:grid-cols-4">
                {workflowBeats.map((beat, index) => (
                  <div key={beat} className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      0{index + 1}
                    </p>
                    <p className="text-base leading-7 text-foreground">{beat}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(243,239,228,0.92),rgba(255,255,255,0.9))] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                    Daily pulse
                  </p>
                  <h2 className="mt-3 text-3xl leading-tight font-semibold text-foreground">
                    {feed.headline}
                  </h2>
                </div>
                <div className="hidden size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary md:inline-flex">
                  <ChartNoAxesColumn className="size-6" />
                </div>
              </div>

              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {feed.subhead}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="rounded-[1.4rem] border border-border/65 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Active repos
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">
                    {feed.stats.activeRepoCount}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-border/65 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Curated notes
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">
                    {feed.stats.curatedEntryCount}
                  </p>
                </div>
                <div className="col-span-2 rounded-[1.4rem] border border-border/65 bg-white/80 p-4 md:col-span-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Top theme
                  </p>
                  <p className="mt-3 text-lg leading-6 font-semibold text-foreground">
                    {feed.stats.topTheme}
                  </p>
                </div>
              </div>

              {leadEntries.length > 0 ? (
                <div className="mt-8 space-y-4">
                  {leadEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-[1.5rem] border border-border/60 bg-white/82 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Badge
                          variant="outline"
                          className="rounded-full border-primary/20 bg-primary/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] text-primary"
                        >
                          {kindLabel(entry.kind)}
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          {entry.repoLabel}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl leading-snug font-semibold text-foreground">
                        {entry.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {entry.summary}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <article className="mt-8 rounded-[1.6rem] border border-dashed border-border/70 bg-white/65 p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                    Quiet by design
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    The diary stays empty until the local scan sees enough signal
                    to tell a useful story.
                  </p>
                </article>
              )}

              <p className="mt-6 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Generated locally from {feed.scanRoot}
              </p>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-border/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,241,233,0.95))] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              What this workflow is
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl leading-tight font-semibold text-foreground">
              A system for turning fuzzy work into visible, provable progress.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              The workflow joins planning, implementation, proof, and shipping
              instead of treating them as separate chores. Each stage answers a
              different question: what are we building, what are we changing,
              what evidence exists, and is the live result actually ready?
            </p>
            <div className="mt-8 rounded-[1.7rem] border border-border/60 bg-white/80 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 text-primary" />
                  <p className="text-sm leading-7 text-foreground">
                    Great for people who want a calmer, more inspectable way to
                    work.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 text-primary" />
                  <p className="text-sm leading-7 text-foreground">
                    Useful when you care about proof, not just “it built on my
                    machine.”
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-border/65 bg-white/88 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              Major tools and when to use them
            </p>
            <div className="mt-5">
              <ToolLensTabs />
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2rem] border border-border/65 bg-[linear-gradient(160deg,rgba(239,246,240,0.8),rgba(255,255,255,0.88))] p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                  Setup path
                </p>
                <h2 className="text-4xl leading-tight font-semibold text-foreground">
                  Start small, keep the proof bar high, and do not skip the
                  cleanup.
                </h2>
                <p className="text-lg leading-8 text-muted-foreground">
                  This first-run path mirrors the behavior of the workflow
                  itself. It helps you bootstrap the repo, write the plan, ship
                  from a branch with a ticket attached, and then prove the
                  result before merge.
                </p>
              </div>

              <ol className="space-y-5">
                {setupSteps.map((step) => (
                  <li
                    key={step.number}
                    className="grid gap-4 rounded-[1.5rem] border border-border/60 bg-white/84 p-4 md:grid-cols-[auto_1fr]"
                  >
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold text-primary">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {step.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <article className="rounded-[2rem] border border-border/65 bg-white/88 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
              More detail, if you want it
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-foreground">
              Expand each step only when you need the deeper explanation.
            </h2>
            <div className="mt-6">
              <SetupAccordion />
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-border/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,243,236,0.94))] p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                Short-form learning
              </p>
              <h2 className="mt-4 text-4xl leading-tight font-semibold text-foreground">
                Skim-friendly articles, explainers, and showcases for people who
                do not want a giant wall of process.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                Every piece is meant to answer one practical question: what is
                this workflow, why does it matter, and how would I start without
                drowning in developer jargon?
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr]">
              {learningCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`rounded-[1.7rem] border border-border/65 p-5 ${
                    index === 0
                      ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(226,236,224,0.85))] md:row-span-2"
                      : index === 1
                        ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(238,230,217,0.9))]"
                        : index === 2
                          ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(244,233,223,0.9))]"
                          : "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(227,238,237,0.86))]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    {card.kind}
                  </p>
                  <h3 className="mt-3 text-2xl leading-snug font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="daily-diary"
          className="rounded-[2rem] border border-border/65 bg-[linear-gradient(180deg,rgba(244,239,228,0.96),rgba(255,255,255,0.9))] p-6 md:p-8"
        >
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.34em] text-muted-foreground">
                Automated diary
              </p>
              <h2 className="text-4xl leading-tight font-semibold text-foreground">
                Daily coding activity, filtered until it becomes worth reading.
              </h2>
              <p className="text-lg leading-8 text-muted-foreground">
                The diary generator scans file changes under
                <span className="mx-1 font-mono text-sm text-foreground">
                  /Users/rajeev/Code
                </span>
                , looks for a meaningful signal, and only then creates entries.
                That keeps the public story curated and readable.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-border/65 bg-white/84 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                What the generator ignores
              </p>
              <p className="mt-3 text-base leading-7 text-foreground">
                Tiny one-file nudges, noisy build output, and other low-signal
                churn do not become diary entries. The site would rather be
                quiet than noisy.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
              {feed.days.length > 0 ? (
                feed.days.map((day) => (
                  <article
                    key={day.date}
                    className="rounded-[1.8rem] border border-border/65 bg-white/88 p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {day.label}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-foreground">
                          {day.date}
                        </h3>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                        {day.summary}
                      </p>
                    </div>

                    <Separator className="my-5 bg-border/70" />

                    <div className="grid gap-4 lg:grid-cols-2">
                      {day.entries.map((entry, index) => (
                        <article
                          key={entry.id}
                          className={`rounded-[1.55rem] border border-border/60 p-5 ${
                            index % 3 === 0
                              ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(227,238,231,0.82))]"
                              : index % 3 === 1
                                ? "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(244,232,217,0.88))]"
                                : "bg-[linear-gradient(150deg,rgba(255,255,255,0.95),rgba(234,236,244,0.88))]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <Badge
                              variant="outline"
                              className="rounded-full border-primary/20 bg-primary/8 px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] text-primary"
                            >
                              {kindLabel(entry.kind)}
                            </Badge>
                            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                              {entry.repoLabel}
                            </span>
                          </div>
                          <h4 className="mt-4 text-xl leading-snug font-semibold text-foreground">
                            {entry.title}
                          </h4>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            {entry.summary}
                          </p>
                          <p className="mt-4 text-sm leading-7 text-foreground">
                            {entry.whyItMatters}
                          </p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {entry.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="rounded-full border border-border/70 bg-white/75 px-3 py-1.5 text-xs text-foreground"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            {momentumLabel(entry.changedFileCount)}
                          </p>
                        </article>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <article className="rounded-[1.7rem] border border-dashed border-border/70 bg-white/78 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Nothing loud enough to publish
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    The refresh command ran, but the scan did not find enough
                    meaningful movement to create a public diary entry today.
                  </p>
                </article>
              )}
          </div>
        </section>

        <footer className="pb-4 text-sm leading-7 text-muted-foreground">
          <div className="flex flex-col gap-3 border-t border-border/65 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <NotebookPen className="size-4 text-primary" />
              <p>
                The live site shows committed generated activity data. Run
                <span className="mx-1 font-mono text-xs text-foreground">
                  pnpm activity:refresh
                </span>
                before proof and deploy.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.24em]">
              Proof-backed, branch-clean, and readable by humans
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
