import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session-db";
import { getWalletData, createTopupOrder } from "@/lib/payment";
import { apiError, ErrorCodes } from "@/lib/api-utils";
import { config } from "@/lib/config";
import { z } from "zod";

const createOrderSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  idempotencyKey: z.string().optional(),
});

/**
 * GET /api/wallet
 * P3.1: Returns balance, currency, and paginated ledgers
 */
export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);

    const walletData = await getWalletData(session.anonymousSessionId, cursor, limit);

    return NextResponse.json({
      data: {
        balance: walletData.balance,
        currency: walletData.currency,
        recommendedTopup: config.currency.recommendedTopups,
        ledgers: walletData.ledgers,
        pagination: {
          nextCursor: walletData.nextCursor,
          hasMore: walletData.hasMore,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get wallet:", error);
    if (error instanceof Error && error.message === "Session not found or expired") {
      return apiError(ErrorCodes.SESSION_NOT_FOUND, "Session not found", 401);
    }
    return apiError(ErrorCodes.INTERNAL_ERROR, "Failed to get wallet data", 500);
  }
}

/**
 * POST /api/wallet/orders
 * P3.2: Creates a topup order
 */
export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(ErrorCodes.VALIDATION_ERROR, "Invalid request", 400, parsed.error.issues);
    }

    const { order, provider } = await createTopupOrder(
      session.anonymousSessionId,
      parsed.data.amount,
      parsed.data.idempotencyKey
    );

    return NextResponse.json({
      data: {
        orderId: order.paymentOrderId,
        status: order.status,
        provider,
      },
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    if (error instanceof Error && error.message === "Session not found or expired") {
      return apiError(ErrorCodes.SESSION_NOT_FOUND, "Session not found", 401);
    }
    return apiError(ErrorCodes.INTERNAL_ERROR, "Failed to create order", 500);
  }
}
