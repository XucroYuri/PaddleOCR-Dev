/**
 * P8: Download Grant Management
 * Handles presigned URL generation and download authorization
 */

import crypto from "node:crypto";
import { db, downloadGrants } from "@/db";
import { eq } from "drizzle-orm";
import { config } from "./config";
import { getStorage } from "./storage";

/**
 * P8.2: Create a download grant for a task's output file
 */
export async function createDownloadGrant(
  sessionId: string,
  taskId: string,
  fileKey: string
): Promise<{ grantId: string; downloadUrl: string; expiresAt: string }> {
  const grantId = `grant_${crypto.randomBytes(8).toString("hex")}`;
  const storage = getStorage();

  // Generate presigned URL
  const downloadUrl = await storage.presignedGet(
    fileKey,
    config.download.urlTtlSec
  );

  // Calculate expiration
  const expiresAt = new Date(
    Date.now() + config.download.urlTtlSec * 1000
  ).toISOString();

  // Insert grant record
  await db.insert(downloadGrants).values({
    grantId,
    anonymousSessionId: sessionId,
    taskId,
    fileKey,
    signedUrl: downloadUrl,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  return { grantId, downloadUrl, expiresAt };
}

/**
 * P8.2: Validate and refresh a download grant
 */
export async function validateDownloadGrant(
  grantId: string,
  sessionId: string
): Promise<{ valid: boolean; downloadUrl?: string; expired?: boolean }> {
  const [grant] = await db
    .select()
    .from(downloadGrants)
    .where(
      eq(downloadGrants.grantId, grantId)
    )
    .limit(1);

  if (!grant) {
    return { valid: false };
  }

  // Check session ownership
  if (grant.anonymousSessionId !== sessionId) {
    return { valid: false };
  }

  // Check expiration
  const now = new Date();
  const expiresAt = new Date(grant.expiresAt);

  if (now >= expiresAt) {
    return { valid: false, expired: true };
  }

  // Return existing URL if still valid
  if (grant.signedUrl) {
    const grantExpires = new Date(grant.expiresAt);
    const timeUntilExpiry = grantExpires.getTime() - now.getTime();

    // Refresh if less than 5 minutes remaining
    if (timeUntilExpiry < 5 * 60 * 1000) {
      const storage = getStorage();
      const newUrl = await storage.presignedGet(
        grant.fileKey,
        config.download.urlTtlSec
      );

      await db
        .update(downloadGrants)
        .set({
          signedUrl: newUrl,
          expiresAt: new Date(
            Date.now() + config.download.urlTtlSec * 1000
          ).toISOString(),
        })
        .where(eq(downloadGrants.grantId, grantId));

      return { valid: true, downloadUrl: newUrl };
    }

    return { valid: true, downloadUrl: grant.signedUrl };
  }

  // Generate new URL
  const storage = getStorage();
  const downloadUrl = await storage.presignedGet(
    grant.fileKey,
    config.download.urlTtlSec
  );

  await db
    .update(downloadGrants)
    .set({
      signedUrl: downloadUrl,
      expiresAt: new Date(
        Date.now() + config.download.urlTtlSec * 1000
      ).toISOString(),
    })
    .where(eq(downloadGrants.grantId, grantId));

  return { valid: true, downloadUrl };
}

/**
 * P8.3: Clean up expired download grants
 */
export async function cleanupExpiredGrants(): Promise<number> {
  const now = new Date().toISOString();

  // Note: In production, we'd use a proper DELETE with WHERE clause
  // For now, this is a placeholder
  const expired = await db
    .select()
    .from(downloadGrants)
    .limit(1000);

  const toDelete = expired.filter((g) => g.expiresAt < now);

  // Delete each expired grant
  for (const grant of toDelete) {
    await db
      .delete(downloadGrants)
      .where(eq(downloadGrants.grantId, grant.grantId));
  }

  return toDelete.length;
}
