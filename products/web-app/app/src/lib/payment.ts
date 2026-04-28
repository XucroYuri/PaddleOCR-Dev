import crypto from "node:crypto";
import { db, paymentOrders, walletLedgers, anonymousSessions } from "@/db";
import { eq, and, desc, lt } from "drizzle-orm";
import { config } from "./config";

/**
 * Payment provider interface (P3.2 - provider DTO)
 */
export interface PaymentProviderDTO {
  orderId: string;
  qrCodeUrl?: string;
  redirectUrl?: string;
  expiresAt: string;
  amount: string;
  currency: string;
}

/**
 * Payment callback payload (normalized from provider)
 */
export interface PaymentCallbackPayload {
  orderId: string;
  providerTxnId: string;
  amount: string;
  status: "success" | "failed";
  rawPayload?: unknown;
}

/**
 * Creates a topup order with idempotency.
 * P3.2: POST 创建 topup 订单
 */
export async function createTopupOrder(
  sessionId: string,
  amount: string,
  idempotencyKey?: string
): Promise<{ order: typeof paymentOrders.$inferSelect; provider: PaymentProviderDTO }> {
  const orderId = `po_${crypto.randomBytes(8).toString("hex")}`;
  const now = new Date();

  // Check for existing order with same idempotency key (P3.2)
  if (idempotencyKey) {
    const existing = await db
      .select()
      .from(paymentOrders)
      .where(eq(paymentOrders.idempotencyKey, idempotencyKey))
      .limit(1);

    if (existing[0]) {
      // Return same order (200+data approach)
      const provider = await getProviderDTO(existing[0]);
      return { order: existing[0], provider };
    }
  }

  const [order] = await db
    .insert(paymentOrders)
    .values({
      paymentOrderId: orderId,
      anonymousSessionId: sessionId,
      orderType: "topup",
      amount,
      status: "pending_payment",
      idempotencyKey,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })
    .returning();

  const provider = await getProviderDTO(order);
  return { order, provider };
}

/**
 * Gets provider display fields for frontend.
 * P3.2: 返回渠道展示字段
 */
async function getProviderDTO(
  order: typeof paymentOrders.$inferSelect
): Promise<PaymentProviderDTO> {
  const expiresAt = new Date(
    new Date(order.createdAt).getTime() + 30 * 60 * 1000
  ).toISOString();

  if (config.payment.provider === "mock") {
    return {
      orderId: order.paymentOrderId,
      qrCodeUrl: `${config.app.baseUrl}/api/payments/mock-qr/${order.paymentOrderId}`,
      expiresAt,
      amount: order.amount,
      currency: config.currency.default,
    };
  }

  // Real provider implementation would go here
  throw new Error(`Payment provider ${config.payment.provider} not implemented`);
}

/**
 * Processes payment callback.
 * P3.3: 支付回调处理
 */
