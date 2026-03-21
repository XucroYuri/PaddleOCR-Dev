import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { mockTasks } from "@/lib/mock-data";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = mockTasks.find((item) => item.id === taskId) ?? mockTasks[0];

  return (
    <AppShell eyebrow="task detail" title={task.title}>
      <section className="card" style={{ gridColumn: "span 4" }}>
        <h2>当前状态</h2>
        <div className="cta-row">
          <StatusBadge status={task.status} />
        </div>
        <p className="lede">文档类型：{task.documentType}</p>
      </section>

      <section className="card" style={{ gridColumn: "span 8" }}>
        <h2>处理阶段</h2>
        <div className="split-panel">
          <div className="panel">
            <h3>上游 OCR</h3>
            <pre>{`PaddleOCR-VL-1.5 API
异步任务编排
内部生成 Markdown/JSON`}</pre>
          </div>
          <div className="panel">
            <h3>下游交付</h3>
            <pre>{`平台模板
Markdown -> DOCX
对象存储签名下载`}</pre>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

