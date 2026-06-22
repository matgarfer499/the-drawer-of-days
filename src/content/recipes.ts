import { localPhoto } from "./localPhoto";
import type { RecipeCard } from "./schema";

/** Real recipe-card photo (4:5 Polaroid; object-cover crops to fit). */
const photo = (file: string, width: number, height: number, alt: string) =>
  localPhoto({ path: `recipes/${file}.webp`, alt, width, height });

// TODO(contenido real): reescribe `title` y `note` de cada ficha con la anécdota/ingredientes
// de verdad (las fotos ya están cableadas). `kind`: home = lo cocináis juntos; out = salís a comerlo.
export const recipes: RecipeCard[] = [
  {
    id: "home-01",
    kind: "home",
    title: "Lo que cocinamos en casa",
    note: "// TODO: la receta o la anécdota de este plato que hacemos juntos.",
    photo: photo("home-01", 1200, 1600, "Foto de un plato que cocinamos en casa"),
  },
  {
    id: "home-02",
    kind: "home",
    title: "Nuestra cocina, otro día",
    note: "// TODO: qué cocinamos y por qué nos gusta hacerlo juntos.",
    photo: photo("home-02", 1200, 1600, "Foto de otro plato que cocinamos en casa"),
  },
  {
    id: "restaurant-02",
    kind: "out",
    title: "Un sitio al que volvemos",
    note: "// TODO: el restaurante, qué pedimos y por qué nos sabe a casa.",
    photo: photo("restaurant-02", 1200, 1600, "Foto de un restaurante al que vamos juntos"),
  },
  {
    id: "restaurant-03",
    kind: "out",
    title: "Otra mesa que recordamos",
    note: "// TODO: el sitio y el momento que pasamos allí.",
    photo: photo("restaurant-03", 1200, 1600, "Foto de un restaurante al que vamos juntos"),
  },
  {
    id: "restaurant-04",
    kind: "out",
    title: "Comiendo fuera, juntos",
    note: "// TODO: dónde fue y qué hizo especial esa comida.",
    photo: photo("restaurant-04", 1200, 1600, "Foto de una comida fuera de casa"),
  },
  {
    id: "restaurant-05",
    kind: "out",
    title: "Nuestro plan de comer fuera",
    note: "// TODO: el restaurante y por qué nos encanta.",
    photo: photo("restaurant-05", 1500, 1125, "Foto de una comida fuera de casa"),
  },
  {
    id: "restaurant-06",
    kind: "out",
    title: "Una más para el recetario",
    note: "// TODO: el sitio, lo que pedimos y la anécdota.",
    photo: photo("restaurant-06", 1200, 1600, "Foto de una comida fuera de casa"),
  },
];
