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
      <div className="mx-auto w-full max-w-[96rem] space-y-10 px-5 md:px-8 lg:px-10">
        <div className="max-w-3xl space-y-4">
          <p className="archive-kicker text-primary-foreground/55">Setup path</p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] md:text-5xl">
            The workflow, in order, with the details ready when you need them.
          </h2>
          <p className="text-base leading-8 text-primary-foreground/72 md:text-lg">
            Start with a clean repo, turn the work into a plan, ship from a
            ticket branch, and prove the result before you celebrate. The short
            version stays visible. The deeper notes sit right underneath it.
          </p>
        </div>

        <ol className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {setupSteps.map((step) => (
            <li key={step.number} className="border border-white/12 bg-white/6 p-5">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-white/18 text-sm font-semibold">
                {step.number}
              </span>
              <div className="mt-4 space-y-3">
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

        <div className="archive-surface-high border border-white/10 bg-white/94 p-6 text-foreground md:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.62fr_1.38fr]">
            <div className="space-y-4">
              <p className="archive-kicker">Expanded guide</p>
              <h3 className="text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
                Open the exact expectations for each step.
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                This is where the commands, proof bar, and branch discipline
                become explicit. It stays out of the way until the visitor wants
                to slow down.
              </p>
            </div>

            <div>
              <SetupAccordion />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
