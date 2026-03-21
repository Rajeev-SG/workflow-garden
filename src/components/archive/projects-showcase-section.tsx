import type { Project } from "@/lib/content"

import { ContentCard } from "@/components/archive/content-card"

export function ProjectsShowcaseSection({
  projects,
}: {
  projects: Project[]
}) {
  return (
    <section className="archive-section archive-surface-low border-y border-border/70">
      <div className="mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-5">
            <p className="archive-kicker">Projects</p>
            <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
              Concrete examples, not just workflow theory.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Project pages connect the explanation to real repos, live URLs,
              and diary evidence so visitors can see how the workflow behaves in
              practice.
            </p>
          </div>

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
        </div>
      </div>
    </section>
  )
}
