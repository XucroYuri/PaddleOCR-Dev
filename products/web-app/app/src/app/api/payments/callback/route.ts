import { NextResponse } from "next/server";
import { processPaymentCallback, type PaymentCallbackPayload } from "@/lib/payment";
import { config } from "@/lib/config";

/**
 * POST /api/payments/callback
 * P3.3: Payment provider callback handler
 *
 * This endpoint receives webhook callbacks from payment providers.
 * It validates the signature and processes the payment.
 */
export async function POST(request: Request) {
  try {
    // P3.3: Verify signature (implementation depends on provider)
    if (config.payment.provider !== "mock") {
      const signature = request.headers.get("x-payment-signature");
      if (!signature) {
        return NextResponse.json(
          { error: { code: "MISSING_SIGNATURE", message: "Missing payment signature" } },
          { status: 401 }
        );
      }

      // TODO: Implement actual signature verification based on provider
      // const rawBody = await request.text();
      // verifySignature(rawBody, signature, config.payment.webhookSecret);
    }

    const body = await request.json();

    // Normalize payload from provider to our internal format
    const payload: PaymentCallbackPayload = normalizePayload(body);

    // Process the payment (idempotent)
    const result = await processPaymentCallback(payload);

    // P3.3: Return 200 idempotent response
    return NextResponse.json({
      success: result.success,
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: { code: "CALLBACK_FAILED", message: "Failed to process payment callback" } },
      { status: 500 }
    );
  }
}

/**
 * Normalizes provider-specific payload to our internal format.
 * Each provider has different callback formats.
 */
function normalizePayload(body: unknown): PaymentCallbackPayload {
  if (config.payment.provider === "mock") {
    // Mock provider format
    const data = body as { orderId: string; providerTxnId: string; amount: string; status: string };
    return {
      orderId: data.orderId,
      providerTxnId: data.providerTxnId,
      amount: data.amount,
      status: data.status === "success" ? "success" : "failed",
    };
  }

  // TODO: Add provider-specific normalization
  throw new Error(`Unknown payment provider: ${config.payment.provider}`);
}
