import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/session-db";
import { db, processingTasks } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { apiError, ErrorCodes } from "@/lib/api-utils";
import { config } from "@/lib/config";
import { debitBalance } from "@/lib/payment";
import { canTransitionTask, taskStatuses, type TaskStatus } from "@/lib/tasks";
import { validateKeyNamespace } from "@/lib/storage";
import crypto from "node:crypto";

const createTaskSchema = z.object({
  sourceFileKey: z.string().min(1),
  documentType: z.enum(["exam", "handout", "homework"]),
  templateId: z.string().optional(),
});

/**
 * GET /api/tasks
 * P5.1: List tasks for current session, ordered by updated_at DESC
 */
export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as TaskStatus | null;
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const cursor = searchParams.get("cursor") ?? undefined;

    let query = db
      .select()
      .from(processingTasks)
      .where(eq(processingTasks.anonymousSessionId, session.anonymousSessionId))
      .orderBy(desc(processingTasks.updatedAt))
      .limit(limit + 1);

    if (status && taskStatuses.includes(status)) {
      // Filter by status if provided
      const tasks = await db
        .select()
        .from(processingTasks)
        .where(
          and(
            eq(processingTasks.anonymousSessionId, session.anonymousSessionId),
            eq(processingTasks.status, status)
          )
        )
        .orderBy(desc(processingTasks.updatedAt))
        .limit(limit + 1);

      const hasMore = tasks.length > limit;
      const items = hasMore ? tasks.slice(0, -1) : tasks;

      return NextResponse.json({
        data: items,
        pagination: {
          nextCursor: hasMore ? items[items.length - 1]?.updatedAt : null,
          hasMore,
        },
      });
    }

    const tasks = await query;
    const hasMore = tasks.length > limit;
    const items = hasMore ? tasks.slice(0, -1) : tasks;

    return NextResponse.json({
      data: items,
      pagination: {
        nextCursor: hasMore ? items[items.length - 1]?.updatedAt : null,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Failed to get tasks:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Failed to get tasks", 500);
  }
}

/**
 * POST /api/tasks
 * P5.1: Create a new task with validation and payment gate
 */
export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(ErrorCodes.VALIDATION_ERROR, "Invalid request", 400, parsed.error.issues);
    }

    const { sourceFileKey, documentType, templateId } = parsed.data;

    // P5.1: Validate sourceFileKey namespace belongs to session
    if (!validateKeyNamespace(sourceFileKey, session.anonymousSessionId)) {
      return apiError(
        ErrorCodes.TASK_ACCESS_DENIED,
        "Source file does not belong to your session",
        403
      );
    }

    // P3.4: Get price for document type
    const price = config.pricing[documentType];
    if (!price) {
      return apiError(ErrorCodes.VALIDATION_ERROR, "Invalid document type", 400);
    }

    // P3.4: Check balance
    const balance = parseFloat(session.walletBalance);
    const taskPrice = parseFloat(price);

    if (balance < taskPrice) {
      // P3.4: Insufficient balance -> awaiting_payment or 402
      return apiError(
        ErrorCodes.INSUFFICIENT_BALANCE,
        "Insufficient balance. Please top up your wallet.",
        402,
        { required: price, current: session.walletBalance }
      );
    }

    const taskId = `task_${crypto.randomBytes(8).toString("hex")}`;
    const now = new Date().toISOString();

    // Create task and debit balance in transaction
    const [task] = await db.transaction(async (tx) => {
      // Insert task with initial status
      const [newTask] = await tx
        .insert(processingTasks)
        .values({
          taskId,
          anonymousSessionId: session.anonymousSessionId,
          sourceFileKey,
          documentType,
          templateId: templateId ?? `${documentType}-default`,
          status: "created",
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      // P3.4: Debit balance
      await debitBalance(session.anonymousSessionId, taskId, price);

      // P3.4: Update task status to paid (debit + status in same tx)
      const [paidTask] = await tx
        .update(processingTasks)
        .set({ status: "paid", updatedAt: new Date().toISOString() })
        .where(eq(processingTasks.taskId, taskId))
        .returning();

      return [paidTask];
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return apiError(ErrorCodes.INTERNAL_ERROR, "Failed to create task", 500);
  }
}
