import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/cms/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const result = { ...post };
  if (process.env.VERCEL && result.imageUrl?.startsWith("/api/uploads/")) {
    result.imageUrl = "";
  }

  return NextResponse.json({ post: result });
}
