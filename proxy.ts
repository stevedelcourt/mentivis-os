import { NextRequest, NextResponse } from "next/server";

const locales = ["fr", "en"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip proxy for static files (paths ending with a file extension)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Skip locale redirect for landing page
  if (pathname === "/manager-ingenierie-durable/" || pathname.startsWith("/manager-ingenierie-durable/")) {
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
  res.headers.set("x-current-path", pathname);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|visuals-library|sounds).*)",],
};
