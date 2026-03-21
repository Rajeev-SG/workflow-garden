import type { ReactNode } from "react"

import activityFeed from "@/data/activity-feed.generated.json"

import { SiteFooter } from "@/components/archive/site-footer"
import { SiteHeader } from "@/components/archive/site-header"

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <main id="top" className="archive-shell">
      <SiteHeader />
      {children}
      <SiteFooter scanRoot={activityFeed.scanRoot} />
    </main>
  )
}
