import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import activityFeed from "../src/data/activity-feed.generated.json" with { type: "json" }
import entitySourceModule from "../src/lib/content-entities-source"

interface ArticleRecord {
  slug: string
  title: string
  description: string
  summary: string
  eyebrow: string
  tags: string[]
  featured: boolean
  category: string
  relatedSlugs: string[]
}

interface ProjectRecord {
  slug: string
  title: string
  description: string
  eyebrow: string
  tags: string[]
  featured: boolean
  relatedSlugs: string[]
  repoName: string
  status: string
  projectType: string
}

interface ConceptRecord {
  slug: string
  title: string
  description: string
  eyebrow: string
  tags: string[]
  relatedSlugs: string[]
  aliases?: string[]
  canonicalTerm: string
  shortDefinition: string
}

const veliteData = (await import("../.velite/index.js")) as {
  articles: ArticleRecord[]
  concepts: ConceptRecord[]
  projects: ProjectRecord[]
}

const { articles, concepts, projects } = veliteData
const { entitySource } = entitySourceModule

const generatedDir = path.join(process.cwd(), "src", "generated")

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function toSearchDocuments() {
  const articleDocs = articles.map((article) => ({
    id: `article:${article.slug}`,
    title: article.title,
    url: `/articles/${article.slug}`,
    kind: "article",
    description: article.description,
    content: article.summary,
    tags: article.tags,
    meta: {
      eyebrow: article.eyebrow,
      category: article.category,
    },
  }))

  const projectDocs = projects.map((project) => ({
    id: `project:${project.slug}`,
    title: project.title,
    url: `/projects/${project.slug}`,
    kind: "project",
    description: project.description,
    content: `${project.description} ${project.repoName} ${project.projectType}`,
    tags: project.tags,
    meta: {
      eyebrow: project.eyebrow,
      repoName: project.repoName,
      status: project.status,
    },
  }))

  const conceptDocs = concepts.map((concept) => ({
    id: `concept:${concept.slug}`,
    title: concept.title,
    url: `/concepts/${concept.slug}`,
    kind: "concept",
    description: concept.description,
    content: `${concept.shortDefinition} ${(concept.aliases ?? []).join(" ")}`,
    tags: concept.tags,
    meta: {
      eyebrow: concept.eyebrow,
      canonicalTerm: concept.canonicalTerm,
    },
  }))

  const diaryDocs = activityFeed.days.flatMap((day) =>
    day.entries.map((entry) => ({
      id: `diary:${entry.id}`,
      title: entry.title,
      url: `/diary/${day.date}`,
      kind: "diary",
      description: entry.summary,
      content: `${entry.summary} ${entry.whyItMatters} ${entry.repoLabel} ${entry.highlights.join(" ")}`,
      tags: entry.categories,
      meta: {
        date: day.date,
        repoName: entry.repoName,
        repoLabel: entry.repoLabel,
      },
    })),
  )

  return [...articleDocs, ...projectDocs, ...conceptDocs, ...diaryDocs]
}

function toRelatedContentMap() {
  const items = [...articles, ...projects, ...concepts]
  return Object.fromEntries(
    items.map((item) => [
      item.slug,
      item.relatedSlugs.map((slug: string) => ({
        slug,
        url:
          articles.find((candidate) => candidate.slug === slug)
            ? `/articles/${slug}`
            : projects.find((candidate) => candidate.slug === slug)
              ? `/projects/${slug}`
              : `/concepts/${slug}`,
      })),
    ]),
  )
}

function toContentIndex() {
  return {
    articles: articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      summary: article.summary,
      eyebrow: article.eyebrow,
      tags: article.tags,
      featured: article.featured,
      href: `/articles/${article.slug}`,
    })),
    projects: projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      eyebrow: project.eyebrow,
      tags: project.tags,
      featured: project.featured,
      href: `/projects/${project.slug}`,
    })),
    concepts: concepts.map((concept) => ({
      slug: concept.slug,
      title: concept.title,
      description: concept.description,
      href: `/concepts/${concept.slug}`,
    })),
    diary: activityFeed.days.map((day) => ({
      slug: day.date,
      title: day.label,
      description: day.summary,
      href: `/diary/${day.date}`,
    })),
  }
}

await mkdir(generatedDir, { recursive: true })

await writeFile(
  path.join(generatedDir, "content-index.ts"),
  `export const contentIndex = ${serialize(toContentIndex())} as const\n`,
  "utf8",
)

await writeFile(
  path.join(generatedDir, "entity-registry.ts"),
  `export const entityRegistry = ${serialize(entitySource)} as const\n`,
  "utf8",
)

await writeFile(
  path.join(generatedDir, "related-content-map.ts"),
  `export const relatedContentMap = ${serialize(toRelatedContentMap())} as const\n`,
  "utf8",
)

await writeFile(
  path.join(generatedDir, "search-documents.json"),
  `${serialize(toSearchDocuments())}\n`,
  "utf8",
)
