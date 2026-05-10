import { describe, it, expect } from "vitest";
import { generateSlug } from "./utils";

describe("generateSlug", () => {
  it("lowercases and hyphenates a simple title", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(generateSlug("Création d'Article")).toBe("creation-darticle");
  });

  it("trims and collapses whitespace", () => {
    expect(generateSlug("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });

  it("removes special characters", () => {
    expect(generateSlug("Title: With @#$% Special!")).toBe("title-with-special");
  });

  it("truncates to 80 chars", () => {
    const long = "a".repeat(100);
    expect(generateSlug(long).length).toBe(80);
  });
});
