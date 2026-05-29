# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Phase 3 — Content model + placeholders:** `content/schema.ts` makes Zod the single source of
  truth — every type is inferred (`z.infer`), `alt` is mandatory on every image and width/height are
  required (CLS = 0), and the tree's refinements enforce unique ids and live constellation→node
  references. `content/index.ts` parses the whole tree on import (fail-fast); the `content/*.ts` files
  hold themed Spanish placeholders, and `placeholderImage()` renders labelled SVG cards so every slot
  shows something before real assets exist. The spoke enum and the incremental-letter reasons are kept
  in sync with the scene-engine by tests. Real content drops in here without touching the UI. Hardened
  by a multi-lens review (constellation id uniqueness, the `unlockedBy` reverse link, the audio path
  convention). 92 tests.
- **Phase 2 — Scrapbook design system + prop catalogue:** the typed, object-style
  (`tailwind-variants`) prop primitives in `shared/ui` — `Polaroid`, `WashiTape`, `StampPin`,
  `PostmarkDate`, `TornEdge`, `ThreadLine`, `PaperFrame` — each carrying deterministic handmade
  imperfection (the seeded `--seed-*` CSS vars) and accessibility by default: required `alt`,
  decorative props hidden from assistive tech, meaningful ones given an accessible name, dates as
  `<time>`. Adds the shared `#paper-tear` SVG filter (`ScrapbookDefs`, mounted once in `App`), the
  `stitchPath` red-thread geometry helper, the `--shadow-tape` and `--text-stamp` tokens, and a
  `@shared/ui` barrel. Hardened by a multi-lens adversarial review (stamp-glyph contrast in
  low-contrast tones, non-scaling thread stroke, single-line caption guard). 70 tests.
- **Phase 1 — Experience engine:** a guarded, hub-and-spoke scene state machine
  (door → sealed box → hub ⇄ scenes → gated finale) with a Zustand store and pure
  selectors (red thread, finale gate, core progress), two-way URL↔scene sync, and
  the React shell — `SceneRouter` (AnimatePresence), placeholder scenes for every
  node, a single invariable `CloseControl` (Escape included), persistent
  audio/canvas layers, and `prefers-reduced-motion`-aware transitions. 43 tests.
- **Phase 0 — Project foundations:** Vite 8 + React 19 + TypeScript (strict) scaffold; Tailwind CSS v4
  with `@theme` scrapbook tokens and `tailwind-variants`; Biome + lefthook; Vitest; feature-based folders
  with path aliases; CI (Biome + tsc + Vitest); Vercel SPA config; `CLAUDE.md`, project skills, and
  Context7 MCP config.
- `cn()` helper and the seeded-imperfection utilities (`mulberry32`, `hashId`, `seededTransform`,
  `seededTransformVars`) in `shared/lib`, with unit tests.
