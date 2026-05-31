import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/cms/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let posts = await getPublishedPosts();

  if (category && category !== "all") {
    posts = posts.filter((p) => p.category.split(",").includes(category));
  }

  if (process.env.VERCEL) {
    posts = posts.map((p) => ({
      ...p,
      imageUrl: p.imageUrl?.startsWith("/api/uploads/") ? "" : p.imageUrl,
    }));
  }

  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
  });

  return NextResponse.json({ posts });
}
