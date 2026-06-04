import { NextResponse } from "next/server";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";

function localize(a: any, lang: string) {
  if (lang === "en" && a.contentEn) a.content = a.contentEn;
  delete a.contentEn;
  return a;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang") || "fr";

  if (slug) {
    const article = await getReferentielArticle(slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article: localize(article, lang) });
  }

  const articles = await getReferentielArticles();
  return NextResponse.json({ articles: articles.map((a) => localize(a, lang)) });
}
