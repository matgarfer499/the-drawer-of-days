import { seededTransformVars } from "@shared/lib/seededRotation";
import { tv, type VariantProps } from "tailwind-variants";

const polaroid = tv({
  slots: {
    root: "relative inline-block bg-paper-cream p-2 pb-7 shadow-paper rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)]",
    photoWrap: "block aspect-[4/5] overflow-hidden rounded-[1px] bg-aged-tan/30",
    photo: "h-full w-full object-cover",
    caption:
      "absolute inset-x-2 bottom-1 truncate text-center font-hand text-lg leading-tight text-faded-ink",
  },
  variants: {
    size: {
      sm: { root: "w-32" },
      md: { root: "w-44" },
      lg: { root: "w-60" },
    },
  },
  defaultVariants: { size: "md" },
});

interface PolaroidProps extends VariantProps<typeof polaroid> {
  /** stable id — drives the deterministic handmade tilt/offset */
  id: string;
  src: string;
  /** required: every photo needs Spanish alt text (a11y) */
  alt: string;
  caption?: string;
  className?: string;
}

/**
 * A photo in a cream polaroid frame with a handwritten caption, tilted a little
 * by a seed derived from its `id` so a wall of them looks hand-placed yet stable.
 */
export function Polaroid({ id, src, alt, caption, size, className }: PolaroidProps) {
  const { root, photoWrap, photo, caption: captionSlot } = polaroid({ size });
  return (
    <figure className={root({ class: className })} style={seededTransformVars(id)}>
      <div className={photoWrap()}>
        <img className={photo()} src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {caption ? <figcaption className={captionSlot()}>{caption}</figcaption> : null}
    </figure>
  );
}
