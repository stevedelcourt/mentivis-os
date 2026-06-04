import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/cms/db";

function localizePost(p: any, lang: string) {
  if (lang === "en") {
    if (p.titleEn) p.title = p.titleEn;
    if (p.excerptEn) p.excerpt = p.excerptEn;
    if (p.contentEn) p.content = p.contentEn;
  }
  delete p.titleEn; delete p.excerptEn; delete p.contentEn;
  return p;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: localizePost(post, lang) });
}
