import { articles, concepts, projects } from "../../.velite"

import activityFeed from "@/data/activity-feed.generated.json"

export type Article = (typeof articles)[number]
export type Project = (typeof projects)[number]
export type Concept = (typeof concepts)[number]

export interface DiaryDay {
  date: string
  label: string
  summary: string
  spotlight: string
  slug: string
  entries: (typeof activityFeed.days)[number]["entries"]
}

export interface RelatedContentItem {
  slug: string
  title: string
  href: string
  kind: "article" | "project" | "concept"
  description: string
}

export function getArticles() {
  return [...articles].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  )
}

export function getProjects() {
  return [...projects].sort((left, right) =>
    Number(right.featured) - Number(left.featured) ||
    right.title.localeCompare(left.title),
  )
}

export function getConcepts() {
  return [...concepts].sort((left, right) => left.title.localeCompare(right.title))
}

export function getFeaturedArticles(limit = 4) {
  return getArticles()
    .filter((article) => article.featured)
    .slice(0, limit)
}

export function getFeaturedProjects(limit = 3) {
  return getProjects()
    .filter((project) => project.featured)
    .slice(0, limit)
}

export function getArticleBySlug(slug: string) {
  return getArticles().find((article) => article.slug === slug)
}

export function getProjectBySlug(slug: string) {
  return getProjects().find((project) => project.slug === slug)
}

export function getProjectByRepoName(repoName: string) {
  return getProjects().find((project) => project.repoName === repoName)
}

export function getConceptBySlug(slug: string) {
  return getConcepts().find((concept) => concept.slug === slug)
}

export function getDiaryDays(): DiaryDay[] {
  return activityFeed.days.map((day) => ({
    ...day,
    slug: day.date,
  }))
}

export function getDiaryDayBySlug(slug: string) {
  return getDiaryDays().find((day) => day.slug === slug)
}

export function hrefForSlug(slug: string) {
  const article = getArticleBySlug(slug)
  if (article) return `/articles/${article.slug}`

  const project = getProjectBySlug(slug)
  if (project) return `/projects/${project.slug}`

  const concept = getConceptBySlug(slug)
  if (concept) return `/concepts/${concept.slug}`

  return null
}

export function relatedContentFor(slugs: string[]): RelatedContentItem[] {
  return slugs
    .map((slug) => {
      const article = getArticleBySlug(slug)
      if (article) {
        return {
          slug,
          title: article.title,
          href: `/articles/${article.slug}`,
          kind: "article" as const,
          description: article.summary,
        }
      }

      const project = getProjectBySlug(slug)
      if (project) {
        return {
          slug,
          title: project.title,
          href: `/projects/${project.slug}`,
          kind: "project" as const,
          description: project.description,
        }
      }

      const concept = getConceptBySlug(slug)
      if (concept) {
        return {
          slug,
          title: concept.title,
          href: `/concepts/${concept.slug}`,
          kind: "concept" as const,
          description: concept.shortDefinition,
        }
      }

      return null
    })
    .filter((item): item is RelatedContentItem => item !== null)
}

export function diaryEntriesForProject(projectSlug: string) {
  const project = getProjectBySlug(projectSlug)
  if (!project) {
    return []
  }

  return diaryEntriesForSlug(project.slug).filter(
    (entry) => entry.repoName === project.repoName,
  )
}

export function diaryEntriesForSlug(slug: string) {
  return getDiaryDays()
    .flatMap((day) =>
      day.entries
        .filter((entry) => entry.relatedSlugs.includes(slug))
        .map((entry) => ({
          ...entry,
          daySlug: day.slug,
          dayLabel: day.label,
          dayDate: day.date,
        })),
    )
    .slice(0, 4)
}
