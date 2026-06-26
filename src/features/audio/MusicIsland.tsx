import { useReducedMotion } from "@features/reduced-motion";
import { motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { audioEngine } from "./AudioEngine";
import type { PlayableTrack } from "./playlist";
import { useAudio } from "./useAudio";
import { usePlaylist } from "./usePlaylist";

/** mini = a tiny album thumbnail with the now-playing bars; expanded = controls. */
type IslandMode = "mini" | "expanded";

const island = tv({
  slots: {
    root: "pointer-events-none fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-50 flex flex-col items-end",
    shell:
      "pointer-events-auto flex flex-col overflow-hidden rounded-3xl bg-paper-cream/90 text-ink-sepia shadow-paper backdrop-blur-sm",
    miniBtn:
      "relative block shrink-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    cover: "block shrink-0 rounded-xl object-cover",
    coverFallback:
      "grid shrink-0 place-items-center rounded-xl bg-kraft-tan/70 text-rose-deep leading-none",
    // the "now playing" equalizer, laid over the thumbnail
    eq: "pointer-events-none absolute inset-0 flex items-end justify-center gap-[3px] rounded-xl bg-ink-sepia/40 p-2.5",
    eqBar: "w-[3px] origin-bottom rounded-full bg-paper-cream",
    header: "flex items-center gap-2",
    meta: "flex min-w-0 flex-1 flex-col leading-tight",
    title: "truncate font-display text-sm",
    artist: "truncate font-hand text-xs text-faded-ink",
    chip: "grid size-11 shrink-0 place-items-center rounded-full text-faded-ink motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    controls: "flex items-center justify-center gap-4",
    iconBtn:
      "grid size-11 place-items-center rounded-full text-ink-sepia motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    playBtn:
      "grid size-12 place-items-center rounded-full bg-faded-rose text-paper-cream shadow-paper motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    dots: "flex items-center justify-center gap-1.5",
    pip: "h-1.5 rounded-full bg-ink-sepia/25 transition-all",
  },
  variants: {
    mode: {
      mini: { shell: "p-1" },
      expanded: { shell: "w-[min(17rem,calc(100vw-5rem))] gap-2 p-3" },
    },
  },
});

/** Album cover, or a warm fallback glyph when the art URL is absent. */
function Cover({ track, size }: { track: PlayableTrack; size: string }) {
  const { cover, coverFallback } = island();
  if (track.art) {
    return (
      <img src={track.art} alt={track.artAlt} className={cover({ class: size })} loading="lazy" />
    );
  }
  return (
    <span className={coverFallback({ class: size })} aria-hidden="true">
      ♪
    </span>
  );
}

/** The typical "now playing" equalizer — three bars that dance while a track
 *  plays and rest (flat) when paused or under prefers-reduced-motion. */
function Equalizer({ active }: { active: boolean }) {
  const { eq, eqBar } = island();
  return (
    <span className={eq()} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={eqBar({ class: "h-4" })}
          animate={active ? { scaleY: [0.3, 1, 0.45, 0.85, 0.35] } : { scaleY: 0.35 }}
          transition={
            active
              ? {
                  duration: 0.9,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </span>
  );
}

function MuteIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path
          d="M16 9.5a3.5 3.5 0 010 5M18.5 7a7 7 0 010 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

/**
 * The global music player — an iOS-style "dynamic island" pinned top-right (where
 * the old mute control sat), living in the App shell so it survives every scene
 * change. Its resting state is a tiny album thumbnail crowned with the now-playing
 * equalizer; tapping it expands to prev / play-pause / next over a wrap-around
 * playlist, plus the always-reachable mute toggle. The music autostarts when the
 * box opens. Under prefers-reduced-motion the size morph and the bars rest.
 */
export function MusicIsland() {
  const { audioUnlocked, muted, toggleMuted } = useAudio();
  const { tracks, index, playing } = usePlaylist();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<IslandMode>("mini");
  const slots = island({ mode });

  const current = tracks[index];
  if (!audioUnlocked || !current) return null;

  return (
    <div className={slots.root()}>
      <motion.div
        layout={!reduced}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className={slots.shell()}
      >
        {mode === "mini" ? (
          <button
            type="button"
            className={slots.miniBtn()}
            onClick={() => setMode("expanded")}
            aria-label={`Reproductor: ${current.title} — ${current.artist}. Ampliar`}
          >
            <Cover track={current} size="size-12" />
            <Equalizer active={playing && !reduced} />
          </button>
        ) : (
          <>
            <div className={slots.header()}>
              <Cover track={current} size="size-10" />
              <span className={slots.meta()}>
                <span className={slots.title()}>{current.title}</span>
                <span className={slots.artist()}>{current.artist}</span>
              </span>
              <button
                type="button"
                className={slots.chip()}
                onClick={toggleMuted}
                aria-label={muted ? "Activar el sonido" : "Silenciar"}
              >
                <MuteIcon muted={muted} />
              </button>
              <button
                type="button"
                className={slots.chip()}
                onClick={() => setMode("mini")}
                aria-label="Contraer el reproductor"
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                  <path
                    d="M7 14l5-5 5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            <div className={slots.controls()}>
              <button
                type="button"
                className={slots.iconBtn()}
                onClick={() => audioEngine.prev()}
                aria-label="Canción anterior"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
                  <path d="M7 6v12H5V6h2zm12 0v12l-9-6 9-6z" />
                </svg>
              </button>
              <button
                type="button"
                className={slots.playBtn()}
                onClick={() => audioEngine.togglePlay()}
                aria-label={playing ? "Pausar" : "Reproducir"}
              >
                {playing ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className={slots.iconBtn()}
                onClick={() => audioEngine.next()}
                aria-label="Canción siguiente"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
                  <path d="M17 6v12h2V6h-2zM5 6v12l9-6-9-6z" />
                </svg>
              </button>
            </div>

            <div className={slots.dots()} aria-hidden="true">
              {tracks.map((track, i) => (
                <span
                  key={track.id}
                  className={slots.pip({ class: i === index ? "w-4 bg-faded-rose" : "w-1.5" })}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
