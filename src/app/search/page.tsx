import type { Metadata } from "next"

import { PageHero } from "@/components/archive/page-hero"
import { SearchExperience } from "@/components/archive/search-experience"
import { SiteFrame } from "@/components/archive/site-frame"

export const metadata: Metadata = {
  title: "Search | Workflow Garden",
  description: "Search across Workflow Garden articles, projects, diary entries, and concept pages.",
}

export default function SearchPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Cross-content search"
        title="Search the archive when a name or workflow term shows up without enough context."
        description="This search blends articles, projects, diary entries, and concept pages so recurring names can resolve inside the site instead of sending visitors elsewhere."
        links={[
          { href: "/articles", label: "Browse articles" },
          { href: "/projects", label: "Browse projects" },
        ]}
      />
      <div className="pb-20">
        <SearchExperience />
      </div>
    </SiteFrame>
  )
}
