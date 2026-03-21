import { mkdir, rm } from "node:fs/promises"
import path from "node:path"

import * as pagefind from "pagefind"

import searchDocuments from "../src/generated/search-documents.json" with { type: "json" }

const outputPath = path.join(process.cwd(), "public", "pagefind")

function compactMeta(
  meta: Record<string, string | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(meta).filter((entry): entry is [string, string] => Boolean(entry[1])),
  )
}

await rm(outputPath, { recursive: true, force: true })
await mkdir(outputPath, { recursive: true })

const { index } = await pagefind.createIndex({
  rootSelector: "main",
})

if (!index) {
  throw new Error("Pagefind did not return an index builder.")
}

for (const doc of searchDocuments) {
  await index.addCustomRecord({
    url: doc.url,
    content: doc.content,
    language: "en",
    meta: compactMeta({
      title: doc.title,
      description: doc.description,
      kind: doc.kind,
      ...doc.meta,
    }),
    filters: {
      kind: [doc.kind],
      tags: doc.tags,
    },
  })
}

await index.writeFiles({
  outputPath,
})
