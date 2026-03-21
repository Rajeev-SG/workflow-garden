import { describe, expect, it } from "vitest"

import activityIntelligence from "./activity-intelligence"

describe("activity intelligence", () => {
  it("treats mixed interface and docs work with commits as meaningful", () => {
    const snapshot = {
      repoName: "workflow-garden",
      day: "2026-03-21",
      latestTouchedAt: "2026-03-21T17:00:00.000Z",
      commits: [
        {
          hash: "abc123",
          committedAt: "2026-03-21T17:00:00.000Z",
          subject: "feat: tighten the diary archive",
          files: [
            "README.md",
            "plans/workflow-garden-mvp.md",
            "src/app/page.tsx",
            "src/components/hero.tsx",
          ],
        },
      ],
      files: [
        "README.md",
        "plans/workflow-garden-mvp.md",
        "src/app/page.tsx",
        "src/components/hero.tsx",
      ],
    }

    expect(activityIntelligence.isMeaningfulSnapshot(snapshot, 12)).toBe(true)

    const feed = activityIntelligence.buildCuratedFeed(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulSnapshotScore: 12,
        fullRefreshSignalThreshold: 32,
        spotlightSignalThreshold: 20,
        minMeaningfulSnapshots: 2,
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
    expect(feed.days[0]?.entries[0]?.narrative).toContain("spent the day on")
  })

  it("keeps the diary quiet when there is not enough signal", () => {
    const snapshot = {
      repoName: "tiny-change",
      day: "2026-03-21",
      latestTouchedAt: "2026-03-21T12:00:00.000Z",
      files: ["notes.txt"],
    }

    expect(activityIntelligence.isMeaningfulSnapshot(snapshot, 12)).toBe(false)

    const feed = activityIntelligence.buildCuratedFeed(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulSnapshotScore: 12,
        fullRefreshSignalThreshold: 32,
        spotlightSignalThreshold: 20,
        minMeaningfulSnapshots: 2,
        maxDays: 7,
      },
      "2026-03-21T18:00:00.000Z",
    )

    expect(feed.meaningfulActivityDetected).toBe(false)
    expect(feed.days).toHaveLength(0)
  })

  it("skips a full regeneration when the fingerprint has not changed", () => {
    const snapshot = {
      repoName: "workflow-garden",
      day: "2026-03-21",
      latestTouchedAt: "2026-03-21T17:00:00.000Z",
      commits: [
        {
          hash: "abc123",
          committedAt: "2026-03-21T17:00:00.000Z",
          subject: "feat: tighten the diary archive",
          files: ["src/app/diary/page.tsx", "src/data/activity-feed.generated.json"],
        },
      ],
      files: ["src/app/diary/page.tsx", "src/data/activity-feed.generated.json"],
    }

    const firstGate = activityIntelligence.buildRefreshGate(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulSnapshotScore: 12,
        fullRefreshSignalThreshold: 32,
        spotlightSignalThreshold: 20,
        minMeaningfulSnapshots: 2,
        maxDays: 7,
      },
    )

    const previousFeed = activityIntelligence.buildCuratedFeed(
      firstGate.meaningfulSnapshots,
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulSnapshotScore: 12,
        fullRefreshSignalThreshold: 32,
        spotlightSignalThreshold: 20,
        minMeaningfulSnapshots: 2,
        maxDays: 7,
      },
      "2026-03-21T18:00:00.000Z",
      undefined,
      firstGate.gate,
    )

    const secondGate = activityIntelligence.buildRefreshGate(
      [snapshot],
      {
        scanRoot: "/Users/rajeev/Code",
        meaningfulSnapshotScore: 12,
        fullRefreshSignalThreshold: 32,
        spotlightSignalThreshold: 20,
        minMeaningfulSnapshots: 2,
        maxDays: 7,
      },
      previousFeed,
    )

    expect(secondGate.gate.decision).toBe("skipped")
  })
})
