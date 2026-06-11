import type { RecipeCard as RecipeCardData } from "@content";
import { Polaroid } from "@shared/ui/Polaroid";
import { tv } from "tailwind-variants";

const card = tv({
  slots: {
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
 * One recipe card: a dish cooked at home or a place we love eating out. A kraft
 * tag flags which it is; the photo sits in a polaroid above the handwritten note.
 */
export function RecipeCard({ card: data }: { card: RecipeCardData }) {
  const s = card({ kind: data.kind });
  return (
    <>
      <span className={s.tag()}>{KIND_LABEL[data.kind]}</span>
      <Polaroid id={data.id} src={data.photo.src} alt={data.photo.alt} size="sm" />
      <h2 className={s.title()}>{data.title}</h2>
      <p className={s.note()}>{data.note}</p>
    </>
  );
}
