import Link from "next/link"

import type { toolLenses } from "@/data/site-content"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
      <div className="grid gap-10 lg:grid-cols-[0.46fr_1.54fr] lg:gap-14">
        <div className="space-y-5">
          <p className="archive-kicker">Tool map</p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            Four lanes, collapsed until you need the detail.
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            The long homepage columns were doing too much at once. This version
            keeps the same guidance, but lets visitors open one lane at a time.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {toolLenses.map((lens, index) => (
            <AccordionItem
              key={lens.id}
              value={lens.id}
              id={lens.id}
              className="archive-card border border-border/70 px-0"
            >
              <AccordionTrigger className="px-6 py-5 text-left hover:no-underline md:px-8">
                <span className="flex items-start gap-5">
                  <span className="space-y-2">
                    <span className={`archive-kicker ${ACCENT_CLASSES[index]}`}>
                      Navigation 0{index + 1}
                    </span>
                    <span className="block text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
                      {lens.label}
                    </span>
                  </span>
                  <span className="space-y-2">
                    <span className="block text-sm font-medium tracking-[0.02em] text-secondary">
                      {lens.eyebrow}
                    </span>
                    <span className="block text-sm leading-7 text-muted-foreground">
                      {lens.headline}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 md:px-8">
                <div className="grid gap-6 xl:grid-cols-[0.68fr_1.32fr]">
                  <div className="border border-border/70 bg-white/72 p-5">
                    <p className="archive-kicker text-primary/45">Why open it</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {lens.summary}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {lens.tools.map((tool) => (
                      <div key={tool.name} className="archive-surface-low border border-border/70 p-4">
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
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
