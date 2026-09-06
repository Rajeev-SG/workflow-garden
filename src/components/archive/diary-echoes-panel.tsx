import Link from "next/link"

import type { diaryEntriesForSlug } from "@/lib/content"

type DiaryEcho = ReturnType<typeof diaryEntriesForSlug>[number]

export function DiaryEchoesPanel({
  title = "Diary echoes",
  items,
}: {
  title?: string
  items: DiaryEcho[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <aside className="archive-card p-6">
      <p className="archive-kicker text-primary/45">{title}</p>
      <div className="mt-4 space-y-4">
        {items.map((entry) => (
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
    </aside>
  )
}
