import { content } from "@content";
import { useExperienceStore } from "@features/scene-engine";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LetterEnvelope } from "./index";

const baseReasons = [...content.reasons]
  .filter((r) => !r.unlockedBy)
  .sort((a, b) => a.order - b.order);

const pull = () => {
  const button = screen.queryByRole("button", { name: /saca/i });
  if (button) fireEvent.click(button);
};

beforeEach(() => {
  useExperienceStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

describe("LetterEnvelope", () => {
  it("starts with the letter empty and an invitation to pull a reason", () => {
    render(<LetterEnvelope />);
    expect(screen.getByRole("button", { name: /saca/i })).toBeTruthy();
    const first = baseReasons[0];
    if (first) expect(screen.queryByText(first.text)).toBeNull();
  });

  it("pulls the reasons out one at a time, in order", () => {
    render(<LetterEnvelope />);
    const [first, second] = baseReasons;
    pull();
    if (first) expect(screen.getByText(first.text)).toBeTruthy();
    pull();
    if (second) expect(screen.getByText(second.text)).toBeTruthy();
  });

  it("teases the reasons still to be written by an unvisited scene as pending", () => {
    render(<LetterEnvelope />);
    const lockedCount = content.reasons.filter((r) => r.unlockedBy).length;
    expect(screen.getAllByText(/por escribir/i)).toHaveLength(lockedCount);
  });

  it("lights a locked reason once its scene has been seen", () => {
    // seeing timeline lights the reason it unlocks
    useExperienceStore.setState({ unlockedReasons: new Set(["timeline"]) });
    render(<LetterEnvelope />);
    const locked = content.reasons.find((r) => r.unlockedBy === "timeline");
    // pull through every available reason
    for (let i = 0; i < content.reasons.length; i += 1) pull();
    if (locked) expect(screen.getByText(locked.text)).toBeTruthy();
  });
});
