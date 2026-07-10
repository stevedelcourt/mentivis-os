import { NextResponse } from "next/server";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";

function localize(a: any, lang: string) {
  if (lang === "en") {
    if (a.titleEn) a.title = a.titleEn;
    if (a.contentEn) a.content = a.contentEn;
    if (a.chapeauEn) a.chapeau = a.chapeauEn;
  }
  delete a.titleEn;
  delete a.contentEn;
  delete a.chapeauEn;
  delete a.faqEn;
  return a;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang") || "fr";
  const bloc = searchParams.get("bloc");
  const cible = searchParams.get("cible");

  if (slug) {
    const article = await getReferentielArticle(slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article: localize(article, lang) });
  }

  const articles = await getReferentielArticles({ bloc: bloc || undefined, cible: cible || undefined });
  return NextResponse.json({ articles: articles.map((a) => localize(a, lang)) });
}
