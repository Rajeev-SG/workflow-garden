import type { Metadata } from "next"

import { PageHero } from "@/components/archive/page-hero"
import { ProjectCard } from "@/components/archive/project-card"
import { SiteFrame } from "@/components/archive/site-frame"
import { getProjects } from "@/lib/content"

export const metadata: Metadata = {
  title: "Projects | Workflow Garden",
  description: "Browse real repositories and live products that show the workflow in practice.",
}

export default function ProjectsPage() {
  const projects = getProjects()
  const [featuredProject, ...remainingProjects] = projects

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Projects"
        title="Real repos, live surfaces, and the reasoning behind them."
        description="These project pages make the workflow concrete. Each one connects the public explanation to a GitHub repo, the live surface when one exists, and the diary trail that shows how the work evolved."
        links={[
          { href: "/articles", label: "Read the guides first" },
          { href: "/diary", label: "Browse the diary" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="archive-surface-low border border-border/70 p-6 md:p-8">
            <p className="archive-kicker">What these pages answer</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-4xl">
              Where has this workflow already been tested, and what can I inspect right now?
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Every project page should help a visitor move from abstract
              process to evidence. That means quick repo access, concise
              framing, and enough context to understand why the project belongs
              in this archive.
            </p>
          </div>

          {featuredProject ? (
            <ProjectCard project={featuredProject} featured />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {remainingProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </SiteFrame>
  )
}
