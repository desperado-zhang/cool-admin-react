# 二期 React 前端实施进度（PROGRESS.md）

> 本文件是本仓库的**唯一进度真相源**。所有 AI 编码工具开工前必读、完工后必更新（约定见 `AGENTS.md`）。
> 接口契约唯一图纸：`../cool-admin-nest/AGENTS.md` + `../cool-admin-nest/docs/eps.snapshot.json`。
> 状态图例：⬜ 未开始 ｜ 🚧 进行中 ｜ ✅ 已完成 ｜ ❌ 阻塞/失败

---

## 一、项目状态总览

| 项 | 值 |
|---|---|
| 项目名 | cool-admin-react |
| 目标 | React + AntD 复刻管理端前端，协议不变、后端零改动，与 Vue 版行为一致、可插拔替换 |
| 当前阶段 | W0 完成：仓库骨架 + 核心契约层（请求/状态）就绪 |
| 最近更新 | 2026-08-13（初始化提交） |
| 远端仓库 | git@github.com:desperado-zhang/cool-admin-react.git |
| 上游进度 | cool-admin-nest 一期全量完成（P0-P4：EPS 118/118、22 表对齐、17 页走查） |

## 二、里程碑进度

| 里程碑 | 内容 | 验收标准 | 状态 |
|---|---|---|---|
| W0 准备 | 仓库骨架、文档、构建工具链、契约层骨架 | 可构建、可推送 | ✅ 2026-08-13 |
| W1 框架 | 登录链路 + 主布局 + 动态路由（menus→routes）+ 权限组件 + EPS service 层 | 登录后菜单/路由/按钮权限正常 | ⬜ |
| W2 CRUD 组件 | CoolTable / CoolForm / CoolDialog（对应 cl-crud 核心能力） | 配置式驱动 CRUD 页面 | ⬜ |
| W3 base 页面 | 登录/工作台/用户/角色/菜单/部门/参数/日志/个人中心 | 与 Vue 版逐页行为一致 | ⬜ |
| W4 其余模块 | dict/recycle/space/task/user/helper/demo | 17 页面全部渲染 | ⬜ |
| P 对齐 | 与 Vue 版逐页比对 + Docker 替换 admin-ui + 验收清单 | 本仓库验收标准 6 项全过 | ⬜ |

## 三、任务清单

### W0：准备（✅ 2026-08-13）
| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| T0.1 | Vite 6 + React 18 + TS + AntD 5 工程骨架 | ✅ | package.json / vite.config.ts（proxy→8001）/ tsconfig |
| T0.2 | 契约类型 + 请求层（响应包装/401 续期/403 语义） | ✅ | `src/cool/types` + `src/cool/service/request.ts` |
| T0.3 | zustand 用户状态（token/menus/perms + persist） | ✅ | `src/cool/store/user.ts`，含 usePermission |
| T0.4 | 树工具（deepTree/flatTree/filterRouterMenus） | ✅ | `src/cool/utils/tree.ts`（对应 Vue 版 menu.ts） |
| T0.5 | AGENTS.md / PROGRESS.md / README + 远端推送 | ✅ | origin main 首次推送 |

### W1：框架（⬜）
| # | 任务 | 关联契约 | 状态 | 备注 |
|---|---|---|---|---|
| T1.1 | 登录页（验证码/登录/记住密码） | AGENTS.md 3.1-3.2 | ⬜ | 对照 Vue 版 login 页 |
| T1.2 | 主布局（侧边菜单/顶栏/页签/个人中心下拉） | — | ⬜ | 对照 Vue 版 layout |
| T1.3 | 动态路由：登录 → permmenu → deepTree 菜单 → filter(type==1) 路由注册 | 4.1 | ⬜ | 扁平数组契约，树形则子菜单 404 |
| T1.4 | 路由守卫（无 token 跳登录 / 404 / 工作台重定向） | — | ⬜ | |
| T1.5 | EPS vite 插件：构建期注入 EPS → 生成 service 层 | 8.x | ⬜ | 对应 @cool-vue/vite-plugin；后端加接口须重建 bundle |
| T1.6 | i18n（zh-CN/en-US，AntD locale 联动） | — | ⬜ | |
| T1.7 | 主题（暗色切换/主色） | — | ⬜ | |

