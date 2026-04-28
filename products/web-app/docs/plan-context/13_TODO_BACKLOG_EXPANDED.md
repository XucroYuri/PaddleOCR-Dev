# TODO Backlog Expanded (SSOT)

> **维护规则**：先改本文件勾选与 id 映射表，再同步 Cursor plan YAML。

## 维护节：ID 映射表

| ID | Content (简) | 状态 |
|----|-------------|------|
| meta-doc-ssot-stack | 元：SSOT 文档栈定义 | ✅ |
| p0-0-ssot-update-order | P0.0: 团队约定先改 13 再同步 YAML | ✅ |
| p0-0-id-map-maintain | P0.0: 新增/拆分时分配新 id 并更新映射表 | ⬜ |
| p0-1-web-branch-from-baseline | P0.1: 从约定 tag/commit 检出 web | ⬜ |
| p0-1-doc-merge-strategy | P0.1: 文档化 web↔local 合并策略 | ⬜ |
| p0-1-production-branch-protection | P0.1: 分支保护规则 | ⬜ |
| p0-2-ci-workflow-paths | P0.2: CI workflow paths 配置 | ⬜ |
| p0-2-ci-job-npm-build-test | P0.2: CI npm build/test job | ⬜ |
| p0-2-ci-npm-cache-optional | P0.2: npm cache (可选) | ⬜ |
| p0-3-env-example-placeholders | P0.3: .env.example 占位符 | ⬜ |
| p0-3-app-readme-local-run | P0.3: app/README.md 本地运行 | ⬜ |
| p0-3-product-readme-devplan-link | P0.3: README 链到开发计划 | ⬜ |
| p0-4-pr-grep-checklist-doc | P0.4: PR 前自检文档 | ⬜ |
| p0-4-precommit-secret-scan-optional | P0.4: pre-commit secret scan (可选) | ⬜ |
| p1-1-orm-spike | P1.1: ORM 选型 Spike | ✅ |
| p1-1-traceability-orm-record | P1.1: ORM 决策记录 | ✅ |
| p1-2-migrate-anonymous-sessions | P1.2: migration anonymous_sessions | ✅ |
| p1-2-migrate-payment-orders | P1.2: migration payment_orders | ✅ |
| p1-2-migrate-wallet-ledgers | P1.2: migration wallet_ledgers | ✅ |
| p1-2-migrate-processing-tasks | P1.2: migration processing_tasks | ✅ |
| p1-2-migrate-ocr-artifacts | P1.2: migration ocr_artifacts | ✅ |
| p1-2-migrate-download-grants | P1.2: migration download_grants | ✅ |
| p1-3-decimal-rounding-doc | P1.3: 金额 decimal 规则 | ✅ |
| p1-3-timestamptz-utc | P1.3: timestamptz UTC 统一 | ✅ |
| p1-4-docker-compose-postgres-optional | P1.4: docker-compose postgres (可选) | ⬜ |
| p1-4-seed-session-completed-task-optional | P1.4: seed 脚本 (可选) | ⬜ |
| p2-1-session-post-db | P2.1: POST /api/session 入库 | ✅ |
| p2-1-set-cookie-attrs-doc | P2.1: Set-Cookie 属性文档 | ✅ |
| p2-1-no-token-in-url-response | P2.1: 禁止 token 暴露到 URL | ✅ |
| p2-2-get-session-helper | P2.2: getSessionFromRequest | ✅ |
| p2-2-middleware-callback-allowlist | P2.2: Middleware 白名单 | ✅ |
| p2-3-expiry-align-lib-db | P2.3: 过期时间配置对齐 | ✅ |
| p2-3-frontend-401-recovery-manual | P2.3: 前端 401 恢复 E2E | ✅ |
| p3-1-wallet-get-ledger-pagination | P3.1: GET /api/wallet 分页 | ✅ |
| p3-1-currency-recommended-topup-config | P3.1: 币种/推荐充值配置 | ✅ |
| p3-2-post-create-topup-order | P3.2: POST 创建 topup 订单 | ✅ |
| p3-2-return-channel-display-fields | P3.2: 返回渠道展示字段 | ✅ |
| p3-2-idempotency-key-conflict-same-order | P3.2: 幂等键冲突处理 | ✅ |
| p3-3-verify-signature-and-test | P3.3: 支付回调验签 | ✅ |
| p3-3-idempotent-provider-txn-id | P3.3: provider_txn_id 幂等 | ✅ |
| p3-3-tx-order-ledger-balance | P3.3: 事务内更新订单/流水/余额 | ✅ |
| p3-4-price-by-document-type | P3.4: 按文档类型定价 | ✅ |
| p3-4-insufficient-balance-e2e | P3.4: 余额不足处理 | ✅ |
| p3-4-debit-and-task-status-same-tx | P3.4: 扣费与状态同事务 | ✅ |
| p3-5-failed-compensation-ledger | P3.5: 失败补偿流水 | ✅ |
| p3-5-refund-idempotent-unique-key | P3.5: 退款幂等唯一键 | ✅ |
| p3-6-mock-provider-nonprod-only | P3.6: Mock provider 仅非生产 | ✅ |
| p3-6-readme-mock-topup-instructions | P3.6: README mock 充值说明 | ✅ |
| p4-1-storage-adapter-interface | P4.1: 存储适配器接口 | ✅ |
| p4-1-s3-minio-impl | P4.1: S3/MinIO 实现 | ✅ |
| p4-2-uploads-init-mime-size | P4.2: POST /uploads/init 校验 | ✅ |
| p4-2-presigned-put-response | P4.2: presigned PUT 响应 | ✅ |
| p4-2-bucket-cors-doc | P4.2: Bucket CORS 文档 | ✅ |
| p4-3-object-key-template-doc | P4.3: 对象 key 模板文档 | ✅ |
| p4-3-bucket-no-public-list | P4.3: 禁止公开 listing | ✅ |
| p5-1-post-tasks-validate | P5.1: POST /tasks zod 校验 | ✅ |
| p5-1-get-tasks-session-scope | P5.1: GET /tasks session 范围 | ✅ |
| p5-1-get-task-detail-cross-session-404 | P5.1: 跨 session 404 | ✅ |
| p5-1-status-transition-guard | P5.1: 状态转移守卫 | ✅ |
| p5-2-api-error-json-shape | P5.2: API 错误 JSON 格式 | ✅ |
| p5-2-frontend-apifetch-errors | P5.2: 前端 apiFetch 错误处理 | ✅ |
| p6-1-ocr-env-validate-startup | P6.1: OCR 环境变量校验 | ✅ |
| p6-1-poll-defaults-doc | P6.1: 轮询默认值文档 | ✅ |
| p6-2-submit-async-impl | P6.2: submitAsyncDocument 实现 | ✅ |
| p6-2-poll-loop-timeout | P6.2: 轮询循环超时 | ✅ |
| p6-2-backoff-429 | P6.2: 429 退避重试 | ✅ |
| p6-3-normalize-schema-fixed | P6.3: OcrResultEnvelope schema | ✅ |
| p6-3-normalize-fixture-test | P6.3: normalize fixture 测试 | ✅ |
| p6-4-sync-ocr-dev-guard | P6.4: 同步 OCR 仅开发环境 | ✅ |
| p7-1-worker-main-loop | P7.1: Worker 主循环 | ✅ |
| p7-1-graceful-shutdown-signals | P7.1: 优雅关闭信号 | ✅ |
| p7-2-queued-grab-lock-ocr-processing | P7.2: SKIP LOCKED 抢任务 | ✅ |
| p7-2-ocr-done-artifact-word-rendering | P7.2: OCR done 写 artifact | ✅ |
| p7-2-docx-done-completed | P7.2: DOCX 完成 | ✅ |
| p7-3-image-download-timeout-15s | P7.3: 图片下载超时 | ✅ |
| p7-3-partial-asset-fail-policy | P7.3: 部分资产失败策略 | ✅ |
| p7-4-poll-timeout-failed-refund | P7.4: 轮询超时退款 | ✅ |
| p7-4-worker-crash-reclaim-queued | P7.4: 崩溃后任务回收 | ✅ |
| p8-1-docx-cli-vs-http-decision | P8.1: CLI vs HTTP 决策 | ✅ |
| p8-1-template-map-document-type | P8.1: 模板映射表 | ✅ |
| p8-1-temp-dir-cleanup-finally | P8.1: 临时目录清理 | ✅ |
| p8-2-presigned-get-ttl-config | P8.2: presigned GET TTL | ✅ |
| p8-2-download-grants-audit | P8.2: download_grants 审计 | ✅ |
| p8-3-artifact-ttl-cleanup-job | P8.3: artifact TTL 清理 | ✅ |
| p8-3-source-output-retention-doc | P8.3: 文件保留策略 | ✅ |
| p9-0-tailwind-postcss-next15 | P9.0: Tailwind/PostCSS 配置 | ✅ |
| p9-0-shadcn-init-components-json | P9.0: shadcn init | ✅ |
| p9-0-brand-tokens-shadcn-vars | P9.0: 品牌 token 映射 | ✅ |
| p9-0-lucide-react | P9.0: lucide-react 图标 | ✅ |
| p9-0-next-themes-provider | P9.0: next-themes (推荐) | ✅ |
| p9-1-shadcn-core-chunk | P9.1: shadcn 核心组件 | ⬜ |
| p9-1-shadcn-form-rhf-zod | P9.1: shadcn form + RHF | ⬜ |
| p9-1-shadcn-overlay-toast-scroll | P9.1: shadcn overlay 组件 | ⬜ |
| p9-1-shadcn-nav-tabs-breadcrumb | P9.1: shadcn 导航组件 | ⬜ |
| p9-1-shadcn-accordion-table-optional | P9.1: accordion/table (可选) | ⬜ |
| p9-2-appshell-sheet-responsive | P9.2: AppShell 响应式 | ⬜ |
| p9-2-layout-theme-font | P9.2: layout ThemeProvider | ⬜ |
| p9-2-page-container-spacing | P9.2: 页面容器间距 | ⬜ |
| p9-3-home-funnel-mock | P9.3: 首页 Mock | ⬜ |
| p9-3-upload-mock | P9.3: 上传页 Mock | ⬜ |
| p9-3-wallet-mock | P9.3: 钱包 Mock | ⬜ |
| p9-3-tasks-list-mock | P9.3: 任务列表 Mock | ⬜ |
| p9-3-task-detail-mock | P9.3: 任务详情 Mock | ⬜ |
| p9-4-global-sonner-layout | P9.4: 全局 Toaster | ⬜ |
| p9-4-toast-vs-alert-matrix | P9.4: toast/alert 使用矩阵 | ⬜ |
| p9-4-suspense-skeleton-list-detail | P9.4: Suspense+Skeleton | ⬜ |
| p9-4-react-query-swr-optional | P9.4: SWR/React Query (可选) | ⬜ |
| p9-5-form-a11y-zod | P9.5: 表单 a11y | ⬜ |
| p9-5-dialog-sheet-focus-esc | P9.5: Dialog/Sheet 焦点 | ⬜ |
| p9-5-task-status-aria-live | P9.5: 状态 aria-live | ⬜ |
| p9-5-touch-target-44px-spotcheck | P9.5: 触摸目标 44px | ⬜ |
| p9-6-bootstrap-session-apiclient | P9.6: 前端 session 初始化 | ⬜ |
| p9-6-401-retry-toast | P9.6: 401 重试 toast | ⬜ |
| p9-6-error-notfound-shadcn | P9.6: error/not-found 页 | ⬜ |
| p9-7-wire-upload-flow | P9.7: 接通上传流程 | ⬜ |
| p9-7-wire-wallet-poll | P9.7: 接通钱包轮询 | ⬜ |
| p9-7-wire-tasks-poll | P9.7: 接通任务轮询 | ⬜ |
| p9-7-wire-task-download | P9.7: 接通下载流程 | ⬜ |
| p9-8-status-badge-migration | P9.8: status-badge 迁移 | ⬜ |
| p9-8-badge-contrast-dark | P9.8: 深色模式对比度 | ⬜ |
| p9-9-dod-five-routes-three-form-factors | P9.9: DoD 五路由三端 | ⬜ |
| p9-9-dod-light-dark-readable | P9.9: DoD 深浅可读 | ⬜ |
| p9-9-dod-14-sec9-12-sec3-automation | P9.9: DoD 自动化检查 | ⬜ |
| p9-10-1-breakpoints-doc-tailwind | P9.10.1: 断点文档 | ⬜ |
| p9-10-1-viewport-metadata-fit-cover | P9.10.1: viewport 配置 | ⬜ |
| p9-10-1-shell-padding-maxwidth | P9.10.1: Shell padding | ⬜ |
| p9-10-2-mobile-sheet-nav | P9.10.2: Mobile 导航 | ⬜ |
| p9-10-2-tablet-nav-choice | P9.10.2: Tablet 导航 | ⬜ |
| p9-10-2-pc-full-nav-wallet | P9.10.2: PC 全导航 | ⬜ |
| p9-10-2-skip-link-main | P9.10.2: skip link | ⬜ |
| p9-10-3-home-grid-by-breakpoint | P9.10.3: 首页栅格 | ⬜ |
| p9-10-3-home-cta-no-horizontal-scroll | P9.10.3: CTA 无横滑 | ⬜ |
| p9-10-4-upload-mobile-touch | P9.10.4: 上传 Mobile | ⬜ |
| p9-10-4-upload-tablet-two-col | P9.10.4: 上传 Tablet | ⬜ |
| p9-10-4-upload-pc-sidebar | P9.10.4: 上传 PC | ⬜ |
| p9-10-5-wallet-mobile-card-only | P9.10.5: 钱包 Mobile | ⬜ |
| p9-10-5-wallet-tablet-balance-grid | P9.10.5: 钱包 Tablet | ⬜ |
| p9-10-5-wallet-pc-table-qr-two-col | P9.10.5: 钱包 PC | ⬜ |
| p9-10-6-tasks-mobile-cards-tabs | P9.10.6: 任务 Mobile | ⬜ |
| p9-10-6-tasks-tablet-two-col-optional | P9.10.6: 任务 Tablet (可选) | ⬜ |
| p9-10-6-tasks-pc-table-row-click | P9.10.6: 任务 PC | ⬜ |
| p9-10-7-detail-mobile-timeline-full-btn | P9.10.7: 详情 Mobile | ⬜ |
| p9-10-7-detail-tablet-stacked | P9.10.7: 详情 Tablet | ⬜ |
| p9-10-7-detail-pc-two-col-sticky | P9.10.7: 详情 PC | ⬜ |
| p9-10-8-no-tooltip-only-mobile-tablet | P9.10.8: 移动端无仅 tooltip | ⬜ |
| p9-10-8-pc-tooltip-keyboard-download | P9.10.8: PC tooltip 键盘 | ⬜ |
| p9-10-9-devtools-three-sizes-manual | P9.10.9: DevTools 三尺寸 | ⬜ |
| p9-10-9-playwright-three-viewports | P9.10.9: Playwright 三视口 | ⬜ |
| p9-10-9-mobile-safari-chrome-smoke | P9.10.9: 真机 smoke | ⬜ |
| p10-1-vitest-payment-idempotency | P10.1: Vitest 支付幂等 | ✅ |
| p10-1-vitest-session-cross-access | P10.1: Vitest 跨 session | ✅ |
| p10-1-vitest-task-transition-pricing | P10.1: Vitest 状态/定价 | ✅ |
| p10-1-vitest-normalize-ocr-fixture | P10.1: Vitest OCR 归一化 | ✅ |
| p10-1-vitest-api-route-integration | P10.1: Vitest API 集成 | ✅ |
| p10-1-playwright-happy-path-optional | P10.1: Playwright happy (可选) | ⬜ |
| p10-2-structured-logging | P10.2: 结构化日志 | ⬜ |
| p10-2-correlation-doc-example | P10.2: 关联日志文档 | ⬜ |
| p10-3-deploy-runbook | P10.3: 部署 Runbook | ⬜ |
| p10-3-production-promotion-checklist | P10.3: 生产晋升清单 | ⬜ |

