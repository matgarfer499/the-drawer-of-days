import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Door } from "./index";

beforeEach(() => useExperienceStore.getState().reset());
afterEach(cleanup);

describe("Door", () => {
  it("greets with the opening line from content", () => {
    render(<Door />);
    expect(screen.getByText(content.opening.greetingLine)).toBeTruthy();
  });

  it("entering advances past the door and unlocks audio", () => {
    render(<Door />);
    fireEvent.click(screen.getByRole("button"));
    const state = useExperienceStore.getState();
    expect(state.status).toBe("sealed");
    expect(state.audioUnlocked).toBe(true);
  });
});
