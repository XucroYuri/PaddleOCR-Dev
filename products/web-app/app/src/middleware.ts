import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for session validation.
 *
 * Callback allowlist (P2.2):
 * - /api/payments/callback - payment webhook, no session required
 * - /_next/* - Next.js internal
 * - /static/* - static assets
 * - /favicon.ico
 *
 * All other routes require a valid session cookie.
 */
const PUBLIC_PATHS = [
  "/api/payments/callback",
  "/api/session", // Session creation endpoint
];

const INTERNAL_PREFIXES = ["/_next/", "/static/", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (INTERNAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Skip public API paths
  if (PUBLIC_PATHS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // For API routes, check session cookie
  if (pathname.startsWith("/api/")) {
    const sessionCookie = request.cookies.get("paddleocr_session");

    if (!sessionCookie) {
      return NextResponse.json(
        { error: { code: "SESSION_REQUIRED", message: "Session required" } },
        { status: 401 }
      );
    }

    // Note: Full session validation happens in the API route via getSessionFromRequest
    // Here we only check cookie presence for early rejection
    return NextResponse.next();
  }

  // For page routes, allow through (session is checked client-side or in page components)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
