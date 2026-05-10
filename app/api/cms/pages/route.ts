import { NextResponse } from "next/server";
import { getPages, savePages } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";

  const pages = await getPages();
  return NextResponse.json({ page: pages[lang as "fr" | "en"] || pages.fr });
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { lang, hero } = body;

    if (!lang || !hero) {
      return NextResponse.json({ error: "Missing lang or hero" }, { status: 400 });
    }

    const pages = await getPages();
    pages[lang as "fr" | "en"] = { hero };
    await savePages(pages);

    return NextResponse.json({ success: true, page: pages[lang as "fr" | "en"] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
