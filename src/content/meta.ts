import type { Content, Opening } from "./schema";

// TODO(contenido real): fechas reales en ISO (YYYY-MM-DD).
export const meta = {
  anniversaryDate: "2026-06-23",
  relationshipStartDate: "2023-06-24",
  seed: 314,
} satisfies Pick<Content, "anniversaryDate" | "relationshipStartDate" | "seed">;

export const opening: Opening = {
  greetingLine: "Esto es para ti linda",
  subGreetingLine: "Tira del lazo suavemente",
  ribbonHint: "desliza para tirar del lazo",
  lidHint: "desliza hacia arriba para abrir la caja",
};
