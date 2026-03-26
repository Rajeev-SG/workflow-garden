import { defineConfig, s } from "velite"

import { remarkAutolinkEntities } from "./src/lib/remark/autolink-entities"

const commonFields = {
  slug: s.slug(),
  title: s.string(),
  description: s.string(),
  eyebrow: s.string(),
  tags: s.array(s.string()).default([]),
  relatedSlugs: s.array(s.string()).default([]),
  externalLinks: s
    .array(
      s.object({
        label: s.string(),
        href: s.string().url(),
        description: s.string().optional(),
      }),
    )
    .default([]),
  featured: s.boolean().default(false),
  publishedAt: s.isodate(),
  updatedAt: s.isodate(),
}

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: {
    articles: {
      name: "Article",
      pattern: "articles/**/*.mdx",
      schema: s.object({
        ...commonFields,
        category: s.string(),
        summary: s.string(),
        audience: s.string(),
        readingTime: s.string(),
        content: s.mdx({
          remarkPlugins: [remarkAutolinkEntities],
        }),
      }),
    },
    projects: {
      name: "Project",
      pattern: "projects/**/*.mdx",
      schema: s.object({
        ...commonFields,
        repoName: s.string(),
        repoUrl: s.string().url(),
        liveUrl: s.string().url().optional(),
        proofUrl: s.string().optional(),
        status: s.enum(["Live", "In progress", "Case study", "Archived"]),
        projectType: s.string(),
        content: s.mdx({
          remarkPlugins: [remarkAutolinkEntities],
        }),
      }),
    },
    concepts: {
      name: "Concept",
      pattern: "concepts/**/*.mdx",
      schema: s.object({
        ...commonFields,
        aliases: s.array(s.string()).default([]),
        shortDefinition: s.string(),
        canonicalTerm: s.string(),
        content: s.mdx({
          remarkPlugins: [remarkAutolinkEntities],
        }),
      }),
    },
  },
})
