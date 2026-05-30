# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- **Phase 9 — Polish (a11y / perf / responsive / QA):** a holistic pass over the whole app. Haptics — a
  guarded `vibrate()` (test-driven, no-ops without support) buzzes at the tactile beats (door, ribbon untie,
  opening a keepsake, the secret finale). A global `prefers-reduced-motion` CSS safety net neutralises any
  stray animation on top of each scene's own fallback. Accessibility, from a multi-lens audit: every scene
  now exposes its own `<h1>` (no more skipped levels or headingless entry screens), the scene region is a
  `<main>` landmark, the mute control no longer double-announces state, and a completed constellation's name
  is spoken (its drawn line is decorative). Content: scene titles/taglines and the finale label move into
  `@content` (no more inline literals) and the unused `herName` slot is dropped. Responsive: cassette panels
  and the finale column scroll inside themselves on short/landscape phones instead of clipping, and hub
  keepsakes keep clear of the bottom controls. `index.html` gains a description and theme-color. Font subsets
  are already `unicode-range`-gated (only latin downloads), so no trim was needed; lazy-loading the morphing
  spoke scenes was deferred (it would risk the unverifiable `layoutId` morph for a modest saving — the heavy
  WebGL chunk is already split). 159 tests.

### Added

- **Phase 8 — The double-bottom finale (R3F + song):** the secret compartment. Our polaroids lift into the
  paper sky and settle (DOM polaroids with real alt text, risen via motion and seeded by `ascendingLayout`),
  the thesis line from `@content` glows in, and a frame is left deliberately empty — the promise, "our next
  chapter". Behind it all is the project's **only WebGL**: a lazy R3F field of phosphorescent paper stars
  with a contained bloom, in its own chunk that never ships on first paint (the persistent `CanvasLayer`
  mounts it only in the finale under full motion; a new `SceneFrame` `bare` option lets it show through; an
  error boundary degrades to a night surface if the chunk fails). Sound is the single Howler **`AudioEngine`**
  — the open-the-box gesture resumes the context and starts a near-inaudible ambient loop, the finale fades
  it down and lets the reserved song lead, the cassette swipe bends the rate, and an always-reachable mute
  control is the only audio chrome. It degrades to silence until the real MP3s land (`resolveAudioSrc`,
  test-driven), so the experience works muted. Reduced motion is a complete 2D finale with no WebGL and no
  audio. Hardened by a multi-lens review (frameloop→demand, idempotent song handover, in-gesture unlock, AA
  contrast, reading order, the promise label modelled in content, and the WebGL error boundary). 156 tests.
- **Phase 7 — The paper sky (playful 2D zone):** the placeholder becomes the constellation game.
  `content.sky.nodes` are cut-out stars pinned to a night-paper ground by their coordinates; tapping a star
  lights (or dims) it and emerges its photo as a polaroid. Light every star of a constellation and its line
  is drawn (an SVG `polyline` traced with `pathLength`); light them all and the hidden `revealMessage` is
  traced. Joining is forgiving by design — there is no wrong move and nothing is required (no frustrating
  puzzle). The completion logic (`isConstellationComplete`, `skyProgress`, `constellationPoints`) is
  test-driven. Reduced motion rests the twinkle and draws the lines/message statically. Keeps
  `morphId="spoke-sky"`. Hardened by a multi-lens adversarial review (persistent `role="status"` live regions
  announce the climax and each emerged place, the reveal overlay no longer blocks taps, and a lit star now
  carries a filled-vs-outline non-colour cue). 144 tests.
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
