import { NextRequest, NextResponse } from "next/server";

const locales = ["fr", "en"];

// Seul mentivisos.com (+ www) est publiquement visible. Tous les autres
// hosts (domaine masqué, hosts techniques *.universe.wf, miroir, vercel.app)
// continuent d'être servis normalement mais reçoivent X-Robots-Tag: noindex.
const CANONICAL_HOSTS = ["mentivisos.com", "www.mentivisos.com"];

function isCanonicalHost(request: NextRequest): boolean {
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(",")[0].trim().toLowerCase().split(":")[0];
  return CANONICAL_HOSTS.includes(host);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip proxy for static files (paths ending with a file extension)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = "fr";
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url),
      308
    );
  }

  const res = NextResponse.next();
  res.headers.set("x-current-path", pathname);
  res.headers.set("x-pathname", pathname);
  if (!isCanonicalHost(request)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|visuals-library|sounds|sitemap.xml|robots.txt|llms.txt).*)",],
};
