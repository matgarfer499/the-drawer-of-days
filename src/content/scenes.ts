import type { SceneCopy } from "./schema";

export const scenes: Record<"timeline" | "letter" | "sky" | "recipes", SceneCopy> = {
  timeline: { title: "La cinta", tagline: "nuestra historia, del comienzo hasta hoy" },
  letter: { title: "El sobre", tagline: "razones por las que te quiero" },
  sky: { title: "El cielo de papel", tagline: "pulsa las estrellas que hemos visitado" },
  recipes: { title: "El recetario", tagline: "por lo que nos gusta cocinar y probar fuera" },
};
