import Link from "next/link"

import type { RelatedContentItem } from "@/lib/content"

export function RelatedLinks({
  title = "Related reading",
  items,
}: {
  title?: string
  items: RelatedContentItem[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <aside className="archive-surface-high border border-border/70 p-6">
      <p className="archive-kicker">Continue through the archive</p>
      <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
        {title}
      </h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="archive-card block p-4 transition-colors hover:bg-white">
            <p className="archive-kicker text-primary/42">{item.kind}</p>
            <p className="mt-3 text-xl leading-tight font-medium tracking-[-0.03em] text-primary">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </aside>
  )
}
