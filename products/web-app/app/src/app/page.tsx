import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { mockTasks } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell eyebrow="web product line" title="教培资料转 Word">
      <section className="card" style={{ gridColumn: "span 7" }}>
        <h2>业务闭环</h2>
        <ol className="flow-list">
          <li>匿名进入，自动创建会话。</li>
          <li>充值或付款后上传试卷、讲义、作业。</li>
          <li>后端异步调用 PaddleOCR-VL-1.5 API。</li>
          <li>内部生成 Markdown/JSON，再转成 DOCX。</li>
          <li>任务完成后回到网页下载可编辑 Word。</li>
        </ol>
        <div className="cta-row" style={{ marginTop: 18 }}>
          <Link className="button primary" href="/upload">
            立即上传资料
          </Link>
          <Link className="button" href="/tasks">
            查看任务中心
          </Link>
        </div>
      </section>

      <section className="card" style={{ gridColumn: "span 5" }}>
        <h2>核心指标</h2>
        <div className="two-up">
          <div className="stat">
            <span>目标交付率</span>
            <strong>85%</strong>
          </div>
          <div className="stat">
            <span>任务完成率</span>
            <strong>90%</strong>
          </div>
          <div className="stat">
            <span>匿名会话隔离</span>
            <strong>100%</strong>
          </div>
          <div className="stat">
            <span>最终产物</span>
            <strong>DOCX</strong>
          </div>
        </div>
      </section>

      <section className="card" style={{ gridColumn: "span 12" }}>
        <h2>当前任务示例</h2>
        <div className="task-list">
          {mockTasks.map((task) => (
            <div className="task-item" key={task.id}>
              <div>
                <p className="task-title">{task.title}</p>
                <p className="task-meta">
                  {task.documentType} · 最近更新 {task.updatedAt}
                </p>
              </div>
              <Link className="button" href={`/tasks/${task.id}`}>
                查看详情
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

