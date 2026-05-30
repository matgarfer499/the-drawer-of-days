import type { Reason } from "@content";

/**
 * Pure logic for the incremental letter. A reason is "available" once it's a base
 * reason (no `unlockedBy`) or its scene has been seen (its id is in
 * `unlockedReasons`). Available reasons are pulled from the envelope one at a time
 * in `order`; the rest wait, pending, until their scene lights them. No DOM here,
 * so the letter's growth is unit-tested.
 */

export type ReasonSlotStatus = "revealed" | "in-envelope" | "pending";

export interface ReasonSlot {
  reason: Reason;
  status: ReasonSlotStatus;
}

export interface LetterView {
  /** every reason in `order`, each tagged with where it is right now */
  slots: ReasonSlot[];
  /** reasons currently pullable (base + scenes already seen) */
  availableCount: number;
  /** how many of those have been pulled onto the letter */
  revealedCount: number;
  /** available reasons still waiting in the envelope */
  remaining: number;
  /** reasons still locked, waiting for their scene */
  pendingCount: number;
}

const isAvailable = (reason: Reason, unlockedReasons: ReadonlySet<string>): boolean =>
  !reason.unlockedBy || unlockedReasons.has(reason.id);

export function composeLetter(
  reasons: readonly Reason[],
  unlockedReasons: ReadonlySet<string>,
  pulled: number,
): LetterView {
  const ordered = [...reasons].sort((a, b) => a.order - b.order);
  const availableCount = ordered.filter((r) => isAvailable(r, unlockedReasons)).length;
  const revealedCount = Math.max(0, Math.min(pulled, availableCount));

  let seenAvailable = 0;
  const slots: ReasonSlot[] = ordered.map((reason) => {
    if (!isAvailable(reason, unlockedReasons)) return { reason, status: "pending" };
    const status: ReasonSlotStatus = seenAvailable < revealedCount ? "revealed" : "in-envelope";
    seenAvailable += 1;
    return { reason, status };
  });

  return {
    slots,
    availableCount,
    revealedCount,
    remaining: availableCount - revealedCount,
    pendingCount: ordered.length - availableCount,
  };
}
