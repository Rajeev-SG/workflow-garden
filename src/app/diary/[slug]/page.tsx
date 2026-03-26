import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"
import {
  getDiaryDayBySlug,
  getDiaryDays,
  getProjectByRepoName,
  relatedContentFor,
} from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return getDiaryDays().map((day) => ({ slug: day.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const day = getDiaryDayBySlug(slug)

  if (!day) {
    return {}
  }

  return {
    title: `${day.label} diary | Workflow Garden`,
    description: day.summary,
  }
}

export default async function DiaryDayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const day = getDiaryDayBySlug(slug)

  if (!day) {
    notFound()
  }

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Diary day"
        title={`${day.label} produced updates worth publishing.`}
        description={day.summary}
        links={[
          { href: "/diary", label: "Back to diary archive" },
          { href: "/projects", label: "Browse related projects" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-4">
          {day.entries.map((entry, index) => {
            const project = getProjectByRepoName(entry.repoName)
            const sourceLinks = entry.sourceLinks ?? []

            return (
              <article
                key={entry.id}
                className={`${index % 2 === 0 ? "archive-paper-stack archive-surface-high" : "archive-card"} p-6 md:p-8`}
              >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="archive-kicker text-primary/42">{entry.repoLabel}</p>
                  <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-4xl">
                    {entry.title}
                  </h2>
                </div>
                {project ? (
                  <Link href={`/projects/${project.slug}`} className="archive-inline-link text-sm">
                    Open project page
                  </Link>
                ) : null}
              </div>
                <p className="mt-5 text-base leading-8 text-foreground">{entry.summary}</p>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  {entry.narrative}
                </p>
                <p className="mt-5 border-l-2 border-[color:rgb(45_8_0_/_18%)] pl-4 text-sm leading-7 text-muted-foreground italic">
                  {entry.whyItMatters}
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_0.9fr]">
                  <div className="archive-surface-low p-5">
                    <p className="archive-kicker text-primary/38">What changed</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground">
                      {entry.notableChanges.map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="archive-surface-low p-5">
                    <p className="archive-kicker text-primary/38">Explore next</p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {entry.exploreNext}
                    </p>
                  </div>
                </div>
                {sourceLinks.length > 0 ? (
                  <div className="mt-6 border border-border/70 bg-white/72 p-5">
                    <p className="archive-kicker text-primary/38">Source trail</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {sourceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="archive-inline-link text-sm"
                          target={link.href.startsWith("/") ? undefined : "_blank"}
                          rel={link.href.startsWith("/") ? undefined : "noreferrer"}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-2">
                  {entry.categories.map((category) => (
                    <span key={category} className="bg-white/72 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-primary/72">
                      {category}
                    </span>
                  ))}
                </div>
                {entry.relatedSlugs.length > 0 ? (
                  <div className="mt-8">
                    <RelatedLinks
                      title="Related archive paths"
                      items={relatedContentFor(entry.relatedSlugs)}
                    />
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>
    </SiteFrame>
  )
}
