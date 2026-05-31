import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WRITE_API_PATTERNS = [
  "/api/demo",
  "/api/beta-questionnaire",
  "/api/job-applications",
  "/api/cms/",
];

export function middleware(request: NextRequest) {
  if (!process.env.VERCEL) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const method = request.method;

  if (
    method === "POST" &&
    WRITE_API_PATTERNS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.json(
      { error: "Write operations not available on this deployment" },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
