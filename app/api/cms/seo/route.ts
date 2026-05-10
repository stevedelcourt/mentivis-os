import { NextResponse } from "next/server";
import { getSeo, saveSeo } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";
import { SeoPageData } from "@/lib/cms/types";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const seo = await getSeo();
  return NextResponse.json({ seo });
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  try {
    const body = (await request.json()) as { lang: string; page: string; data: SeoPageData };
    const { lang, page, data } = body;

    if (!lang || !page || !data) {
      return NextResponse.json({ error: "Missing lang, page, or data" }, { status: 400 });
    }

    const seo = await getSeo();
    if (!seo[lang as "fr" | "en"]) {
      return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
    }

    seo[lang as "fr" | "en"][page] = data;
    await saveSeo(seo);

    return NextResponse.json({ success: true, seo: seo[lang as "fr" | "en"][page] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
