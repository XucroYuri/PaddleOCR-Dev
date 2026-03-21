# MCP 产品线分支与发布说明

## 1. Branch Role

未来 `mcp` 分支承接：

- OpenClaw / Codex / CLI Agent 工具链的产品化接入
- MCP 协议或等效调用方式的实现
- 面向 Agent 的任务提交、状态查询、结果交付

## 2. Relationship to Main Lines

- `web`：人类用户入口
- `mcp`：Agent / CLI 入口
- `main`：新的产品主线
- `local`：冻结备用本地能力线

## 3. Promotion Strategy

- `mcp` 分支独立开发
- 阶段性与 `web` 共享后端对齐
- 稳定后整批提升到 `main`

## 4. Repository Governance

`mcp` 产品线必须遵循仓库级治理文档：

- [`products/REPO_GOVERNANCE.md`](../../REPO_GOVERNANCE.md)

尤其是：

- 所有 GitHub 提交默认视为公开传播
- 任何 token 必须在提交前脱敏或移除
- 真实 MCP/Workspace Token 不得进入仓库

