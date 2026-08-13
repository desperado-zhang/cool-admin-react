# cool-admin-react —— React 版管理端施工约定

> **项目目标**：用 React + AntD 复刻 cool-admin 管理端前端。**协议不变、后端零改动**，与 Vue 版（cool-admin-nest/apps/admin-ui）行为一致、可插拔替换。
> **唯一施工图纸**：`../cool-admin-nest/AGENTS.md`（10 章 + 3 附录：全部接口出入参 / 错误码 / 验收标准）+ `../cool-admin-nest/docs/eps.snapshot.json`（官方 EPS 验收基准）。
> **协议歧义**：以 cool-admin-nest 运行实例（或官方 show.cool-admin.com）实测为准。
> **参考实现**：`../cool-admin-nest/apps/admin-ui`（Vue 版）及官方 cool-admin-vue 8.x 源码。

---

## ⚙️ 工作约定（对所有 AI 编码工具生效）

1. **开工前**：必须先读本仓库 `PROGRESS.md` 与 `../cool-admin-nest/AGENTS.md`（接口契约），了解当前进度、已完成/进行中任务、下一个动作；
2. **完工后**：每完成一个任务，必须同步更新本仓库 `PROGRESS.md` 与 `../cool-admin-nest/PROGRESS.md`（二期行）的状态、验收结果、日期，不得跳过；
3. **未完成任务**：必须明确写在 `PROGRESS.md` 的"下一个动作"中，禁止因会话中断/上下文超长而丢失；
4. **规范歧义**：接口契约以 cool-admin-nest AGENTS.md 为准；文档未覆盖的交互细节，以 Vue 版源码实测为准，并列入 `PROGRESS.md` 待确认项；
5. **验收**：任务完成以本文件"验收标准"为准，验证结果记录在 `PROGRESS.md`。

---

## 前端关键契约（施工红线，源自 cool-admin-nest AGENTS.md 与 Vue 版实测）

| # | 契约 | 实现要求 |
|---|---|---|
| 1 | **响应包装** | HTTP 恒 200，`{code:1000/1001/1002/1003, message, data}`；HTTP 401 = 登录失效、HTTP 403 = 无权限（官方 authority.ts 语义） |
| 2 | **token 生命周期** | 401 时用 refreshToken 单飞续期重放；失败跳登录页；logout 后服务端 token 立即作废 |
| 3 | **permmenu 扁平数组** | `menus` 为扁平数组（含 type=2 按钮），前端 `deepTree` 组树、`filter(type==1)` 生成路由；**若后端返回树形则子菜单 404** |
| 4 | **按钮级权限** | `perms` 扁平数组 + 超管（username==='admin'）豁免；React 侧实现 `<Permission>` 组件 / `usePermission()`（对应 v-permission） |
| 5 | **EPS 服务层** | EPS 由构建期注入（vite 插件，对应 @cool-vue/vite-plugin）；`service.base.sys.user.page()` 风格动态生成；后端加接口须重建 bundle |
| 6 | **页面清单** | 17 页 + 弹窗/iframe 与 Vue 版一致：base（登录/工作台/用户/角色/菜单/部门/参数/日志/个人中心）、dict、recycle、space、task、user、helper、demo |

---

## 技术栈约定

| 项 | 选型 | 对应 Vue 版 |
|---|---|---|
| 构建 | Vite 6 + React 18 + TS 5.6 | Vite 5 + Vue 3 |
| UI | AntD 5（@ant-design/icons 6） | Element Plus + @cool-vue/crud |
| 路由 | react-router-dom v6（动态路由） | vue-router |
| 状态 | zustand（persist 持久化 token） | pinia |
| 请求 | axios（契约拦截器见 `src/cool/service/request.ts`） | axios |
| i18n | i18next + react-i18next | vue-i18n |
| 图表 | echarts + echarts-for-react | vue-echarts |
| 上传/富文本 | AntD Upload / 待定 | element upload / wangeditor |

## 目录结构

```
src/
├── cool/            # 核心框架（对应 Vue 版 src/cool）
│   ├── service/     # 请求层 + EPS 服务层
│   ├── store/       # zustand（user/permission）
│   ├── router/      # 动态路由（menus → routes）
│   ├── hooks/       # usePermission / useCoolTable 等
│   ├── components/  # CoolTable / CoolForm / CoolDialog（对应 cl-crud）
│   ├── utils/       # deepTree 等
│   └── types/       # 契约类型
├── config/          # 环境配置
├── locales/         # zh-CN / en-US
└── modules/         # 页面模块（与 Vue 版 src/modules 一一对应）
    ├── base/  demo/  dict/  helper/  recycle/  space/  task/  user/
```

## 验收标准

| # | 验收项 | 方法 |
|---|---|---|
| 1 | 登录 → permmenu → 动态路由 → 17 页面全部渲染 | 浏览器实测，与 Vue 版逐页比对 |
| 2 | 所有接口出入参与 cool-admin-nest AGENTS.md 一致 | devtools 抓包与 Vue 版请求 diff |
| 3 | 按钮级权限：非超管仅见有权按钮，越权请求 403 | 新建角色/用户实测 |
| 4 | token 生命周期：401 续期重放 / 改密失效 / logout 作废 | HTTP 实测 |
| 5 | EPS 消费正确：service 层全量生成且无遗漏接口 | 与 eps.snapshot.json 比对 |
| 6 | Docker 可插拔替换：替换 admin-ui 容器后全功能可用 | docker compose 实测 |
