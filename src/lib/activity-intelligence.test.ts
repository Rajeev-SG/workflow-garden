import { describe, expect, it } from "vitest"

import activityIntelligence from "./activity-intelligence"

describe("activity intelligence", () => {
  it("treats mixed interface and docs work as meaningful", () => {
    const snapshot = {
      repoName: "workflow-garden",
      day: "2026-03-21",
      latestTouchedAt: "2026-03-21T17:00:00.000Z",
      files: [
        "README.md",
        "plans/workflow-garden-mvp.md",
        "src/app/page.tsx",
        "src/components/hero.tsx",
      ],
    }

    expect(activityIntelligence.isMeaningfulSnapshot(snapshot, 3)).toBe(true)

    const feed = activityIntelligence.buildCuratedFeed(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulChangeThreshold: 3,
        maxDays: 7,
      },
      "2026-03-21T18:00:00.000Z",
    )

    expect(feed.meaningfulActivityDetected).toBe(true)
    expect(feed.days).toHaveLength(1)
    expect(feed.days[0]?.entries[0]?.kind).toBe("showcase")
    expect(feed.days[0]?.entries[0]?.highlights).toContain(
      "the plain-language README",
    )
  })

  it("keeps the diary quiet when there is not enough signal", () => {
    const snapshot = {
      repoName: "tiny-change",
      day: "2026-03-21",
      latestTouchedAt: "2026-03-21T12:00:00.000Z",
      files: ["notes.txt"],
    }

    expect(activityIntelligence.isMeaningfulSnapshot(snapshot, 3)).toBe(false)

    const feed = activityIntelligence.buildCuratedFeed(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulChangeThreshold: 3,
        maxDays: 7,
      },
      "2026-03-21T18:00:00.000Z",
    )

    expect(feed.meaningfulActivityDetected).toBe(false)
    expect(feed.days).toHaveLength(0)
  })
})
