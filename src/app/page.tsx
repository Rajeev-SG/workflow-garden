import activityFeed from "@/data/activity-feed.generated.json"
import {
  learningCards,
  reassuranceNotes,
  setupSteps,
  toolLenses,
  workflowBeats,
} from "@/data/site-content"
import { DiaryArchiveSection } from "@/components/archive/diary-archive-section"
import { LandingHero } from "@/components/archive/landing-hero"
import { LearningLibrarySection } from "@/components/archive/learning-library-section"
import { SetupPathSection } from "@/components/archive/setup-path-section"
import { SiteFooter } from "@/components/archive/site-footer"
import { SiteHeader } from "@/components/archive/site-header"
import { ToolMapSection } from "@/components/archive/tool-map-section"
import { WorkflowBeatsSection } from "@/components/archive/workflow-beats-section"
import type { ActivityFeed } from "@/lib/activity-intelligence"

const feed = activityFeed as ActivityFeed

export default function Home() {
  return (
    <main id="top" className="archive-shell">
      <SiteHeader />
      <LandingHero feed={feed} reassuranceNotes={reassuranceNotes} />
      <WorkflowBeatsSection workflowBeats={workflowBeats} />
      <ToolMapSection toolLenses={toolLenses} />
      <SetupPathSection setupSteps={setupSteps} />
      <LearningLibrarySection learningCards={learningCards} />
      <DiaryArchiveSection feed={feed} />
      <SiteFooter scanRoot={feed.scanRoot} />
    </main>
  )
}
