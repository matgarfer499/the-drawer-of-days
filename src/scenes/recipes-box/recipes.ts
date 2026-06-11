import type { RecipeCard } from "@content";

/** The recetario's filter: everything, what we cook at home, or where we eat out. */
export type RecipeFilter = "all" | "home" | "out";

/** The cards matching a filter, in content order. */
export function filterRecipes(cards: readonly RecipeCard[], filter: RecipeFilter): RecipeCard[] {
  return filter === "all" ? [...cards] : cards.filter((card) => card.kind === filter);
}

/** Nearest card index for a 0..1 scroll progress — drives the active dot (cf. cassette's nearestTrack). */
export function nearestCard(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.round(clamped * (count - 1));
}
