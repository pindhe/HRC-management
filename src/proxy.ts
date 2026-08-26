import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/prefs";
import { canAccess, parseRole, ROLE_HOME } from "@/lib/roles";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = parseRole(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/";

  if (!role && !isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (role && isLogin) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (role && !canAccess(pathname, role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon|apple-icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
