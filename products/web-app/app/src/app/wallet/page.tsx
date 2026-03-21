import { AppShell } from "@/components/app-shell";

export default function WalletPage() {
  return (
    <AppShell eyebrow="payments" title="充值与付款">
      <section className="card" style={{ gridColumn: "span 6" }}>
        <h2>一期策略</h2>
        <ul className="bullet-list">
          <li>匿名会话优先，不做强制注册。</li>
          <li>支持充值或按次付费，任务执行前必须完成扣费前置校验。</li>
          <li>支付成功后才允许进入 OCR 队列。</li>
        </ul>
      </section>
      <section className="card" style={{ gridColumn: "span 6" }}>
        <h2>开发阶段占位</h2>
        <div className="panel">
          <pre>{`待接入:
- 充值订单创建
- 支付二维码
- 支付回调
- 幂等扣费与失败补偿`}</pre>
        </div>
      </section>
    </AppShell>
  );
}

