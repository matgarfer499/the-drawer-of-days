# El Cajón de los Días 🎁

*An anniversary gift you open like a keepsake tin — a scene-based, scrapbook-style web experience.
Not a website you scroll; a box you open.*

> A third-anniversary gift, and a small showcase of clean front-end craft. The real photos, dates,
> messages and song are **private and never committed** — the repo ships with placeholders only.

## The idea

You don't scroll a page; you open a tin tied with a ribbon. Pull the ribbon (which quietly unlocks the
sound) and the box opens into a **hub** of keepsake objects stitched together by a red thread. Each object
*morphs* full-screen into its own scene:

- 🎞️ a cassette → **the timeline** of our story (swipe through it; the tape "rewinds" with the sound),
- ✉️ an envelope → **reasons I love you**, drawn out one by one (and written as you live the rest),
- ✨ a paper sky → an **interactive** constellation of our places.

A hidden double bottom turns the box into a hand-cut paper planetarium for the finale, where the song
finally plays — and leaves one empty frame reserved for *our next chapter*.

Built **mobile-first**: it's meant to be opened on a phone, anywhere.

## Tech

Vite + React 19 SPA · TypeScript (strict) · Tailwind CSS v4 with `tailwind-variants` (object-style) ·
`motion` (shared-layout morphs) · Zustand (scene state machine) · `@react-three/fiber` (finale only) ·
Howler (audio) · Zod (content as the single source of truth). Tooling: Biome + lefthook, Vitest, CI on
GitHub Actions. Deploys to Vercel.

See **[`ROADMAP.md`](./ROADMAP.md)** for the full concept, design system and phase plan, and
**[`CLAUDE.md`](./CLAUDE.md)** for architecture conventions.

## Commands

```bash
pnpm install
pnpm dev         # dev server (http://localhost:5173)
pnpm build       # typecheck + production build → dist/
pnpm test        # vitest
pnpm typecheck
pnpm check       # biome lint + format
```

## Content & privacy

All content lives in `src/content/` as typed, Zod-validated data with placeholders. Dropping in the real
photos / dates / messages / song means editing those files and adding files under `src/assets/` — **no UI
changes**. Personal media is `.gitignore`d; only placeholders are tracked. The deployed gift is a private,
non-indexed link.

## License

[MIT](./LICENSE) for the code. Personal photos, texts and audio are **not** included or licensed.
