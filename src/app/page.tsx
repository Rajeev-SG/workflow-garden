import activityFeed from "@/data/activity-feed.generated.json"
import {
  reassuranceNotes,
  setupSteps,
  toolLenses,
  workflowBeats,
} from "@/data/site-content"
import { LandingHero } from "@/components/archive/landing-hero"
import { ProjectsShowcaseSection } from "@/components/archive/projects-showcase-section"
import { SetupPathSection } from "@/components/archive/setup-path-section"
import { SiteFrame } from "@/components/archive/site-frame"
import { ToolMapSection } from "@/components/archive/tool-map-section"
import { WorkflowBeatsSection } from "@/components/archive/workflow-beats-section"
import type { ActivityFeed } from "@/lib/activity-intelligence"
import { getFeaturedArticles, getFeaturedProjects } from "@/lib/content"

const feed = activityFeed as ActivityFeed

export default function Home() {
  const featuredArticle = getFeaturedArticles(1)[0]
  const featuredProjects = getFeaturedProjects()
  const featuredProject = featuredProjects[0]

  if (!featuredArticle || !featuredProject) {
    return null
  }

  return (
    <SiteFrame>
      <LandingHero
        feed={feed}
        reassuranceNotes={reassuranceNotes}
        featuredArticle={featuredArticle}
        featuredProject={featuredProject}
      />
      <WorkflowBeatsSection workflowBeats={workflowBeats} />
      <ToolMapSection toolLenses={toolLenses} />
      <ProjectsShowcaseSection projects={featuredProjects} />
      <SetupPathSection setupSteps={setupSteps} />
    </SiteFrame>
  )
}
