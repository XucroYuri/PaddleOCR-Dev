# 分支与发布说明

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

## 5. Current Strategy Summary

- 先把 Web 产品线在 `web` 分支上独立起来
- 先完成文档、架构、目录骨架
- 后续实现以 `products/web-app/` 为唯一主工作区

