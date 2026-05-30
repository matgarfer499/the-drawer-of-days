import { tv } from "tailwind-variants";
import { useAudio } from "./useAudio";

const control = tv({
  base: "fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-50 grid h-11 w-11 place-items-center rounded-full bg-paper-cream/85 text-ink-sepia shadow-paper backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-rose-deep focus-visible:outline-offset-2",
});

/**
 * Persistent audio mount: it runs the gesture-unlock / ambient / finale-song
 * wiring (useAudio) and renders the always-reachable mute control once audio is
 * in play. The whole experience works in silence, so the control is the only
 * audio chrome — no banners, never autoplay-forced.
 */
export function AudioLayer() {
  const { audioUnlocked, muted, toggleMuted } = useAudio();
  if (!audioUnlocked) return null;

  return (
    <button
      type="button"
      className={control()}
      onClick={toggleMuted}
      aria-pressed={muted}
      aria-label={muted ? "Activar el sonido" : "Silenciar"}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <title>{muted ? "silenciado" : "con sonido"}</title>
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {muted ? (
          <path
            d="M16 8l5 8M21 8l-5 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
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
    </button>
  );
}
