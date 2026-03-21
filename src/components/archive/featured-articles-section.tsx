import type { Article } from "@/lib/content"

import { ContentCard } from "@/components/archive/content-card"

export function FeaturedArticlesSection({
  articles,
}: {
  articles: Article[]
}) {
  return (
    <section
      id="library"
      className="archive-section mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-10"
    >
      <div className="grid gap-10 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-5">
          <p className="archive-kicker">Reading room</p>
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-5xl">
            Articles that turn repeated names into real explanations.
          </h2>
          <p className="max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            Instead of leaving tool names and workflow terms floating around the
            page, the archive now gives them a place to land.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <ContentCard
              key={article.slug}
              href={`/articles/${article.slug}`}
              eyebrow={article.eyebrow}
              title={article.title}
              description={article.summary}
              meta={`${article.category} · ${article.readingTime}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
