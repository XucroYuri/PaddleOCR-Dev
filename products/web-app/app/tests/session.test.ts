import { describe, expect, test } from "vitest";

import { createAnonymousSession, sessionExpiryHours } from "@/lib/session";

describe("anonymous session", () => {
  test("creates a session with zero wallet balance and a future expiry", () => {
    const session = createAnonymousSession(new Date("2026-03-22T00:00:00.000Z"));

    expect(session.anonymousSessionId).toMatch(/^sess_[a-z0-9]{24}$/);
    expect(session.walletBalance).toBe(0);
    expect(session.expiresAt).toBe("2026-03-22T12:00:00.000Z");
    expect(sessionExpiryHours).toBe(12);
  });
});

