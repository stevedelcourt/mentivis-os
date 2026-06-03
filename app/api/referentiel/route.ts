import { NextResponse } from "next/server";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const article = await getReferentielArticle(slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
  }

  const articles = await getReferentielArticles();
  return NextResponse.json({ articles });
}
