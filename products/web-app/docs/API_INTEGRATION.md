# PaddleOCR-VL-1.5 API 接入说明

## 1. 目标

本文件定义 `web` 产品线如何以 **API-only** 方式接入 `PaddleOCR-VL-1.5`，并将官方 API 返回结果统一转换为内部可消费的任务结果结构，供 Word 渲染链路与下载交付链路使用。

默认结论：

- 开发调试可使用**同步解析**
- 生产主链路必须使用**异步解析**
- 前端永远不直接持有 OCR API Token
- OCR 原始结果不直接暴露给终端用户

## 2. 运行时密钥

所有密钥必须由服务端注入，不得出现在前端或示例代码中。

推荐环境变量：

- `PADDLEOCR_VL_SYNC_API_URL`
- `PADDLEOCR_VL_ASYNC_JOB_URL`
- `PADDLEOCR_VL_MODEL_NAME`
- `PADDLEOCR_VL_AISTUDIO_TOKEN`
- `PADDLEOCR_VL_POLL_INTERVAL_MS`
- `PADDLEOCR_VL_POLL_TIMEOUT_MS`

说明：

- 示例文档和代码一律使用占位符
- 任何暴露过的 token 一律视为泄漏并重置
- 具体规则遵循 [REPO_GOVERNANCE.md](../../REPO_GOVERNANCE.md)

## 3. Provider Adapter 设计

建议在后端实现一个统一适配层，例如：

- `submitSyncDocument(input, options)`
- `submitAsyncDocument(input, options)`
- `pollAsyncDocument(jobId)`
- `normalizeOcrResult(rawResult, sourceMeta)`

### 3.1 输入类型

统一输入模型：

- `input_type`: `local_upload` | `remote_url`
- `file_url`
- `object_storage_key`
- `original_filename`
- `mime_type`
- `page_count_hint`

### 3.2 调用策略

**同步解析**

用途：

- 本地开发联调
- 小图片、小页数样例
- 后台快速排障

限制：

- 不能作为正式商用主链路
- 不应用于支付后长任务处理

**异步解析**

用途：

- 生产环境默认方案
- 多页 PDF
- 扫描件和中长任务
- 支付后任务链路

结论：

- `web` 产品线必须默认围绕异步 API 设计
- 同步 API 只作为内部工具能力保留

## 4. 官方 API 到内部模型的映射

### 4.1 官方异步任务状态

上游典型状态：

- `pending`
- `running`
- `done`
- `failed`

### 4.2 内部任务状态

统一映射为：

- `queued`
- `ocr_processing`
- `word_rendering`
- `completed`
- `failed`

建议映射规则：

| 上游状态 | 内部状态 | 说明 |
|------|------|------|
| `pending` | `queued` | OCR 任务已创建，等待解析 |
| `running` | `ocr_processing` | OCR 正在执行 |
| `done` | `word_rendering` | OCR 完成，进入 DOCX 渲染 |
| `failed` | `failed` | 解析失败，保留错误信息 |

## 5. 统一结果结构

推荐后端统一结果对象：

```json
{
  "taskId": "tsk_xxx",
  "ocrProvider": "paddleocr_vl_1_5",
  "sourceFile": {
    "filename": "example.pdf",
    "mimeType": "application/pdf"
  },
  "ocrResult": {
    "markdownText": "....",
    "structuredJson": {},
    "assets": [
      {
        "kind": "markdown_image",
        "path": "images/page-1-figure-1.jpg",
        "sourceUrl": "https://..."
      }
    ]
  }
}
```

### 5.1 Word 组件只依赖以下字段

- `markdownText`
- `assets`
- `documentType`
- `templateId`

### 5.2 原始上游响应处理原则

- 原始 OCR 响应仅保留在后端内部
- 若需要审计，可保存压缩版 raw payload
- 不允许直接原样回给前端

## 6. 轮询与超时

建议默认参数：

- 轮询间隔：`5000 ms`
- 最大轮询时间：`10 min`
- 单次下载图片超时：`15 s`
- 单任务总处理超时：`15 min`

处理原则：

- 轮询超时 -> 标记任务 `failed`
- 单个中间图片下载失败 -> 记录告警并继续；若 Word 渲染必需图片缺失，则任务失败

## 7. 错误分类

建议统一错误分类：

- `OCR_AUTH_ERROR`
- `OCR_RATE_LIMITED`
- `OCR_UPSTREAM_TIMEOUT`
- `OCR_BAD_RESPONSE`
- `OCR_JOB_FAILED`
- `OCR_ASSET_DOWNLOAD_FAILED`

每种错误必须附带：

- `error_code`
- `error_message`
- `upstream_trace_id`（若可获取）

## 8. 最小实施步骤

1. 实现 `OCR Provider Adapter`
2. 封装同步/异步接口
3. 落统一结果结构
4. 接入任务轮询
5. 接入中间图片下载与资产清单
6. 对接 DOCX 渲染链路

