import { NextRequest, NextResponse } from "next/server";

import { mockTasks } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await context.params;
  const task = mockTasks.find((item) => item.id === taskId);

  if (!task) {
    return NextResponse.json(
      { error: { code: "TASK_NOT_FOUND", message: "Task not found." } },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: task });
}