### W2：CRUD 组件（⬜）
| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| T2.1 | CoolTable：分页/搜索/排序/工具栏/选择/字典渲染 | ⬜ | 对应 cl-crud cl-table |
| T2.2 | CoolForm：动态表单/校验/组件联动 | ⬜ | 对应 cl-crud cl-form |
| T2.3 | CoolDialog：新增/编辑弹窗上下文 | ⬜ | 对应 cl-upsert |
| T2.4 | `<Permission>` 组件 / usePermission 接入按钮 | ⬜ | 对应 v-permission |

### W3：base 页面（⬜）
| # | 页面 | 状态 | 备注 |
|---|---|---|---|
| T3.1 | 登录 / 工作台 dashboard | ⬜ | echarts 图表与 Vue 版一致 |
| T3.2 | 用户管理（含部门树联动/批量移动/角色分配） | ⬜ | |
| T3.3 | 角色管理（含菜单/部门授权树） | ⬜ | |
| T3.4 | 菜单管理（树形/图标/导入导出） | ⬜ | |
| T3.5 | 部门管理（树形/拖拽排序） | ⬜ | |
| T3.6 | 参数配置 / 操作日志 / 个人中心 | ⬜ | |

### W4：其余模块（⬜）
| # | 页面 | 状态 | 备注 |
|---|---|---|---|
| T4.1 | dict 字典管理 | ⬜ | |
| T4.2 | recycle 回收站 | ⬜ | |
| T4.3 | space 云空间 | ⬜ | |
| T4.4 | task 定时任务 | ⬜ | |
| T4.5 | user 用户模块 | ⬜ | |
| T4.6 | helper（AI 编码/插件）+ demo（CRUD 示例/首页演示） | ⬜ | |

### P：对齐验收（⬜）
| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| T5.1 | 17 页面与 Vue 版逐页比对（egolite 实测） | ⬜ | |
| T5.2 | 接口抓包 diff（出入参与 AGENTS.md 一致） | ⬜ | |
| T5.3 | 按钮级权限实测（非超管/越权 403） | ⬜ | |
| T5.4 | token 生命周期实测（401 续期/改密失效/logout 作废） | ⬜ | |
| T5.5 | EPS 全量消费比对（eps.snapshot.json） | ⬜ | |
| T5.6 | Docker 可插拔替换 admin-ui 容器实测 | ⬜ | |

## 四、待确认项

| # | 待确认项 | 状态 | 备注 |
|---|---|---|---|
| U1 | React 版富文本编辑器选型（对应 wangeditor） | ⬜ | 参数配置页 html 编辑需要 |
| U2 | 图标体系：官方菜单 icon 字符串（如 icon-setting）→ AntD 图标映射 | ⬜ | 需建映射表 |
| U3 | EPS vite 插件实现方式（虚拟模块 vs 代码生成） | ⬜ | T1.5 时决策 |

## 五、决策记录（ADR）

| # | 决策 | 内容 | 日期 |
|---|---|---|---|
| D1 | 技术栈 | React 18 + AntD 5 + react-router v6 + zustand + axios + i18next + echarts | 2026-08-13 |
| D2 | 复刻策略 | 结构镜像 Vue 版（src/cool 核心 + src/modules 页面一一对应），行为逐页比对 | 2026-08-13 |
| D3 | 契约层先行 | 请求层/状态/树工具按契约实现后再做页面（对应 W0） | 2026-08-13 |

## 六、验收记录

| 日期 | 验收项 | 方法 | 结果 |
|---|---|---|---|
| 2026-08-13 | W0 骨架 | pnpm install + tsc -b + vite build 通过；远端推送成功 | ✅ |

## 七、下一个动作

1. **T1.1 登录页**：对照 Vue 版 login 视图 + 契约 3.1/3.2（验证码 svg/base64、md5 密码、token 存储）
2. 之后按 W1 → W2 → W3 → W4 → P 顺序推进，每任务验收后更新本文件与 `../cool-admin-nest/PROGRESS.md`（二期行）
