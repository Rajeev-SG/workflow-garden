import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MDXContent } from "@/lib/mdx"
import {
  diaryEntriesForProject,
  getProjectBySlug,
  getProjects,
  relatedContentFor,
} from "@/lib/content"
import { DiaryEchoesPanel } from "@/components/archive/diary-echoes-panel"
import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"
import { SourceLinksPanel } from "@/components/archive/source-links-panel"

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

      <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:px-10">
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

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="archive-surface-high border border-border/70 p-6">
            <p className="archive-kicker">At a glance</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
              What you can inspect here
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              This page ties the public explanation to the repo, the live
              surface when one exists, and the diary trail that shows how the
              implementation changed over time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-secondary">
              <span>{project.status}</span>
              <span>{project.projectType}</span>
              <span>{project.repoName}</span>
            </div>
          </div>

          <SourceLinksPanel
            links={[
              {
                label: "GitHub repository",
                href: project.repoUrl,
                description: "Inspect the actual code and commit history behind this project.",
              },
              ...(project.liveUrl
                ? [
                    {
                      label: "Live site",
                      href: project.liveUrl,
                      description: "See the public surface as visitors experience it.",
                    },
                  ]
                : []),
              ...(project.proofUrl
                ? [
                    {
                      label: "Proof trail",
                      href: project.proofUrl,
                      description: "Follow the acceptance and design evidence connected to this work.",
                    },
                  ]
                : []),
              ...project.externalLinks,
            ]}
          />
          <DiaryEchoesPanel title="Latest diary echoes" items={diaryEntries} />
          <RelatedLinks title="Related archive paths" items={relatedContentFor(project.relatedSlugs)} />
        </div>
      </section>
    </SiteFrame>
  )
}
