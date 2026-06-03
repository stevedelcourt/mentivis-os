import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/cms/db";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
  }
  return {};
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let posts = await getPublishedPosts();
  if (category && category !== "all") {
    posts = posts.filter((p) => p.category.split(",").includes(category));
  }

  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
  });

  return NextResponse.json({ posts }, { headers: corsHeaders(request) });
}
