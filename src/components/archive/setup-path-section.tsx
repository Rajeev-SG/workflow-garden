import type { setupSteps } from "@/data/site-content"

import { SetupAccordion } from "@/components/setup-accordion"

type SetupStep = (typeof setupSteps)[number]

export interface SetupPathSectionProps {
  setupSteps: readonly SetupStep[]
}

export function SetupPathSection({
  setupSteps,
}: Readonly<SetupPathSectionProps>) {
  return (
    <section
      id="ship"
      className="archive-section bg-primary py-20 text-primary-foreground"
    >
      <div className="mx-auto grid w-full max-w-[96rem] gap-12 px-5 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="archive-kicker text-primary-foreground/55">
              Setup path
            </p>
            <h2 className="max-w-2xl text-4xl leading-tight font-medium tracking-[-0.04em] md:text-5xl">
              Start small, keep the proof bar high, and do not skip the
              cleanup.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-primary-foreground/72 md:text-lg">
              This first-run path mirrors the behavior of the workflow itself.
              It helps you bootstrap the repo, write the plan, ship from a
              branch with a ticket attached, and then prove the result before
              merge.
            </p>
          </div>

          <ol className="space-y-5">
            {setupSteps.map((step) => (
              <li
                key={step.number}
                className="grid gap-4 border border-white/12 bg-white/6 p-5 md:grid-cols-[auto_1fr]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center border border-white/18 text-sm font-semibold">
                  {step.number}
                </span>
                <div className="space-y-3">
                  <h3 className="text-2xl leading-tight font-medium tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-primary-foreground/72">
                    {step.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.commands.map((command) => (
                      <span
                        key={command}
                        className="bg-white/9 px-3 py-1.5 font-mono text-[0.72rem] text-primary-foreground/86"
                      >
                        {command}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="archive-surface-high border border-white/10 bg-white/94 p-6 text-foreground md:p-8">
          <div className="space-y-4">
            <p className="archive-kicker">Deeper notes</p>
            <h3 className="text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
              Expand each step only when you need the deeper explanation.
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              The overview stays skim-friendly, while the accordion keeps the
              real commands and proof expectations available at the point of
              need.
            </p>
          </div>

          <div className="mt-8">
            <SetupAccordion />
          </div>
        </div>
      </div>
    </section>
  )
}
