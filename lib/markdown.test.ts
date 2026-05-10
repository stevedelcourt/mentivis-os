import { describe, it, expect } from "vitest";
import { renderMarkdown, stripMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("converts headings to HTML", () => {
    const html = renderMarkdown("# Hello");
    expect(html).toContain("<h1>Hello</h1>");
  });

  it("converts bold text", () => {
    const html = renderMarkdown("**bold**");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("converts lists", () => {
    const html = renderMarkdown("- item 1\n- item 2");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>item 1</li>");
  });
});

describe("stripMarkdown", () => {
  it("removes heading syntax", () => {
    expect(stripMarkdown("# Title")).toBe("Title");
  });

  it("removes bold markers", () => {
    expect(stripMarkdown("**bold**")).toBe("bold");
  });

  it("removes inline code", () => {
    expect(stripMarkdown("`code`")).toBe("code");
  });

  it("converts links to text", () => {
    expect(stripMarkdown("[link](http://example.com)")).toBe("link");
  });

  it("removes images", () => {
    expect(stripMarkdown("![alt](image.png)")).toBe("");
  });

  it("replaces newlines with spaces", () => {
    expect(stripMarkdown("line1\nline2")).toBe("line1 line2");
  });
});
