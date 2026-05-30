import { content } from "@content";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { formatPostmark } from "./cassette";
import { CassetteTimeline } from "./index";

afterEach(cleanup);

describe("CassetteTimeline", () => {
  it("lays every milestone on the tape with its title and postmark date", () => {
    render(<CassetteTimeline />);
    for (const milestone of content.milestones) {
      expect(screen.getByText(milestone.title)).toBeTruthy();
      expect(screen.getByText(formatPostmark(milestone.date))).toBeTruthy();
    }
  });

  it("shows each milestone photo with its Spanish alt text", () => {
    render(<CassetteTimeline />);
    for (const milestone of content.milestones) {
      const photo = milestone.photos[0];
      if (photo) expect(screen.getByAltText(photo.alt)).toBeTruthy();
    }
  });

  it("offers one navigation dot per milestone", () => {
    render(<CassetteTimeline />);
    const dots = screen.getAllByRole("button", { name: /ir a/i });
    expect(dots).toHaveLength(content.milestones.length);
  });
});
