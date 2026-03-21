import { AppShell } from "@/components/app-shell";

export default function UploadPage() {
  return (
    <AppShell eyebrow="upload flow" title="上传资料并创建任务">
      <section className="card" style={{ gridColumn: "span 7" }}>
        <h2>上传规范</h2>
        <ul className="bullet-list">
          <li>支持试卷、讲义、作业等 PDF 或图片资料。</li>
          <li>生产默认走异步 OCR API，适合多页与复杂文档。</li>
          <li>上传前应完成支付或余额校验。</li>
          <li>中间 Markdown/JSON 仅内部保存，不直接提供给最终用户。</li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "span 5" }}>
        <h2>开发阶段占位</h2>
        <p className="lede">
          这里将承接真实的上传表单、文件校验、支付前置校验与任务创建动作。
        </p>
      </section>
    </AppShell>
  );
}

