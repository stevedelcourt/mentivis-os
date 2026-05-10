import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/cms/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let posts = getPublishedPosts();
  if (category && category !== "all") {
    posts = posts.filter((p) => p.category === category);
  }

  return NextResponse.json({ posts });
}
