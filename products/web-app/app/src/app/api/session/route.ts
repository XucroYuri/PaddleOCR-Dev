import { NextResponse } from "next/server";

import { createAnonymousSession } from "@/lib/session";

export async function POST() {
  const session = createAnonymousSession();
  return NextResponse.json({ data: session });
}

