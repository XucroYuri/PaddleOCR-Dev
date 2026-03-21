# 分支、发布与密钥治理说明

## 1. Branch Responsibilities

### `local`

当前仓库的本地能力线，承接：

- PaddleOCR 本地模型能力
- 本地训练/推理/部署相关代码
- 与 Web 商业化产品无关的原始仓库职责

### `web`

新的 Web 产品研发主线，承接：

- Web/H5 应用产品化开发
- 产品文档
- API-only 后端设计
- 支付、任务、下载与 Word 输出链路

### `production`

空白接收分支，职责为：

- 接收 `web` 阶段性稳定版本
- 表示可进入产品化发布阶段的内容
- 不作为日常开发分支使用

## 2. Repository Shape

- 采用**同仓独立子目录**策略
- `products/web-app/` 为 `web` 产品线主目录
- `local` 与 `web` 不共享研发目标
- Web 产线只借鉴现有项目文档、API 接入经验和 DOCX 组件思路

## 3. Promotion Flow

1. `web` 分支持续研发
2. 达到阶段性稳定节点后，整理一批功能与文档
3. 整批提升到 `production`
4. `production` 作为产品化接收分支进行部署或发布准备

## 4. What Not To Do

- 不在 `production` 上直接做日常开发
- 不把 `local` 分支继续当作 Web 产品线开发分支
- 不让 `web` 产品目录污染本地能力线的主职责

## 5. GitHub Secrets & Token Hygiene

`web` 产品线除遵循本文件中的要求外，还**必须同时遵循仓库级治理文档**
[`products/REPO_GOVERNANCE.md`](../../REPO_GOVERNANCE.md)。

以下规则是 `web` 产品线的正式仓库约束，优先级高于普通提交习惯：

- **所有 GitHub 提交默认视为公开传播，任何 token 必须在提交前完成脱敏或移除。**
- 真实的 API token、access token、bearer token、workspace token、支付密钥、对象存储密钥、签名下载链接不得出现在：
  - 代码
  - 文档
  - 示例配置
  - 截图
  - 提交信息
- 所有示例只能使用占位符，例如：
  - `YOUR_AISTUDIO_ACCESS_TOKEN`
  - `YOUR_WORKSPACE_TOKEN`
  - `YOUR_PAYMENT_SECRET`
- 所有运行时密钥必须通过环境变量、GitHub Secrets、部署平台 Secret Manager 或等效密钥管理系统注入，严禁硬编码。
- 如果 token 曾在对话、截图、日志、示例代码或提交历史中暴露，应视为已泄漏，必须先作废并重新生成，再继续开发或提交。
- 提交前必须检查差异中是否出现以下敏感字段：
  - `token`
  - `access_token`
  - `bearer`
  - `api_key`
  - `secret`
  - `password`
- `.env`、本地调试配置、导出的浏览器存储、临时日志等文件不得进入版本库。

## 6. Current Strategy Summary

- 先把 Web 产品线在 `web` 分支上独立起来
- 先完成文档、架构、目录骨架
- 后续实现以 `products/web-app/` 为唯一主工作区
