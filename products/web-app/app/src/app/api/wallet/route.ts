import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      pricingMode: "topup_or_pay_per_task",
      recommendedTopup: 29,
      currency: "CNY",
    },
  });
}

