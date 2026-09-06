import type { Project } from "@/lib/content"

import { ProjectCard } from "@/components/archive/project-card"

export function ProjectsShowcaseSection({
  projects,
}: {
  projects: Project[]
}) {
  const [leadProject, ...remainingProjects] = projects

  return (
    <section className="archive-section archive-surface-low border-y border-border/70">
      <div className="mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-10">
        <div className="grid gap-10 xl:grid-cols-[0.66fr_1.34fr]">
          <div className="space-y-5">
            <p className="archive-kicker">Projects</p>
            <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
              The workflow makes more sense once you can inspect a real repo.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              These project pages connect the explanation to real GitHub repos,
              live URLs, and diary evidence. They answer the practical
              follow-up question: where has this approach already been used?
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {leadProject ? (
              <div className="md:col-span-2">
                <ProjectCard project={leadProject} featured />
              </div>
            ) : null}
            {remainingProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
