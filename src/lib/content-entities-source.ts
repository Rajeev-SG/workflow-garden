export type EntityKind = "article" | "project" | "concept"

export interface EntitySource {
  id: string
  label: string
  href: string
  kind: EntityKind
  aliases?: string[]
}

export const entitySource: EntitySource[] = [
  {
    id: "skills",
    label: "agent skills",
    href: "/articles/what-agent-skills-are",
    kind: "article",
    aliases: ["skills", "skill"],
  },
  {
    id: "repo-bootstrap",
    label: "repo-bootstrap",
    href: "/articles/repo-bootstrap-explained",
    kind: "article",
    aliases: ["`repo-bootstrap`", "repo bootstrap"],
  },
  {
    id: "write-a-prd",
    label: "write-a-prd",
    href: "/articles/prd-workflow-explained",
    kind: "article",
    aliases: ["`write-a-prd`", "write a prd"],
  },
  {
    id: "prd-to-plan",
    label: "prd-to-plan",
    href: "/articles/prd-workflow-explained",
    kind: "article",
    aliases: ["`prd-to-plan`", "prd to plan"],
  },
  {
    id: "prd-to-issues",
    label: "prd-to-issues",
    href: "/articles/prd-workflow-explained",
    kind: "article",
    aliases: ["`prd-to-issues`", "prd to issues"],
  },
  {
    id: "design-proof",
    label: "design-proof",
    href: "/articles/proof-vs-acceptance",
    kind: "article",
    aliases: ["`design-proof`", "design proof"],
  },
  {
    id: "acceptance-proof",
    label: "acceptance-proof",
    href: "/articles/proof-vs-acceptance",
    kind: "article",
    aliases: ["`acceptance-proof`", "acceptance proof"],
  },
  {
    id: "shadcn-ui",
    label: "shadcn-ui",
    href: "/articles/shadcn-ui-explained",
    kind: "article",
  },
  {
    id: "frontend-design",
    label: "frontend-design",
    href: "/articles/frontend-design-explained",
    kind: "article",
  },
  {
    id: "critique",
    label: "critique",
    href: "/articles/critique-explained",
    kind: "article",
  },
  {
    id: "audit",
    label: "audit",
    href: "/articles/audit-explained",
    kind: "article",
  },
  {
    id: "polish",
    label: "polish",
    href: "/articles/polish-explained",
    kind: "article",
  },
  {
    id: "one-issue-one-branch",
    label: "one issue, one branch, one PR",
    href: "/articles/one-issue-one-branch-one-pr",
    kind: "article",
    aliases: ["one issue / one branch / one PR", "one issue one branch one pr"],
  },
  {
    id: "what-is-a-prd",
    label: "PRD",
    href: "/concepts/prd",
    kind: "concept",
    aliases: ["product requirements document"],
  },
  {
    id: "issue-branch",
    label: "issue branch",
    href: "/concepts/issue-branch",
    kind: "concept",
    aliases: ["ticket branch", "ticket-derived branch"],
  },
  {
    id: "proof",
    label: "proof",
    href: "/concepts/proof",
    kind: "concept",
    aliases: ["proof-backed", "proof artifacts"],
  },
  {
    id: "workflow-garden",
    label: "Workflow Garden",
    href: "/projects/workflow-garden",
    kind: "project",
  },
  {
    id: "choice-compass",
    label: "Choice Compass",
    href: "/projects/choice-compass",
    kind: "project",
  },
  {
    id: "proof-pack",
    label: "Proof Pack",
    href: "/projects/proof-pack",
    kind: "project",
  },
  {
    id: "property-search",
    label: "Property Search",
    href: "/projects/property-search",
    kind: "project",
  },
]

const entitySourceModule = {
  entitySource,
}

export default entitySourceModule
