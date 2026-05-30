/**
 * Map a content audio path (e.g. `@assets/audio/our-song.mp3`) to its real,
 * bundled URL by basename. Returns null when the file isn't in the bundle — which
 * is the whole placeholder era, so the AudioEngine simply stays silent until the
 * real MP3s are dropped into `src/assets/audio` (no code change needed then). Pure.
 */
export function resolveAudioSrc(
  contentPath: string,
  byBasename: Readonly<Record<string, string>>,
): string | null {
  const basename = contentPath.split("/").pop();
  if (!basename) return null;
  return byBasename[basename] ?? null;
}
