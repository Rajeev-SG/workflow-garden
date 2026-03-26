import type { Metadata } from "next"

import activityFeed from "@/data/activity-feed.generated.json"
import { DiaryArchiveSection } from "@/components/archive/diary-archive-section"
import { SiteFrame } from "@/components/archive/site-frame"
import type { ActivityFeed } from "@/lib/activity-intelligence"

const feed = activityFeed as ActivityFeed

export const metadata: Metadata = {
  title: "Diary | Workflow Garden",
  description:
    "An automated diary that turns meaningful repository activity into readable public updates with GitHub and project links attached.",
}

export default function DiaryPage() {
  return (
    <SiteFrame>
      <DiaryArchiveSection feed={feed} showArchiveLink={false} />
    </SiteFrame>
  )
}
