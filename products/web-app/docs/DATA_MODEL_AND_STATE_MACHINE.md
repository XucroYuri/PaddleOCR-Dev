# 数据模型与状态机说明

## 1. 目标

本文件定义 `web` 产品线的一期核心数据模型和状态机，为后续数据库设计、后端接口、任务编排与下载交付提供统一基础。

## 2. 核心实体

### 2.1 AnonymousSession

字段建议：

| 字段 | 类型 | 说明 |
|------|------|------|
| `anonymous_session_id` | string | 匿名会话主键 |
| `created_at` | datetime | 创建时间 |
| `expires_at` | datetime | 会话过期时间 |
| `wallet_balance` | decimal | 当前余额 |
| `status` | enum | `active / expired / locked` |

### 2.2 PaymentOrder

| 字段 | 类型 | 说明 |
|------|------|------|
| `payment_order_id` | string | 支付订单主键 |
| `anonymous_session_id` | string | 归属会话 |
| `order_type` | enum | `topup / task_charge` |
| `amount` | decimal | 订单金额 |
| `status` | enum | 支付订单状态 |
| `idempotency_key` | string | 幂等键 |
| `provider_txn_id` | string | 支付平台流水号 |
| `created_at` | datetime | 创建时间 |

### 2.3 WalletLedger

| 字段 | 类型 | 说明 |
|------|------|------|
| `ledger_id` | string | 钱包流水主键 |
| `anonymous_session_id` | string | 归属会话 |
| `payment_order_id` | string | 关联订单 |
| `direction` | enum | `credit / debit / refund` |
| `amount` | decimal | 金额 |
| `reason` | enum | `topup / task_run / compensation` |
| `created_at` | datetime | 生成时间 |

### 2.4 ProcessingTask

| 字段 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 任务主键 |
| `anonymous_session_id` | string | 归属会话 |
| `payment_order_id` | string | 扣费来源 |
| `source_file_key` | string | 原始文件存储键 |
| `document_type` | enum | `exam / handout / homework` |
| `template_id` | string | 目标模板 |
| `status` | enum | 任务状态 |
| `ocr_job_id` | string | 上游 OCR job id |
| `output_docx_key` | string | 产物文件键 |
| `error_code` | string | 错误码 |
| `error_message` | text | 错误描述 |
| `created_at` | datetime | 创建时间 |

### 2.5 OcrArtifact

| 字段 | 类型 | 说明 |
|------|------|------|
| `artifact_id` | string | 中间产物主键 |
| `task_id` | string | 归属任务 |
| `markdown_text` | text | OCR 输出 Markdown |
| `structured_json_key` | string | OCR 结构化 JSON 存储键 |
| `asset_manifest_key` | string | 图片资产清单键 |
| `ttl_expires_at` | datetime | 中间产物清理时间 |

### 2.6 DownloadGrant

| 字段 | 类型 | 说明 |
|------|------|------|
| `grant_id` | string | 下载授权主键 |
| `anonymous_session_id` | string | 归属会话 |
| `task_id` | string | 归属任务 |
| `file_key` | string | Word 文件键 |
| `signed_url` | text | 下载链接 |
| `expires_at` | datetime | 链接失效时间 |

## 3. 任务状态机

推荐任务状态：

- `created`
- `awaiting_payment`
- `paid`
- `queued`
- `ocr_processing`
- `word_rendering`
- `completed`
- `failed`
- `expired`

### 3.1 合法转移

| 当前状态 | 可转移到 |
|------|------|
| `created` | `awaiting_payment`, `expired` |
| `awaiting_payment` | `paid`, `expired` |
| `paid` | `queued`, `failed`, `expired` |
| `queued` | `ocr_processing`, `failed`, `expired` |
| `ocr_processing` | `word_rendering`, `failed`, `expired` |
| `word_rendering` | `completed`, `failed`, `expired` |
| `completed` | 无 |
| `failed` | 无 |
| `expired` | 无 |

### 3.2 终态

终态固定为：

- `completed`
- `failed`
- `expired`

## 4. 支付订单状态机

推荐订单状态：

- `created`
- `pending_payment`
- `paid`
- `credited`
- `failed`
- `expired`
- `refunded`

推荐转移：

| 当前状态 | 可转移到 |
|------|------|
| `created` | `pending_payment`, `expired` |
| `pending_payment` | `paid`, `expired`, `failed` |
| `paid` | `credited`, `failed` |
| `credited` | `refunded` |
| `failed` | 无 |
| `expired` | 无 |
| `refunded` | 无 |

## 5. 会话隔离原则

隔离键固定为：

- `anonymous_session_id`
- `task_id`

要求：

- 一个任务必须且只能绑定一个匿名会话
- 下载授权必须校验会话归属
- 文件存储必须按 `session_id/task_id` 命名空间组织
- 任何跨会话访问都必须返回拒绝

## 6. 清理与 TTL

推荐 TTL 策略：

- 匿名会话：12 小时活跃期
- 中间 Markdown/JSON：24 小时
- 失败任务日志：7 天
- 已完成 Word 文件：根据运营策略决定，默认 7-30 天

## 7. 最小数据库实施建议

一期至少需要以下表：

- `anonymous_sessions`
- `payment_orders`
- `wallet_ledgers`
- `processing_tasks`
- `ocr_artifacts`
- `download_grants`

## 8. 实施注意事项

- 任务状态推进与余额扣减必须分离但具有关联键
- 支付成功不等于任务成功
- OCR 成功不等于 Word 成功
- Word 成功后才能签发下载授权
- 所有状态更新都应记录时间戳与错误上下文

