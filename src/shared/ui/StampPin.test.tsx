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
});
