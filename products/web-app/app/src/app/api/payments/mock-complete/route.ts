import { NextResponse } from "next/server";
import { processPaymentCallback } from "@/lib/payment";
import { apiError, ErrorCodes } from "@/lib/api-utils";
import { config } from "@/lib/config";

/**
 * POST /api/payments/mock-complete
 * P3.6: Mock payment completion for development only
 *
 * This endpoint simulates a payment callback for testing.
 * Only available when PAYMENT_PROVIDER=mock and NODE_ENV != production
 */
export async function POST(request: Request) {
  // P3.6: Mock provider nonprod only guard
  if (config.payment.provider !== "mock") {
    return apiError(ErrorCodes.INVALID_REQUEST, "Mock payment not available", 400);
  }

  if (process.env.NODE_ENV === "production") {
    return apiError(ErrorCodes.INVALID_REQUEST, "Mock payment disabled in production", 403);
  }

  try {
    const body = await request.json();
    const { orderId, amount } = body as { orderId: string; amount: string };

    if (!orderId || !amount) {
      return apiError(ErrorCodes.VALIDATION_ERROR, "Missing orderId or amount", 400);
    }

    // Simulate provider callback
    const result = await processPaymentCallback({
      orderId,
      providerTxnId: `mock_txn_${Date.now()}`,
      amount,
      status: "success",
    });

    return NextResponse.json({
      success: result.success,
      orderId: result.orderId,
      message: "Mock payment completed. Balance credited.",
    });
  } catch (error) {
    console.error("Mock payment error:", error);
    return apiError(ErrorCodes.PAYMENT_FAILED, "Mock payment failed", 500);
  }
}
