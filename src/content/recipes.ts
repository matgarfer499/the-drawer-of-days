import { placeholderImage } from "./placeholders/asset";
import type { RecipeCard } from "./schema";

/** 4:5 placeholder photo for a recipe card (same ratio as a Polaroid). */
const photo = (label: string, alt: string) =>
  placeholderImage({ width: 1200, height: 1500, label, alt });

// TODO(contenido real): platos que cocináis juntos (`home`) y sitios/comidas favoritas fuera (`out`).
// Cada ficha: id único, kind, título, una nota (anécdota/ingredientes o el sitio y por qué), foto 4:5 + alt.
export const recipes: RecipeCard[] = [
  {
    id: "pasta-casa",
    kind: "home",
    title: "La pasta de los viernes",
    note: "Lo que cocinamos cuando no queremos pensar. // TODO: contenido real",
    photo: photo("pasta en casa", "Marcador de la foto de la pasta que cocinamos en casa"),
  },
  {
    id: "domingo-cocina",
    kind: "home",
    title: "Cocinar sin reloj",
    note: "Un domingo entero entre fogones y música. // TODO: contenido real",
    photo: photo("cocina de domingo", "Marcador de la foto de un domingo cocinando juntos"),
  },
  {
    id: "primera-cita-restaurante",
    kind: "out",
    title: "El sitio de la primera cita",
    note: "El restaurante, lo que pedimos, los nervios. // TODO: contenido real",
    photo: photo("nuestro restaurante", "Marcador de la foto del restaurante de la primera cita"),
  },
  {
    id: "favorito-fuera",
    kind: "out",
    title: "Nuestro favorito de siempre",
    note: "Al que volvemos cada vez que hay algo que celebrar. // TODO: contenido real",
    photo: photo("favorito de fuera", "Marcador de la foto de nuestro restaurante favorito"),
  },
];
