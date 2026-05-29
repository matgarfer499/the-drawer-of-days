import { seededTransformVars } from "@shared/lib/seededRotation";
import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tornEdge = tv({
  slots: {
    root: "relative isolate inline-block rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
    // the paper layer is what gets ragged-edged; it sits behind the crisp content
    paper: "absolute inset-0 -z-10 shadow-paper [filter:url(#paper-tear)]",
    content: "relative px-5 py-4",
  },
  variants: {
    tone: {
      cream: { paper: "bg-paper-cream" },
      kraft: { paper: "bg-kraft-tan" },
      aged: { paper: "bg-aged-tan" },
    },
  },
  defaultVariants: { tone: "cream" },
});

interface TornEdgeProps extends VariantProps<typeof tornEdge> {
  /** stable id — drives the deterministic angle/offset */
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * A scrap of torn paper. A filled paper layer is ragged-edged by the shared
 * `#paper-tear` SVG filter (see ScrapbookDefs) while the content rides crisply on
 * top, so text stays sharp. Seeded angle keeps each scrap individual.
 */
export function TornEdge({ id, tone, children, className }: TornEdgeProps) {
  const { root, paper, content } = tornEdge({ tone });
  return (
    <div className={root({ class: className })} style={seededTransformVars(id)}>
      <div aria-hidden="true" className={paper()} />
      <div className={content()}>{children}</div>
    </div>
  );
}
