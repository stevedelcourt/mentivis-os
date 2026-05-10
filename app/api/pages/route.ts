import { NextResponse } from "next/server";
import { getPages } from "@/lib/cms/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";

  const pages = getPages();
  return NextResponse.json({ page: pages[lang as "fr" | "en"] || pages.fr });
}
