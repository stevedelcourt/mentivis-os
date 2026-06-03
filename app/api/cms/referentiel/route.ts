import { NextResponse } from "next/server";
import { getAllReferentielArticles, getReferentielArticle, saveReferentielArticle, deleteReferentielArticle } from "@/lib/cms/db";
import { generateSlug } from "@/lib/cms/utils";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const articles = await getAllReferentielArticles();
    const article = articles.find(a => a.id === parseInt(id));
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
  }

  const articles = await getAllReferentielArticles();
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await saveReferentielArticle({
      title: body.title,
      content: body.content,
      position: body.position ?? 0,
      published: !!body.published,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    if (!body.id || !body.title || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await saveReferentielArticle({
      id: body.id,
      slug: body.slug,
      title: body.title,
      content: body.content,
      position: body.position ?? 0,
      published: !!body.published,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteReferentielArticle(parseInt(id));
  return NextResponse.json({ success: true });
}
