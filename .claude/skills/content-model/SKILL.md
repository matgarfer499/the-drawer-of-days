---
name: content-model
description: Use when working with the content layer — the Zod schema, adding or changing content slots, wiring placeholders, or dropping in real photos/dates/messages/song. Covers Zod-as-source-of-truth, the core schema shapes, the placeholder strategy, AssetRef with mandatory dimensions, and validate-on-import.
---

## What I do

Keep **Zod the single source of truth** for all content, so the UI is fully decoupled from data and the
real photos/texts/song can be dropped in later **without touching any component**.

## When to use me

- Editing `src/content/schema.ts` or any `src/content/*.ts` data file.
- Adding a new content slot or scene binding.
- Replacing placeholders with real content.

## Rules

- Define schemas in `schema.ts`; **infer** types with `z.infer` — never hand-write the TS types.
- `src/content/index.ts` runs `schema.parse()` on import → invalid content **fails in dev/build** with a
  clear message, never silently at runtime.
- Components receive typed data via props; they **never** read content literals inline.
- **Placeholders ship from day one** (in `src/content/placeholders/`, marked `// TODO: real content`), and
  must satisfy the schema. Placeholder photos use the **same width/height** as the real ones → swapping in
  real assets moves zero pixels (CLS = 0).
- Real personal assets are **gitignored** (public repo); only placeholders (`placeholder-*`, `*.svg`) are committed.

## Core shapes

```ts
Milestone  { id, date: ISODate, title, body, photos: AssetRef[], side?: "A" | "B" }
Reason     { id, order, text, unlockedBy?: SceneId }   // unlockedBy = incremental letter
HubObject  { id, label, scene: SceneId, art: AssetRef, palmSize: boolean }
SkyNode    { id, label, media?: AssetRef, position }
Song       { src, ambientSrc, climaxAt?: number, stems?: { momentId; atSec }[] }
AssetRef   { src, alt, width, height, blurDataURL? }   // width/height REQUIRED; alt in Spanish, REQUIRED
```

## Checklist when adding a slot

- [ ] Add/extend the Zod schema in `schema.ts`; export the inferred type.
- [ ] Add a placeholder in `placeholders/` that parses cleanly.
- [ ] If it's an image, set real `width`/`height` and an `alt` in Spanish.
- [ ] A vitest test parses the whole content tree (red flag if anything fails).
