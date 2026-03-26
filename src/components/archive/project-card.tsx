import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import type { Project } from "@/lib/content"

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  return (
    <article
      className={`archive-card flex h-full flex-col ${
        featured ? "p-7 md:p-8" : "p-6"
      } transition-colors hover:bg-white`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="archive-kicker text-primary/45">{project.eyebrow}</p>
          <h3
            className={`leading-tight font-medium tracking-[-0.04em] text-primary ${
              featured ? "text-[2.5rem]" : "text-[2rem]"
            }`}
          >
            {project.title}
          </h3>
        </div>
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-secondary">
          {project.status}
        </p>
      </div>

      <p className="mt-4 text-base leading-8 text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-secondary">
        <span>{project.projectType}</span>
        <span>{project.repoName}</span>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 border border-primary/70 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/92"
        >
          Project page
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={project.repoUrl}
          className="inline-flex items-center gap-2 border border-border/80 bg-white/78 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <ArrowUpRight className="size-4" />
        </Link>
        {project.liveUrl ? (
          <Link
            href={project.liveUrl}
            className="inline-flex items-center gap-2 border border-border/80 bg-white/78 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white"
            target="_blank"
            rel="noreferrer"
          >
            Live site
            <ArrowUpRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  )
}
