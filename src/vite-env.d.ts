/// <reference types="vite/client" />

/**
 * Playlist asset URLs, injected at build time from env (Vercel Blob). Optional so
 * the app type-checks and runs when they're absent (island hidden/silent). NEVER
 * committed — set in `.env.local` (dev) and the Vercel dashboard (prod/preview).
 */
interface ImportMetaEnv {
  readonly VITE_SONG_1_URL?: string;
  readonly VITE_SONG_2_URL?: string;
  readonly VITE_SONG_3_URL?: string;
  readonly VITE_SONG_1_ART_URL?: string;
  readonly VITE_SONG_2_ART_URL?: string;
  readonly VITE_SONG_3_ART_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
