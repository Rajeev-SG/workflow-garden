# Workflow Garden Design Direction

Source of truth: Stitch project `6446201702713515390`, approved direction `B` ("Intellectual Archive").

## Creative North Star

Workflow Garden should feel like a public-interest journal crossed with a carefully maintained evidence board. The site should read as permanent, thoughtful, and editorial rather than fast-moving SaaS.

## Visual Rules

- Use `Newsreader` for headlines and `Inter` for body, labels, and interface copy.
- Favor ink-on-parchment contrast: deep navy text on warm paper surfaces.
- Prefer tonal layering to hard borders. If a border is needed, keep it ghost-light.
- Keep radii tight and paper-like. Avoid pill-heavy or soft blob styling.
- Let layouts feel slightly asymmetric and archival rather than perfectly centered card stacks.
- Use grain, stacked-paper, and pinned-note cues sparingly to create tactility.

## Core Tokens

- Background / surface: `#fcf9f0`
- Primary ink: `#041627`
- Secondary sage: `#52634c`
- Tertiary rust: `#2d0800`
- Outline variant: `#c4c6cd`
- Surface low: `#f6f3ea`
- Surface high: `#ebe8df`
- Surface highest: `#e5e2da`

## Component Direction

- Header: editorial masthead with minimal navigation and quiet utility actions.
- Hero: large serif statement plus an evidence-board panel composed from real diary data.
- Workflow beats: numbered editorial rhythm, not generic feature cards.
- Tool map: columnar archive modules using the real `toolLenses` content.
- Setup path: dark ink field with procedural steps and expandable details.
- Library: asymmetric journal cards using the real learning copy.
- Diary: dated archive groups with one featured record and smaller supporting notes.

## Repo Mapping

- Preserve the existing landing route and educational narrative.
- Keep `site-content.ts` and `activity-feed.generated.json` as the content source of truth.
- Use Stitch as a visual specification only; do not paste exported HTML into production code.
