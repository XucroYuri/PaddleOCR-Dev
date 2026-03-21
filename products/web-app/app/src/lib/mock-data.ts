import type { TaskStatus } from "@/lib/tasks";

export interface TaskCard {
  id: string;
  title: string;
  documentType: "试卷" | "讲义" | "作业";
  status: TaskStatus;
  updatedAt: string;
}

export const mockTasks: TaskCard[] = [
  {
    id: "tsk_exam_001",
    title: "2024 级初一语文定时练习",
    documentType: "试卷",
    status: "completed",
    updatedAt: "刚刚",
  },
  {
    id: "tsk_handout_002",
    title: "九年级古诗文复习讲义",
    documentType: "讲义",
    status: "word_rendering",
    updatedAt: "2 分钟前",
  },
  {
    id: "tsk_homework_003",
    title: "周末作业整理",
    documentType: "作业",
    status: "awaiting_payment",
    updatedAt: "8 分钟前",
  },
];

