import { placeholderImage } from "./placeholders/asset";
import type { AssetRef } from "./schema";

/**
 * Real personal photos live (gitignored) under `src/assets/photos/<scene>/`. Vite bundles
 * each one as a hashed URL via `?url`; dimensions are NOT derived from the file, so every
 * caller passes the true pixel `width`/`height` (mandatory in the schema → CLS = 0).
 *
 * The map is keyed by full path (not basename) because names collide across scenes
 * (e.g. `beach.webp` exists in both `timeline/` and `sky/`).
 */
const bundled = import.meta.glob("/src/assets/photos/**/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

interface LocalPhotoOptions {
  /** path under `src/assets/photos`, e.g. `"timeline/beginning.webp"` */
  path: string;
  /** Spanish alt text (a11y), REQUIRED */
  alt: string;
  width: number;
  height: number;
}

/**
 * Resolve a real local photo to an `AssetRef`. If the file is absent (fresh clone / CI —
 * real media is gitignored), fall back to a placeholder of the SAME size so the build and
 * tests stay green and the layout never shifts, exactly as the audio engine stays silent
 * when its files are missing.
 */
export function localPhoto({ path, alt, width, height }: LocalPhotoOptions): AssetRef {
  const url = bundled[`/src/assets/photos/${path}`];
  if (!url) return placeholderImage({ width, height, label: path, alt });
  return { src: url, alt, width, height };
}
