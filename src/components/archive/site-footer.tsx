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
            The intellectual archive
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-primary/46">
            Proof-backed, branch-clean, and readable by humans
          </p>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-right">
          The live site shows committed generated activity data from{" "}
          <span className="font-mono text-xs text-foreground">{scanRoot}</span>.
          Run <span className="font-mono text-xs text-foreground">pnpm activity:refresh</span>{" "}
          before proof and deploy.
        </p>
      </div>
    </footer>
  )
}
