import type { Metadata } from "next"

import { ContentCard } from "@/components/archive/content-card"
import { PageHero } from "@/components/archive/page-hero"
import { SiteFrame } from "@/components/archive/site-frame"
import { getProjects } from "@/lib/content"

export const metadata: Metadata = {
  title: "Projects | Workflow Garden",
  description: "Browse real repositories and live products that show the workflow in practice.",
}

export default function ProjectsPage() {
  const projects = getProjects()

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Projects"
        title="Real repos, live URLs, and proof-backed examples."
        description="Project pages give the workflow somewhere concrete to land. They connect the public explanation to repos, live surfaces, and diary evidence."
        links={[
          { href: "/articles", label: "Read the explanations first" },
          { href: "/diary", label: "Browse the diary" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ContentCard
              key={project.slug}
              href={`/projects/${project.slug}`}
              eyebrow={project.eyebrow}
              title={project.title}
              description={project.description}
              meta={`${project.status} · ${project.projectType}`}
            />
          ))}
        </div>
      </section>
    </SiteFrame>
  )
}
