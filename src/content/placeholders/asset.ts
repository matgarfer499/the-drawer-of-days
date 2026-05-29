import type { AssetRef } from "@content/schema";

// Palette hex mirroring the @theme tokens. A placeholder image is asset CONTENT,
// the one place a raw colour belongs — it literally has to draw the picture.
const CREAM = "#f4ecdd";
const KRAFT = "#d8c3a0";
const INK = "#6b5b4d";

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface PlaceholderImageOptions {
  width: number;
  height: number;
  /** short label drawn on the card, e.g. "polaroid" */
  label: string;
  /** Spanish alt text for the real slot (a11y) */
  alt: string;
}

/**
 * A renderable placeholder photo: a labelled cream card with a kraft dashed
 * border, encoded as an inline SVG data URI. Real assets replace these later with
 * the SAME width/height, so dropping them in shifts nothing on screen (CLS = 0).
 */
export function placeholderImage({ width, height, label, alt }: PlaceholderImageOptions): AssetRef {
  const fontSize = Math.max(12, Math.round(Math.min(width, height) / 12));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="100%" height="100%" fill="${CREAM}"/>` +
    `<rect x="6" y="6" width="${width - 12}" height="${height - 12}" fill="none" stroke="${KRAFT}" stroke-width="3" stroke-dasharray="10 8"/>` +
    `<text x="50%" y="50%" fill="${INK}" font-family="Georgia, serif" font-size="${fontSize}" text-anchor="middle">${esc(label)}</text>` +
    `<text x="50%" y="50%" dy="${fontSize + 6}" fill="${INK}" font-family="Georgia, serif" font-size="${Math.round(fontSize * 0.72)}" text-anchor="middle" opacity="0.7">${width}×${height}</text>` +
    `</svg>`;
  return {
    src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    alt,
    width,
    height,
  };
}
