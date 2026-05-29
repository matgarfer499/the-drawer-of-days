import type { Content, Opening } from "./schema";

// TODO(contenido real): nombre/apodo y fechas reales en ISO (YYYY-MM-DD).
export const meta = {
  herName: "Mi amor",
  anniversaryDate: "2024-09-14",
  relationshipStartDate: "2021-09-14",
  /** cambia esta semilla para barajar toda la imperfección hecha a mano a la vez */
  seed: 314,
} satisfies Pick<Content, "herName" | "anniversaryDate" | "relationshipStartDate" | "seed">;

// TODO(contenido real): el saludo de la puerta y el subtítulo de la caja sellada.
export const opening: Opening = {
  greetingLine: "Esto es para ti, mi amor.",
  subGreetingLine: "Tira del lazo, sin prisa.",
};
