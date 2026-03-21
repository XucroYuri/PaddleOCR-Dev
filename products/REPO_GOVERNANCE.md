# 产品线仓库治理与密钥安全规则

本文件定义 `products/` 下所有产品线的共享仓库治理要求，适用于当前的 `web`
产品线以及未来的 `mcp` 产品线。

## 1. Scope

以下规则适用于：

- `products/web-app/`
- 未来的 `products/mcp-app/`
- 后续新增的其他产品线目录

当产品线文档与本文件冲突时，除非该产品线文档显式声明更严格限制，否则以本文件为最低治理要求。

## 2. GitHub Publication Assumption

- **所有 GitHub 提交默认视为公开传播，任何 token 必须在提交前完成脱敏或移除。**
- 所有文档、代码、提交信息、示例配置和截图都必须按“公开仓库可见”标准处理。

## 3. Secret Handling Rules

以下内容不得出现在版本库中：

- 真实 API token
- access token
- bearer token
- workspace token
- 支付密钥
- 对象存储密钥
- 签名下载链接
- 任何可直接用于访问生产或测试环境的凭据

所有示例必须使用占位符，例如：

- `YOUR_AISTUDIO_ACCESS_TOKEN`
- `YOUR_WORKSPACE_TOKEN`
- `YOUR_PAYMENT_SECRET`
- `YOUR_OBJECT_STORAGE_KEY`

## 4. Runtime Secret Injection

所有运行时密钥必须通过以下方式注入：

- 环境变量
- GitHub Secrets
- 部署平台 Secret Manager
- 等效的密钥托管方案

禁止：

- 在代码中硬编码 token 或 secret
- 在文档中粘贴真实凭据
- 在测试数据、截图、日志样例中保留真实值

## 5. Leak Response

如果 token 曾在以下任一位置暴露，应视为**已泄漏**：

- 对话
- 截图
- 日志
- 示例代码
- 提交历史

处理要求：

1. 立即作废旧 token
2. 重新生成新 token
3. 在仓库中只保留占位符
4. 再继续开发、提交或发布

## 6. Pre-Commit Checks

提交前必须检查差异中是否出现以下敏感字段：

- `token`
- `access_token`
- `bearer`
- `api_key`
- `secret`
- `password`

并确认以下文件不会进入版本库：

- `.env`
- 本地调试配置
- 导出的浏览器存储
- 临时日志
- 个人机器状态文件

## 7. Product-Line Adoption

- `web` 产品线必须遵循本文件
- 未来 `mcp` 产品线必须遵循本文件
- 产品线可补充更严格的要求，但不得弱化本文件中的密钥保护规则

