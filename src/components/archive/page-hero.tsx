import Link from "next/link"

export interface PageHeroLink {
  href: string
  label: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  links = [],
}: {
  eyebrow: string
  title: string
  description: string
  links?: PageHeroLink[]
}) {
  return (
    <section className="archive-section mx-auto w-full max-w-[96rem] px-5 pb-8 md:px-8 lg:px-10">
      <div className="archive-paper-stack archive-surface-low grid gap-8 p-8 md:p-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <p className="archive-kicker">{eyebrow}</p>
          <h1 className="max-w-4xl text-[clamp(3rem,7vw,5.8rem)] leading-[0.95] font-medium tracking-[-0.05em] text-primary">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-[1.16rem] md:leading-9">
            {description}
          </p>
        </div>

        <div className="space-y-3 self-end">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="archive-card flex items-center justify-between p-4 text-sm font-semibold text-primary transition-colors hover:bg-white"
            >
              <span>{link.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
