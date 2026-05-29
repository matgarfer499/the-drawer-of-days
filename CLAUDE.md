# CLAUDE.md

Guidance for Claude Code working in **El Cajón de los Días** — an anniversary gift built as a
scene-based, scrapbook-style web *experience* (not a website you scroll). **Mobile-primary.**

## Commands

```bash
pnpm dev         # Vite dev server (http://localhost:5173)
pnpm build       # tsc --noEmit + vite build → dist/
pnpm test        # vitest run (pure logic only — no pixels)
pnpm typecheck   # tsc --noEmit
pnpm check       # biome check (lint + format)
pnpm check:fix   # biome check --write (auto-fix)
```

## Architecture

One screen, **no page scroll**. A **scene state machine** (hub-and-spoke) drives everything: a sealed box →
the open-box **hub** → full-screen scenes → a secret double-bottom **finale**. A hub object *morphs*
(`motion` `layoutId`) into its scene and back. Audio (Howler) and the R3F canvas are **persistent layers**
mounted once in `App`, never remounted per scene — the reason this is a Vite SPA, not an MPA.

- `src/app/` — shell: `App`, `main`, `SceneRouter` (AnimatePresence + URL↔scene sync), global styles.
- `src/scenes/<scene>/` — one folder per full-screen scene. Scenes **never import each other**; they go
  through `features/scene-engine`.
- `src/features/` — cross-cutting mechanics: `scene-engine`, `audio`, `narrative` (incremental letter +
  red thread + "seen" state), `reduced-motion`, `diegetic-index`.
- `src/shared/ui/` — the typed **prop catalogue** (Polaroid, WashiTape, StampPin, …). `src/shared/lib/` —
  `cn`, `seededRotation` (mulberry32), `prefersReducedMotion`.
- `src/content/` — **Zod is the source of truth**: `schema.ts` defines it, `index.ts` parses + validates on
  import. Placeholders live here; real content drops in later **without touching UI**.

## Key conventions

- **Imports:** always use aliases `@app/ @scenes/ @features/ @shared/ @content/ @assets/` — never `../`.
- **Styling = object-style with `tailwind-variants`** (`tv` + base/slots/variants). `cn()` for one-off
  merges only. **No `style={{}}`** — the *only* exception is the seeded per-id transform, injected as a CSS
  variable (`seededTransformVars`) and consumed via `rotate-[var(--seed-rot)]`. Tokens live in `@theme`
  (`src/app/styles/theme.css`).
- **Zustand:** selectors in components (`useStore(s => s.x)`); `getState()` inside `useFrame`. **Never call
  `setState` from inside `useFrame`.**
- **R3F:** lazy + `frameloop="demand"`; allocate `Vector3`/typed arrays in `useRef`, never in `useFrame`.
  R3F is used **only in the finale**.
- **TypeScript:** strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. No `as any` /
  `@ts-ignore`. Types are **inferred from Zod** (`z.infer`), never redefined by hand. `verbatimModuleSyntax`
  is on → use `import type` for type-only imports.

## Experience invariants (what makes it feel like an experience, not a web)

- The page **never scrolls** (`#root` is `100dvh`, `overflow-hidden`). Long text scrolls *inside* a paper frame only.
- **Mobile-primary:** phone first; touch targets ≥44px; honour `safe-area-inset-*`; the hub is its own mobile composition, not a scaled desktop.
- The **close gesture is invariable** across every scene (same control + position; `Escape` and browser back also close).
- **Every scene declares a `prefers-reduced-motion` fallback** (morph→crossfade, finale→static collage, 3D→2D). Reduced motion is first-class, never just "disabled".
- Content is **never an inline literal** — it comes from `@content` (Zod-validated).
- Audio is a **singleton** unlocked by the open-the-box gesture; never autoplay; mute is always reachable.

## Context7 MCP

**Always use Context7 before writing code that touches a library API** (React, motion, R3F/three, Zustand,
Howler, Tailwind, Zod, Vite). Do not rely on training-data signatures — versions move fast. Requires
`CONTEXT7_API_KEY` in your environment (see `.env.example`); the token is never committed.

## Skills (`.claude/skills/`)

| Skill | When to invoke |
|---|---|
| `scene-architecture` | Adding or changing a scene, the scene-engine, transitions, URL sync, the close gesture |
| `scrapbook-design`   | Visual work: `@theme` tokens, the `tv` prop catalogue, seeded imperfection |
| `content-model`      | The Zod content schema, adding content slots, dropping in real content |
| `audio-howler`       | The AudioEngine singleton, gesture unlock, cassette pitch, the finale song |
| `r3f-paper-sky`      | The finale R3F scene, frameloop, the reduced-motion 2D fallback |
