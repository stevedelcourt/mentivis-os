import { NextResponse } from "next/server";
import { getPage, getPages } from "@/lib/cms/db";
import { PAGE_KEYS, PageKey } from "@/lib/cms/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";
  const pageParam = searchParams.get("page");

  if (pageParam && PAGE_KEYS.includes(pageParam as PageKey)) {
    const pageData = await getPage(pageParam as PageKey);
    return NextResponse.json({ page: pageData[lang as "fr" | "en"] });
  }

  // Backward compatible: return homepage
  const pages = await getPages();
  return NextResponse.json({ page: pages.fr.homepage });
}
