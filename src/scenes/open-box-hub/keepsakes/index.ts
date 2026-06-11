import type { SpokeSceneId } from "@features/scene-engine";
import type { ComponentType } from "react";
import { CassetteIcon } from "./CassetteIcon";
import { EnvelopeIcon } from "./EnvelopeIcon";
import { RecetarioIcon } from "./RecetarioIcon";
import { StarmapIcon } from "./StarmapIcon";
import type { KeepsakeIconProps } from "./types";

export type { KeepsakeIconProps } from "./types";

/**
 * The animated SVG keepsake for each spoke. Typing it as `Record<SpokeSceneId, …>`
 * makes a missing icon a compile error the day a new spoke is added.
 */
export const KEEPSAKE_ICONS: Record<SpokeSceneId, ComponentType<KeepsakeIconProps>> = {
  timeline: CassetteIcon,
  letter: EnvelopeIcon,
  sky: StarmapIcon,
  recipes: RecetarioIcon,
};
