import { NextResponse } from "next/server";
import { getPricing, savePricing } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const pricing = await getPricing();
  return NextResponse.json({ pricing });
}

export async function PUT(request: Request) {
  const auth = await requireRole(request, ["god", "tarifs"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const pricing = await getPricing();

    if (body.learningos) pricing.learningos = body.learningos;
    if (body.pipelineos) pricing.pipelineos = body.pipelineos;
    if (body.api) pricing.api = body.api;

    await savePricing(pricing);
    return NextResponse.json({ success: true, pricing });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
