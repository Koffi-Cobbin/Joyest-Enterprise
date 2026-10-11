import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin/session";

/**
 * Next 16 replaces middleware with proxy. This gates the whole /admin area:
 * valid signed session cookie → pass through; otherwise redirect to login.
 * Server actions under /admin also re-check via requireAdmin() (defense in depth).
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authed = await verifySessionToken(token);
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    if (authed) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
