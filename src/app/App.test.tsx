import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

/** The hub label that opens a given spoke (labels come from @content). */
const labelFor = (scene: string): string => {
  const object = content.hubObjects.find((o) => o.scene === scene);
  if (!object) throw new Error(`no hub object for ${scene}`);
  return object.label;
};

// happy-dom has no animation timeline, so AnimatePresence never completes its
// exit and leaves stale nodes mounted. We pass it through here to test the
// routing/store wiring (which scene renders, and that clicks drive it) — the
// animations themselves are verified visually in the browser.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, AnimatePresence: ({ children }: { children: ReactNode }) => children };
});

// The finale's WebGL sky can't run in happy-dom (no GL context); this test is
// about routing/store wiring, so stub the lazy canvas out.
vi.mock("@scenes/finale-double-bottom/FinaleSky", () => ({ default: () => null }));

const openHub = async () => {
  fireEvent.click(screen.getByText("toca para entrar"));
  // the box opens via a two-phase pull/lift gesture; the keyboard path opens it
  // directly (Enter on the knot), which is what we drive here
  fireEvent.keyDown(await screen.findByLabelText(content.opening.ribbonHint), { key: "Enter" });
  return screen.findByText("Nuestro cajón");
};

beforeEach(() => {
  useExperienceStore.getState().reset();
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
});

describe("App navigation", () => {
  it("walks door → sealed box → hub", async () => {
    render(<App />);
    expect(await openHub()).toBeTruthy();
  });

  it("opens a scene and the invariable close returns to the hub", async () => {
    render(<App />);
    await openHub();

    fireEvent.click(screen.getByText(labelFor("timeline")));
    expect(await screen.findByText("La cinta")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Volver a la caja" }));
    expect(await screen.findByText("Nuestro cajón")).toBeTruthy();
  });

  it("reveals and enters the finale only after every core scene is seen", async () => {
    render(<App />);
    await openHub();

    expect(screen.queryByText("abrir el doble fondo")).toBeNull();

    for (const scene of ["timeline", "letter", "sky", "recipes"] as const) {
      fireEvent.click(screen.getByText(labelFor(scene)));
      fireEvent.click(await screen.findByRole("button", { name: "Volver a la caja" }));
      await screen.findByText("Nuestro cajón");
    }

    fireEvent.click(await screen.findByText("abrir el doble fondo"));
    expect(await screen.findByText("El doble fondo")).toBeTruthy();
  });
});

describe("App focus management", () => {
  it("moves focus to the close control when a scene opens", async () => {
    render(<App />);
    await openHub();
    fireEvent.click(screen.getByText(labelFor("timeline")));
    await screen.findByText("La cinta");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Volver a la caja" }));
  });

  it("returns focus to the opened keepsake when the scene closes", async () => {
    render(<App />);
    await openHub();
    fireEvent.click(screen.getByText(labelFor("timeline")));
    fireEvent.click(await screen.findByRole("button", { name: "Volver a la caja" }));
    await screen.findByText("Nuestro cajón");
    expect(document.activeElement).toBe(screen.getByText(labelFor("timeline")).closest("button"));
  });
});
