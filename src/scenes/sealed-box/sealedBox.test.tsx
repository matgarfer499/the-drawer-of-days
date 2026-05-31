import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SealedBox } from "./index";

beforeEach(() => {
  useExperienceStore.getState().reset();
  useExperienceStore.getState().enter(); // door → sealed, so OPEN_BOX is valid
});
afterEach(cleanup);

describe("SealedBox", () => {
  it("shows the sealed-box copy from content", () => {
    render(<SealedBox />);
    expect(screen.getByText(content.opening.subGreetingLine)).toBeTruthy();
  });

  it("opens to the hub via the keyboard (Enter on the knot)", () => {
    render(<SealedBox />);
    fireEvent.keyDown(screen.getByLabelText(content.opening.ribbonHint), { key: "Enter" });
    expect(useExperienceStore.getState().status).toBe("hub");
  });
});
