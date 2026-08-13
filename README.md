# cool-admin-react

[React](https://react.dev) + [Ant Design 5](https://ant.design) 实现的 cool-admin 管理端前端。

**协议不变、后端零改动**：与 [cool-admin-nest](https://github.com/desperado-zhang/cool-admin-nest)（NestJS 版后端，一期全量完成）及官方 cool-admin 后端 100% 兼容，可作为 cool-admin-nest 中 Vue 版管理端（apps/admin-ui）的**可插拔替换**。

> 接口契约唯一图纸：`../cool-admin-nest/AGENTS.md` + `../cool-admin-nest/docs/eps.snapshot.json`；施工约定见本仓库 `AGENTS.md`。

## 技术栈

| 项 | 选型 |
|---|---|
| 构建 | Vite 6 + React 18 + TypeScript |
| UI | AntD 5 + @ant-design/icons（暗色主题支持） |
| 路由 | react-router-dom v6（permmenu 动态路由） |
| 状态 | zustand |
| 请求 | axios（契约拦截器：`{code:1000...}` 包装 / 401 单飞续期 / 403 语义） |
| 服务层 | EPS 构建期注入（vite 虚拟模块，`service.base.sys.user.page()` 风格全量生成） |
| CRUD 框架 | 自研 CoolTable / CoolForm / CoolDialog（对应 Vue 版 cl-crud，配置式驱动） |
| i18n | i18next + react-i18next（zh-CN / en-US） |
| 富文本 | wangEditor |
| 缓存 | react-activation（页签 keep-alive） |
| 图表 | echarts + echarts-for-react |

## 功能清单（与 Vue 版一致，17 页面）

- **base**：登录（验证码）、工作台、用户管理（组织架构树/角色分配/批量转移）、角色管理（菜单/部门授权树）、菜单管理（树形/图标/导入导出）、部门管理（拖拽排序）、参数配置（富文本）、操作日志、个人中心
- **dict** 字典管理 ｜ **recycle** 数据回收站 ｜ **space** 云空间 ｜ **task** 定时任务 ｜ **user** 用户模块 ｜ **helper** 插件市场/AI 编码 ｜ **demo** CRUD 示例
- 按钮级权限（对应 v-permission）、token 生命周期（401 续期/改密失效/logout 作废）、EPS 118/118 消费

## 快速开始

```bash
# 1. 启动后端（cool-admin-nest，API localhost:8001，账号 admin/123456）
#    docker compose up -d   —— 见 cool-admin-nest README

# 2. 安装依赖
pnpm install

# 3. 开发（localhost:9001，/admin 代理到 8001）
pnpm dev

# 4. 构建（先拉取后端 EPS 再编译，后端加接口须重新构建）
pnpm build

# 仅重新生成 EPS 类型（后端接口变更后）
pnpm eps
```

## Docker 部署

```bash
# 独立构建
docker build -t cool-admin-react-ui .
docker run -d --name cool-admin-react-ui --network cool-admin-nest_default -p 9001:80 cool-admin-react-ui

# 可插拔替换 cool-admin-nest 的 Vue 版 ui 容器（在 cool-admin-nest 目录执行）
docker compose -f docker-compose.yml -f ../cool-admin-react/docker-compose.react.yml up -d --build ui
# 恢复 Vue 版
docker compose -f docker-compose.yml up -d --build ui
```

## 目录结构

```
src/
├── cool/          # 核心框架
│   ├── service/   # axios 契约层 + EPS 服务层
│   ├── crud/      # CoolTable / CoolForm / CoolDialog / 组件注册表 / 工具栏
│   ├── store/     # zustand（user/menu/app/process/dict）
│   ├── router/    # 动态路由（menus → routes）+ view-loader
│   ├── hooks/     # usePermission 等
│   ├── components/# 通用组件 + 菜单图标映射
│   ├── utils/     # deepTree/storage 等
│   └── types/     # 契约类型 + EPS 生成类型（eps.generated.d.ts）
├── config/        # 环境配置
├── locales/       # zh-CN / en-US
└── modules/       # 页面模块（base / demo / dict / helper / recycle / space / task / user）
```

## 验收状态

与 Vue 版行为一致、可插拔替换的目标已达成（浏览器实测）：

- ✅ 登录 → permmenu → 动态路由 → 17 页面全部渲染
- ✅ 接口出入参与 cool-admin-nest AGENTS.md 一致（契约接口 68 个实测覆盖 100%）
- ✅ 按钮级权限：非超管仅见有权按钮，越权请求 403
- ✅ token 生命周期：401 单飞续期重放 / 改密失效 / logout 作废
- ✅ EPS 全量消费：20 前缀与官方快照一致
- ✅ Docker 可插拔替换 ui 容器实测通过

## 进度

见 [PROGRESS.md](./PROGRESS.md)（唯一进度真相源）。
