import { seededTransformVars } from "@shared/lib/seededRotation";
import { tv } from "tailwind-variants";

const postmark = tv({
  slots: {
    root: "relative inline-flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-faded-ink/70 text-faded-ink rotate-[var(--seed-rot)] translate-x-[var(--seed-x)] translate-y-[var(--seed-y)] before:absolute before:inset-1.5 before:rounded-full before:border before:border-faded-ink/40 before:content-['']",
    place: "px-2 text-center font-semibold text-stamp uppercase leading-none tracking-widest",
    date: "font-display text-sm leading-none",
  },
});

interface PostmarkDateProps {
  /** stable id — drives the deterministic angle/offset */
  id: string;
  /** display date, e.g. "14 FEB 2023" */
  date: string;
  /** machine-readable ISO date for the <time> element */
  dateTime?: string;
  place?: string;
  className?: string;
}

/**
 * A round postal cancellation mark: a double ring with a place arched above an
 * inked date. The date is real content, so it renders inside a `<time>`; the
 * rings are decorative. Seeded angle keeps each stamp a little askew.
 */
export function PostmarkDate({ id, date, dateTime, place, className }: PostmarkDateProps) {
  const { root, place: placeSlot, date: dateSlot } = postmark();
  return (
    <span className={root({ class: className })} style={seededTransformVars(id)}>
      {place ? <span className={placeSlot()}>{place}</span> : null}
      <time className={dateSlot()} {...(dateTime ? { dateTime } : {})}>
        {date}
      </time>
    </span>
  );
}
