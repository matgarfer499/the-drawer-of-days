import { content } from "@content";
import { useReducedMotion } from "@features/reduced-motion";
import { SceneFrame } from "@shared/ui/SceneFrame";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { tv } from "tailwind-variants";
import { RecipeCard } from "./components/RecipeCard";
import { filterRecipes, nearestCard, type RecipeFilter } from "./recipes";

const TABS: { value: RecipeFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "home", label: "En casa" },
  { value: "out", label: "Comiendo fuera" },
];

const ui = tv({
  slots: {
    root: "flex h-full w-full max-w-md flex-col items-center gap-3 py-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]",
    title: "font-display text-3xl text-ink-sepia",
    subtitle: "-mt-1 font-hand text-2xl text-faded-rose",
    tabs: "flex flex-wrap items-center justify-center gap-2",
    tab: "min-h-11 rounded-full border border-aged-tan/50 px-4 font-body text-sm text-faded-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    track:
      "flex w-full flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    panel:
      "flex w-full shrink-0 snap-center flex-col items-center justify-center gap-2.5 overflow-y-auto overscroll-y-contain px-1",
    empty: "grid flex-1 place-items-center font-hand text-2xl text-faded-rose",
    dots: "flex min-h-11 items-center justify-center gap-1",
    dot: "grid h-11 w-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep",
    dotInner: "h-2.5 w-2.5 rounded-full bg-aged-tan transition-transform",
  },
  variants: {
    smooth: { true: { track: "scroll-smooth" }, false: {} },
    active: { true: { dotInner: "scale-150 bg-faded-rose" }, false: {} },
    selected: {
      true: { tab: "border-transparent bg-faded-rose/30 text-ink-sepia" },
      false: {},
    },
  },
  defaultVariants: { smooth: true, active: false, selected: false },
});

/**
 * The recetario. Recipe cards — dishes we cook at home and places we love eating
 * out — live on a horizontal, scroll-snapped stack you swipe through; the tabs
 * filter by kind. Under reduced motion the snap jumps instead of glides, but the
 * stack stays fully navigable by swipe or by the dots. Keeps `spoke-recipes` so it
 * morphs from (and back to) its hub keepsake.
 */
export function RecipesBox() {
  const reduced = useReducedMotion() ?? false;
  const [filter, setFilter] = useState<RecipeFilter>("all");
  const cards = filterRecipes(content.recipes, filter);

  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollXProgress } = useScroll({ container: trackRef, axis: "x" });
  useMotionValueEvent(scrollXProgress, "change", (progress) => {
    setActive(nearestCard(progress, cards.length));
  });

  // Switching filter rebuilds the stack: jump back to the first card.
  const selectFilter = (value: RecipeFilter) => {
    setFilter(value);
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const goTo = (index: number) => {
    panelRefs.current[index]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const s = ui({ smooth: !reduced });

  return (
    <SceneFrame morphId="spoke-recipes">
      <div className={s.root()}>
        <h1 className={s.title()}>{content.scenes.recipes.title}</h1>
        <p className={s.subtitle()}>{content.scenes.recipes.tagline}</p>

        <div className={s.tabs()}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={s.tab({ selected: filter === tab.value })}
              aria-pressed={filter === tab.value}
              onClick={() => selectFilter(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {cards.length === 0 ? (
          <p className={s.empty()}>Aún no hay nada por aquí.</p>
        ) : (
          <section
            ref={trackRef}
            className={s.track()}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable so a keyboard user can arrow-scrub the stack (WCAG 2.1.1); the dots provide discrete nav alongside
            tabIndex={0}
            aria-roledescription="carrusel"
            aria-label="El recetario: desliza para recorrer las recetas"
          >
            {cards.map((recipe, index) => (
              <article
                key={recipe.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className={s.panel()}
                aria-roledescription="receta"
                aria-label={`${index + 1} de ${cards.length}: ${recipe.title}`}
              >
                <RecipeCard card={recipe} />
              </article>
            ))}
          </section>
        )}

        {cards.length > 1 && (
          <nav className={s.dots()} aria-label="Saltar a una receta">
            {cards.map((recipe, index) => (
              <button
                key={recipe.id}
                type="button"
                className={s.dot()}
                aria-label={`Ir a: ${recipe.title}`}
                aria-current={active === index}
                onClick={() => goTo(index)}
              >
                <span className={s.dotInner({ active: active === index })} />
              </button>
            ))}
          </nav>
        )}
      </div>
    </SceneFrame>
  );
}
