import { tv, type VariantProps } from "tailwind-variants";

const photoCorner = tv({
  base: "pointer-events-none absolute h-6 w-6 shadow-tape",
  variants: {
    corner: {
      tl: "-top-0.5 -left-0.5 [clip-path:polygon(0_0,100%_0,0_100%)]",
      tr: "-top-0.5 -right-0.5 [clip-path:polygon(0_0,100%_0,100%_100%)]",
      bl: "-bottom-0.5 -left-0.5 [clip-path:polygon(0_0,0_100%,100%_100%)]",
      br: "-bottom-0.5 -right-0.5 [clip-path:polygon(100%_0,100%_100%,0_100%)]",
    },
    tone: {
      kraft: "bg-kraft-tan/90",
      cream: "bg-paper-cream/90",
      night: "bg-silver-pen/20",
    },
  },
  defaultVariants: { corner: "tl", tone: "kraft" },
});

interface PhotoCornerProps extends VariantProps<typeof photoCorner> {
  className?: string;
}

/**
 * A gummed photo-mount corner, the little triangles that hold a photo to an
 * album page. Square on purpose — the charm is that whatever they hold sits
 * crooked, not the mounts themselves. Purely decorative; the parent must be
 * positioned.
 */
export function PhotoCorner({ corner, tone, className }: PhotoCornerProps) {
  return <span aria-hidden="true" className={photoCorner({ corner, tone, class: className })} />;
}
