import { localPhoto } from "./localPhoto";
import type { AssetRef, Finale } from "./schema";

/** The double-bottom's ascending photos, with their real pixel sizes [n, width, height]. */
const ASCENDING: ReadonlyArray<readonly [number, number, number]> = [
  [1, 2160, 3840],
  [2, 1170, 2080],
  [3, 1536, 2048],
  [4, 1200, 1600],
  [5, 1200, 1600],
  [6, 1200, 1600],
  [7, 1200, 1600],
  [8, 1200, 1600],
  [9, 3024, 4032],
  [10, 1200, 1600],
  [11, 1200, 1600],
  [12, 1500, 1125],
  [13, 2400, 1600],
  [14, 1200, 1600],
  [15, 720, 1280],
];

const ascendingPhotos: AssetRef[] = ASCENDING.map(([n, width, height]) =>
  localPhoto({
    path: `finale/finale-${String(n).padStart(2, "0")}.webp`,
    alt: `Recuerdo nuestro nº ${n}`,
    width,
    height,
  }),
);

export const finale: Finale = {
  label: "El doble fondo",
  thesisLine: "Por firmar muchos más capítulos de nuestra historia juntos.",
  ascendingPhotos,
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
