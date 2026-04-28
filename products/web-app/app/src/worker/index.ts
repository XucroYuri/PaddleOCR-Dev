/**
 * P7: Task Worker
 * Main worker loop for processing OCR and DOCX generation tasks
 */

import { db, processingTasks, ocrArtifacts } from "@/db";
import { eq, and, inArray, lt } from "drizzle-orm";
import { config } from "@/lib/config";
import {
  submitAsyncDocument,
  pollOcrJob,
  downloadOcrAsset,
  normalizeOcrResult,
  OcrTimeoutError,
  OcrRateLimitError,
  OcrProcessingError,
  type OcrResultEnvelope,
} from "@/lib/ocr";
import { getStorage, buildObjectKey } from "@/lib/storage";
import { refundBalance } from "@/lib/payment";
import { generateDocx } from "./docx-generator";

/**
 * P7.1: Worker state
 */
interface WorkerState {
  isRunning: boolean;
  activeTasks: Set<string>;
  concurrency: number;
}

const state: WorkerState = {
  isRunning: false,
  activeTasks: new Set(),
  concurrency: config.worker.concurrency,
};

/**
 * P7.1: Main worker loop
 * P7.1: Worker 主循环
 */
export async function startWorker(): Promise<void> {
  console.log("[Worker] Starting task worker...");
  console.log(`[Worker] Concurrency: ${state.concurrency}`);
  console.log(`[Worker] Poll interval: ${config.worker.pollIntervalMs}ms`);

  state.isRunning = true;

  // P7.1: Graceful shutdown handlers
  setupGracefulShutdown();

  while (state.isRunning) {
    try {
      // Process tasks up to concurrency limit
      while (state.activeTasks.size < state.concurrency) {
        const task = await grabNextTask();

        if (!task) {
          break; // No tasks available
        }

        // Process task asynchronously
        processTask(task).finally(() => {
          state.activeTasks.delete(task.taskId);
        });

        state.activeTasks.add(task.taskId);
      }

      // Wait before next poll
      await sleep(config.worker.pollIntervalMs);
    } catch (error) {
      console.error("[Worker] Error in main loop:", error);
      await sleep(5000); // Backoff on error
    }
  }

  console.log("[Worker] Shut down complete");
}

/**
 * P7.2: Grab next task using SKIP LOCKED
 * P7.2: SKIP LOCKED 抢任务
 */
async function grabNextTask() {
  // Query for tasks in 'paid' or 'queued' status
  // In production, this should use SELECT ... FOR UPDATE SKIP LOCKED
  // For now, we use a simpler approach with status update

  const tasks = await db
    .select()
    .from(processingTasks)
    .where(
      inArray(processingTasks.status, ["paid", "queued"])
    )
    .orderBy(processingTasks.createdAt)
    .limit(1);

  if (tasks.length === 0) {
    return null;
  }

  const task = tasks[0];

  // Try to claim the task by updating status
  const now = new Date().toISOString();
  const updated = await db
    .update(processingTasks)
    .set({
      status: "ocr_processing",
      updatedAt: now,
    })
    .where(
      and(
        eq(processingTasks.taskId, task.taskId),
        inArray(processingTasks.status, ["paid", "queued"])
      )
    )
    .returning();

  if (updated.length === 0) {
    // Task was claimed by another worker
    return null;
  }

  return updated[0];
}

/**
 * P7.2: Process a single task
 */
