import { marked } from "marked";

// Configure marked for blog content
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Parse markdown content to HTML string.
 * Use with dangerouslySetInnerHTML in React components.
 */
export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}

/**
 * Strip markdown syntax to produce plain text.
 * Used for excerpts and previews where HTML is not desired.
 */
export function stripMarkdown(content: string): string {
  return content
    .replace(/#+\s/g, "") // headings
    .replace(/\*\*|__/g, "") // bold
    .replace(/\*|_/g, "") // italic
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // inline code / code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\n/g, " ") // newlines to spaces
    .trim();
}
