export const toolLenses = [
  {
    id: "understand",
    label: "Understand",
    eyebrow: "When the work is still fuzzy",
    headline: "Start by turning the idea into something everyone can agree on.",
    summary:
      "This lane is for turning a vague idea into a plan. It keeps the work from jumping straight into code before anyone knows what success looks like.",
    tools: [
      {
        name: "repo-bootstrap",
        useCase: "Set up a new repo so the next agent knows the workflow, commands, and proof bar.",
      },
      {
        name: "write-a-prd",
        useCase: "Translate a rough product idea into a plain-language PRD with clear user stories.",
      },
      {
        name: "prd-to-plan",
        useCase: "Turn that PRD into thin, demoable phases instead of one giant to-do list.",
      },
      {
        name: "prd-to-issues",
        useCase: "Create the actual execution issues that branches and PRs will follow.",
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    eyebrow: "When the shape is clear",
    headline: "Use reliable primitives, then spend creativity on composition and clarity.",
    summary:
      "Build mode is about small, reversible changes. Mature primitives reduce risk. Strong page composition keeps the work from looking like a stack of generic cards.",
    tools: [
      {
        name: "shadcn-ui",
        useCase: "De-risk the tricky basics like tabs, accordions, buttons, and sheets.",
      },
      {
        name: "frontend-design",
        useCase: "Choose a real visual direction instead of shipping generic AI-looking layouts.",
      },
      {
        name: "critique",
        useCase: "Challenge the design early so structural problems get fixed before polish.",
      },
      {
        name: "gh + Linear",
        useCase: "Keep the implementation branch, PR, and planning state lined up.",
      },
    ],
  },
  {
    id: "prove",
    label: "Prove",
    eyebrow: "When the page works",
    headline: "Passing code checks is useful. Visible evidence is what builds trust.",
    summary:
      "Proof mode asks a simple question: can another person see that this actually works and actually looks right? If the answer is unclear, the proof is not done yet.",
    tools: [
      {
        name: "audit",
        useCase: "Run a quality pass across accessibility, responsive behavior, and anti-patterns.",
      },
      {
        name: "polish",
        useCase: "Fix the last alignment, spacing, copy, and interaction details before shipping.",
      },
      {
        name: "design-proof",
        useCase: "Fail the pass if normal desktop, wide desktop, or mobile screenshots are compositionally weak.",
      },
      {
        name: "acceptance-proof",
        useCase: "Run the real user journey in a browser and fail if the screenshots do not hold up.",
      },
    ],
  },
  {
    id: "ship",
    label: "Ship",
    eyebrow: "When the evidence is strong",
    headline: "Close the loop all the way through deploy, merge, and cleanup.",
    summary:
      "Shipping is not just pushing code. It means the work is live, the issue state is accurate, the proof exists, and the implementation branch is no longer lingering around.",
    tools: [
      {
        name: "vercel",
        useCase: "Push the MVP to a real public URL so the proof can reference a live surface.",
      },
      {
        name: "gh",
        useCase: "Reuse one PR, merge it cleanly, and close the linked issue from the merge.",
      },
      {
        name: "Linear",
        useCase: "Move planning state only when the proof and merge state genuinely line up.",
      },
      {
        name: "README proof screenshots",
        useCase: "Turn internal proof artifacts into a public, inspectable record of the shipped result.",
      },
    ],
  },
] as const

export const workflowBeats = [
  "Clarify the work before implementation starts.",
  "Build on a ticket branch that maps cleanly to one issue.",
  "Treat proof as evidence, not as a polite summary.",
  "Only call it done once deploy, merge, and cleanup line up.",
] as const

export const setupSteps = [
  {
    number: "01",
    title: "Bootstrap a clean repo",
    summary:
      "Create the folder, set the repo rules, and make the README useful from the first day.",
    details:
      "A good bootstrap keeps the repo easy for future agents to inspect. It should name the workflow, the commands, the proof bar, and the exact next step.",
    commands: ["repo-bootstrap", "gh repo create", "git init -b main"],
  },
  {
    number: "02",
    title: "Write the plan in normal language",
    summary:
      "Turn a rough product idea into a PRD, then slice it into independently shippable work.",
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
  "Minimal jargon, because the goal is understanding.",
  "Short sections, because attention is precious.",
  "Visible proof, because trust should be earned.",
] as const
