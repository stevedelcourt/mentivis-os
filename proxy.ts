import { NextRequest, NextResponse } from "next/server";

const locales = ["fr", "en"];

const VER = process.env.VERCEL;

const WRITE_API_PREFIXES = [
  "/api/demo",
  "/api/beta-questionnaire",
  "/api/job-applications",
  "/api/cms/",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (VER && pathname.startsWith("/api/")) {
    if (
      request.method !== "GET" &&
      request.method !== "HEAD" &&
      WRITE_API_PREFIXES.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.json(
        { error: "Write operations not available on this deployment" },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = "fr";
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|visuals-library|sounds).*)",],
};
