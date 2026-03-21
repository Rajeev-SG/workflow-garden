import Link from "next/link"

export function ContentCard({
  href,
  eyebrow,
  title,
  description,
  meta,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  meta?: string
}) {
  return (
    <Link href={href} className="archive-card block h-full p-6 transition-colors hover:bg-white">
      <p className="archive-kicker text-primary/45">{eyebrow}</p>
      <h3 className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.04em] text-primary">
        {title}
      </h3>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
      {meta ? (
        <p className="mt-6 text-[0.72rem] uppercase tracking-[0.22em] text-secondary">
          {meta}
        </p>
      ) : null}
    </Link>
  )
}
