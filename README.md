# cool-admin-react

[React](https://react.dev) + [Ant Design 5](https://ant.design) 实现的 cool-admin 管理端前端。

**协议不变、后端零改动**：与 [cool-admin-nest](https://github.com/desperado-zhang/cool-admin-nest)（NestJS 版后端，一期全量完成）及官方 cool-admin 后端 100% 兼容，可作为 cool-admin-nest 中 Vue 版管理端（apps/admin-ui）的**可插拔替换**。

> 接口契约唯一图纸：`../cool-admin-nest/AGENTS.md` + `../cool-admin-nest/docs/eps.snapshot.json`；施工约定见本仓库 `AGENTS.md`。

## 技术栈

| 项 | 选型 |
|---|---|
| 构建 | Vite 6 + React 18 + TypeScript |
| UI | AntD 5 + @ant-design/icons |
| 路由 | react-router-dom v6（permmenu 动态路由） |
| 状态 | zustand（persist） |
| 请求 | axios（契约拦截器：`{code:1000...}` 包装 / 401 续期 / 403 语义） |
| i18n | i18next + react-i18next |
| 图表 | echarts + echarts-for-react |

## 快速开始

```bash
# 1. 启动后端（cool-admin-nest，API localhost:8001，账号 admin/123456）
#    docker compose up -d   —— 见 cool-admin-nest README

# 2. 安装依赖
pnpm install

# 3. 开发（localhost:9000，/admin 代理到 8001）
pnpm dev

# 4. 构建
pnpm build
```

## 目录结构

```
src/
├── cool/          # 核心框架（service / store / router / hooks / components / utils / types）
├── config/        # 环境配置
├── locales/       # zh-CN / en-US
└── modules/       # 页面模块（base / demo / dict / helper / recycle / space / task / user）
```

## 进度

见 [PROGRESS.md](./PROGRESS.md)（唯一进度真相源）。
