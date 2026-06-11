import type { SpokeSceneId } from "@features/scene-engine";
import { useExperienceStore } from "@features/scene-engine";
import { CassetteTimeline } from "@scenes/cassette-timeline";
import { Door } from "@scenes/door";
import { Finale } from "@scenes/finale-double-bottom";
import { LetterEnvelope } from "@scenes/letter-envelope";
import { Hub } from "@scenes/open-box-hub";
import { PaperSky } from "@scenes/paper-sky";
import { RecipesBox } from "@scenes/recipes-box";
import { SealedBox } from "@scenes/sealed-box";
import { AnimatePresence, LayoutGroup } from "motion/react";
import type { ReactElement } from "react";

const SPOKE_SCENE: Record<SpokeSceneId, ReactElement> = {
  timeline: <CassetteTimeline key="timeline" />,
  letter: <LetterEnvelope key="letter" />,
  sky: <PaperSky key="sky" />,
  recipes: <RecipesBox key="recipes" />,
};

/**
 * Renders exactly one scene for the current status. `AnimatePresence mode="wait"`
 * lets the leaving scene finish its exit before the next enters; each scene owns
 * its transition via SceneFrame. A hub keepsake and its scene share a `layoutId`,
 * so the object morphs into the scene's hero and back; LayoutGroup coordinates
 * that shared-layout animation across the AnimatePresence swap.
 */
export function SceneRouter() {
  const status = useExperienceStore((state) => state.status);
  const activeScene = useExperienceStore((state) => state.activeScene);

  let view: ReactElement;
  switch (status) {
    case "door":
      view = <Door key="door" />;
      break;
    case "sealed":
      view = <SealedBox key="sealed" />;
      break;
    case "inScene":
      view = SPOKE_SCENE[activeScene as SpokeSceneId];
      break;
    case "finale":
      view = <Finale key="finale" />;
      break;
    default:
      view = <Hub key="hub" />;
      break;
  }

  return (
    <main className="relative h-[100dvh] w-[100dvw] overflow-hidden">
      <LayoutGroup>
        <AnimatePresence mode="wait">{view}</AnimatePresence>
      </LayoutGroup>
    </main>
  );
}
