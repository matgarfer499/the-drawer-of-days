# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Phase 6 — The letter envelope (incremental letter):** the placeholder becomes the real sobre. Reasons
  from `content.reasons` are pulled out of a kraft envelope one at a time onto a letter that scrolls *inside*
  its `PaperFrame` (the page never scrolls). The letter writes itself: a reason tagged `unlockedBy` stays a
  pending placeholder — naming the scene that will light it — until that scene has been seen (its id lands in
  the engine's `unlockedReasons` via `recordVisit`), then becomes pullable. The pull/`composeLetter` logic
  (ordering, the available/pending/revealed split, the clamp) is test-driven, and the coupling
  `unlockedBy` ↔ `unlockedReasons` ↔ `unlocksReasonId` is verified against the scene-engine. Each pulled
  reason hand-writes in; reduced motion drops the slide and keeps the ritual. Keeps `morphId="spoke-letter"`.
  Hardened by a multi-lens adversarial review (the emptied pull button now keeps keyboard focus via
  `aria-disabled`, shows a meaningful empty label, and announces completion through a `role="status"` live
  region). 134 tests.
- **Phase 5 — The cassette timeline:** the placeholder scene becomes the real tape. `content.milestones`
  lay along a horizontal, scroll-snapped track you swipe through, each a Polaroid + postmark date + title +
  body tagged Cara A/B. The `CassetteDeck`'s two reels spin with the scroll (`useScroll` → `useTransform`)
  and whirr gold the faster you scrub — the same `cassetteRate` (a tested pure mapping) that phase 8 will
  feed into `AudioEngine.rate()`. A dot `<nav>` jumps between milestones for keyboard/AT users and the tape
  itself is keyboard-focusable; under reduced motion the reels rest still and the snap jumps instead of
  glides. Keeps `morphId="spoke-timeline"`, so it grows from (and shrinks back to) its hub keepsake. The
  postmark, snap-index and scrub-rate logic are test-driven. Hardened by a multi-lens adversarial review
  (glow decay via `useVelocity`, AA contrast on the Cara tag/subtitle/dots, keyboard scrub, object-style
  spoke angles). 125 tests.
- **Phase 4 — The experience comes alive (door, sealed box, hub + morph):** the first three scenes
  wired for real. The Door greets from `@content` and taps to enter (which unlocks audio); the
  SealedBox is a kraft tin whose ribbon bow "breathes" (motion-safe) and opens on a forgiving drag in
  any direction — or a tap; the Hub lays `content.hubObjects` out with a seeded `hubLayout`, veils the
  unopened, sews opened keepsakes together with the red `ThreadLine`, stamps them "Visto", and keeps
  the finale gate and guided tour in a keyboard-navigable `<nav>`. A keepsake morphs into its scene and
  back via a shared `layoutId` (LayoutGroup), with a reduced-motion crossfade fallback. Focus is
  managed across every transition; controls meet the 44px target and honour safe areas. 113 tests.
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
