import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { mockTasks } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <AppShell eyebrow="task manager" title="任务中心">
      <section className="card" style={{ gridColumn: "span 12" }}>
        <h2>匿名会话任务列表</h2>
        {mockTasks.map((task) => (
          <div className="task-item" key={task.id}>
            <div>
              <p className="task-title">{task.title}</p>
              <p className="task-meta">
                {task.documentType} · 最近更新 {task.updatedAt}
              </p>
            </div>
            <div className="cta-row">
              <StatusBadge status={task.status} />
              <Link className="button" href={`/tasks/${task.id}`}>
                详情
              </Link>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

