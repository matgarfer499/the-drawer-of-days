---
name: scrapbook-design
description: Use for any visual or styling work — defining @theme tokens, building or styling components and prop primitives, applying the tailwind-variants object-style pattern, or adding deterministic handmade imperfection. Covers the palette/typography tokens, the tv() convention, the seededTransform CSS-variable rule, and the warm-paper material language.
---

## What I do

Keep the look **nostalgic / scrapbook** (paper, polaroids, washi tape, handwriting) and the styling code
**clean and object-style**. Enforce the `tailwind-variants` convention and deterministic imperfection.

## When to use me

- Building or restyling any component, especially `shared/ui` prop primitives.
- Adding or changing `@theme` tokens (colours, fonts, shadows).
- Anything involving rotation/tilt/offset of props ("handmade" feel).

## Styling rules (non-negotiable)

- **Every component declares classes with `tv({...})`** (base · `slots` · `variants` · `compoundVariants`
  · `defaultVariants`). No long Tailwind strings inline in JSX. `cn()` only for one-off prop merges.
- **No `style={{}}`** — the single exception is the seeded per-id transform, injected via
  `seededTransformVars(id)` as CSS variables and consumed with arbitrary values:
  `className="rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]"`.
- Tokens only — never raw hex in components. Add new tokens to `src/app/styles/theme.css` `@theme`.
- All animation is `motion-safe`; pair every motion with a `prefers-reduced-motion` resting state.

## Tokens (already in `@theme`)

- **Colours:** `paper-cream` (base, never pure white), `kraft-tan`, `aged-tan`, `ink-sepia` (text, never
  `#000`), `faded-ink`, `faded-rose` (the red thread / accent), `rose-deep` (hover/focus), `sage-dust`,
  `dusty-teal`, `golden-hour` (glow), `night-paper` (finale sky), `silver-pen`.
- **Fonts:** `font-display` (Fraunces), `font-hand` (Caveat), `font-body` (Nunito Sans).
- **Shadows:** `shadow-paper`, `shadow-paper-lifted` (warm, never grey/black).

## Material language

Paper grain (low-opacity multiply), torn edges via SVG masks (`feTurbulence`), warm double-layer shadows,
inset shadow inside the open box. Prop primitives: `Polaroid`, `WashiTape`, `StampPin`, `PostmarkDate`,
`TornEdge`, `ThreadLine`, `PaperFrame`. Each derives its imperfection from its `id` via `seededTransform`
(mulberry32) — stable across renders.

## Accessibility

WCAG AA contrast (body text uses `ink-sepia`/`faded-ink` on `paper-cream`; finale uses `silver-pen` on
`night-paper`). Handwriting is decorative: keep a legible text equivalent. Visible, warm focus rings.
