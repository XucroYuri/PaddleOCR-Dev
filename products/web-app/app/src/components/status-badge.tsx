import type { TaskStatus } from "@/lib/tasks";

const labelMap: Record<TaskStatus, string> = {
  created: "已创建",
  awaiting_payment: "待支付",
  paid: "已支付",
  queued: "已入队",
  ocr_processing: "解析中",
  word_rendering: "Word 生成中",
  completed: "已完成",
  failed: "失败",
  expired: "已过期",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`status-badge status-${status}`}>{labelMap[status]}</span>
  );
}

