/** Already a fetchable URL (a Vercel Blob playlist track) — not a bundled asset. */
const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Resolve a content audio path to a real, playable source. Two cases:
 *
 * - An **absolute http(s) URL** (a playlist song hosted on Vercel Blob, injected
 *   from env) passes straight through to be streamed (`html5: true`) — never
 *   bundled, never committed.
 * - Otherwise a `@assets/audio/…` path is matched **by basename** to its bundled
 *   URL (the ambient loop / finale song). Returns null when the file isn't in the
 *   bundle — the placeholder era — so the engine simply stays silent. Pure.
 */
export function resolveAudioSrc(
  contentPath: string,
  byBasename: Readonly<Record<string, string>>,
): string | null {
  if (ABSOLUTE_URL.test(contentPath)) return contentPath;
  const basename = contentPath.split("/").pop();
  if (!basename) return null;
  return byBasename[basename] ?? null;
}