async function processTask(
  task: typeof processingTasks.$inferSelect
): Promise<void> {
  const logPrefix = `[Task ${task.taskId}]`;

  try {
    console.log(`${logPrefix} Processing task...`);
    console.log(`${logPrefix} Status: ${task.status}`);
    console.log(`${logPrefix} Document type: ${task.documentType}`);

    // Generate presigned URL for source file
    const storage = getStorage();
    const sourceUrl = await storage.presignedGet(
      task.sourceFileKey,
      3600 // 1 hour
    );

    // P6.2: Submit to OCR service
    console.log(`${logPrefix} Submitting to OCR...`);
    const { jobId } = await submitAsyncDocument(sourceUrl, {
      documentType: task.documentType as "exam" | "handout" | "homework",
    });

    // Update task with OCR job ID
    await db
      .update(processingTasks)
      .set({
        ocrJobId: jobId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(processingTasks.taskId, task.taskId));

    // P6.2: Poll for OCR completion
    console.log(`${logPrefix} Polling OCR job ${jobId}...`);
    const ocrResult = await pollOcrJob(jobId, {
      onProgress: (status) => {
        console.log(`${logPrefix} OCR status: ${status}`);
      },
    });

    if (!ocrResult.result) {
      throw new Error("OCR completed but no result returned");
    }

    // P7.2: OCR done - write artifacts
    console.log(`${logPrefix} Saving OCR artifacts...`);
    const artifactId = await saveOcrArtifacts(
      task,
      ocrResult.result
    );

    // P7.2: Update status to word_rendering
    await db
      .update(processingTasks)
      .set({
        status: "word_rendering",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(processingTasks.taskId, task.taskId));

    // P8: Generate DOCX
    console.log(`${logPrefix} Generating DOCX...`);
    const docxKey = await generateDocxForTask(
      task,
      ocrResult.result,
      artifactId
    );

    // P7.2: DOCX done - mark completed
    await db
      .update(processingTasks)
      .set({
        status: "completed",
        outputDocxKey: docxKey,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(processingTasks.taskId, task.taskId));

    console.log(`${logPrefix} Task completed successfully`);
  } catch (error) {
    console.error(`${logPrefix} Task failed:`, error);

    // Determine error code
    let errorCode = "TASK_FAILED";
    let errorMessage = "Task processing failed";

    if (error instanceof OcrTimeoutError) {
      errorCode = "OCR_UPSTREAM_TIMEOUT";
      errorMessage = "OCR processing timed out";
    } else if (error instanceof OcrRateLimitError) {
      errorCode = "OCR_RATE_LIMITED";
      errorMessage = "OCR service rate limited";
    } else if (error instanceof OcrProcessingError) {
      errorCode = error.code;
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Update task status to failed
    await db
      .update(processingTasks)
      .set({
        status: "failed",
        errorCode,
        errorMessage,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(processingTasks.taskId, task.taskId));

    // P7.4: Refund on failure
    if (task.paymentOrderId) {
      console.log(`${logPrefix} Refunding task...`);
      const price = config.pricing[task.documentType];
      if (price) {
        await refundBalance(
          task.anonymousSessionId,
          task.taskId,
          price
        );
      }
    }
  }
}

/**
 * P7.2: Save OCR artifacts to storage and database
 */
async function saveOcrArtifacts(
  task: typeof processingTasks.$inferSelect,
  ocrResult: OcrResultEnvelope
): Promise<string> {
  const storage = getStorage();
  const artifactId = `art_${crypto.randomUUID().replace(/-/g, "")}`;
  const now = new Date();

  // Calculate TTL (7 days)
  const ttlExpiresAt = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Save markdown text
  const markdownKey = buildObjectKey(
    task.anonymousSessionId,
    task.taskId,
    "artifact",
    "result.md"
  );
  await storage.putObject(
    markdownKey,
    Buffer.from(ocrResult.markdownText, "utf-8"),
    "text/markdown"
  );

  // Save structured JSON
  const jsonKey = buildObjectKey(
    task.anonymousSessionId,
    task.taskId,
    "artifact",
    "structured.json"
  );
  await storage.putObject(
    jsonKey,
    Buffer.from(JSON.stringify(ocrResult.structuredJson ?? {}), "utf-8"),
    "application/json"
  );

  // P7.3: Download and save assets
  const assetManifest: Array<{ key: string; originalUrl: string }> = [];

  for (const asset of ocrResult.assets) {
    try {
      console.log(`[Task ${task.taskId}] Downloading asset: ${asset.key}`);

      const assetBuffer = await downloadOcrAsset(asset.url);

      const assetKey = buildObjectKey(
        task.anonymousSessionId,
        task.taskId,
        "artifact",
        `assets/${asset.key}`
      );

      await storage.putObject(
        assetKey,
        assetBuffer,
        asset.type === "image" ? "image/png" : "application/octet-stream"
      );

      assetManifest.push({
        key: assetKey,
        originalUrl: asset.url,
      });
    } catch (error) {
      // P7.3: Partial asset fail policy - log but continue
      console.error(
        `[Task ${task.taskId}] Failed to download asset ${asset.key}:`,
        error
      );
    }
  }

  // Save asset manifest
  const manifestKey = buildObjectKey(
    task.anonymousSessionId,
    task.taskId,
    "artifact",
    "asset-manifest.json"
  );
  await storage.putObject(
    manifestKey,
    Buffer.from(JSON.stringify(assetManifest, null, 2), "utf-8"),
    "application/json"
  );

  // Insert artifact record
  await db.insert(ocrArtifacts).values({
    artifactId,
    taskId: task.taskId,
    markdownText: ocrResult.markdownText,
    structuredJsonKey: jsonKey,
    assetManifestKey: manifestKey,
    ttlExpiresAt,
    createdAt: now.toISOString(),
  });

  return artifactId;
}

/**
 * P8: Generate DOCX for task
 */
async function generateDocxForTask(
  task: typeof processingTasks.$inferSelect,
  ocrResult: OcrResultEnvelope,
  _artifactId: string
): Promise<string> {
  const storage = getStorage();

  // Generate DOCX using the docx-generator
  const docxBuffer = await generateDocx(
    ocrResult.markdownText,
    {
      documentType: task.documentType as "exam" | "handout" | "homework",
      templateId: task.templateId ?? `${task.documentType}-default`,
    }
  );

  // Upload to storage
  const docxKey = buildObjectKey(
    task.anonymousSessionId,
    task.taskId,
    "output",
    `${task.taskId}.docx`
  );

  await storage.putObject(
    docxKey,
    docxBuffer,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  return docxKey;
}

/**
 * P7.1: Setup graceful shutdown
 * P7.1: 优雅关闭信号
 */
function setupGracefulShutdown(): void {
  let isShuttingDown = false;

  const shutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log("\n[Worker] Shutting down gracefully...");
    console.log(`[Worker] Waiting for ${state.activeTasks.size} active tasks...`);

    state.isRunning = false;

    // Wait for active tasks with timeout
    const shutdownTimeout = 30000; // 30 seconds
    const startTime = Date.now();

    while (
      state.activeTasks.size > 0 &&
      Date.now() - startTime < shutdownTimeout
    ) {
      await sleep(1000);
      console.log(
        `[Worker] Still waiting for ${state.activeTasks.size} tasks...`
      );
    }

    if (state.activeTasks.size > 0) {
      console.log(
        `[Worker] Shutdown timeout. ${state.activeTasks.size} tasks may be incomplete.`
      );
    }

    // Close database connection
    try {
      const { closeDb } = await import("@/db");
      await closeDb();
      console.log("[Worker] Database connection closed.");
    } catch (error) {
      console.error("[Worker] Error closing database:", error);
    }

    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

/**
 * P7.4: Reclaim stale tasks
 * P7.4: 崩溃后任务回收
 */
export async function reclaimStaleTasks(): Promise<number> {
  const staleThreshold = new Date(
    Date.now() - 10 * 60 * 1000 // 10 minutes
  ).toISOString();

  const reclaimed = await db
    .update(processingTasks)
    .set({
      status: "queued",
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        inArray(processingTasks.status, ["ocr_processing", "word_rendering"]),
        lt(processingTasks.updatedAt, staleThreshold)
      )
    )
    .returning();

  if (reclaimed.length > 0) {
    console.log(`[Worker] Reclaimed ${reclaimed.length} stale tasks`);
  }

  return reclaimed.length;
}

/**
 * Helper: Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Start worker if run directly
 */
if (require.main === module) {
  // Reclaim stale tasks on startup
  reclaimStaleTasks()
    .then(() => startWorker())
    .catch((error) => {
      console.error("[Worker] Fatal error:", error);
      process.exit(1);
    });
}
