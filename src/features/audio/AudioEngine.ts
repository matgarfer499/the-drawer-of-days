import { Howl, Howler } from "howler";
import {
  nextIndex,
  type PlayableTrack,
  type PlaylistTrackInput,
  prevIndex,
  resolvePlaylist,
} from "./playlist";
import { resolveAudioSrc } from "./resolveAudioSrc";

/**
 * The single AudioEngine (Howler). One instance, mounted once via the App shell
 * (the MusicIsland), so sound never restarts between scenes. Everything degrades
 * to silence when the audio files aren't bundled/hosted yet or when the platform
 * has no audio — the whole experience works muted.
 *
 * Layers, foreground to background:
 *  - the **playlist** the user drives from the dynamic island (streamed from
 *    Vercel Blob; it autostarts when the box opens — a user gesture, so this is
 *    permitted autoplay, not a forced one);
 *  - a near-inaudible **ambient loop** that starts on the open-the-box gesture and
 *    DUCKS to silence while a song plays (the cassette swipe bends its rate);
 *  - the reserved **finale song**, which fades in and takes over only in the
 *    finale — the playlist yields to it so the two never overlap.
 */

// Bundled assets: the ambient loop / finale song live in src/assets/audio (and,
// for dev, optionally the playlist songs by basename). Playlist URLs in prod are
// absolute (Vercel Blob) and bypass this glob entirely.
const bundled = import.meta.glob("/src/assets/audio/*.{mp3,ogg,webm}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byBasename: Record<string, string> = {};
for (const [path, url] of Object.entries(bundled)) {
  const base = path.split("/").pop();
  if (base) byBasename[base] = url;
}

const AMBIENT_VOLUME = 0.35;
const SONG_VOLUME = 0.8;

/** What React reads to render the island. A new object is published on every
 *  change so `useSyncExternalStore` re-renders; the reference is otherwise stable. */
export interface PlaylistSnapshot {
  readonly tracks: readonly PlayableTrack[];
  readonly index: number;
  readonly playing: boolean;
}

const EMPTY_SNAPSHOT: PlaylistSnapshot = { tracks: [], index: 0, playing: false };

class AudioEngine {
  private ambient: Howl | null = null;
  private song: Howl | null = null;
  private finaleStarted = false;
  private muted = false;

  // ── playlist (the dynamic island) ──────────────────────────────────────────
  private playlist: readonly PlayableTrack[] = [];
  private howl: Howl | null = null;
  private index = 0;
  private playing = false;
  private playlistLoaded = false;
  private playbackStarted = false;
  private listeners = new Set<() => void>();
  private snapshot: PlaylistSnapshot = EMPTY_SNAPSHOT;

  /** Resume the audio context — must run inside a user gesture (the box opening). */
  unlock(): void {
    const ctx = Howler.ctx;
    if (ctx?.state === "suspended") void ctx.resume();
  }

  /** Start the near-inaudible ambient loop (once). No-op without its asset. */
  startAmbient(contentPath: string): void {
    if (this.ambient) return;
    const src = resolveAudioSrc(contentPath, byBasename);
    if (!src) return;
    this.ambient = new Howl({ src: [src], loop: true, volume: 0, onloaderror: () => {} });
    this.ambient.play();
    this.ambient.fade(0, this.playing ? 0 : AMBIENT_VOLUME, 1200);
  }

  /**
   * The finale: fade the ambient down and let the song lead — ONCE. The finale is
   * re-entrable (browser back/forward), and the song must never restart from the
   * top, so the whole handover is guarded. No-op without the asset.
   */
  enterFinale(contentPath: string): void {
    if (this.finaleStarted) return;
    this.finaleStarted = true;
    const src = resolveAudioSrc(contentPath, byBasename);
    // No reserved finale song configured → leave the playlist (and ambient) as they
    // are, so the music carries through the finale instead of cutting to silence.
    if (!src) return;
    // A reserved song exists → the user's playlist yields to it (never two at once).
    if (this.howl && this.playing) {
      this.howl.pause();
      this.playing = false;
      this.emit();
    }
    if (this.ambient) this.ambient.fade(this.ambient.volume(), 0, 1500);
    this.song = new Howl({ src: [src], html5: true, volume: 0, onloaderror: () => {} });
    this.song.play();
    this.song.fade(0, SONG_VOLUME, 2000);
  }

  /** Bend the ambient's pitch with the cassette swipe (0.5–4.0). */
  setCassetteRate(rate: number): void {
    this.ambient?.rate(rate);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    Howler.mute(muted);
  }

  isMuted(): boolean {
    return this.muted;
  }

  // ── playlist API (driven by the dynamic island) ────────────────────────────

  /** Resolve and store the playlist (once). Empty resolution (URLs absent) leaves
   *  the island hidden/silent. Does not play — `startPlaylist` does that. */
  loadPlaylist(tracks: readonly PlaylistTrackInput[]): void {
    if (this.playlistLoaded) return;
    this.playlistLoaded = true;
    this.playlist = resolvePlaylist(tracks, byBasename);
    this.emit();
  }

  /** Start the playlist from the top — ONCE — when the box opens. The box-open is
   *  a user gesture, so this is permitted autoplay. No-op if already started (e.g.
   *  returning to the hub from a scene) or if there's nothing to play. */
  startPlaylist(): void {
    if (this.playbackStarted || this.playlist.length === 0) return;
    this.playbackStarted = true;
    this.playTrack(0);
  }

  /** Play a specific track, replacing whatever was playing. Streams via html5. */
  playTrack(index: number): void {
    const track = this.playlist[index];
    if (!track) return;
    this.index = index;
    this.howl?.unload();
    this.howl = new Howl({
      src: [track.src],
      html5: true,
      volume: SONG_VOLUME,
      onend: () => this.next(),
      onloaderror: () => {},
      onplayerror: () => {},
    });
    this.howl.play();
    this.playing = true;
    this.duckAmbient(true);
    this.emit();
  }

  /** Play/pause the current track (starting the first one on first play). */
  togglePlay(): void {
    if (this.playlist.length === 0) return;
    if (!this.howl) {
      this.playTrack(this.index);
      return;
    }
    if (this.playing) {
      this.howl.pause();
      this.playing = false;
      this.duckAmbient(false);
    } else {
      this.howl.play();
      this.playing = true;
      this.duckAmbient(true);
    }
    this.emit();
  }

  /** Next track, wrapping around. */
  next(): void {
    if (this.playlist.length === 0) return;
    this.playTrack(nextIndex(this.index, this.playlist.length));
  }

  /** Previous track, wrapping around. */
  prev(): void {
    if (this.playlist.length === 0) return;
    this.playTrack(prevIndex(this.index, this.playlist.length));
  }

  /** React subscription for the island (useSyncExternalStore). */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): PlaylistSnapshot => this.snapshot;

  /** Duck the ambient hiss under a playing song, restore it when paused — but not
   *  during the finale, where the reserved song owns the mix. */
  private duckAmbient(ducked: boolean): void {
    if (!this.ambient || this.finaleStarted) return;
    this.ambient.fade(this.ambient.volume(), ducked ? 0 : AMBIENT_VOLUME, 800);
  }

  private emit(): void {
    this.snapshot = { tracks: this.playlist, index: this.index, playing: this.playing };
    for (const listener of this.listeners) listener();
  }
}

/** The one engine instance for the whole app. */
export const audioEngine = new AudioEngine();
