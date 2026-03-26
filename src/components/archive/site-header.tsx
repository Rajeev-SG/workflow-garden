import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const NAV_ITEMS = [
  { href: "/articles", label: "Articles" },
  { href: "/projects", label: "Projects" },
  { href: "/diary", label: "Diary" },
  { href: "/search", label: "Search" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-6 px-5 py-4 md:px-8 lg:px-10">
        <Link href="/" className="shrink-0">
          <span className="font-heading text-[1.7rem] leading-none font-medium tracking-[-0.04em] text-primary italic">
            Workflow Garden
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="archive-link text-sm font-medium tracking-[0.02em]"
          >
            Home
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="archive-link text-sm font-medium tracking-[0.02em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/Rajeev-SG/workflow-garden"
            className="hidden items-center gap-2 border border-border/80 bg-white/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary transition-colors hover:bg-white md:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center border border-border/80 bg-white/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary transition-colors hover:bg-white"
          >
            Search
          </Link>
        </div>
      </div>
    </header>
  )
}
