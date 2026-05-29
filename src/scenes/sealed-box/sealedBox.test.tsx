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

  it("pulling (or tapping) the ribbon opens the box", () => {
    render(<SealedBox />);
    fireEvent.click(screen.getByText("tira del lazo"));
    expect(useExperienceStore.getState().status).toBe("hub");
  });
});
