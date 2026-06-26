import type { RecipeCard as RecipeCardData } from "@content";
import { Polaroid } from "@shared/ui/Polaroid";
import { TornEdge } from "@shared/ui/TornEdge";
import { WashiTape } from "@shared/ui/WashiTape";
import { tv } from "tailwind-variants";

const card = tv({
  slots: {
    // cap the card narrower than the snap panel (like the timeline scrap) so a long
    // title wraps instead of widening the card past the viewport and breaking the snap
    scrap: "w-fit max-w-[16rem] self-center text-center",
    inner: "flex flex-col items-center gap-2.5",
    tape: "-top-2 -right-7 absolute z-10",
    tag: "rounded px-2 py-0.5 font-body text-stamp uppercase tracking-[0.2em] text-ink-sepia",
    title: "font-display text-2xl text-ink-sepia",
    note: "max-w-[30ch] font-body text-sm leading-relaxed text-faded-ink",
  },
  variants: {
    kind: {
      home: { tag: "bg-faded-rose/30" },
      out: { tag: "bg-dusty-teal/30" },
    },
  },
});

const KIND_LABEL: Record<RecipeCardData["kind"], string> = {
  home: "En casa",
  out: "Comiendo fuera",
};

/**
 * One recipe card: a dish cooked at home or a place we love eating out, kept as a
 * scrap torn from the recetario and taped into the album. A kraft tag flags which
 * it is; the photo sits in a polaroid above the handwritten note.
 */
export function RecipeCard({ card: data }: { card: RecipeCardData }) {
  const s = card({ kind: data.kind });
  return (
    <TornEdge id={`scrap-${data.id}`} tone="kraft" className={s.scrap()}>
      <WashiTape
        id={`tape-${data.id}`}
        tone={data.kind === "home" ? "rose" : "teal"}
        length="sm"
        className={s.tape()}
      />
      <div className={s.inner()}>
        <span className={s.tag()}>{KIND_LABEL[data.kind]}</span>
        <Polaroid id={data.id} src={data.photo.src} alt={data.photo.alt} size="sm" />
        <h2 className={s.title()}>{data.title}</h2>
        <p className={s.note()}>{data.note}</p>
      </div>
    </TornEdge>
  );
}
