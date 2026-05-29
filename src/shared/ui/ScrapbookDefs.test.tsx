import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScrapbookDefs } from "./ScrapbookDefs";

afterEach(cleanup);

describe("ScrapbookDefs", () => {
  it("provides the paper-tear filter that torn props reference by id", () => {
    const { container } = render(<ScrapbookDefs />);
    expect(container.querySelector("filter#paper-tear")).not.toBeNull();
  });

  it("is inert and hidden from assistive technology", () => {
    const { container } = render(<ScrapbookDefs />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });
});
