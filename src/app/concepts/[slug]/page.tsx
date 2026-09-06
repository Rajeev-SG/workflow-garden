import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MDXContent } from "@/lib/mdx"
import {
  diaryEntriesForSlug,
  getConceptBySlug,
  getConcepts,
  relatedContentFor,
} from "@/lib/content"
import { DiaryEchoesPanel } from "@/components/archive/diary-echoes-panel"
import { PageHero } from "@/components/archive/page-hero"
import { RelatedLinks } from "@/components/archive/related-links"
import { SiteFrame } from "@/components/archive/site-frame"
import { SourceLinksPanel } from "@/components/archive/source-links-panel"

export const dynamicParams = false

export function generateStaticParams() {
  return getConcepts().map((concept) => ({ slug: concept.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const concept = getConceptBySlug(slug)

  if (!concept) {
    return {}
  }

  return {
    title: `${concept.title} | Workflow Garden`,
    description: concept.description,
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const concept = getConceptBySlug(slug)

  if (!concept) {
    notFound()
  }

  const diaryEntries = diaryEntriesForSlug(concept.slug)

  return (
    <SiteFrame>
      <PageHero
        eyebrow={concept.eyebrow}
        title={concept.title}
        description={concept.shortDefinition}
        links={[
          { href: "/articles", label: "Read the deeper articles" },
          { href: "/search", label: "Search related terms" },
        ]}
      />

      <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_22rem] lg:px-10">
        <article className="archive-card archive-prose p-6 md:p-8">
          <div className="mt-2">
            <MDXContent code={concept.content} />
          </div>
        </article>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="archive-surface-low border border-border/70 p-6">
            <p className="archive-kicker">Canonical term</p>
            <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
              {concept.canonicalTerm}
            </h2>
            {concept.aliases.length > 0 ? (
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Also seen as {concept.aliases.join(", ")}.
              </p>
            ) : null}
          </div>
          <SourceLinksPanel
            title="Further reading"
            kicker="External links"
            links={concept.externalLinks}
          />
          <DiaryEchoesPanel items={diaryEntries} />
          <RelatedLinks items={relatedContentFor(concept.relatedSlugs)} />
        </div>
      </section>
    </SiteFrame>
  )
}
