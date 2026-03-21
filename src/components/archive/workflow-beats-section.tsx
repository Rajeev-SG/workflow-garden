export interface WorkflowBeatsSectionProps {
  workflowBeats: readonly string[]
}

export function WorkflowBeatsSection({
  workflowBeats,
}: Readonly<WorkflowBeatsSectionProps>) {
  return (
    <section
      id="prove"
      className="archive-section archive-surface-low border-y border-border/70 py-20"
    >
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-12 px-5 md:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="archive-kicker">The workflow beats</p>
          <h2 className="mt-4 text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            A system for turning fuzzy work into visible, provable progress.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
            The workflow joins planning, implementation, proof, and shipping
            instead of treating them as separate chores. Each step answers a
            different question and leaves behind evidence another person can
            inspect.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {workflowBeats.map((beat, index) => (
            <article key={beat} className="space-y-4">
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
