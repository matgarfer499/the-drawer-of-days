---
name: scene-architecture
description: Use when adding or changing a scene, the scene-engine, scene transitions, URL↔scene sync, or the close gesture. Covers the scene-engine contract, the SceneId/SceneDef types, the guarded transition table, the invariable close gesture, the reduced-motion fallback requirement, and a checklist for adding a scene.
---

## What I do

Keep the experience a **scene state machine**, not a scrolling page. Guard scene transitions, the
invariable close gesture, URL sync, and the reduced-motion fallback contract.

## When to use me

- Adding a new full-screen scene under `src/scenes/<scene>/`.
- Changing the scene-engine, the transition rules, or the "show me everything" tour.
- Touching URL↔scene sync or the close gesture.

## The model

Hub-and-spoke. `door → seal → hub ⇄ {timeline, letter, sky, …optional} → (gate) finale`.

- **One active scene at a time.** The hub stays mounted (blurred/scaled) beneath the active scene so the
  `layoutId` morph back is continuous.
- **Close is invariable:** same control + position in every scene; `Escape` and browser back also close.
  Closing returns to the hub, marks the scene seen, and may unlock a letter reason (incremental letter).
- **URL reflects state** (`?scene=timeline`) via History API for resume/share; back = close.
- **Finale is gated:** only reachable once the core scenes are seen (`finaleUnlocked`).

## Contract

```ts
type SceneId = "door" | "seal" | "hub" | "timeline" | "letter" | "sky" | "finale" | (string & {});

interface SceneDef {
  id: SceneId;
  bookmarkLabel: string;        // diegetic index entry
  unlocksReasonId?: ReasonId;   // closing this scene lights a letter reason
  Component: React.LazyExoticComponent<React.ComponentType>;
  Fallback: React.ComponentType; // REQUIRED prefers-reduced-motion fallback
}
```

- The store (`useExperienceStore`, Zustand) owns `activeScene`, `visitedScenes`, `unlockedReasons`,
  `finaleUnlocked`, `audioUnlocked`, `reducedMotion`. Transitions are **guarded** (no illegal jumps):
  `openBox`, `enterScene`, `closeScene`, `unlockReason`, `enterFinale`, tour actions.
- Scenes are **lazy** (`React.lazy`) so each is its own chunk; the R3F chunk loads only with the finale.
- Scenes never import each other — they register a `SceneDef`.

## Checklist for a new scene

- [ ] Folder `src/scenes/<scene>/` with `index.tsx`, `components/`, `content-binding.ts`, `*.test.ts`.
- [ ] Register a `SceneDef` (id, bookmark label, optional `unlocksReasonId`, lazy `Component`, `Fallback`).
- [ ] Reads content from `@content` (Zod), never inline literals.
- [ ] Uses the shared close control; never invents its own.
- [ ] Declares a real `prefers-reduced-motion` fallback (not just "no animation").
- [ ] Mobile-first layout; touch targets ≥44px; respects `safe-area-inset-*`.
- [ ] Transition reducers covered by a vitest unit test.
