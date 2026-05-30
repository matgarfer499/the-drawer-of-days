import { Howl, Howler } from "howler";
import { resolveAudioSrc } from "./resolveAudioSrc";

/**
 * The single AudioEngine (Howler). One instance, owned by the persistent
 * AudioLayer, so sound never restarts between scenes. Everything degrades to
 * silence when the audio files aren't bundled yet (the placeholder era) or when
 * the platform has no audio — the whole experience works muted.
 *
 * Layers: a near-inaudible ambient loop starts on the open-the-box gesture; the
 * reserved song fades in and takes over only in the finale; the cassette swipe
 * bends the ambient's playback rate.
 */

// Real audio drops into src/assets/audio at phase 10; today this is empty, so
// every resolve returns null and the engine stays silent.
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

class AudioEngine {
  private ambient: Howl | null = null;
  private song: Howl | null = null;
  private finaleStarted = false;
  private muted = false;

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
    this.ambient.fade(0, AMBIENT_VOLUME, 1200);
  }

  /**
   * The finale: fade the ambient down and let the song lead — ONCE. The finale is
   * re-entrable (browser back/forward), and the song must never restart from the
   * top, so the whole handover is guarded. No-op without the asset.
   */
  enterFinale(contentPath: string): void {
    if (this.finaleStarted) return;
    this.finaleStarted = true;
    if (this.ambient) this.ambient.fade(this.ambient.volume(), 0, 1500);
    const src = resolveAudioSrc(contentPath, byBasename);
    if (!src) return;
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
}

/** The one engine instance for the whole app. */
export const audioEngine = new AudioEngine();
