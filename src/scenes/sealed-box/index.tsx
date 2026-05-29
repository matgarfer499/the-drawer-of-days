import { useExperienceStore } from "@features/scene-engine";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { tv } from "tailwind-variants";

const seal = tv({
  slots: {
    box: "flex flex-col items-center gap-5 rounded-3xl border-2 border-aged-tan/50 bg-kraft-tan/40 px-10 py-12 shadow-paper-lifted",
    label: "font-hand text-2xl text-ink-sepia",
    ribbon:
      "rounded-full bg-faded-rose px-6 py-2 font-display text-lg text-paper-cream shadow-paper transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
  },
});

/** The sealed tin. Phase 4 turns the ribbon into a real drag-to-open gesture. */
export function SealedBox() {
  const openBox = useExperienceStore((state) => state.openBox);
  const { box, label, ribbon } = seal();
  return (
    <SceneFrame>
      <div className={box()}>
        <span className={label()}>una caja atada con un lazo</span>
        <button type="button" className={ribbon()} onClick={openBox}>
          tira del lazo
        </button>
      </div>
    </SceneFrame>
  );
}
