# 教培资料转 Word Web 应用 PRD

## 1. Executive Summary

### Problem Statement

教培/学校场景中的试卷、讲义、作业等资料，常常以 PDF、扫描件或图片形式存在。用户需要尽快把这些资料转成可继续编辑的 Word 文件，但人工录入和排版成本高、效率低。

### Proposed Solution

建设一个全新的 Web/H5 应用，面向教培资料处理场景，完全依赖 `PaddleOCR-VL-1.5 API` 做文档解析。系统内部消费 OCR 返回的 `Markdown/JSON`，再通过模板化 Word 渲染组件生成 `.docx`，最终通过网页向用户返回下载链接。

### Success Criteria

- 任务完成率 `>= 90%`
- 支付成功后的有效交付率 `>= 85%`
- 用户对“可编辑 Word 可用性”的满意度 `>= 4.2/5`
- 不同用户会话串台率 `0`
- 首次付费转化率作为核心商业指标持续跟踪

## 2. User Experience & Functionality

### User Personas

- 教师
- 教务与资料整理人员
- 培训机构运营人员

### Core Value

核心价值不是“最强 OCR 平台”，而是“让教培用户最快拿到可编辑 Word”。

### Primary User Flow

1. 用户打开网页，系统创建匿名会话。
2. 用户查看价格说明，完成支付或预充值。
3. 支付完成后上传试卷、讲义或作业。
4. 系统创建任务并调用 `PaddleOCR-VL-1.5 API`。
5. 系统将 OCR 结果转换为内部 `Markdown/JSON`。
6. Word 组件使用平台模板生成 `.docx`。
7. 用户在网页任务页下载最终 Word 文件。

### User Stories

- 作为教培用户，我希望上传一份试卷后快速拿到可编辑 Word，这样我不用重新手工录入。
- 作为付费用户，我希望充值后能连续处理多个文件，而不是每次重复付款。
- 作为匿名访问用户，我希望不注册也能完成支付、上传、处理和下载。
- 作为平台方，我希望不同用户的任务、文件和下载结果完全隔离，避免串台。

### Acceptance Criteria

- 支持 `试卷 / 讲义 / 作业` 三类文档
- 支持匿名会话，无需强制注册
- 支持支付与充值
- 支付成功前任务不可进入 OCR 处理
- OCR 默认使用异步解析接口
- 用户最终只下载 `.docx`
- 页面至少包含上传、支付/充值、任务状态、下载四个核心页面

### Non-Goals

- 不做本地 PaddleOCR 部署
- 不做用户自定义模板
- 不把微信公众号作为一期主登录门槛
- 不做完整输入/输出对比预览
- 不直接对最终用户开放 `Markdown/JSON` 下载
- 不把 MCP / OpenCloud Skills 作为一期主入口

## 3. AI System Requirements

### Tool Requirements

- 上游解析：`PaddleOCR-VL-1.5 API`
- Word 输出：内部 `Markdown -> DOCX` 渲染组件
- 文件存储：对象存储
- 任务执行：异步 Worker / Queue

### Evaluation Strategy

- OCR 成功返回率
- OCR 到 DOCX 的端到端成功率
- Word 可编辑性主观评分
- 支付成功后最终下载完成率
- 失败任务分类统计（OCR / 渲染 / 存储 / 回调）

## 4. Technical Specifications

### Architecture Overview

- `Frontend Web/H5`
  - 上传页
  - 支付/充值页
  - 任务状态页
  - 下载页
- `App Backend`
  - 匿名会话管理
  - 订单/充值/支付回调
  - 任务管理
  - 下载授权
- `OCR Provider Adapter`
  - 同步/异步 API 封装
  - 统一 OCR 结果结构
- `Task Worker`
  - OCR 任务发起与轮询
  - DOCX 渲染
  - 结果回写
- `Storage + DB`
  - 原始文件、中间产物、成品 Word、会话、订单、任务

### Integration Points

- PaddleOCR-VL-1.5 官方 API
- 支付渠道二维码支付与支付回调
- 对象存储下载链接
- 平台模板与样式配置

### Security & Privacy

- API Token 仅服务端持有
- 文件按 `anonymous_session_id + task_id` 隔离
- 下载链接必须短时效签名
- 中间 Markdown/JSON 默认仅内部留存
- 支付回调、余额扣减、任务启动需幂等

## 5. Risks & Roadmap

### Risks

- OCR API 配额、超时或 429 将直接影响交付 SLA
- Word 可编辑性是核心价值，如果模板映射不足会影响满意度
- 支付成功但任务失败时，需要稳定的补偿策略
- 匿名会话下的余额与任务归属需要严格隔离

### Roadmap

- `v0`：匿名会话跑通业务
- `v1`：商用首版（支付、上传、异步 OCR、DOCX 下载）
- `v1.1`：手机号验证码登录与匿名会话绑定
- `v1.2+`：微信身份绑定、消息通知、后续 Agent/MCP 接入

