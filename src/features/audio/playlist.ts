import { resolveAudioSrc } from "./resolveAudioSrc";

/**
 * Pure playlist helpers — the wrap-around index math and the resolution of
 * content tracks into playable ones. Kept free of Howler/React so they unit-test
 * without a browser (the engine and island consume them).
 */

/** A content track as it arrives from `@content` (audio + art URLs from env). */
export interface PlaylistTrackInput {
  id: string;
  title: string;
  artist: string;
  /** absolute Blob URL (prod) or a bundled basename (dev); empty ⇒ absent */
  src: string;
  /** absolute Blob URL for the cover; empty ⇒ no cover */
  art: string;
  artAlt: string;
}

/** A track with a confirmed-playable source, ready for the engine + island. */
export interface PlayableTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  art: string | null;
  artAlt: string;
}

/** Next track, wrapping the last back to the first. */
export function nextIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index + 1) % length;
}

/** Previous track, wrapping the first back to the last. */
export function prevIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index - 1 + length) % length;
}

/**
 * Resolve content tracks to playable ones: pass absolute URLs through (streamed),
 * match bundled basenames against the dev bundle, drop any track with no playable
 * audio (its env URL absent), and null an absent cover. An empty result ⇒ the
 * island stays hidden/silent, matching the placeholder behaviour.
 */
export function resolvePlaylist(
  tracks: readonly PlaylistTrackInput[],
  byBasename: Readonly<Record<string, string>>,
): PlayableTrack[] {
  const playable: PlayableTrack[] = [];
  for (const track of tracks) {
    const src = resolveAudioSrc(track.src, byBasename);
    if (!src) continue;
    playable.push({
      id: track.id,
      title: track.title,
      artist: track.artist,
      src,
      art: track.art ? track.art : null,
      artAlt: track.artAlt,
    });
  }
  return playable;
}
