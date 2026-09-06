import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export interface SiteFooterProps {
  scanRoot: string
}

export function SiteFooter({ scanRoot }: Readonly<SiteFooterProps>) {
  return (
    <footer className="mx-auto w-full max-w-[96rem] px-5 py-10 md:px-8 lg:px-10">
      <div className="archive-rule" />
      <div className="flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-heading text-xl leading-none font-medium italic text-primary">
            Workflow Garden
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-primary/46">
            Plain-language workflow notes with inspectable evidence
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            <Link href="/articles" className="archive-link">Articles</Link>
            <Link href="/projects" className="archive-link">Projects</Link>
            <Link href="/diary" className="archive-link">Diary</Link>
            <Link href="/search" className="archive-link">Search</Link>
            <Link
              href="https://github.com/Rajeev-SG/workflow-garden"
              className="archive-link inline-flex items-center gap-1"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-right">
          The live site serves committed generated activity data from{" "}
          <span className="font-mono text-xs text-foreground">{scanRoot}</span>.
          Run <span className="font-mono text-xs text-foreground">pnpm activity:refresh</span>,
          then capture proof before deploy.
        </p>
      </div>
    </footer>
  )
}
