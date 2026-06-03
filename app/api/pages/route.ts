import { NextResponse } from "next/server";
import { getPage, getPages } from "@/lib/cms/db";
import { PAGE_KEYS, PageKey } from "@/lib/cms/types";

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
  const lang = searchParams.get("lang") || "fr";
  const pageParam = searchParams.get("page");

  if (pageParam && PAGE_KEYS.includes(pageParam as PageKey)) {
    const pageData = await getPage(pageParam as PageKey);
    return NextResponse.json({ page: pageData[lang as "fr" | "en"] }, { headers: corsHeaders(request) });
  }

  const pages = await getPages();
  const langKey = (lang === "fr" || lang === "en" ? lang : "fr") as "fr" | "en";
  return NextResponse.json({ page: (pages[langKey] || pages.fr).homepage }, { headers: corsHeaders(request) });
}
