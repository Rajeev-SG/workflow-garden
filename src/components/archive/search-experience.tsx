"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import searchDocuments from "@/generated/search-documents.json"

type SearchKind = "all" | "article" | "project" | "diary" | "concept"

interface SearchResult {
  title: string
  url: string
  excerpt: string
  kind: string
  meta?: Record<string, string>
}

interface PagefindSearchItem {
  data(): Promise<{
    url: string
    excerpt?: string
    meta: Record<string, string>
    filters: Record<string, string[]>
  }>
}

interface PagefindModule {
  options(config: {
    baseUrl: string
    bundlePath: string
    excerptLength: number
  }): Promise<void>
  init(): Promise<void>
  search(query: string, options?: {
    filters?: Record<string, string[]>
  }): Promise<{
    results: PagefindSearchItem[]
  }>
}

const importPagefind = new Function(
  "modulePath",
  "return import(modulePath)",
) as (modulePath: string) => Promise<PagefindModule>

function compactMeta(
  meta: Record<string, unknown> | undefined,
): Record<string, string> | undefined {
  if (!meta) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(meta)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return [key, value] as const
        }

        if (typeof value === "number") {
          return [key, String(value)] as const
        }

        if (Array.isArray(value)) {
          return [key, value.join(", ")] as const
        }

        return null
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry?.[1])),
  )
}

export function SearchExperience() {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<SearchKind>("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)

      try {
        const pagefind = await importPagefind("/pagefind/pagefind.js")
        await pagefind.options({
          baseUrl: "/",
          bundlePath: "/pagefind/",
          excerptLength: 24,
        })
        await pagefind.init()

        const search = await pagefind.search(query, {
          filters: kind === "all" ? undefined : { kind: [kind] },
        })

        const pageData = await Promise.all(
          search.results.slice(0, 12).map((result) => result.data()),
        )

        if (!cancelled) {
          setResults(
            pageData.map((item) => ({
              title: item.meta.title,
              url: item.url,
              excerpt: item.excerpt || item.meta.description || "",
              kind: item.filters.kind?.[0] ?? "article",
              meta: compactMeta(item.meta),
            })),
          )
        }
      } catch {
        const lower = query.toLowerCase()
        const fallback = searchDocuments
          .filter((doc) => {
            if (kind !== "all" && doc.kind !== kind) {
              return false
            }

            return `${doc.title} ${doc.description} ${doc.content} ${doc.tags.join(" ")}`
              .toLowerCase()
              .includes(lower)
          })
          .slice(0, 12)
          .map((doc) => ({
            title: doc.title,
            url: doc.url,
            excerpt: doc.description,
            kind: doc.kind,
            meta: compactMeta(doc.meta),
          }))

        if (!cancelled) {
          setResults(fallback)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [kind, query])

  const quickLinks = useMemo(
    () => searchDocuments.filter((doc) => doc.kind !== "diary").slice(0, 6),
    [],
  )

  return (
    <section className="mx-auto grid w-full max-w-[96rem] gap-10 px-5 md:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-10">
      <aside className="space-y-6">
        <div className="archive-surface-low border border-border/70 p-6">
          <p className="archive-kicker">Search lens</p>
          <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
            Search across articles, projects, diary entries, and concepts.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", "article", "project", "diary", "concept"] as SearchKind[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                className={`border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                  kind === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white/70 text-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="archive-card p-6">
          <p className="archive-kicker text-primary/45">Quick entry points</p>
          <div className="mt-4 space-y-3">
            {quickLinks.map((doc) => (
              <Link key={doc.id} href={doc.url} className="block text-sm leading-7 text-primary transition-colors hover:text-tertiary">
                {doc.title}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="archive-paper-stack archive-surface-high p-6 md:p-8">
          <label className="archive-kicker" htmlFor="archive-search">
            Query
          </label>
          <input
            id="archive-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for repo-bootstrap, proof, Workflow Garden, Choice Compass..."
            className="mt-4 w-full border border-border bg-white/86 px-4 py-4 text-base text-foreground outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(4,22,39,0.09)]"
          />
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="archive-card p-6 text-sm text-muted-foreground">Searching the archive…</div>
          ) : null}

          {!loading && query && results.length === 0 ? (
            <div className="archive-card p-6 text-sm leading-7 text-muted-foreground">
              No exact matches yet. Try a project name, a workflow term, or the name of a skill.
            </div>
          ) : null}

          {!query ? (
            <div className="archive-card p-6 text-sm leading-7 text-muted-foreground">
              Start with a skill name, a project, or a workflow term and the archive will bring the relevant pages together.
            </div>
          ) : null}

          {results.map((result) => (
            <Link key={result.url} href={result.url} className="archive-card block p-6 transition-colors hover:bg-white">
              <div className="flex flex-wrap items-center gap-3">
                <span className="archive-kicker text-primary/42">{result.kind}</span>
                {result.meta?.eyebrow ? (
                  <span className="text-[0.68rem] uppercase tracking-[0.2em] text-secondary">
                    {result.meta.eyebrow}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
                {result.title}
              </h3>
              <p
                className="mt-4 text-sm leading-7 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
