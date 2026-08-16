import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/cms/db";
import { generateSlug } from "@/lib/cms/utils";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "published", "draft", or null for all

  let posts = await getAllPosts();
  if (status === "published") posts = posts.filter((p) => p.published);
  if (status === "draft") posts = posts.filter((p) => !p.published);

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { title, titleEn, excerpt, excerptEn, content, contentEn, category, date, dateISO, imageUrl, imageTag, imageCaption, gradientId, featured, published, pdfUrl, pdfTitle, pdfTitleEn, pdfImage, pdfContext } = body;

    if (!title || !excerpt || !content || !category || !date || !dateISO) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const posts = await getAllPosts();
    let uniqueSlug = slug;
    let counter = 1;
    while (posts.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await createPost({
      slug: uniqueSlug,
      title,
      titleEn: titleEn || "",
      excerpt,
      excerptEn: excerptEn || "",
      content,
      contentEn: contentEn || "",
      category,
      date,
      dateISO,
      imageUrl: imageUrl || undefined,
      imageTag: imageTag || undefined,
      imageCaption: imageCaption || undefined,
      gradientId: gradientId ?? undefined,
      featured: !!featured,
      published: !!published,
      pdfUrl: pdfUrl || undefined,
      pdfTitle: pdfTitle || "",
      pdfTitleEn: pdfTitleEn || "",
      pdfImage: pdfImage || "",
      pdfContext: pdfContext || "",
    });

    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
