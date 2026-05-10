import { NextResponse } from "next/server";
import { getPricing } from "@/lib/cms/db";

export async function GET() {
  const pricing = getPricing();
  return NextResponse.json({ pricing });
}
