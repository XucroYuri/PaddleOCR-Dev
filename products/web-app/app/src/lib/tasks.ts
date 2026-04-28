export const taskStatuses = [
  "created",
  "awaiting_payment",
  "paid",
  "queued",
  "ocr_processing",
  "word_rendering",
  "completed",
  "failed",
  "expired",
] as const;

export type TaskStatus = (typeof taskStatuses)[number];

const transitionMap: Record<TaskStatus, TaskStatus[]> = {
  created: ["awaiting_payment", "expired"],
  awaiting_payment: ["paid", "expired"],
  paid: ["queued", "failed", "expired"],
  queued: ["ocr_processing", "failed", "expired"],
  ocr_processing: ["word_rendering", "failed", "expired"],
  word_rendering: ["completed", "failed", "expired"],
  completed: [],
  failed: [],
  expired: [],
};

export const terminalTaskStatuses: TaskStatus[] = [
  "completed",
  "failed",
  "expired",
];

export function canTransitionTask(
  from: TaskStatus,
  to: TaskStatus,
): boolean {
  return transitionMap[from].includes(to);
}

/**
 * P3.4: Get task price by document type
 */
export function getTaskPrice(
  documentType: "exam" | "handout" | "homework"
): string | undefined {
  const prices: Record<string, string> = {
    exam: "2.00",
    handout: "1.50",
    homework: "1.00",
  };
  return prices[documentType];
}

