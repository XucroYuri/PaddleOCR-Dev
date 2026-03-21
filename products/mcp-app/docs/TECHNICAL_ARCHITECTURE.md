# MCP 产品线技术方案说明

## 1. Scope

本方案面向 `mcp` 产品线，目标是为 OpenClaw、Codex 以及其他 Agent/CLI
工具链提供稳定的文档处理入口，并与 `web` 产品线共用同一后端能力。

## 2. Architecture

### MCP Gateway

- 接收 Agent/CLI 请求
- 校验 API Key / Workspace Token
- 统一封装任务创建参数
- 向共享后端提交任务

### Shared Backend

与 `web` 共用：

- OCR Provider Adapter
- Task Manager
- DOCX Renderer
- Storage & Delivery

### Billing & Quota

- 基于 `API Key / Workspace Token`
- 按 workspace 隔离
- 控制额度、配额、调用限制

## 3. Core Objects

### WorkspaceIdentity

- `workspace_id`
- `workspace_token_id`
- `quota_policy`
- `billing_status`

### AgentTask

- `task_id`
- `workspace_id`
- `source_file`
- `document_type`
- `template_id`
- `status`
- `output_docx_key`

## 4. Result Model

对 MCP 调用方统一返回：

- `task_id`
- `status`
- `download_url`（任务完成后可用）
- `error_code`
- `error_message`

## 5. Shared Backend Principle

`mcp` 与 `web` 是两个入口，不是两套后端。

共享内容：

- OCR 编排
- Word 渲染
- 文件存储
- 状态机

独立内容：

- 用户身份模型
- 计费入口
- 交互协议

## 6. Secret Hygiene

本产品线必须遵循仓库级治理文档：

- [`products/REPO_GOVERNANCE.md`](../../REPO_GOVERNANCE.md)

任何 MCP 示例配置只能使用占位符，禁止真实 token 入库。

