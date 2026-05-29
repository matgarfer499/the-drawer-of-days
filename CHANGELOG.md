# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

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
