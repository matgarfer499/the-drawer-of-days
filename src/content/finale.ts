import { placeholderImage } from "./placeholders/asset";
import type { Finale } from "./schema";

const ascending = (n: number) =>
  placeholderImage({
    width: 800,
    height: 1000,
    label: `recuerdo ${n}`,
    alt: `Marcador del recuerdo ${n}`,
  });

// TODO(contenido real): el mensaje culminante, 5–9 polaroids que ascienden, y el hueco-promesa.
export const finale: Finale = {
  label: "El doble fondo",
  thesisLine: "Cabes en mi mano y a la vez llenas el cielo.",
  ascendingPhotos: [ascending(1), ascending(2), ascending(3), ascending(4), ascending(5)],
  promise: {
    frameLabel: "nuestro próximo capítulo",
    pendingDate: "",
    pendingLabel: "— por escribir —",
    note: "Aquí dejamos un hueco a propósito. Lo llenamos nosotros.",
  },
  closing: {
    cue: "continuar",
    message: "Y que sean muchos más",
    signature: "— por muchos años más, contigo",
  },
};
