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

  return (
    <SiteFrame>
      <PageHero
        eyebrow="Articles"
        title="Evergreen explanations for the parts visitors keep meeting."
        description="These are the pages that turn recurring tool names, workflow terms, and proof language into something understandable without sending people elsewhere."
        links={[
          { href: "/search", label: "Search the archive" },
          { href: "/projects", label: "See real projects" },
        ]}
      />

      <section className="mx-auto w-full max-w-[96rem] px-5 pb-20 md:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </section>
    </SiteFrame>
  )
}
