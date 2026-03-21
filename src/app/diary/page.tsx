import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/archive/page-hero"
import { SiteFrame } from "@/components/archive/site-frame"
import { getDiaryDays } from "@/lib/content"

export const metadata: Metadata = {
  title: "Diary | Workflow Garden",
  description: "Curated daily notes generated from local repo activity once the signal is strong enough to be worth reading.",
}

export default function DiaryPage() {
  const days = getDiaryDays()

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Diary archive"
        title="Curated daily entries instead of raw change noise."
        description="The diary only publishes when local project activity clears the curation bar. Each day becomes a short archive record that visitors can browse by date and project."
        links={[
          { href: "/projects", label: "Jump to projects" },
          { href: "/search", label: "Search the archive" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-6">
          {days.map((day) => (
            <Link key={day.slug} href={`/diary/${day.slug}`} className="archive-paper-stack archive-surface-low block p-6 transition-colors hover:bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="archive-kicker text-primary/42">{day.label}</p>
                  <h2 className="mt-4 text-4xl leading-tight font-medium tracking-[-0.04em] text-primary">
                    {day.date}
                  </h2>
                </div>
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-secondary">
                  {day.entries.length} curated notes
                </p>
              </div>
              <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
                {day.summary}
              </p>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/80">
                {day.spotlight}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </SiteFrame>
  )
}
