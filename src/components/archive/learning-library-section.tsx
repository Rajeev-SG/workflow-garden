import type { learningCards } from "@/data/site-content"

type LearningCard = (typeof learningCards)[number]

export interface LearningLibrarySectionProps {
  learningCards: readonly LearningCard[]
}

export function LearningLibrarySection({
  learningCards,
}: Readonly<LearningLibrarySectionProps>) {
  return (
    <section
      id="library"
      className="archive-section mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-10"
    >
      <div className="grid gap-10 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-5">
          <p className="archive-kicker">Short-form learning</p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            Skim-friendly articles, explainers, and showcases.
          </h2>
          <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            Every piece is meant to answer one practical question: what is this
            workflow, why does it matter, and how would I start without
            drowning in developer jargon?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr]">
          {learningCards.map((card, index) => (
            <article
              key={card.title}
              className={`archive-card p-6 ${
                index === 0
                  ? "archive-paper-stack md:row-span-2 md:p-8"
                  : index === 1
                    ? "archive-surface-low"
                    : index === 2
                      ? "archive-surface-high"
                      : "bg-[color:rgb(255_255_255_/_74%)]"
              }`}
            >
              <p className="archive-kicker text-primary/44">{card.kind}</p>
              <h3 className="mt-4 text-[2rem] leading-snug font-medium tracking-[-0.04em] text-primary">
                {card.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
