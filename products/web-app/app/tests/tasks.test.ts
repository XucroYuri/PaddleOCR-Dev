import { describe, expect, test } from "vitest";

import { canTransitionTask, terminalTaskStatuses } from "@/lib/tasks";

describe("task state machine", () => {
  test("allows the happy-path transitions from created to completed", () => {
    expect(canTransitionTask("created", "awaiting_payment")).toBe(true);
    expect(canTransitionTask("awaiting_payment", "paid")).toBe(true);
    expect(canTransitionTask("paid", "queued")).toBe(true);
    expect(canTransitionTask("queued", "ocr_processing")).toBe(true);
    expect(canTransitionTask("ocr_processing", "word_rendering")).toBe(true);
    expect(canTransitionTask("word_rendering", "completed")).toBe(true);
  });

  test("rejects invalid jumps and exposes terminal states", () => {
    expect(canTransitionTask("created", "completed")).toBe(false);
    expect(canTransitionTask("completed", "queued")).toBe(false);
    expect(terminalTaskStatuses).toEqual(["completed", "failed", "expired"]);
  });
});

