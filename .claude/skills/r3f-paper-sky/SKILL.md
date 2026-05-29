---
name: r3f-paper-sky
description: Use when working on the finale's react-three-fiber scene (the paper sky / double-bottom planetarium) — the lazy WebGL chunk, frameloop policy, allocating Three objects, reading the store in useFrame, contained bloom for the phosphorescent glow, and the mandatory reduced-motion 2D fallback. R3F is used ONLY here.
---

## What I do

Keep WebGL **confined to the finale** and cheap on mobile, with a real 2D fallback. R3F appears nowhere
else in the app.

## When to use me

- Building or changing `src/scenes/finale-double-bottom/` 3D content.
- Anything importing `@react-three/fiber`, `three`, `drei`, or `postprocessing`.

## Rules

- **Lazy + isolated chunk:** the finale (and its Three/R3F imports) is `React.lazy` under `<Suspense>`, so
  the WebGL bundle downloads only when the finale opens. It must not load on initial paint.
- **`frameloop="demand"`** by default; switch to `"always"` only during the song swell, then back.
- **No per-frame allocation:** create `Vector3`/typed arrays once in `useRef`; never inside `useFrame`.
- **Read state imperatively in the loop:** `useExperienceStore.getState()` inside `useFrame`. Never
  `setState` from `useFrame`.
- **Mobile budget:** cap `dpr` (~2), fewer particles/instances on coarse pointers; detect low-end → fall
  back to 2D.
- **Aesthetic:** hand-cut paper sky (pins, glitter, phosphorescent stickers, silver-pen wobble), NOT
  digital starfield. Bloom is **contained** (postprocessing) for the glow only — avoid the sci-fi cliché.
  Positions/wobble derive from `seededTransform` (mulberry32).

## Reduced motion (required)

With `prefers-reduced-motion`, the finale degrades to a **static hand-cut collage** with gentle fades — the
ascending polaroids and bloom stop, the message and the "promise" slot remain. Provide this as the scene's
`Fallback` component; never ship the 3D scene without it.
