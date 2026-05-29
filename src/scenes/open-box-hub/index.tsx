import type { SpokeSceneId } from "@features/scene-engine";
import { useExperienceStore } from "@features/scene-engine";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { tv } from "tailwind-variants";

const SPOKES = [
  { id: "timeline", label: "Nuestra cinta" },
  { id: "letter", label: "Ábreme despacio" },
  { id: "sky", label: "Nuestro cielo" },
] as const satisfies readonly { id: SpokeSceneId; label: string }[];

const layout = tv({
  slots: {
    wrap: "flex max-w-md flex-col items-center gap-7",
    title: "font-hand text-3xl text-faded-rose",
    grid: "flex flex-wrap items-center justify-center gap-4",
    secret:
      "rounded-full bg-golden-hour/40 px-5 py-2 font-hand text-xl text-rose-deep shadow-paper transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    tour: "text-xs uppercase tracking-[0.2em] text-faded-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

const spoke = tv({
  base: "grid h-28 w-28 place-items-center rounded-2xl border border-aged-tan/40 bg-kraft-tan/40 p-3 text-center font-display text-base text-ink-sepia shadow-paper transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  variants: { veiled: { true: "opacity-50 grayscale", false: "" } },
  defaultVariants: { veiled: false },
});

/** The open box: a collage of keepsake objects, the finale gate, and the tour. */
export function Hub() {
  const enterScene = useExperienceStore((state) => state.enterScene);
  const enterFinale = useExperienceStore((state) => state.enterFinale);
  const startTour = useExperienceStore((state) => state.startTour);
  const visited = useExperienceStore((state) => state.visitedScenes);
  const finaleUnlocked = useExperienceStore((state) => state.finaleUnlocked);
  const { wrap, title, grid, secret, tour } = layout();

  return (
    <SceneFrame>
      <div className={wrap()}>
        <h1 className={title()}>El cajón de los días</h1>
        <div className={grid()}>
          {SPOKES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={spoke({ veiled: !visited.has(id) })}
              onClick={() => enterScene(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {finaleUnlocked && (
          <button type="button" className={secret()} onClick={enterFinale}>
            abrir el doble fondo
          </button>
        )}
        <button type="button" className={tour()} onClick={startTour}>
          enséñamelo todo
        </button>
      </div>
    </SceneFrame>
  );
}
