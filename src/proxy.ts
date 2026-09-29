import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

function redirectTo(url: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(url, request.url), 302);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = verifySession(token) !== null;

  const res = NextResponse.next();
  res.headers.set("x-pg-pathname", pathname);

  if (pathname.startsWith("/dashboard") || pathname === "/dashboard") {
    if (!authed) return redirectTo("/login", request);
    return res;
  }

  if (pathname === "/login" || pathname === "/register") {
    if (authed) return redirectTo("/dashboard", request);
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|mp4|mov|webm)).*)",
  ],
};