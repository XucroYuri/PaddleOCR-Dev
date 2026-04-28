import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/session-db";
import { getStorage, buildObjectKey } from "@/lib/storage";
import { apiError, ErrorCodes } from "@/lib/api-utils";
import { config } from "@/lib/config";
import crypto from "node:crypto";

const initUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string(),
  size: z.number().positive(),
});

/**
 * POST /api/uploads/init
 * P4.2: Initialize upload, validate MIME/size, return presigned URL
 */
export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const parsed = initUploadSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(ErrorCodes.VALIDATION_ERROR, "Invalid request", 400, parsed.error.issues);
    }

    const { filename, contentType, size } = parsed.data;

    // P4.2: Validate MIME whitelist
    const allowedTypes = config.storage.allowedMimeTypes as unknown as string[];
    if (!allowedTypes.includes(contentType)) {
      return apiError(
        ErrorCodes.INVALID_FILE_TYPE,
        `File type not allowed. Allowed types: ${config.storage.allowedMimeTypes.join(", ")}`,
        400
      );
    }

    // P4.2: Validate maxSize
    if (size > config.storage.maxFileSize) {
      return apiError(
        ErrorCodes.FILE_TOO_LARGE,
        `File too large. Max size: ${config.storage.maxFileSize} bytes`,
        400
      );
    }

    // Generate a temporary task ID for the upload
    // The actual task will be created when POST /api/tasks is called
    const tempTaskId = `temp_${crypto.randomBytes(8).toString("hex")}`;
    const sourceFileKey = buildObjectKey(
      session.anonymousSessionId,
      tempTaskId,
      "source",
      filename
    );

    // Generate presigned PUT URL
    const storage = getStorage();
    const presignedUrl = await storage.presignedPut(
      sourceFileKey,
      config.storage.presignedUrlTtlSec
    );

    const expiresAt = new Date(
      Date.now() + config.storage.presignedUrlTtlSec * 1000
    ).toISOString();

    return NextResponse.json({
      data: {
        uploadUrl: presignedUrl,
        sourceFileKey,
        expiresAt,
        headers: {
          "Content-Type": contentType,
        },
      },
    });
  } catch (error) {
    console.error("Upload init error:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Failed to initialize upload", 500);
  }
}
