import { NextResponse } from "next/server";
import { getPricing } from "@/lib/cms/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";
  const pricing = await getPricing(lang as "fr" | "en");
  return NextResponse.json({ pricing });
}
