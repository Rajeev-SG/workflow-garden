import { findAndReplace } from "mdast-util-find-and-replace"
import type { Root, Text } from "mdast"
import { visitParents } from "unist-util-visit-parents"

import { entitySource } from "@/lib/content-entities-source"

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function makeMatchers() {
  return entitySource
    .flatMap((entity) => [entity.label, ...(entity.aliases ?? [])].map((label) => ({ entity, label })))
    .sort((left, right) => right.label.length - left.label.length)
}

export function remarkAutolinkEntities() {
  return (tree: Root) => {
    const linkedLabels = new Set<string>()

    visitParents(tree, "paragraph", (node, parents) => {
      const parentKinds = new Set<string>(parents.map((parent) => parent.type))
      if (parentKinds.has("link") || parentKinds.has("linkReference")) {
        return
      }

      for (const { entity, label } of makeMatchers()) {
        if (linkedLabels.has(entity.id)) {
          continue
        }

        const regex = new RegExp(`\\b${escapeRegex(label)}\\b`, "i")
        let matched = false

        findAndReplace(
          node,
          [
            regex,
            (value: string) => {
              if (matched) {
                return value
              }

              matched = true
              linkedLabels.add(entity.id)

              return {
                type: "link",
                url: entity.href,
                data: {
                  hProperties: {
                    className: ["archive-inline-link"],
                    "data-entity-kind": entity.kind,
                  },
                },
                children: [{ type: "text", value }] as Text[],
              }
            },
          ],
          {
            ignore: ["link", "linkReference", "inlineCode", "code", "heading"],
          },
        )

        if (matched) {
          break
        }
      }
    })
  }
}
