import { cookies } from "next/headers";
import { db, anonymousSessions, type AnonymousSession } from "@/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { config } from "./config";
import crypto from "node:crypto";

/**
 * Creates a new anonymous session and stores it in the database.
 * Sets an HttpOnly cookie for session tracking.
 */
export async function createSession(): Promise<AnonymousSession> {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + config.session.expiryHours * 60 * 60 * 1000
  );

  const sessionId = `sess_${crypto.randomBytes(12).toString("hex")}`;

  const [session] = await db
    .insert(anonymousSessions)
    .values({
      anonymousSessionId: sessionId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      walletBalance: "0.00",
      status: "active",
    })
    .returning();

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(config.session.cookieName, sessionId, config.session.cookie);

  return session;
}

/**
 * Gets the current session from the request cookie.
 * Validates expiry and returns null if invalid or expired.
 */
export async function getSessionFromRequest(): Promise<AnonymousSession | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(config.session.cookieName)?.value;

  if (!sessionId) {
    return null;
  }

  const now = new Date().toISOString();

  const sessions = await db
    .select()
    .from(anonymousSessions)
    .where(
      and(
        eq(anonymousSessions.anonymousSessionId, sessionId),
        eq(anonymousSessions.status, "active"),
        gt(anonymousSessions.expiresAt, now)
      )
    )
    .limit(1);

  return sessions[0] ?? null;
}

/**
 * Gets the session or throws an error if not found.
 * Use this in API routes that require authentication.
 */
export async function requireSession(): Promise<AnonymousSession> {
  const session = await getSessionFromRequest();
  if (!session) {
    throw new SessionError("SESSION_NOT_FOUND", "Session not found or expired");
  }
  return session;
}

/**
 * Updates session balance. Called after payment or refund.
 */
export async function updateSessionBalance(
  sessionId: string,
  deltaAmount: string
): Promise<void> {
  // Use raw SQL for atomic increment/decrement
  await db.execute(sql`
    UPDATE anonymous_sessions
    SET wallet_balance = (wallet_balance + ${deltaAmount})::decimal(12,2)
    WHERE anonymous_session_id = ${sessionId}
  `);
}

/**
 * Marks a session as expired.
 */
export async function expireSession(sessionId: string): Promise<void> {
  await db
    .update(anonymousSessions)
    .set({ status: "expired" })
    .where(eq(anonymousSessions.anonymousSessionId, sessionId));
}

/**
 * Custom error class for session-related errors.
 */
export class SessionError extends Error {
  constructor(
    public code: "SESSION_NOT_FOUND" | "SESSION_EXPIRED" | "SESSION_INVALID",
    message: string
  ) {
    super(message);
    this.name = "SessionError";
  }
}
