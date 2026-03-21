import Link from "next/link"

import type { toolLenses } from "@/data/site-content"

type ToolLens = (typeof toolLenses)[number]

const ACCENT_CLASSES = [
  "text-tertiary",
  "text-secondary",
  "text-primary",
  "text-primary/72",
] as const

export interface ToolMapSectionProps {
  toolLenses: readonly ToolLens[]
}

export function ToolMapSection({
  toolLenses,
}: Readonly<ToolMapSectionProps>) {
  return (
    <section id="build" className="archive-section mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.4fr_1.6fr] lg:gap-14">
        <div className="space-y-5">
          <p className="archive-kicker">Tool map</p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            Major tools and when to use them.
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            The site keeps the original educational framing, but presents each
            lane like an archive module instead of a generic tab set.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden bg-border/70 lg:grid-cols-2 xl:grid-cols-4">
          {toolLenses.map((lens, index) => (
            <article
              key={lens.id}
              id={lens.id}
              className="archive-surface-low flex min-h-[30rem] flex-col gap-8 p-8 transition-colors hover:bg-white"
            >
              <div className="space-y-6">
                <p className={`archive-kicker ${ACCENT_CLASSES[index]}`}>
                  Navigation 0{index + 1}
                </p>
                <div className="space-y-4">
                  <p className="text-sm font-medium tracking-[0.02em] text-secondary">
                    {lens.eyebrow}
                  </p>
                  <h3 className="text-[2rem] leading-tight font-medium tracking-[-0.04em] text-primary">
                    {lens.label}
                  </h3>
                  <p className="text-base leading-7 text-muted-foreground">
                    {lens.headline}
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {lens.summary}
                  </p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                {lens.tools.map((tool) => (
                  <div key={tool.name} className="archive-card p-4">
                    {"href" in tool ? (
                      <Link
                        href={tool.href}
                        className="archive-kicker text-primary/45 transition-colors hover:text-tertiary"
                      >
                        {tool.name}
                      </Link>
                    ) : (
                      <p className="archive-kicker text-primary/45">{tool.name}</p>
                    )}
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      {tool.useCase}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
