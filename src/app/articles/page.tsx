import type { Metadata } from "next"

import { ContentCard } from "@/components/archive/content-card"
import { PageHero } from "@/components/archive/page-hero"
import { SiteFrame } from "@/components/archive/site-frame"
import { getArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Articles | Workflow Garden",
  description: "Evergreen articles that explain the workflow, the skills, and the proof bar in plain language.",
}

export default function ArticlesPage() {
  const articles = getArticles()
  const [featuredArticle, ...remainingArticles] = articles

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Articles"
        title="Short guides for the parts of the workflow people keep asking about."
        description="These articles translate recurring tool names, workflow terms, and proof language into plain English. Read them in any order, but they work best as a connected set."
        links={[
          { href: "/projects", label: "See the projects next" },
          { href: "/diary", label: "Open the automated diary" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="archive-surface-low border border-border/70 p-6 md:p-8">
            <p className="archive-kicker">How to use this section</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary md:text-4xl">
              Start with the broad workflow, then narrow down to the rule or tool you need.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              The guides are intentionally short. They are here to stop visitors
              from bouncing out to search for missing context every time a term
              like PRD, proof, or ticket branch appears.
            </p>
          </div>

          {featuredArticle ? (
            <ContentCard
              href={`/articles/${featuredArticle.slug}`}
              eyebrow={`${featuredArticle.eyebrow} · Recommended first`}
              title={featuredArticle.title}
              description={featuredArticle.summary}
              meta={`${featuredArticle.category} · ${featuredArticle.readingTime} · ${featuredArticle.audience}`}
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {remainingArticles.map((article) => (
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
      </section>
    </SiteFrame>
  )
}
