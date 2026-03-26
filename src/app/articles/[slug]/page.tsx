import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MDXContent } from "@/lib/mdx"
import {
  diaryEntriesForSlug,
  getArticleBySlug,
  getArticles,
  relatedContentFor,
} from "@/lib/content"
import { DiaryEchoesPanel } from "@/components/archive/diary-echoes-panel"
import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"
import { SourceLinksPanel } from "@/components/archive/source-links-panel"

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
          { href: "/projects", label: "See related projects" },
        ]}
      />

      <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_22rem] lg:px-10">
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

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="archive-surface-low border border-border/70 p-6">
            <p className="archive-kicker">At a glance</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
              Why this page exists
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {article.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-secondary">
              <span>{article.category}</span>
              <span>{article.readingTime}</span>
              <span>{article.audience}</span>
            </div>
          </div>
          <SourceLinksPanel
            title="Further reading"
            kicker="External links"
            links={article.externalLinks}
          />
          <DiaryEchoesPanel items={diaryEntries} />
          <RelatedLinks items={relatedContentFor(article.relatedSlugs)} />
        </div>
      </section>
    </SiteFrame>
  )
}
