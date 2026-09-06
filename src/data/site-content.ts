export const toolLenses = [
  {
    id: "understand",
    label: "Understand",
    eyebrow: "When the work is still fuzzy",
    headline: "Turn the idea into something concrete before the code starts.",
    summary:
      "This lane is for turning a vague idea into a plan. It keeps the work from rushing into code before anyone knows what success should look like.",
    tools: [
      {
        name: "repo-bootstrap",
        useCase: "Set up a new repo so the next agent knows the workflow, commands, and proof bar.",
        href: "/articles/repo-bootstrap-explained",
      },
      {
        name: "write-a-prd",
        useCase: "Translate a rough product idea into a plain-language PRD with clear user stories.",
        href: "/articles/prd-workflow-explained",
      },
      {
        name: "prd-to-plan",
        useCase: "Turn that PRD into thin, demoable phases instead of one giant to-do list.",
        href: "/articles/prd-workflow-explained",
      },
      {
        name: "prd-to-issues",
        useCase: "Create the actual execution issues that branches and PRs will follow.",
        href: "/articles/prd-workflow-explained",
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    eyebrow: "When the shape is clear",
    headline: "Use reliable primitives, then spend the creativity on clarity.",
    summary:
      "Build mode is about small, reversible changes. Mature primitives reduce risk. Strong composition keeps the work from looking like a stack of generic cards.",
    tools: [
      {
        name: "shadcn-ui",
        useCase: "De-risk the tricky basics like tabs, accordions, buttons, and sheets.",
        href: "/articles/shadcn-ui-explained",
      },
      {
        name: "frontend-design",
        useCase: "Choose a real visual direction instead of shipping generic AI-looking layouts.",
        href: "/articles/frontend-design-explained",
      },
      {
        name: "critique",
        useCase: "Challenge the design early so structural problems get fixed before polish.",
        href: "/articles/critique-explained",
      },
      {
        name: "gh + Linear",
        useCase: "Keep the implementation branch, PR, and planning state lined up.",
        href: "/articles/one-issue-one-branch-one-pr",
      },
    ],
  },
  {
    id: "prove",
    label: "Prove",
    eyebrow: "When the page works",
    headline: "Passing checks is useful. Visible evidence is what builds trust.",
    summary:
      "Proof mode asks a simple question: can another person see that this works and looks right? If the answer is unclear, the proof is not done yet.",
    tools: [
      {
        name: "audit",
        useCase: "Run a quality pass across accessibility, responsive behavior, and anti-patterns.",
        href: "/articles/audit-explained",
      },
      {
        name: "polish",
        useCase: "Fix the last alignment, spacing, copy, and interaction details before shipping.",
        href: "/articles/polish-explained",
      },
      {
        name: "design-proof",
        useCase: "Fail the pass if normal desktop, wide desktop, or mobile screenshots are compositionally weak.",
        href: "/articles/proof-vs-acceptance",
      },
      {
        name: "acceptance-proof",
        useCase: "Run the real user journey in a browser and fail if the screenshots do not hold up.",
        href: "/articles/proof-vs-acceptance",
      },
    ],
  },
  {
    id: "ship",
    label: "Ship",
    eyebrow: "When the evidence is strong",
    headline: "Close the loop through deploy, merge, and cleanup.",
    summary:
      "Shipping is not just pushing code. It means the work is live, the issue state is accurate, the proof exists, and the branch is no longer lingering around.",
    tools: [
      {
        name: "vercel",
        useCase: "Push the MVP to a real public URL so the proof can reference a live surface.",
        href: "/projects/workflow-garden",
      },
      {
        name: "gh",
        useCase: "Reuse one PR, merge it cleanly, and close the linked issue from the merge.",
        href: "/articles/one-issue-one-branch-one-pr",
      },
      {
        name: "Linear",
        useCase: "Move planning state only when the proof and merge state genuinely line up.",
        href: "/articles/one-issue-one-branch-one-pr",
      },
      {
        name: "README proof screenshots",
        useCase: "Turn internal proof artifacts into a public, inspectable record of the shipped result.",
      },
    ],
  },
] as const

export const workflowBeats = [
  "Clarify the job before implementation starts.",
  "Build on one ticket branch so the change still has a readable shape.",
  "Treat proof as evidence, not as a polite summary.",
  "Only call it done when deploy, merge, and cleanup all line up.",
] as const

export const setupSteps = [
  {
    number: "01",
    title: "Bootstrap a clean repo",
    summary:
      "Set the repo rules and make the README useful from the first day.",
    details:
      "A good bootstrap keeps the repo easy for future agents to inspect. It should name the workflow, the commands, the proof bar, and the exact next step.",
    commands: ["repo-bootstrap", "gh repo create", "git init -b main"],
  },
  {
    number: "02",
    title: "Write the plan in normal language",
    summary:
      "Turn a rough product idea into a PRD, then slice it into shippable work.",
    details:
      "This is where the workflow gets friendlier. Instead of burying intent in chat history, it stores requirements in GitHub and planning state in Linear.",
    commands: ["write-a-prd", "prd-to-plan", "prd-to-issues"],
  },
  {
    number: "03",
    title: "Ship from one ticket branch",
    summary:
      "Keep the implementation narrow enough that one issue, one branch, and one PR still feel natural.",
    details:
      "That branch should be where the code, proof, and deploy story all meet. If the branch is merged, it should be deleted too.",
    commands: ["git checkout -b raj-37-…", "gh pr create", "gh pr merge --delete-branch"],
  },
  {
    number: "04",
    title: "Require proof before celebration",
    summary:
      "Run the real browser flow, inspect the screenshots, then decide whether the work actually passes.",
    details:
      "The workflow deliberately blocks a false win. If the screenshots fail at desktop, wide desktop, or mobile, acceptance fails too.",
    commands: ["playwright-cli", "design-proof", "acceptance-proof"],
  },
] as const

export const learningCards = [
  {
    kind: "Tutorial",
    title: "How one issue becomes one trustworthy branch",
    body: "A quick walkthrough of why the workflow prefers a single branch and a single PR until merge, and why that keeps the history easier to reason about.",
  },
  {
    kind: "Showcase",
    title: "What proof artifacts look like when they are actually useful",
    body: "Screenshots, console checks, and a short pass/fail note are enough to tell another person what happened without making them replay the whole investigation.",
  },
  {
    kind: "Explainer",
    title: "Why the diary is curated instead of live-streaming every file touch",
    body: "Raw file churn is not the same thing as progress. The diary waits for a meaningful signal, then translates it into human language.",
  },
  {
    kind: "Article",
    title: "Why non-developers can still benefit from this workflow",
    body: "The hidden value is not just speed. It is clarity: what changed, why it matters, and what evidence exists that the work is solid.",
  },
] as const

export const reassuranceNotes = [
  "Minimal jargon",
  "Short sections",
  "Visible proof",
] as const
