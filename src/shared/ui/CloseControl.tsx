import { useExperienceStore } from "@features/scene-engine";
import { useEffect, useRef } from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: [
    "fixed left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-50",
    "flex h-11 w-11 items-center justify-center rounded-full",
    "bg-kraft-tan/85 text-ink-sepia shadow-paper backdrop-blur-sm",
    "transition-transform hover:scale-105 active:scale-95",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  ],
});

/**
 * The invariable "back to the box" control. Rendered once, globally, so it lives
 * in the same place with the same behaviour in every scene (a core experience
 * invariant). Escape closes too. It shows itself only when something is open.
 */
export function CloseControl() {
  const status = useExperienceStore((state) => state.status);
  const closeScene = useExperienceStore((state) => state.closeScene);
  const closeFinale = useExperienceStore((state) => state.closeFinale);
  const closeable = status === "inScene" || status === "finale";
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!closeable) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") (status === "finale" ? closeFinale : closeScene)();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeable, status, closeScene, closeFinale]);

  // When a scene opens, the originating keepsake unmounts — move focus here so
  // keyboard/AT users land on a known control instead of dropping to <body>.
  useEffect(() => {
    if (closeable) ref.current?.focus();
  }, [closeable]);

  if (!closeable) return null;

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Volver a la caja"
      className={button()}
      onClick={status === "finale" ? closeFinale : closeScene}
    >
      <span aria-hidden="true">✕</span>
    </button>
  );
}
