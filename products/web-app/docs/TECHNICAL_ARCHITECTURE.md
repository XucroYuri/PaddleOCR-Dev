# Web 应用技术方案说明

## 1. Scope

本技术方案只面向 `web` 产品线，默认采用 **API-only** 架构：

`Web/H5 -> Backend -> PaddleOCR-VL-1.5 API -> internal Markdown/JSON -> DOCX renderer -> object storage download`

不包含本地 PaddleOCR 推理链路。

## 2. System Components

### Frontend

- 上传页
- 充值/支付页
- 任务列表页
- 下载页

### Backend

- 匿名会话服务
- 订单与支付服务
- 任务服务
- 下载授权服务

### OCR Provider Adapter

- 封装同步/异步 OCR API
- 生产默认使用异步接口
- 同步接口仅作调试与小文件快速验证

### Worker

- 创建并轮询 OCR 任务
- 统一提取 `markdown.text`、`markdown.images`、结构化结果
- 调用 DOCX Renderer
- 写回任务状态与文件索引

### DOCX Renderer

- 消费内部 `Markdown/JSON`
- 选择平台模板
- 输出 `.docx`
- 上传到对象存储

## 3. Core Objects

### AnonymousSession

- `anonymous_session_id`
- `created_at`
- `expires_at`
- `wallet_balance`

### PaymentOrder

- `payment_order_id`
- `anonymous_session_id`
- `amount`
- `status`
- `idempotency_key`

### ProcessingTask

- `task_id`
- `anonymous_session_id`
- `payment_order_id`
- `source_file_key`
- `document_type`
- `template_id`
- `ocr_job_id`
- `status`
- `output_docx_key`
- `error_code`
- `error_message`

### OCRResultEnvelope

- `markdown_text`
- `structured_json`
- `assets`

## 4. State Machine

- `created`
- `awaiting_payment`
- `paid`
- `queued`
- `ocr_processing`
- `word_rendering`
- `completed`
- `failed`
- `expired`

## 5. Isolation Rules

- 每个访问者先生成 `anonymous_session_id`
- 每个任务必须绑定 `anonymous_session_id + task_id`
- 文件与结果按 `session_id/task_id` 命名空间隔离
- 下载仅对当前会话授权
- 中间产物按 TTL 清理

## 6. API Strategy

### Sync API

用途：

- 开发调试
- 小样例验证
- 后台快速排障

### Async API

用途：

- 生产主链路
- 多页 PDF
- 中长任务
- 支付后处理

结论：正式业务默认只围绕异步接口设计。

## 7. DOCX Strategy

- 平台模板为主，不开放用户上传模板
- 模板按 `document_type -> template_id` 映射
- 目标是“可编辑 Word”，不是极致版面复刻
- `Markdown/JSON` 仅作为内部中间层

## 8. Deployment Notes

- Web 产品目录独立于本地能力线目录
- API Token 必须通过服务端环境变量注入
- 前端不得直接持有 OCR API Token
- 生产环境需具备对象存储、数据库、队列与支付回调入口

