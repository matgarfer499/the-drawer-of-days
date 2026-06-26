import type { PlaylistTrack } from "./schema";

// The three songs in the global music player (the dynamic island).
//
// COPYRIGHT / PRIVACY: the MP3s and album art are NOT bundled and NOT committed
// (the repo is public). Their URLs are injected at runtime from env vars
// (`VITE_SONG_n_URL` / `VITE_SONG_n_ART_URL`) pointing at Vercel Blob. Access them
// with STATIC keys only — Vite inlines `import.meta.env.VITE_*` at build time, but
// only for literal keys. When a var is absent the value is "", which drops the
// track (or its cover) so the island stays hidden/silent — the placeholder era.
//
// Titles/artists are not secret and live here as the source of truth.
export const playlist: PlaylistTrack[] = [
  {
    id: "die-hard",
    title: "Die Hard",
    artist: "Kendrick Lamar",
    src: import.meta.env.VITE_SONG_1_URL ?? "",
    art: import.meta.env.VITE_SONG_1_ART_URL ?? "",
    artAlt: "Portada de Die Hard, de Kendrick Lamar",
  },
  {
    id: "birds-of-a-feather",
    title: "Birds of a feather",
    artist: "Billie Eilish",
    src: import.meta.env.VITE_SONG_2_URL ?? "",
    art: import.meta.env.VITE_SONG_2_ART_URL ?? "",
    artAlt: "Portada de Birds of a feather, de Billie Eilish",
  },
  {
    id: "volver",
    title: "VOLVER",
    artist: "Tainy, Rauw Alejandro, Skrillex, Four Tet",
    src: import.meta.env.VITE_SONG_3_URL ?? "",
    art: import.meta.env.VITE_SONG_3_ART_URL ?? "",
    artAlt: "Portada de VOLVER, de Tainy, Rauw Alejandro, Skrillex y Four Tet",
  },
];
