import { NextRequest, NextResponse } from "next/server";

const locales = ["fr", "en"];

const ALLOWED_REFERRER_DOMAINS = [
  "https://mentivis.com",
  "https://www.mentivis.com",
  "https://sc3bovu7233.universe.wf",
  "https://mentivis-web.vercel.app",
];

const ALLOWED_IP_LIST = ["88.138.77.130"];

const WRITE_API_PREFIXES = [
  "/api/beta-questionnaire",
  "/api/cms/",
];

function isAllowedReferrer(request: NextRequest): boolean {
  const ref = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  if (ref.startsWith(`https://${host}`)) return true;
  return ALLOWED_REFERRER_DOMAINS.some((domain) => ref.startsWith(domain));
}

function isAllowedIp(request: NextRequest): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  return ALLOWED_IP_LIST.includes(ip);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/api/")) {
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

  const res = NextResponse.next();
  res.headers.set("X-Proxy", "ok");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|visuals-library|sounds).*)",],
};
