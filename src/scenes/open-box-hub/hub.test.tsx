import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Hub } from "./index";

beforeEach(() => {
  const store = useExperienceStore.getState();
  store.reset();
  store.enter();
  store.openBox(); // → hub
});
afterEach(cleanup);

describe("Hub", () => {
  it("shows a keepsake for every hub object in content", () => {
    render(<Hub />);
    for (const object of content.hubObjects) {
      expect(screen.getByText(object.label)).toBeTruthy();
    }
  });

  it("opening a keepsake enters its scene", () => {
    render(<Hub />);
    const object = content.hubObjects[0];
    if (!object) throw new Error("expected at least one hub object");
    fireEvent.click(screen.getByText(object.label));
    expect(useExperienceStore.getState().activeScene).toBe(object.scene);
  });

  it("hides the finale gate until every core scene is seen", () => {
    render(<Hub />);
    expect(screen.queryByText("abrir el doble fondo")).toBeNull();
  });

  it("offers the guided tour", () => {
    render(<Hub />);
    fireEvent.click(screen.getByText("enséñamelo todo"));
    expect(useExperienceStore.getState().tour.active).toBe(true);
  });
});
