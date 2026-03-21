import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MDXContent } from "@/lib/mdx"
import {
  diaryEntriesForProject,
  getProjectBySlug,
  getProjects,
  relatedContentFor,
} from "@/lib/content"
import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"

export const dynamicParams = false

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  return {
    title: `${project.title} | Workflow Garden`,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const diaryEntries = diaryEntriesForProject(project.slug)

  return (
    <SiteFrame>
      <PageHero
        eyebrow={project.eyebrow}
        title={project.title}
        description={project.description}
        links={[
          { href: project.repoUrl, label: "Open the repository" },
          ...(project.liveUrl
            ? [{ href: project.liveUrl, label: "Visit the live URL" }]
            : [{ href: "/diary", label: "Browse related diary notes" }]),
        ]}
      />

      <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <article className="archive-card archive-prose p-6 md:p-8">
          <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-secondary">
            <span>{project.status}</span>
            <span>{project.projectType}</span>
            <span>{project.repoName}</span>
          </div>
          <div className="mt-8">
            <MDXContent code={project.content} />
          </div>
        </article>

        <div className="space-y-6">
          <div className="archive-surface-high border border-border/70 p-6">
            <p className="archive-kicker">Project links</p>
            <div className="mt-4 space-y-3">
              <Link href={project.repoUrl} className="archive-inline-link block" target="_blank" rel="noreferrer">
                Repository
              </Link>
              {project.liveUrl ? (
                <Link href={project.liveUrl} className="archive-inline-link block" target="_blank" rel="noreferrer">
                  Live URL
                </Link>
              ) : null}
            </div>
          </div>

          {diaryEntries.length > 0 ? (
            <div className="archive-card p-6">
              <p className="archive-kicker text-primary/45">Latest diary echoes</p>
              <div className="mt-4 space-y-4">
                {diaryEntries.map((entry) => (
                  <Link key={entry.id} href={`/diary/${entry.daySlug}`} className="block transition-colors hover:text-tertiary">
                    <p className="text-sm uppercase tracking-[0.2em] text-secondary">{entry.dayLabel}</p>
                    <p className="mt-2 text-xl leading-tight font-medium text-primary">{entry.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{entry.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <RelatedLinks title="Related archive paths" items={relatedContentFor(project.relatedSlugs)} />
        </div>
      </section>
    </SiteFrame>
  )
}
