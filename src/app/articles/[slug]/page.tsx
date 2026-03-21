import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MDXContent } from "@/lib/mdx"
import {
  diaryEntriesForSlug,
  getArticleBySlug,
  getArticles,
  relatedContentFor,
} from "@/lib/content"
import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"

export const dynamicParams = false

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {}
  }

  return {
    title: `${article.title} | Workflow Garden`,
    description: article.description,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const diaryEntries = diaryEntriesForSlug(article.slug)

  return (
    <SiteFrame>
      <PageHero
        eyebrow={article.eyebrow}
        title={article.title}
        description={article.description}
        links={[
          { href: "/articles", label: "Back to articles" },
          { href: "/search", label: "Search nearby topics" },
        ]}
      />

      <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <article className="archive-card archive-prose p-6 md:p-8">
          <div className="flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.2em] text-secondary">
            <span>{article.category}</span>
            <span>{article.readingTime}</span>
            <span>{article.audience}</span>
          </div>
          <div className="mt-8">
            <MDXContent code={article.content} />
          </div>
        </article>

        <div className="space-y-6">
          <div className="archive-surface-low border border-border/70 p-6">
            <p className="archive-kicker">Summary</p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {article.summary}
            </p>
          </div>
          {diaryEntries.length > 0 ? (
            <div className="archive-card p-6">
              <p className="archive-kicker text-primary/45">Diary echoes</p>
              <div className="mt-4 space-y-4">
                {diaryEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/diary/${entry.daySlug}`}
                    className="block transition-colors hover:text-tertiary"
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                      {entry.dayLabel}
                    </p>
                    <p className="mt-2 text-xl leading-tight font-medium text-primary">
                      {entry.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {entry.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <RelatedLinks items={relatedContentFor(article.relatedSlugs)} />
        </div>
      </section>
    </SiteFrame>
  )
}
