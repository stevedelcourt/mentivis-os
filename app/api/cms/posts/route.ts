import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/cms/db";
import { generateSlug } from "@/lib/cms/utils";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "published", "draft", or null for all

  let posts = getAllPosts();
  if (status === "published") posts = posts.filter((p) => p.published);
  if (status === "draft") posts = posts.filter((p) => !p.published);

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const auth = requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { title, excerpt, content, category, date, dateISO, imageUrl, imageTag, imageCaption, featured, published } = body;

    if (!title || !excerpt || !content || !category || !date || !dateISO) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const posts = getAllPosts();
    let uniqueSlug = slug;
    let counter = 1;
    while (posts.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = createPost({
      slug: uniqueSlug,
      title,
      excerpt,
      content,
      category,
      date,
      dateISO,
      imageUrl: imageUrl || undefined,
      imageTag: imageTag || undefined,
      imageCaption: imageCaption || undefined,
      featured: !!featured,
      published: !!published,
    });

    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
