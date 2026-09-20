import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import ogManifest from "./og-manifest.json";
import { ogImageForArticle, ogImageForRoute, ogImageForPost, OG_FALLBACK } from "./og-images";

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
const OG_DIR = path.join(PUBLIC_DIR, "images", "og");

function publicExists(webPath: string): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, webPath.replace(/^\//, "")));
}

describe("og manifest sources", () => {
  it("every bloc default source exists in public/", () => {
    for (const src of Object.values(ogManifest.blocDefaults)) {
      expect(publicExists(src), `missing source ${src}`).toBe(true);
    }
  });

  it("every page source exists in public/", () => {
    for (const [route, src] of Object.entries(ogManifest.pages)) {
      expect(publicExists(src), `missing source ${src} for ${route}`).toBe(true);
    }
  });

  it("every post override source exists in public/", () => {
    for (const [slug, src] of Object.entries(ogManifest.posts)) {
      expect(publicExists(src), `missing source ${src} for post ${slug}`).toBe(true);
    }
  });
});

describe("og outputs are scraper-safe jpg", () => {
  it("article with image resolves to jpg, never avif", () => {
    expect(ogImageForArticle({ slug: "x", image: "/images/a.avif", bloc: "M" })).toBe("/images/og/x.jpg");
  });

  it("article without image falls back to bloc jpg", () => {
    expect(ogImageForArticle({ slug: "x", bloc: "N" })).toBe("/images/og/bloc-n.jpg");
  });

  it("mapped routes resolve to jpg, unmapped to fallback", () => {
    expect(ogImageForRoute("/openos")).toBe("/images/og/page-openos.jpg");
    expect(ogImageForRoute("/fr/openos")).toBe("/images/og/page-openos.jpg");
    expect(ogImageForRoute("/unknown-xyz")).toBe(OG_FALLBACK);
  });

  it("post override resolves to jpg; plain jpg/png used directly", () => {
    const base = { slug: "s", title: "", titleEn: "", excerpt: "", excerptEn: "", content: "", contentEn: "", category: "", date: "", dateISO: "", imageTag: "", imageCaption: "", gradientId: "", featured: false, published: true, createdAt: "", updatedAt: "" } as any;
    expect(ogImageForPost({ ...base, slug: "marche-education-formation-france-2026", imageUrl: "/images/marche-2026.avif" }))
      .toBe("/images/og/post-marche-education-formation-france-2026.jpg");
    expect(ogImageForPost({ ...base, slug: "s", imageUrl: "/photo.jpg" })).toBe("/photo.jpg");
    expect(ogImageForPost({ ...base, slug: "s", imageUrl: "/a.avif" })).toBe(OG_FALLBACK);
  });
});

describe("og generated files exist", () => {
  it("every generated output referenced above exists in public/images/og/", () => {
    const expected = new Set<string>();
    for (const bloc of Object.keys(ogManifest.blocDefaults)) {
      expected.add(`/images/og/bloc-${bloc.toLowerCase()}.jpg`);
    }
    for (const route of Object.keys(ogManifest.pages)) {
      expected.add(ogImageForRoute(route));
    }
    for (const slug of Object.keys(ogManifest.posts)) {
      expected.add(`/images/og/post-${slug}.jpg`);
    }
    for (const out of expected) {
      expect(publicExists(out), `missing generated OG ${out} - run npm run og`).toBe(true);
    }
  });
});

describe("seed posts coverage", () => {
  it("every seed post with avif/webp image has a manifest.posts entry", () => {
    const seedsDir = path.join(__dirname, "..", "cms", "seeds");
    if (!fs.existsSync(seedsDir)) return;
    for (const file of fs.readdirSync(seedsDir).filter((f) => f.endsWith(".json"))) {
      const post = JSON.parse(fs.readFileSync(path.join(seedsDir, file), "utf-8"));
      if (post.imageUrl && /\.(avif|webp)$/i.test(post.imageUrl)) {
        expect(
          (ogManifest.posts as Record<string, string>)[post.slug],
          `seed post ${post.slug} needs manifest.posts entry - run npm run og`
        ).toBeTruthy();
      }
    }
  });
});
