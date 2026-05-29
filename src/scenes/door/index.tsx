import { useExperienceStore } from "@features/scene-engine";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { tv } from "tailwind-variants";

const door = tv({
  slots: {
    button:
      "flex flex-col items-center gap-1 rounded-2xl px-8 py-10 transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-deep",
    tag: "font-hand text-2xl text-faded-rose",
    title: "font-display text-5xl font-semibold text-ink-sepia",
    hint: "mt-6 text-xs uppercase tracking-[0.2em] text-faded-ink",
  },
});

/** The soft door: "this is for you" + a tap that also unlocks the audio. */
export function Door() {
  const enter = useExperienceStore((state) => state.enter);
  const { button, tag, title, hint } = door();
  return (
    <SceneFrame>
      {/* TODO(phase 3): herName from @content */}
      <button type="button" className={button()} onClick={enter}>
        <span className={tag()}>Para ti,</span>
        <span className={title()}>mi amor</span>
        <span className={hint()}>toca para entrar</span>
      </button>
    </SceneFrame>
  );
}