---

## P0: Process & Infrastructure

### Process
- [x] meta-doc-ssot-stack: 元：SSOT=DEVELOPMENT_PLAN + plan-context/INDEX + 13_TODO_BACKLOG_EXPANDED（维护节含 id 映射表）
- [x] p0-0-ssot-update-order: P0.0: 团队约定先改 13 勾选行与映射表，再同步本 Cursor plan 的 id/content/status，避免分叉
- [ ] p0-0-id-map-maintain: P0.0: 在 13 新增/拆分勾选时：分配新 p*- slug id；在映射表增一行；再改 YAML

### Branching
- [ ] p0-1-web-branch-from-baseline: P0.1: 从约定 tag/commit 检出 web；记录默认 upstream
- [ ] p0-1-doc-merge-strategy: P0.1: 文档化 web↔local 合并策略（单行：仅共享工具/文档或长期隔离）
- [ ] p0-1-production-branch-protection: P0.1: GitHub/GitLab 分支规则：禁止直推 production；PR 需 review/CI（按团队）

### CI/CD
- [ ] p0-2-ci-workflow-paths: P0.2: 新增 workflow，on.push.paths / pull_request.paths 含 products/web-app/**
- [ ] p0-2-ci-job-npm-build-test: P0.2: job 执行 cd products/web-app/app && npm ci && npm run build && npm run test；失败阻断合并
- [ ] p0-2-ci-npm-cache-optional: P0.2（可选）: actions/cache 缓存 ~/.npm 或 npm 全局 store

### Environment & Documentation
- [ ] p0-3-env-example-placeholders: P0.3: app/.env.example 全占位符（DATABASE_URL、OBJECT_STORAGE_*、PADDLEOCR_VL_*、PAYMENT_*、APP_BASE_URL、WORKER_*）
- [ ] p0-3-app-readme-local-run: P0.3: app/README.md — cp .env.example、npm install、dev、test、后续 worker 命令
- [ ] p0-3-product-readme-devplan-link: P0.3: products/web-app/README.md 链到 DEVELOPMENT_PLAN 与 plan-context/INDEX

### Security
- [ ] p0-4-pr-grep-checklist-doc: P0.4: 文档化 PR 前 grep 自检（token/secret/api_key）对齐 REPO_GOVERNANCE
- [ ] p0-4-precommit-secret-scan-optional: P0.4（可选）: pre-commit + gitleaks/trufflehog 等轻量规则

---

## P1: Database & ORM

### ORM Selection
- [x] p1-1-orm-spike: P1.1: ≤1 天 Spike 选定 Prisma/Drizzle/Kysely；记录迁移 DX、Serverless 兼容、团队熟悉度
- [x] p1-1-traceability-orm-record: P1.1: 在 plan-context/00_TRACEABILITY.md 技术选型表填入 ORM+日期+简述

### Migrations
- [x] p1-2-migrate-anonymous-sessions: P1.2: migration anonymous_sessions（PK、wallet_balance、status、expires_at、created_at、索引 expires_at）
- [x] p1-2-migrate-payment-orders: P1.2: migration payment_orders + FK anonymous_session_id；idempotency_key 唯一；provider_txn_id
- [x] p1-2-migrate-wallet-ledgers: P1.2: migration wallet_ledgers + FKs；direction/reason/amount；防重复入账唯一约束
- [x] p1-2-migrate-processing-tasks: P1.2: migration processing_tasks + FKs；列表 (session_id,created_at desc)；Worker (status,created_at)
- [x] p1-2-migrate-ocr-artifacts: P1.2: migration ocr_artifacts + FK task_id；ttl_expires_at；大字段或外链 key 策略
- [x] p1-2-migrate-download-grants: P1.2: migration download_grants + FK session/task；expires_at；signed_url 存否策略

### Data Quality
- [x] p1-3-decimal-rounding-doc: P1.3: 文档化金额 decimal 精度、舍入、展示到分规则；禁止 JS number 直接算钱
- [x] p1-3-timestamptz-utc: P1.3: 全表时间戳 timestamptz UTC；ORM 层统一序列化 ISO8601

### Dev Tools (Optional)
- [ ] p1-4-docker-compose-postgres-optional: P1.4（可选）: products/web-app/docker-compose.yml 仅 postgres:16；volume；端口文档
- [ ] p1-4-seed-session-completed-task-optional: P1.4（可选）: seed 脚本 1 session + 1 completed task + 示例 ledger

---

## P2: Session Management

### Session Creation
- [x] p2-1-session-post-db: P2.1: POST /api/session INSERT；sess_ 高熵 id（crypto.randomBytes）；返回非敏感 JSON
- [x] p2-1-set-cookie-attrs-doc: P2.1: Set-Cookie：HttpOnly、Path=/、Secure(生产)、SameSite=Lax/Strict 策略书面化
- [x] p2-1-no-token-in-url-response: P2.1: 禁止在 redirect Location 或响应体把 session 暴露到可分享 URL

### Session Validation
- [x] p2-2-get-session-helper: P2.2: 实现 getSessionFromRequest：读 Cookie、查 DB、校验 expires_at、返回 typed session
- [x] p2-2-middleware-callback-allowlist: P2.2: Middleware 跳过 /api/payments/callback、静态资源、Next 内部路径；其余需 session

### Expiry Handling
- [x] p2-3-expiry-align-lib-db: P2.3: sessionExpiryHours（lib/session.ts）与 DB expires_at 同源配置；到期 401 SESSION_EXPIRED
- [x] p2-3-frontend-401-recovery-manual: P2.3: 手动 E2E：清 Cookie/过期后前端可重建 session 并恢复操作

---

## P3: Wallet & Payment

### Wallet API
- [x] p3-1-wallet-get-ledger-pagination: P3.1: GET /api/wallet：balance、currency、ledgers cursor/limit 分页、排序 desc
- [x] p3-1-currency-recommended-topup-config: P3.1: recommendedTopup 与币种从 env 或配置读取；禁止硬编码于组件

### Payment Orders
- [x] p3-2-post-create-topup-order: P3.2: POST 创建 topup 订单：写 payment_orders pending；关联 session
- [x] p3-2-return-channel-display-fields: P3.2: 响应含二维码 URL / 支付跳转 URL / 过期时间等渠道所需字段（抽象为 provider DTO）
- [x] p3-2-idempotency-key-conflict-same-order: P3.2: 相同 idempotency_key 重放返回同一订单 id（409 或 200+data，全 API 统一）

### Payment Callback
- [x] p3-3-verify-signature-and-test: P3.3: 支付回调验签（渠道算法）；Vitest fixture 覆盖合法/篡改 body
- [x] p3-3-idempotent-provider-txn-id: P3.3: provider_txn_id 幂等：第二次回调不重复入账；返回 200 幂等响应
- [x] p3-3-tx-order-ledger-balance: P3.3: 单事务内更新 order paid/credited、insert ledger credit、increment session balance

### Pricing & Debit
- [x] p3-4-price-by-document-type: P3.4: 定价表 exam/handout/homework；可 env JSON 或 DB；单元测试边界
- [x] p3-4-insufficient-balance-e2e: P3.4: 覆盖余额不足→awaiting_payment 或 402；前端引导充值
- [x] p3-4-debit-and-task-status-same-tx: P3.4: 扣费 ledger debit + task 状态推进同事务；失败整单回滚

### Refund & Compensation
- [x] p3-5-failed-compensation-ledger: P3.5: task failed 写 compensation/refund ledger；余额加回
- [x] p3-5-refund-idempotent-unique-key: P3.5: 唯一键 (task_id, reason) 或独立 idempotency 防双退

### Mock Provider
- [x] p3-6-mock-provider-nonprod-only: P3.6: PAYMENT_PROVIDER=mock 仅在非 production；双检 env+构建时断言
- [x] p3-6-readme-mock-topup-instructions: P3.6: README 描述本地一键 mock 到账步骤与限制

---

## P4: Object Storage

### Storage Interface
- [x] p4-1-storage-adapter-interface: P4.1: TypeScript 接口 putObject、presignedPut、presignedGet；错误类型
- [x] p4-1-s3-minio-impl: P4.1: @aws-sdk/client-s3 或兼容实现；docker MinIO 联调上传下载

### Upload API
- [x] p4-2-uploads-init-mime-size: P4.2: POST /api/uploads/init 校验 MIME 白名单、maxSize、session 存在
- [x] p4-2-presigned-put-response: P4.2: 返回 url、headers、expiresAt、最终 source_file_key（与后续 POST /tasks 对齐）
- [x] p4-2-bucket-cors-doc: P4.2: 文档写 bucket CORS：允许前端 origin、PUT/HEAD、Expose-Headers

### Security
- [x] p4-3-object-key-template-doc: P4.3: 文档模板 {sessionId}/{taskId}/source/...；禁止可枚举 listing
- [x] p4-3-bucket-no-public-list: P4.3: 确认 bucket policy 关闭 list；仅 presigned 访问

---

## P5: Tasks API

### CRUD
- [ ] p5-1-post-tasks-validate: P5.1: POST /api/tasks zod 校验 body；source_file_key 命名空间属于 session；初态+支付闸门
- [ ] p5-1-get-tasks-session-scope: P5.1: GET /api/tasks WHERE session_id=? ORDER BY updated_at DESC；字段对齐 TaskCard
- [ ] p5-1-get-task-detail-cross-session-404: P5.1: GET /api/tasks/[id] 非本 session 返回 404（防 id 枚举）
- [ ] p5-1-status-transition-guard: P5.1: 服务端更新 status 前调用与 lib/tasks.ts 同逻辑的 canTransitionTask（抽共享模块防漂移）

### Error Handling
- [ ] p5-2-api-error-json-shape: P5.2: 全路由 NextResponse.json({ error:{code,message,details?} }, status) 封装
- [ ] p5-2-frontend-apifetch-errors: P5.2: 前端 apiFetch 统一抛业务 Error；映射 toast/alert

---

## P6: OCR Integration

### Configuration
- [ ] p6-1-ocr-env-validate-startup: P6.1: 读取 PADDLEOCR_VL_*；生产缺变量时 worker/api 拒绝启动或降级策略文档化
- [ ] p6-1-poll-defaults-doc: P6.1: 文档 POLL_INTERVAL_MS、TIMEOUT_MS、单图下载超时默认值

### Async Processing
- [ ] p6-2-submit-async-impl: P6.2: submitAsyncDocument：multipart 或 URL 模式；返回 jobId 持久化到 task
- [ ] p6-2-poll-loop-timeout: P6.2: 轮询循环直至 done/failed/时钟超时；超时标记 OCR_UPSTREAM_TIMEOUT
- [ ] p6-2-backoff-429: P6.2: 429/5xx 指数退避+抖动；上限重试次数

### Result Normalization
- [ ] p6-3-normalize-schema-fixed: P6.3: Zod/TS 类型固定 OcrResultEnvelope；markdownText、structuredJson、assets[]
- [ ] p6-3-normalize-fixture-test: P6.3: Vitest：脱敏上游 raw JSON → normalize 快照

### Sync Mode (Dev Only)
- [ ] p6-4-sync-ocr-dev-guard: P6.4: submitSync 仅 ALLOW_SYNC_OCR=true 且 NODE_ENV!=production

---

## P7: Worker

### Main Loop
- [ ] p7-1-worker-main-loop: P7.1: src/worker/index.ts：并发 N、sleep、拉取任务；日志 taskId
- [ ] p7-1-graceful-shutdown-signals: P7.1: SIGINT/SIGTERM 停止拉新、尽力完成当前或标记回 queued（策略写明）

### Task Processing
- [ ] p7-2-queued-grab-lock-ocr-processing: P7.2: SQL SKIP LOCKED/UPDATE RETURNING 抢 queued；置 ocr_processing
- [ ] p7-2-ocr-done-artifact-word-rendering: P7.2: OCR done→写 ocr_artifacts→status word_rendering；失败分支
- [ ] p7-2-docx-done-completed: P7.2: DOCX 上传成功→output_docx_key→completed；否则 failed+退款

### Asset Handling
- [ ] p7-3-image-download-timeout-15s: P7.3: 每 asset fetch 超时；AbortController；记录 OCR_ASSET_DOWNLOAD_FAILED
- [ ] p7-3-partial-asset-fail-policy: P7.3: 可选图失败：若 Word 必需则 fail；否则跳过并日志

### Failure Recovery
- [ ] p7-4-poll-timeout-failed-refund: P7.4: OCR 轮询超时→failed→触发 p3-5 退款路径
- [ ] p7-4-worker-crash-reclaim-queued: P7.4: 进程崩溃后 queued/ocr_processing 可再次被抢；心跳或租约可选 v1

---

## P8: DOCX Generation

### Implementation Choice
- [ ] p8-1-docx-cli-vs-http-decision: P8.1: 书面选定 Python 子进程 vs HTTP 内网服务；写入 00_TRACEABILITY
- [ ] p8-1-template-map-document-type: P8.1: exam/handout/homework→模板文件路径表；版本号环境变量
- [ ] p8-1-temp-dir-cleanup-finally: P8.1: fs.mkdtemp；try/finally rm；子进程 kill 超时

### Download
- [ ] p8-2-presigned-get-ttl-config: P8.2: DOWNLOAD_URL_TTL_SEC；与用户下载按钮请求频控
- [ ] p8-2-download-grants-audit: P8.2: INSERT download_grants：session、task、expires、可选 signed_url hash

### Cleanup
- [ ] p8-3-artifact-ttl-cleanup-job: P8.3: Worker 定时或独立 cron：删过期 ocr_artifact 行与对象
- [ ] p8-3-source-output-retention-doc: P8.3: 源文件与 docx 保留天数对齐 DATA_MODEL；法律/运营确认

---

## P9: UI/Frontend

### Foundation (P9.0)
- [ ] p9-0-tailwind-postcss-next15: P9.0: 安装 tailwindcss postcss autoprefixer；content paths 含 app/src；build 通过
- [ ] p9-0-shadcn-init-components-json: P9.0: npx shadcn@latest init；RSC、@/components、tailwind 主题变量
- [ ] p9-0-brand-tokens-shadcn-vars: P9.0: 映射现有暖色到 --primary 等；收敛 globals.css 重复变量
- [ ] p9-0-lucide-react: P9.0: lucide-react；与 shadcn 示例一致
- [ ] p9-0-next-themes-provider: P9.0（推荐）: next-themes ThemeProvider；layout 注入；class 策略

### Components (P9.1)
- [ ] p9-1-shadcn-core-chunk: P9.1: shadcn add button card badge alert progress skeleton separator
- [ ] p9-1-shadcn-form-rhf-zod: P9.1: add form input label select/radio-group；装 react-hook-form zod @hookform/resolvers
- [ ] p9-1-shadcn-overlay-toast-scroll: P9.1: add dialog sheet sonner tooltip scroll-area
- [ ] p9-1-shadcn-nav-tabs-breadcrumb: P9.1: add tabs 或 navigation-menu、breadcrumb
- [ ] p9-1-shadcn-accordion-table-optional: P9.1（可选）: accordion FAQ；table 桌面流水

### Layout (P9.2)
- [ ] p9-2-appshell-sheet-responsive: P9.2: 重构 AppShell：lg 横导航、<lg Sheet+汉堡；钱包快捷可选
- [ ] p9-2-layout-theme-font: P9.2: layout.tsx 包裹 ThemeProvider；next/font 中文子集策略
- [ ] p9-2-page-container-spacing: P9.2: 统一 container px-4 md:px-6 lg:px-8、section gap、max-w-6xl

### Page Mocks (P9.3)
- [ ] p9-3-home-funnel-mock: P9.3: 首页四步 Mock+CTA；空状态；后换真实任务计数
- [ ] p9-3-upload-mock: P9.3: 上传页 Mock 步骤条+文件 UI；后接 presign+PUT+POST tasks
- [ ] p9-3-wallet-mock: P9.3: 钱包 Mock 余额/流水/Dialog 二维码；后接 API
- [ ] p9-3-tasks-list-mock: P9.3: 列表 Mock 卡片/筛选；后接轮询
- [ ] p9-3-task-detail-mock: P9.3: 详情 Mock 时间线+Progress+下载；后接 grant

### UX Patterns (P9.4)
- [ ] p9-4-global-sonner-layout: P9.4: layout 挂 Toaster/Sonner；统一 duration
- [ ] p9-4-toast-vs-alert-matrix: P9.4: 文档+代码：网络抖动 toast；余额不足/格式错误 alert+CTA
- [ ] p9-4-suspense-skeleton-list-detail: P9.4: 列表/详情 loading.tsx 或 Suspense+Skeleton
- [ ] p9-4-react-query-swr-optional: P9.4（可选）: SWR/React Query；refetchInterval 按任务是否终态

### Accessibility (P9.5)
- [ ] p9-5-form-a11y-zod: P9.5: Label htmlFor；aria-invalid；错误 id 关联
- [ ] p9-5-dialog-sheet-focus-esc: P9.5: Radix Dialog/Sheet 焦点陷阱与 Esc 手动测
- [ ] p9-5-task-status-aria-live: P9.5: 轮询更新区域 aria-live=polite；防抖合并文案
- [ ] p9-5-touch-target-44px-spotcheck: P9.5: 上传/下载/导航 min-h-11 min-w-11 抽检

### Session & Error Handling (P9.6)
- [ ] p9-6-bootstrap-session-apiclient: P9.6: 无 Cookie 时 layout effect POST /api/session；fetch credentials include
- [ ] p9-6-401-retry-toast: P9.6: 401 清 cookie+toast+单次重试原请求或回首页
- [ ] p9-6-error-notfound-shadcn: P9.6: app/error.tsx not-found.tsx 用 Button 回首页

### Wire Up (P9.7)
- [ ] p9-7-wire-upload-flow: P9.7: upload：init→PUT→POST tasks；错误分层
- [ ] p9-7-wire-wallet-poll: P9.7: wallet：拉流水+创建订单+轮询支付状态至 credited
- [ ] p9-7-wire-tasks-poll: P9.7: tasks 列表 3–5s 轮询直至全终态或 unmount
- [ ] p9-7-wire-task-download: P9.7: 详情 completed 调 download API；处理 410 重签

### Polish (P9.8)
- [ ] p9-8-status-badge-migration: P9.8: status-badge.tsx→Badge variant 映射 TaskStatus 中文表
- [ ] p9-8-badge-contrast-dark: P9.8: dark 模式每状态 Badge 对比度人工表

### Definition of Done (P9.9)
- [ ] p9-9-dod-five-routes-three-form-factors: P9.9: DoD：五路由+Mobile/Tablet/PC 主路径无横滑断裂
- [ ] p9-9-dod-light-dark-readable: P9.9: DoD：深浅色全文可读
- [ ] p9-9-dod-14-sec9-12-sec3-automation: P9.9: DoD：14§9 + 12§3 axe/Playwright 若启用则全绿

### Responsive Design (P9.10)
#### Breakpoints (P9.10.1)
- [ ] p9-10-1-breakpoints-doc-tailwind: P9.10.1: 文档 Mobile<md Tablet md–lg PC lg+；tailwind screens 对齐
- [ ] p9-10-1-viewport-metadata-fit-cover: P9.10.1: export viewport viewportFit=cover；Apple 刘海
- [ ] p9-10-1-shell-padding-maxwidth: P9.10.1: AppShell 统一 padding/max-width 阶梯

#### Navigation (P9.10.2)
- [ ] p9-10-2-mobile-sheet-nav: P9.10.2: Mobile 汉堡+Sheet；顶栏≤3 图标级
- [ ] p9-10-2-tablet-nav-choice: P9.10.2: Tablet 选精简 Tab 或仍 Sheet；全站一致
- [ ] p9-10-2-pc-full-nav-wallet: P9.10.2: PC NavigationMenu+可选钱包摘要
- [ ] p9-10-2-skip-link-main: P9.10.2: skip to #main-content 可 Tab 聚焦

#### Home (P9.10.3)
- [ ] p9-10-3-home-grid-by-breakpoint: P9.10.3: 首页 1/2/4 列栅格按 md/lg
- [ ] p9-10-3-home-cta-no-horizontal-scroll: P9.10.3: 三端首屏主 CTA 无横向滚动

#### Upload (P9.10.4)
- [ ] p9-10-4-upload-mobile-touch: P9.10.4: Mobile 类型选择全宽+44px 触摸
- [ ] p9-10-4-upload-tablet-two-col: P9.10.4: Tablet md:grid-cols-2 表单+说明
- [ ] p9-10-4-upload-pc-sidebar: P9.10.4: PC 双列+大拖拽区

#### Wallet (P9.10.5)
- [ ] p9-10-5-wallet-mobile-card-only: P9.10.5: Mobile 流水仅 Card；禁整页 Table 横滑
- [ ] p9-10-5-wallet-tablet-balance-grid: P9.10.5: Tablet 余额+入口两列
- [ ] p9-10-5-wallet-pc-table-qr-two-col: P9.10.5: PC Table+ScrollArea；二维码 lg:grid-cols-2

#### Tasks (P9.10.6)
- [ ] p9-10-6-tasks-mobile-cards-tabs: P9.10.6: Mobile Card+Select/滚动 Tabs
- [ ] p9-10-6-tasks-tablet-two-col-optional: P9.10.6: Tablet 可选 md:grid-cols-2
- [ ] p9-10-6-tasks-pc-table-row-click: P9.10.6: PC Table row click；hover 非唯一信息

#### Task Detail (P9.10.7)
- [ ] p9-10-7-detail-mobile-timeline-full-btn: P9.10.7: Mobile 时间线+下载全宽
- [ ] p9-10-7-detail-tablet-stacked: P9.10.7: Tablet 上下区
- [ ] p9-10-7-detail-pc-two-col-sticky: P9.10.7: PC lg:grid + sticky 侧卡

#### Tooltips (P9.10.8)
- [ ] p9-10-8-no-tooltip-only-mobile-tablet: P9.10.8: 关键说明 Mobile/Tablet 可见文案不依赖 Tooltip
- [ ] p9-10-8-pc-tooltip-keyboard-download: P9.10.8: PC Tooltip 补充；键盘完成下载

#### Testing (P9.10.9)
- [ ] p9-10-9-devtools-three-sizes-manual: P9.10.9: 375×812、768×1024、1280×800 手测主路径
- [ ] p9-10-9-playwright-three-viewports: P9.10.9: Playwright 三视口 smoke（mock 支付+OCR）
- [ ] p9-10-9-mobile-safari-chrome-smoke: P9.10.9: 上线前 iOS Safari+Android Chrome 真机各 1 次

---

## P10: Testing & Deployment

### Vitest Unit/Integration
- [ ] p10-1-vitest-payment-idempotency: P10.1: Vitest 重复 callback/ledger 不重复入账
- [ ] p10-1-vitest-session-cross-access: P10.1: Vitest 跨 session 读任务 404
- [ ] p10-1-vitest-task-transition-pricing: P10.1: Vitest canTransitionTask+定价纯函数
- [ ] p10-1-vitest-normalize-ocr-fixture: P10.1: Vitest normalizeOcrResult fixture（可与 P6 复用例）
- [ ] p10-1-vitest-api-route-integration: P10.1: Vitest+TestDB integration：session→task→越权
- [ ] p10-1-playwright-happy-path-optional: P10.1（可选）: Playwright 单条 happy path 或与 p9-10-9 合并

### Logging
- [ ] p10-2-structured-logging: P10.2: pino/winston 等 JSON 日志；level、msg、taskId、requestId
- [ ] p10-2-correlation-doc-example: P10.2: 文档示例：按 requestId/taskId grep 全链路

### Deployment
- [ ] p10-3-deploy-runbook: P10.3: Runbook：migrate、next start、worker start、env、回调 URL、存储 CORS、双进程健康检查
- [ ] p10-3-production-promotion-checklist: P10.3: production 晋升清单对齐 BRANCHING_AND_RELEASE；关 mock；密钥仅 Secret Manager

---

## Summary

- **Total**: 159 items
- **Completed**: 1 (meta-doc-ssot-stack)
- **In Progress**: 1 (p0-0-ssot-update-order)
- **Pending**: 157
