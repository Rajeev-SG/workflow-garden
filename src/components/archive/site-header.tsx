const NAV_ITEMS = [
  { href: "#understand", label: "Understand" },
  { href: "#build", label: "Build" },
  { href: "#prove", label: "Prove" },
  { href: "#ship", label: "Ship" },
  { href: "#library", label: "Library" },
  { href: "#daily-diary", label: "Diary" },
 ] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-6 px-5 py-5 md:px-8 lg:px-10">
        <a href="#top" className="shrink-0">
          <span className="font-heading text-[1.7rem] leading-none font-medium tracking-[-0.04em] text-primary italic">
            Workflow Garden
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="archive-link text-sm font-medium tracking-[0.02em]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#daily-diary"
          className="inline-flex items-center border border-border/80 bg-white/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary transition-colors hover:bg-white"
        >
          Read today&apos;s diary
        </a>
      </div>
    </header>
  )
}
