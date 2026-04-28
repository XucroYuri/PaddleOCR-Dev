/**
 * P6: OCR Integration Module
 * Handles PaddleOCR-VL-1.5 API interactions
 */

import { z } from "zod";
import { config } from "@/lib/config";

/**
 * P6.3: OCR Result Envelope Schema
 */
export const OcrResultEnvelopeSchema = z.object({
  markdownText: z.string(),
  structuredJson: z.record(z.string(), z.unknown()).optional(),
  assets: z.array(
    z.object({
      type: z.enum(["image", "table", "equation"]),
      key: z.string(),
      url: z.string().url(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
  ),
  metadata: z.object({
    pageCount: z.number().optional(),
    processingTimeMs: z.number().optional(),
    confidence: z.number().optional(),
  }),
});

export type OcrResultEnvelope = z.infer<typeof OcrResultEnvelopeSchema>;

/**
 * P6.2: Async OCR Job Status
 */
export type OcrJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

/**
 * P6.2: OCR Job Response
 */
export interface OcrJobResponse {
  jobId: string;
  status: OcrJobStatus;
  result?: OcrResultEnvelope;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * P6.1: OCR Configuration Validation
 */
export function validateOcrConfig(): void {
  if (!config.ocr.apiUrl) {
    throw new Error("PADDLEOCR_VL_API_URL is required");
  }
  if (!config.ocr.apiKey) {
    throw new Error("PADDLEOCR_VL_API_KEY is required");
  }
}

/**
 * P6.2: Submit document for async OCR processing
 * P6.2: submitAsyncDocument 实现
 */
export async function submitAsyncDocument(
  fileUrl: string,
  options?: {
    documentType?: "exam" | "handout" | "homework";
    callbackUrl?: string;
  }
): Promise<{ jobId: string }> {
  validateOcrConfig();

  const response = await fetch(`${config.ocr.apiUrl}/v1/ocr/async`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ocr.apiKey}`,
    },
    body: JSON.stringify({
      file_url: fileUrl,
      document_type: options?.documentType ?? "general",
      callback_url: options?.callbackUrl,
      output_format: "markdown",
      include_structure: true,
      extract_images: true,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      // P6.2: 429 rate limit handling
      const retryAfter = response.headers.get("Retry-After");
      throw new OcrRateLimitError(
        parseInt(retryAfter ?? "60", 10)
      );
    }

    throw new OcrApiError(
      `OCR API error: ${response.status}`,
      "OCR_API_ERROR"
    );
  }

  const data = await response.json();
  return { jobId: data.job_id };
}

/**
 * P6.2: Poll OCR job status
 * P6.2: 轮询循环
 */
export async function pollOcrJob(
  jobId: string,
  options?: {
    onProgress?: (status: OcrJobStatus) => void;
    signal?: AbortSignal;
  }
): Promise<OcrJobResponse> {
  const startTime = Date.now();
  const { pollIntervalMs, timeoutMs } = config.ocr;

  while (true) {
    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      // P6.2: 轮询超时
      throw new OcrTimeoutError(jobId);
    }

    // Check abort signal
    if (options?.signal?.aborted) {
      throw new Error("OCR polling aborted");
    }

    // Get job status
    const job = await getOcrJobStatus(jobId);

    // Notify progress
    options?.onProgress?.(job.status);

    // Check completion
    if (job.status === "completed") {
      return job;
    }

    if (job.status === "failed") {
      throw new OcrProcessingError(
        job.error?.message ?? "OCR processing failed",
        job.error?.code ?? "OCR_FAILED"
      );
    }

    // Wait before next poll
    await sleep(pollIntervalMs);
  }
}

/**
 * P6.2: Get OCR job status
 */
export async function getOcrJobStatus(jobId: string): Promise<OcrJobResponse> {
  validateOcrConfig();

  const response = await fetch(
    `${config.ocr.apiUrl}/v1/ocr/async/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${config.ocr.apiKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new OcrApiError(
      `Failed to get OCR job status: ${response.status}`,
      "OCR_STATUS_ERROR"
    );
  }

  const data = await response.json();

  // P6.3: Normalize response to OcrResultEnvelope
  if (data.status === "completed" && data.result) {
    const normalized = normalizeOcrResult(data.result);
    return {
      jobId: data.job_id,
      status: "completed",
      result: normalized,
    };
  }

  return {
    jobId: data.job_id,
    status: mapJobStatus(data.status),
    error: data.error
      ? {
          code: data.error.code ?? "UNKNOWN",
          message: data.error.message ?? "Unknown error",
        }
      : undefined,
  };
}

/**
 * P6.3: Normalize OCR provider response to OcrResultEnvelope
 * P6.3: OcrResultEnvelope schema
 */
export function normalizeOcrResult(rawResult: unknown): OcrResultEnvelope {
  // Handle PaddleOCR-VL-1.5 API response format
  const result = rawResult as {
    markdown?: { text?: string; images?: Array<{ key: string; url: string; type?: string }> };
    structured?: Record<string, unknown>;
    pages?: unknown[];
    images?: Array<{ key: string; url: string; type?: string }>;
    metadata?: {
      page_count?: number;
      processing_time_ms?: number;
      confidence?: number;
    };
  };

  const markdownText = result.markdown?.text ?? "";
  const assets = [
    ...(result.markdown?.images ?? []),
    ...(result.images ?? []),
  ].map((img) => ({
    type: (img.type as "image" | "table" | "equation") ?? "image",
    key: img.key,
    url: img.url,
    metadata: undefined,
  }));

  return OcrResultEnvelopeSchema.parse({
    markdownText,
    structuredJson: result.structured,
    assets,
    metadata: {
      pageCount: result.metadata?.page_count ?? result.pages?.length,
      processingTimeMs: result.metadata?.processing_time_ms,
      confidence: result.metadata?.confidence,
    },
  });
}

/**
 * P6.4: Submit document for sync OCR processing (dev only)
 * P6.4: 同步 OCR 仅开发环境
 */
export async function submitSyncDocument(
  fileUrl: string
): Promise<OcrResultEnvelope> {
  if (!config.ocr.allowSync) {
    throw new Error(
      "Sync OCR is disabled. Set ALLOW_SYNC_OCR=true and ensure NODE_ENV!=production"
    );
  }

  validateOcrConfig();

  const response = await fetch(`${config.ocr.apiUrl}/v1/ocr/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ocr.apiKey}`,
    },
    body: JSON.stringify({
      file_url: fileUrl,
      output_format: "markdown",
      include_structure: true,
      extract_images: true,
    }),
  });

  if (!response.ok) {
    throw new OcrApiError(
      `Sync OCR API error: ${response.status}`,
      "OCR_SYNC_ERROR"
    );
  }

  const data = await response.json();
  return normalizeOcrResult(data);
}

/**
 * P7.3: Download OCR asset with timeout
 */
export async function downloadOcrAsset(
  url: string,
  timeoutMs: number = config.ocr.assetDownloadTimeoutMs
): Promise<Buffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to download asset: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Helper: Map API status to internal status
 */
function mapJobStatus(apiStatus: string): OcrJobStatus {
  const statusMap: Record<string, OcrJobStatus> = {
    pending: "pending",
    queued: "pending",
    processing: "processing",
    running: "processing",
    completed: "completed",
    done: "completed",
    failed: "failed",
    error: "failed",
  };
  return statusMap[apiStatus] ?? "pending";
}

/**
 * Helper: Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Custom Error Classes
 */
export class OcrError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "OcrError";
  }
}

export class OcrApiError extends OcrError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "OcrApiError";
  }
}

export class OcrRateLimitError extends OcrError {
  constructor(public retryAfterSec: number) {
    super(`Rate limited. Retry after ${retryAfterSec}s`, "OCR_RATE_LIMITED");
    this.name = "OcrRateLimitError";
  }
}

export class OcrTimeoutError extends OcrError {
  constructor(public jobId: string) {
    super(`OCR job ${jobId} timed out`, "OCR_UPSTREAM_TIMEOUT");
    this.name = "OcrTimeoutError";
  }
}

export class OcrProcessingError extends OcrError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "OcrProcessingError";
  }
}
