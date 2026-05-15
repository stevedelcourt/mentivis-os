import { NextResponse } from "next/server";
import { getPages, getPage, savePage } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";
import { PAGE_KEYS, PageKey } from "@/lib/cms/types";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";
  const page = (searchParams.get("page") || "homepage") as PageKey;

  if (!PAGE_KEYS.includes(page)) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  const pageData = await getPage(page);
  return NextResponse.json({ page: pageData[lang as "fr" | "en"], pages: PAGE_KEYS });
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { lang, page, hero } = body;

    if (!lang || !hero) {
      return NextResponse.json({ error: "Missing lang or hero" }, { status: 400 });
    }

    const pageKey = (page || "homepage") as PageKey;
    if (!PAGE_KEYS.includes(pageKey)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }

    await savePage(pageKey, lang as "fr" | "en", hero);

    return NextResponse.json({ success: true, page: pageKey });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
