import { seededTransformVars } from "@shared/lib/seededRotation";
import type { ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const stampPin = tv({
  base: "relative inline-grid select-none place-items-center rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
  variants: {
    kind: {
      // a postage stamp: a dotted "perforated" border around a cream square
      stamp:
        "h-14 w-14 rounded-[2px] border-2 border-dotted border-current bg-paper-cream text-2xl leading-none shadow-paper",
      // a pushpin head: a small domed dot with a specular highlight
      pin: "h-4 w-4 rounded-full bg-current shadow-paper-lifted before:absolute before:top-[25%] before:left-[30%] before:h-1 before:w-1 before:rounded-full before:bg-paper-cream/70 before:content-['']",
    },
    // tone is applied as currentColor → tints the stamp ink/border, or the pin head
    tone: {
      rose: "text-rose-deep",
      sage: "text-sage-dust",
      teal: "text-dusty-teal",
      ink: "text-ink-sepia",
      golden: "text-golden-hour",
    },
  },
  defaultVariants: { kind: "stamp", tone: "ink" },
});

interface StampPinProps extends VariantProps<typeof stampPin> {
  /** stable id — drives the deterministic angle/offset */
  id: string;
  /** if it carries meaning (e.g. a "Visto" stamp), give it a label → becomes role="img" */
  label?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * A rubber-stamp or pushpin mark. A `label` makes it a meaningful image with an
 * accessible name; without one it is purely decorative and hidden from AT. The
 * tone tints the stamp's ink (and border) or the pin's head via currentColor.
 */
export function StampPin({ id, kind, tone, label, className, children }: StampPinProps) {
  const accessible = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);
  return (
    <span
      className={stampPin({ kind, tone, class: className })}
      style={seededTransformVars(id)}
      {...accessible}
    >
      {children}
    </span>
  );
}
