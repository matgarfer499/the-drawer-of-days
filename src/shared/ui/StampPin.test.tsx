import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StampPin } from "./StampPin";

afterEach(cleanup);

describe("StampPin", () => {
  it("exposes an accessible name when it carries meaning (a labelled stamp)", () => {
    render(<StampPin id="seen" label="Visto" />);
    expect(screen.getByRole("img", { name: "Visto" })).toBeTruthy();
  });

  it("is decorative (hidden from assistive tech) when it has no label", () => {
    const { container } = render(<StampPin id="pin1" kind="pin" />);
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders its glyph children", () => {
    render(
      <StampPin id="s1" label="Sello">
        ★
      </StampPin>,
    );
    expect(screen.getByText("★")).toBeTruthy();
  });

  it("keeps a stamp's glyph legible (ink) in tones that fail contrast on the cream face", () => {
    const { container } = render(
      <StampPin id="s" kind="stamp" tone="sage">
        ★
      </StampPin>,
    );
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("text-ink-sepia");
    expect(cls).not.toContain("text-sage-dust");
  });

  it("keeps the requested tone for stamps that already clear contrast", () => {
    const { container } = render(
      <StampPin id="s" kind="stamp" tone="rose">
        ★
      </StampPin>,
    );
    expect(container.firstElementChild?.className ?? "").toContain("text-rose-deep");
  });
});
