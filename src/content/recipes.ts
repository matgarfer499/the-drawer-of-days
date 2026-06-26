import { localPhoto } from "./localPhoto";
import type { RecipeCard } from "./schema";

/** Real recipe-card photo (4:5 Polaroid; object-cover crops to fit). */
const photo = (file: string, width: number, height: number, alt: string) =>
  localPhoto({ path: `recipes/${file}.webp`, alt, width, height });

// `kind`: home = lo cocináis juntos; out = salís a comerlo.
export const recipes: RecipeCard[] = [
  {
    id: "home-01",
    kind: "home",
    title: "De los primeros platos que cocinamos juntos",
    note: "No te voy a mentir: no recuerdo qué era ni cómo lo hicimos, pero seguro estaba riquísimo como tú bb.",
    photo: photo("home-01", 1200, 1600, "Foto de un plato que cocinamos en casa"),
  },
  {
    id: "home-02",
    kind: "home",
    title: "Mis burritos profesionales",
    note: "Porque sabes que lo hago rico y lo envuelvo mejor que en el Taco Bell.",
    photo: photo("home-02", 1200, 1600, "Foto de otro plato que cocinamos en casa"),
  },
  {
    id: "restaurant-02",
    kind: "out",
    title: "Hamburguesas en Bruselas",
    note: "Por muchas más hamburguesas tanto aquí y por todo el mundo.",
    photo: photo("restaurant-02", 1200, 1600, "Foto de un restaurante al que vamos juntos"),
  },
  {
    id: "restaurant-03",
    kind: "out",
    title: "Por muchos más puestos",
    note: "Por compartir contigo mucho más experiencias en mercadillos y probar comidas de todo el mundo.",
    photo: photo("restaurant-03", 1200, 1600, "Foto de un restaurante al que vamos juntos"),
  },
  {
    id: "restaurant-04",
    kind: "out",
    title: "Vivan las patatas",
    note: "Porque se nos va a quedar cara de patatas fritas y nunca nos vamos a cansar de comerlas, como tú y yo juntos.",
    photo: photo("restaurant-04", 1200, 1600, "Foto de una comida fuera de casa"),
  },
  {
    id: "restaurant-05",
    kind: "out",
    title: "Por muchos más restaurantes",
    note: "Desde sushis, hamburguesas, comida italiana y todo lo que nos queda por probar juntos.",
    photo: photo("restaurant-05", 1500, 1125, "Foto de una comida fuera de casa"),
  },
  {
    id: "restaurant-06",
    kind: "out",
    title: "Cómo no, patatas fritas",
    note: "No podía terminar sin poner más patatas fritas, ¿nos vamos a por unas?",
    photo: photo("restaurant-06", 1200, 1600, "Foto de una comida fuera de casa"),
  },
];
