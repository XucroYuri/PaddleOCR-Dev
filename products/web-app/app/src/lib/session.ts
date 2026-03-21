import crypto from "node:crypto";

export const sessionExpiryHours = 12;

export interface AnonymousSession {
  anonymousSessionId: string;
  walletBalance: number;
  createdAt: string;
  expiresAt: string;
}

export function createAnonymousSession(now = new Date()): AnonymousSession {
  const createdAt = new Date(now);
  const expiresAt = new Date(createdAt);
  expiresAt.setHours(expiresAt.getHours() + sessionExpiryHours);

  return {
    anonymousSessionId: `sess_${crypto.randomBytes(12).toString("hex")}`,
    walletBalance: 0,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

