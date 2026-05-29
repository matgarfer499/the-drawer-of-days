import { tv } from "tailwind-variants";

// Placeholder shell for Phase 0. The real experience (sealed box → hub → scenes →
// double-bottom finale) arrives in the following phases via the scene-engine.
const layout = tv({
  slots: {
    root: "grid h-[100dvh] w-[100dvw] place-items-center overflow-hidden bg-paper-cream px-6 text-center",
    title: "font-display text-4xl font-semibold text-ink-sepia",
    tag: "mt-3 font-hand text-3xl text-faded-rose",
    note: "mx-auto mt-8 max-w-xs text-sm leading-relaxed text-faded-ink",
  },
});

export function App() {
  const { root, title, tag, note } = layout();
  return (
    <main className={root()}>
      <div>
        <h1 className={title()}>El Cajón de los Días</h1>
        <p className={tag()}>para ti</p>
        <p className={note()}>
          Cimientos listos. La caja, el hub y las escenas llegan en las siguientes fases.
        </p>
      </div>
    </main>
  );
}
