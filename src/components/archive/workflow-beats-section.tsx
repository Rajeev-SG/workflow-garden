export interface WorkflowBeatsSectionProps {
  workflowBeats: readonly string[]
}

export function WorkflowBeatsSection({
  workflowBeats,
}: Readonly<WorkflowBeatsSectionProps>) {
  return (
    <section
      id="prove"
      className="archive-section archive-surface-low border-y border-border/70 py-16"
    >
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-10 px-5 md:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="archive-kicker">The workflow beats</p>
          <h2 className="mt-4 text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            What you need to understand before the tools start sounding useful.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            This workflow is easier to follow when each phase answers one clear
            question: what are we doing, how are we building it, how do we know
            it works, and what happens when it ships?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowBeats.map((beat, index) => (
            <article key={beat} className="archive-card space-y-4 p-5 md:p-6">
              <p className="font-heading text-5xl leading-none font-medium italic text-primary/22">
                0{index + 1}
              </p>
              <p className="text-2xl leading-tight font-medium tracking-[-0.03em] text-primary">
                {["Understand", "Build", "Prove", "Ship"][index]}
              </p>
              <p className="text-base leading-7 text-muted-foreground">{beat}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
