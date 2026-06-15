import { content } from "@content";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Finale } from "./index";

afterEach(cleanup);

describe("Finale", () => {
  it("speaks the thesis line from content", () => {
    render(<Finale />);
    expect(screen.getByText(content.finale.thesisLine)).toBeTruthy();
  });

  it("reserves the promise — a labelled frame and its note", () => {
    render(<Finale />);
    expect(screen.getByText(content.finale.promise.frameLabel)).toBeTruthy();
    expect(screen.getByText(content.finale.promise.note)).toBeTruthy();
  });

  it("raises every ascending photo with its alt text", () => {
    render(<Finale />);
    for (const photo of content.finale.ascendingPhotos) {
      expect(screen.getByAltText(photo.alt)).toBeTruthy();
    }
  });

  it("keeps the farewell hidden until the cue is taken, then draws the curtain", () => {
    vi.useFakeTimers();
    try {
      const { closing } = content.finale;
      render(<Finale />);
      // the curtain is closed: neither the cue nor the farewell are present yet
      expect(screen.queryByText(closing.message)).toBeNull();

      // once the scene settles, the cue invites the tap
      act(() => {
        vi.runAllTimers();
      });
      const cue = screen.getByRole("button", { name: closing.cue });

      // a tap reveals the farewell and its signature
      fireEvent.click(cue);
      expect(screen.getByText(closing.message)).toBeTruthy();
      expect(screen.getByText(closing.signature)).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