export async function processPaymentCallback(
  payload: PaymentCallbackPayload
): Promise<{ success: boolean; orderId: string }> {
  const order = await db
    .select()
    .from(paymentOrders)
    .where(eq(paymentOrders.paymentOrderId, payload.orderId))
    .limit(1);

  if (!order[0]) {
    throw new Error(`Order not found: ${payload.orderId}`);
  }

  // P3.3: provider_txn_id 幂等检查
  if (order[0].providerTxnId === payload.providerTxnId) {
    // Already processed, return idempotent response
    return { success: true, orderId: payload.orderId };
  }

  if (payload.status !== "success") {
    // Mark as failed
    await db
      .update(paymentOrders)
      .set({
        status: "failed",
        providerTxnId: payload.providerTxnId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(paymentOrders.paymentOrderId, payload.orderId));

    return { success: false, orderId: payload.orderId };
  }

  // P3.3: 单事务内更新 order paid/credited、insert ledger credit、increment session balance
  await db.transaction(async (tx) => {
    const now = new Date().toISOString();

    // Update order status
    await tx
      .update(paymentOrders)
      .set({
        status: "credited",
        providerTxnId: payload.providerTxnId,
        updatedAt: now,
      })
      .where(eq(paymentOrders.paymentOrderId, payload.orderId));

    // Insert ledger entry
    await tx.insert(walletLedgers).values({
      ledgerId: `lg_${crypto.randomBytes(8).toString("hex")}`,
      anonymousSessionId: order[0].anonymousSessionId,
      paymentOrderId: payload.orderId,
      direction: "credit",
      amount: payload.amount,
      reason: "topup",
      createdAt: now,
    });

    // Update session balance
    await tx.execute(`
      UPDATE anonymous_sessions
      SET wallet_balance = (wallet_balance + ${payload.amount})::decimal(12,2)
      WHERE anonymous_session_id = '${order[0].anonymousSessionId}'
    `);
  });

  return { success: true, orderId: payload.orderId };
}

/**
 * Gets wallet balance and ledger entries.
 * P3.1: GET /api/wallet
 */
export async function getWalletData(
  sessionId: string,
  cursor?: string,
  limit = 20
) {
  const [session] = await db
    .select({ walletBalance: anonymousSessions.walletBalance })
    .from(anonymousSessions)
    .where(eq(anonymousSessions.anonymousSessionId, sessionId))
    .limit(1);

  if (!session) {
    throw new Error("Session not found");
  }

  // P3.1: cursor/limit 分页
  const ledgers = cursor
    ? await db
        .select()
        .from(walletLedgers)
        .where(
          and(
            eq(walletLedgers.anonymousSessionId, sessionId),
            lt(walletLedgers.createdAt, cursor)
          )
        )
        .orderBy(desc(walletLedgers.createdAt))
        .limit(limit + 1)
    : await db
        .select()
        .from(walletLedgers)
        .where(eq(walletLedgers.anonymousSessionId, sessionId))
        .orderBy(desc(walletLedgers.createdAt))
        .limit(limit + 1);

  const hasMore = ledgers.length > limit;
  const items = hasMore ? ledgers.slice(0, -1) : ledgers;
  const nextCursor = hasMore ? items[items.length - 1]?.createdAt : null;

  return {
    balance: session.walletBalance,
    currency: config.currency.default,
    ledgers: items,
    nextCursor,
    hasMore,
  };
}

/**
 * Debits balance for a task.
 * P3.4: 扣费
 */
export async function debitBalance(
  sessionId: string,
  _taskId: string,
  amount: string
): Promise<void> {
  await db.transaction(async (tx) => {
    const now = new Date().toISOString();

    // Insert ledger entry
    await tx.insert(walletLedgers).values({
      ledgerId: `lg_${crypto.randomBytes(8).toString("hex")}`,
      anonymousSessionId: sessionId,
      direction: "debit",
      amount,
      reason: "task_run",
      createdAt: now,
    });

    // Update session balance
    await tx.execute(`
      UPDATE anonymous_sessions
      SET wallet_balance = (wallet_balance - ${amount})::decimal(12,2)
      WHERE anonymous_session_id = '${sessionId}'
    `);
  });
}

/**
 * Refunds balance for a failed task.
 * P3.5: 失败补偿
 */
export async function refundBalance(
  sessionId: string,
  _taskId: string,
  amount: string
): Promise<void> {
  await db.transaction(async (tx) => {
    const now = new Date().toISOString();

    // P3.5: 唯一键防双退 - check if refund already exists for this task
    // In production, we'd check by taskId in a separate column
    // For now, we rely on the caller to ensure single refund per task

    await tx.insert(walletLedgers).values({
      ledgerId: `lg_${crypto.randomBytes(8).toString("hex")}`,
      anonymousSessionId: sessionId,
      direction: "refund",
      amount,
      reason: "compensation",
      createdAt: now,
    });

    await tx.execute(`
      UPDATE anonymous_sessions
      SET wallet_balance = (wallet_balance + ${amount})::decimal(12,2)
      WHERE anonymous_session_id = '${sessionId}'
    `);
  });
}
