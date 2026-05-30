import type { SceneCopy } from "./schema";

// TODO(contenido real): el título y la frase manuscrita de cada escena.
export const scenes: Record<"timeline" | "letter" | "sky", SceneCopy> = {
  timeline: { title: "La cinta", tagline: "nuestra historia, lado a lado" },
  letter: { title: "El sobre", tagline: "razones por las que te quiero" },
  sky: { title: "El cielo de papel", tagline: "toca las estrellas de nuestros lugares" },
};
