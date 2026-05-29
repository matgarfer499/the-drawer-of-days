import { placeholderImage } from "./placeholders/asset";
import type { Milestone } from "./schema";

/** 4:5 placeholder photo for a milestone. */
const photo = (label: string, alt: string) =>
  placeholderImage({ width: 1200, height: 1500, label, alt });

// TODO(contenido real): 5–9 hitos (fecha ISO, título, 2–4 frases, foto 4:5 ≥1200px + alt).
export const milestones: Milestone[] = [
  {
    id: "first-met",
    date: "2021-09-14",
    side: "A",
    title: "El día que te conocí",
    body: "Aquí irá el recuerdo de cómo empezó todo. // TODO: contenido real",
    photos: [photo("primer día", "Marcador de la foto del primer día")],
  },
  {
    id: "first-trip",
    date: "2022-06-02",
    side: "A",
    title: "Nuestro primer viaje",
    body: "El sitio, la risa, lo que nos dijimos. // TODO: contenido real",
    photos: [photo("primer viaje", "Marcador de la foto del primer viaje")],
  },
  {
    id: "the-home",
    date: "2023-03-21",
    side: "B",
    title: "Nuestra casa",
    body: "Las cajas, la primera cena, el sofá. // TODO: contenido real",
    photos: [photo("nuestra casa", "Marcador de la foto de nuestra casa")],
  },
  {
    id: "third-year",
    date: "2024-09-14",
    side: "B",
    title: "Tres años",
    body: "Y los que nos quedan por vivir. // TODO: contenido real",
    photos: [photo("tres años", "Marcador de la foto de los tres años")],
  },
];
