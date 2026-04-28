// Centralized configuration - single source of truth
// All session-related settings should come from here

export const config = {
  session: {
    expiryHours: parseInt(process.env.SESSION_EXPIRY_HOURS ?? "12", 10),
    cookieName: "paddleocr_session",
    // Cookie attributes - documented for P2.1
    cookie: {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: parseInt(process.env.SESSION_EXPIRY_HOURS ?? "12", 10) * 60 * 60,
    },
  },
  currency: {
    default: process.env.DEFAULT_CURRENCY ?? "CNY",
    recommendedTopups: JSON.parse(
      process.env.RECOMMENDED_TOPUP_AMOUNTS ?? '["10.00","30.00","50.00","100.00"]'
    ) as string[],
  },
  pricing: JSON.parse(
    process.env.PRICING_CONFIG ?? '{"exam":"2.00","handout":"1.50","homework":"1.00"}'
  ) as Record<string, string>,
  storage: {
    endpoint: process.env.OBJECT_STORAGE_ENDPOINT ?? "http://localhost:9000",
    accessKey: process.env.OBJECT_STORAGE_ACCESS_KEY ?? "minioadmin",
    secretKey: process.env.OBJECT_STORAGE_SECRET_KEY ?? "minioadmin",
    bucket: process.env.OBJECT_STORAGE_BUCKET ?? "paddleocr-files",
    region: process.env.OBJECT_STORAGE_REGION ?? "us-east-1",
    // Upload constraints
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? "52428800", 10), // 50MB default
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    presignedUrlTtlSec: parseInt(process.env.PRESIGNED_URL_TTL_SEC ?? "3600", 10),
  },
  ocr: {
    apiUrl: process.env.PADDLEOCR_VL_API_URL ?? "",
    apiKey: process.env.PADDLEOCR_VL_API_KEY ?? "",
    pollIntervalMs: parseInt(process.env.OCR_POLL_INTERVAL_MS ?? "2000", 10),
    timeoutMs: parseInt(process.env.OCR_TIMEOUT_MS ?? "300000", 10),
    assetDownloadTimeoutMs: parseInt(
      process.env.OCR_ASSET_DOWNLOAD_TIMEOUT_MS ?? "15000",
      10
    ),
    allowSync: process.env.ALLOW_SYNC_OCR === "true",
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER ?? "mock",
    apiKey: process.env.PAYMENT_API_KEY ?? "",
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "",
  },
  worker: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY ?? "3", 10),
    pollIntervalMs: parseInt(process.env.WORKER_POLL_INTERVAL_MS ?? "1000", 10),
  },
  download: {
    urlTtlSec: parseInt(process.env.DOWNLOAD_URL_TTL_SEC ?? "3600", 10),
  },
  docx: {
    templateVersion: process.env.DOCX_TEMPLATE_VERSION ?? "1.0.0",
  },
  app: {
    baseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  },
} as const;

// Type exports for use elsewhere
export type AppConfig = typeof config;
