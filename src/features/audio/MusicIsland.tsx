import { useReducedMotion } from "@features/reduced-motion";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { audioEngine } from "./AudioEngine";
import type { PlayableTrack } from "./playlist";
import { useAudio } from "./useAudio";
import { usePlaylist } from "./usePlaylist";
import { useTrackProgress } from "./useTrackProgress";

const island = tv({
  slots: {
    // The mini thumbnail lives top-right; the expanded sheet is bottom-anchored —
    // two separate fixed roots, each click-through except its own surface.
    miniRoot:
      "pointer-events-none fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-50",
    sheetRoot:
      "pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3",
    // A transparent catcher behind the sheet — a tap outside collapses it.
    catcher: "pointer-events-auto fixed inset-0 z-40 cursor-default bg-transparent",

    // ── mini ──
    miniBtn:
      "pointer-events-auto relative block rounded-island bg-paper-cream/90 p-1 text-ink-sepia shadow-paper backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    // 24px corners inside a 28px shell with p-1(4px) → concentric with the shell.
    miniCover: "block size-12 rounded-3xl object-cover",
    miniFallback:
      "grid size-12 place-items-center rounded-3xl bg-kraft-tan/70 text-2xl text-rose-deep leading-none",
    eq: "pointer-events-none absolute inset-1 flex items-end justify-center gap-[3px] rounded-3xl bg-ink-sepia/40 p-2.5",
    eqBar: "w-[3px] origin-bottom rounded-full bg-paper-cream",

    // ── expanded bottom sheet (Apple "now playing") ──
    sheet:
      "pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-island bg-paper-cream/95 p-4 text-ink-sepia shadow-paper-lifted backdrop-blur-md",
    grabRow: "flex justify-center",
    grabBtn:
      "flex h-7 w-16 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    grab: "h-1.5 w-10 rounded-full bg-ink-sepia/20",
    art: "block aspect-square w-full rounded-2xl object-cover shadow-paper",
    artFallback:
      "grid aspect-square w-full place-items-center rounded-2xl bg-kraft-tan/70 text-6xl text-rose-deep leading-none shadow-paper",
    meta: "flex flex-col gap-0.5 px-0.5 text-left",
    title: "truncate font-display text-lg",
    artist: "truncate font-hand text-base text-faded-ink",

    // progress (ABOVE the transport)
    progress: "flex flex-col gap-1",
    timeRow:
      "flex items-center justify-between px-0.5 font-body text-xs text-faded-ink tabular-nums",

    // transport
    controls: "flex items-center justify-center gap-8",
    iconBtn:
      "grid size-11 place-items-center rounded-full text-ink-sepia motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    playBtn:
      "grid size-14 place-items-center rounded-full bg-faded-rose text-paper-cream shadow-paper motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",

    // volume (BOTTOMMOST), a speaker at each end
    volumeRow: "flex items-center gap-1.5",
    volBtn:
      "grid size-11 shrink-0 place-items-center rounded-full text-faded-ink motion-safe:transition-transform motion-safe:active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    volGlyph: "grid size-9 shrink-0 place-items-center text-faded-ink",

    // shared accessible range (scrubber + volume); pseudo-elements via range-paper
    range:
      "range-paper h-11 w-full flex-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

type Slots = ReturnType<typeof island>;

/** CSS-var fill % for the WebKit range track — the same sanctioned inline-style
 *  exception as `seededTransformVars`. Consumed by `range-paper`'s track gradient. */
function fillVar(pct: number): Record<`--${string}`, string> {
  const clamped = Math.max(0, Math.min(100, pct));
  return { "--fill": `${clamped.toFixed(2)}%` };
}

/** Seconds → `m:ss`, guarding NaN/negative (html5 duration is 0 until it loads). */
function formatTime(seconds: number): string {
  const s = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const m = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

/** Album cover, or a warm fallback glyph when the art URL is absent. Carries the
 *  shared `layoutId` so the artwork morphs from the mini thumbnail to the sheet. */
function Cover({
  track,
  imgClass,
  fallbackClass,
  morph,
}: {
  track: PlayableTrack;
  imgClass: string;
  fallbackClass: string;
  morph: boolean;
}) {
  const shared = morph
    ? ({
        layoutId: "np-cover",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      } as const)
    : {};
  if (track.art) {
    return (
      <motion.img
        {...shared}
        src={track.art}
        alt={track.artAlt}
        className={imgClass}
        loading="lazy"
      />
    );
  }
  return (
    <motion.span {...shared} className={fallbackClass} aria-hidden="true">
      ♪
    </motion.span>
  );
}

/** The "now playing" equalizer — three bars that dance while a track plays and rest
 *  (flat) when paused or under prefers-reduced-motion. */
function Equalizer({ active, slots }: { active: boolean; slots: Slots }) {
  return (
    <span className={slots.eq()} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={slots.eqBar({ class: "h-4" })}
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

function SpeakerIcon({ muted }: { muted: boolean }) {
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

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="currentColor">
      <path d="M7 6v12H5V6h2zm12 0v12l-9-6 9-6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="currentColor">
      <path d="M17 6v12h2V6h-2zM5 6v12l9-6-9-6z" />
    </svg>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true" fill="currentColor">
      {playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
    </svg>
  );
}

/** The expanded sheet's body. Factored out so `useTrackProgress` only mounts (and
 *  only polls) while the player is expanded. Owns the scrub interaction. */
function NowPlaying({
  track,
  playing,
  index,
  reduced,
  muted,
  onToggleMute,
  volume,
  onVolume,
  onCollapse,
  slots,
}: {
  track: PlayableTrack;
  playing: boolean;
  index: number;
  reduced: boolean;
  muted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolume: (level: number) => void;
  onCollapse: () => void;
  slots: Slots;
}) {
  const [scrub, setScrub] = useState<number | null>(null);
  const [seekTick, setSeekTick] = useState(0);
  const { position, duration } = useTrackProgress(playing, index, seekTick);

  const hasDuration = duration > 0;
  const raw = scrub ?? position;
  const value = hasDuration ? Math.max(0, Math.min(raw, duration)) : 0;
  const pct = hasDuration ? (value / duration) * 100 : 0;
  const remaining = hasDuration ? Math.max(0, duration - value) : 0;

  const commitSeek = () => {
    if (scrub === null) return;
    audioEngine.seekTo(scrub);
    setSeekTick((tick) => tick + 1);
    setScrub(null);
  };

  return (
    <>
      <div className={slots.grabRow()}>
        <button
          type="button"
          className={slots.grabBtn()}
          onClick={onCollapse}
          aria-label="Contraer el reproductor"
        >
          <span className={slots.grab()} aria-hidden="true" />
        </button>
      </div>

      <Cover
        track={track}
        imgClass={slots.art()}
        fallbackClass={slots.artFallback()}
        morph={!reduced}
      />

      <div className={slots.meta()}>
        <span className={slots.title()}>{track.title}</span>
        <span className={slots.artist()}>{track.artist}</span>
      </div>

      <div className={slots.progress()}>
        <input
          type="range"
          className={slots.range()}
          style={fillVar(pct)}
          min={0}
          max={hasDuration ? duration : 1}
          step={1}
          value={value}
          disabled={!hasDuration}
          aria-label="Progreso de la canción"
          onChange={(event) => setScrub(Number(event.currentTarget.value))}
          onPointerUp={commitSeek}
          onPointerCancel={commitSeek}
          onKeyUp={commitSeek}
          onBlur={commitSeek}
        />
        <div className={slots.timeRow()}>
          <span>{formatTime(value)}</span>
          <span>-{formatTime(remaining)}</span>
        </div>
      </div>

      <div className={slots.controls()}>
        <button
          type="button"
          className={slots.iconBtn()}
          onClick={() => audioEngine.prev()}
          aria-label="Canción anterior"
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className={slots.playBtn()}
          onClick={() => audioEngine.togglePlay()}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          <PlayPauseIcon playing={playing} />
        </button>
        <button
          type="button"
          className={slots.iconBtn()}
          onClick={() => audioEngine.next()}
          aria-label="Canción siguiente"
        >
          <NextIcon />
        </button>
      </div>

      <div className={slots.volumeRow()}>
        <button
          type="button"
          className={slots.volBtn()}
          onClick={onToggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Activar el sonido" : "Silenciar"}
        >
          <SpeakerIcon muted={muted} />
        </button>
        <input
          type="range"
          className={slots.range()}
          style={fillVar(volume * 100)}
          min={0}
          max={1}
          step={0.01}
          value={volume}
          aria-label="Volumen"
          onChange={(event) => onVolume(Number(event.currentTarget.value))}
        />
        <span className={slots.volGlyph()} aria-hidden="true">
          <SpeakerIcon muted={false} />
        </span>
      </div>
    </>
  );
}

/**
 * The global music player — an iOS-style control living in the App shell so it
 * survives every scene change. Its resting state is a tiny album thumbnail crowned
 * with the now-playing equalizer (top-right); tapping it expands into a near-full-width
 * "now playing" bottom sheet — large art that morphs up from the thumbnail, a scrubbable
 * progress bar, prev / play-pause / next, and a volume slider with a mute speaker at each
 * end. It appears only once the box is opened, and the music autostarts then. Under
 * prefers-reduced-motion the morph and the bars rest.
 */
export function MusicIsland() {
  const { playerVisible, muted, toggleMuted, volume, setVolume } = useAudio();
  const { tracks, index, playing } = usePlaylist();
  // null (pre-measurement) behaves as "not reduced", matching motion's own default.
  const reduced = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(false);
  const slots = island();

  const current = tracks[index];
  if (!playerVisible || !current) return null;

  return (
    <LayoutGroup id="music-island">
      <AnimatePresence>
        {expanded && (
          <motion.button
            key="catcher"
            type="button"
            tabIndex={-1}
            aria-label="Cerrar el reproductor"
            className={slots.catcher()}
            onClick={() => setExpanded(false)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="sheet"
            className={slots.sheetRoot()}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          >
            <div className={slots.sheet()}>
              <NowPlaying
                track={current}
                playing={playing}
                index={index}
                reduced={reduced}
                muted={muted}
                onToggleMute={toggleMuted}
                volume={volume}
                onVolume={setVolume}
                onCollapse={() => setExpanded(false)}
                slots={slots}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mini"
            className={slots.miniRoot()}
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <button
              type="button"
              className={slots.miniBtn()}
              onClick={() => setExpanded(true)}
              aria-label={`Reproductor: ${current.title} — ${current.artist}. Ampliar`}
            >
              <Cover
                track={current}
                imgClass={slots.miniCover()}
                fallbackClass={slots.miniFallback()}
                morph={!reduced}
              />
              <Equalizer active={playing && !reduced} slots={slots} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
