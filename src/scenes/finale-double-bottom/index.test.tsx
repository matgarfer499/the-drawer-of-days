import { content } from "@content";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
