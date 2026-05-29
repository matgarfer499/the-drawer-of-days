import { AudioLayer } from "@features/audio";
import { useSceneUrlSync } from "@features/scene-engine";
import { CloseControl } from "@shared/ui/CloseControl";
import { CanvasLayer } from "./CanvasLayer";
import { SceneRouter } from "./SceneRouter";

/**
 * App shell. The persistent layers (audio, canvas) mount once and survive every
 * scene change; SceneRouter swaps the active scene; CloseControl is the single,
 * global, invariable "back to the box" gesture. URL↔scene sync runs here.
 */
export function App() {
  useSceneUrlSync();
  return (
    <>
      <AudioLayer />
      <CanvasLayer />
      <SceneRouter />
      <CloseControl />
    </>
  );
}
