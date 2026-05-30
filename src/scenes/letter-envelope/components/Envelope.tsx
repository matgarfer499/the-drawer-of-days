import { tv } from "tailwind-variants";

const envelope = tv({
  slots: {
    root: "relative block h-14 w-24 rounded-sm bg-kraft-tan shadow-paper",
    // the downward flap, drawn as a CSS triangle (border trick)
    flap: "absolute inset-x-0 top-0 mx-auto h-0 w-0 border-x-[3rem] border-t-[1.75rem] border-x-transparent border-t-aged-tan/70",
    seal: "absolute left-1/2 top-7 h-4 w-4 -translate-x-1/2 rounded-full bg-faded-rose/85 shadow-paper",
  },
});

/**
 * A small kraft envelope with a wax seal — the keepsake the reasons are pulled
 * from. Decorative, so it stays out of the accessibility tree (the pull button
 * around it carries the accessible name).
 */
export function Envelope() {
  const { root, flap, seal } = envelope();
  return (
    <span className={root()} aria-hidden="true">
      <span className={flap()} />
      <span className={seal()} />
    </span>
  );
}
