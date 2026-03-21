# MCP / Agent 文档转 Word 产品线 PRD

## 1. Executive Summary

### Problem Statement

OpenClaw、Codex 以及其他 CLI / Agent 工具链需要一种稳定的方式，将 OCR
文档解析能力集成到自动化流程中，并最终返回可下载的 Word 文件，而不仅仅是
原始 Markdown 或 JSON。

### Proposed Solution

建设一个独立的 `mcp` 产品线，面向 Agent / CLI 工作流，通过 API Key 或
Workspace Token 识别调用方，调用统一后端中的 `PaddleOCR-VL-1.5 API`
编排链路，并在下游生成 `.docx`，返回任务结果与下载链接。

### Success Criteria

- MCP/Agent 任务成功完成率 `>= 90%`
- Token/Workspace 隔离下的串任务率 `0`
- 同一后端能力可同时服务 `web` 与 `mcp`
- Agent 调用获得稳定的任务状态与 DOCX 交付结果

## 2. User Experience & Functionality

### Primary Users

- OpenClaw 自动化工作流
- Codex / CLI 工具链
- 其他通过 MCP 协议或等效协议接入的 Agent 系统

### Core Value

不是做一个仅供体验的 OCR MCP demo，而是提供一条可商用、可计费、可稳定交付
Word 文件的 Agent 调用入口。

### Primary Flow

1. 调用方通过 API Key / Workspace Token 接入
2. 提交本地文件或文件 URL
3. 系统创建任务并调用 `PaddleOCR-VL-1.5 API`
4. 返回统一任务句柄
5. 后端完成 OCR、Markdown/JSON 归一化与 DOCX 渲染
6. 调用方轮询任务状态或接收结果
7. 最终获取 DOCX 下载链接或结果引用

### Non-Goals

- 不做本地 PaddleOCR 主链路
- 不复刻 Web 前端
- 不把匿名会话模型直接套用到 MCP 产品线

## 3. AI System Requirements

### Tool Requirements

- 上游解析：`PaddleOCR-VL-1.5 API`
- 调用入口：MCP / CLI / Agent 适配层
- 结果交付：共享 DOCX Renderer
- 鉴权：API Key / Workspace Token

### Evaluation Strategy

- 任务成功率
- DOCX 交付成功率
- Token 隔离正确率
- Web 与 MCP 共用后端的一致性

## 4. Technical Specifications

### Architecture Overview

- `MCP Gateway`
  - 协议适配
  - 参数校验
  - 身份鉴权
- `Shared Backend`
  - OCR Provider Adapter
  - Task Manager
  - DOCX Renderer
  - Storage + Delivery
- `Billing / Quota Layer`
  - API Key / Workspace Token
  - 配额
  - 额度与调用限制

### Integration Points

- PaddleOCR 官方 API
- OpenClaw / Codex / CLI Agent 工具链
- 共享后端任务系统

### Security & Privacy

- API Key / Workspace Token 严格隔离
- 示例配置只使用占位符
- 遵循仓库级治理文档中的 token 保护规则

## 5. Risks & Roadmap

### Risks

- 若 Agent 产品线与 Web 后端耦合不清晰，会导致两条产品线互相牵制
- 若 Token 与配额模型不清晰，无法安全商用
- 若把 `mcp` 当 demo，而非产品线，会在后期重复返工

### Roadmap

- `v0`：MCP 产品线文档骨架
- `v1`：最小可商用 MCP 调用入口
- `v1.1`：与 Web 共用后端的稳定联调
- `v2.0`：更丰富的 Agent 工具集与返回模式

