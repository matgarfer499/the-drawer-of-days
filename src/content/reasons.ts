import type { Reason } from "./schema";

export const reasons: Reason[] = [
  { id: "r-laugh", order: 1, text: "Por cómo te ríes cuando algo te hace mucha gracia." },
  {
    id: "timeline",
    order: 2,
    text: "Por haberme metido al mundo del sushi y ser ahora un adicto.",
    unlockedBy: "timeline",
  },
  { id: "r-coffee", order: 3, text: "Por quererme día sí y día también, ya esté mal o bien." },
  { id: "sky", order: 4, text: "Por siempre pensar en mí e incluirme en todo.", unlockedBy: "sky" },
  {
    id: "recipes",
    order: 5,
    text: "Por ser la mejor compañera de vida que podría haberme encontrado.",
    unlockedBy: "recipes",
  },
  { id: "r-home", order: 6, text: "Por hacerme platos riquísimos." },
  { id: "r-future", order: 7, text: "Por todo lo que aún nos queda por vivir." },
];
