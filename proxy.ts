import { NextRequest, NextResponse } from "next/server";

const locales = ["fr", "en"];

const ALLOWED_REFERRERS = (process.env.ALLOWED_REFERRERS || "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const ALLOWED_IPS = (process.env.ALLOWED_IPS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const WRITE_API_PREFIXES = [
  "/api/beta-questionnaire",
  "/api/cms/",
];

function isAllowedReferrer(request: NextRequest): boolean {
  const ref = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  if (ref.startsWith(`https://${host}`)) return true;
  if (ALLOWED_REFERRERS.length === 0) return true;
  return ALLOWED_REFERRERS.some((domain) => ref.startsWith(domain));
}

function isAllowedIp(request: NextRequest): boolean {
  if (ALLOWED_IPS.length === 0) return false;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  return ALLOWED_IPS.includes(ip);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (ALLOWED_REFERRERS.length > 0 && !pathname.startsWith("/api/")) {
    if (!isAllowedIp(request) && !isAllowedReferrer(request)) {
      return new NextResponse("Access denied", { status: 403 });
    }
  }

  if (pathname.startsWith("/api/")) {
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
