import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export interface SourceLinkItem {
  label: string
  href: string
  description?: string
}

export function SourceLinksPanel({
  title = "Source links",
  kicker = "Keep exploring",
  links,
}: {
  title?: string
  kicker?: string
  links: SourceLinkItem[]
}) {
  if (links.length === 0) {
    return null
  }

  return (
    <aside className="archive-surface-high border border-border/70 p-6">
      <p className="archive-kicker">{kicker}</p>
      <h2 className="mt-4 text-3xl leading-tight font-medium tracking-[-0.04em] text-primary">
        {title}
      </h2>
      <div className="mt-6 space-y-3">
        {links.map((link) => {
          const isInternal = link.href.startsWith("/")

          return (
            <Link
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="archive-card block p-4 transition-colors hover:bg-white"
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noreferrer"}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-base leading-6 font-semibold text-primary">
                  {link.label}
                </p>
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary/48" />
              </div>
              {link.description ? (
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {link.description}
                </p>
              ) : null}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
