import { NextResponse } from "next/server";
import { createSession, getSessionFromRequest } from "@/lib/session-db";

/**
 * POST /api/session
 * Creates a new anonymous session with database persistence.
 * Returns non-sensitive session data and sets HttpOnly cookie.
 */
export async function POST() {
  try {
    const session = await createSession();

    // Return only non-sensitive fields
    // Never expose session ID in response body (P2.1: no token in URL/response)
    return NextResponse.json({
      data: {
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        walletBalance: session.walletBalance,
      },
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json(
      { error: { code: "SESSION_CREATE_FAILED", message: "Failed to create session" } },
      { status: 500 }
    );
  }
}

/**
 * GET /api/session
 * Returns current session info if valid cookie exists.
 */
export async function GET() {
  try {
    const session = await getSessionFromRequest();

    if (!session) {
      return NextResponse.json(
        { error: { code: "SESSION_NOT_FOUND", message: "Session not found or expired" } },
        { status: 401 }
      );
    }

    return NextResponse.json({
      data: {
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        walletBalance: session.walletBalance,
      },
    });
  } catch (error) {
    console.error("Failed to get session:", error);
    return NextResponse.json(
      { error: { code: "SESSION_GET_FAILED", message: "Failed to get session" } },
      { status: 500 }
    );
  }
}
