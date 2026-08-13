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
| 当前阶段 | W3+W4 完成：**17 页面全部实现**，浏览器实测通过 |
| 最近更新 | 2026-08-13（W4 其余模块） |
| 远端仓库 | git@github.com:desperado-zhang/cool-admin-react.git |
| 上游进度 | cool-admin-nest 一期全量完成（P0-P4：EPS 118/118、22 表对齐、17 页走查） |

## 二、里程碑进度

| 里程碑 | 内容 | 验收标准 | 状态 |
|---|---|---|---|
| W0 准备 | 仓库骨架、文档、构建工具链、契约层骨架 | 可构建、可推送 | ✅ 2026-08-13 |
| W1 框架 | 登录链路 + 主布局 + 动态路由（menus→routes）+ 权限组件 + EPS service 层 | 登录后菜单/路由/按钮权限正常 | 🚧 T1.1-T1.5 ✅；T1.6 i18n/T1.7 主题 ⬜ |
| W2 CRUD 组件 | CoolTable / CoolForm / CoolDialog（对应 cl-crud 核心能力） | 配置式驱动 CRUD 页面 | ✅ 2026-08-13（参数配置页端到端实测） |
| W3 base 页面 | 登录/工作台/用户/角色/菜单/部门/参数/日志/个人中心 | 与 Vue 版逐页行为一致 | ✅ 2026-08-13（8 页面浏览器实测） |
| W4 其余模块 | dict/recycle/space/task/user/helper/demo | 17 页面全部渲染 | ✅ 2026-08-13（7 页面浏览器实测） |
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

### W1：框架
| # | 任务 | 关联契约 | 状态 | 备注 |
|---|---|---|---|---|
| T1.1 | 登录页（验证码/登录/记住密码） | AGENTS.md 3.1-3.2 | ✅ 2026-08-13 | 对照 Vue 版 login 页复刻；pic-captcha svg/base64 + 点击刷新 + 失败刷新；登录→setToken→person+permmenu→跳首页 |
| T1.2 | 主布局（侧边菜单/顶栏/页签/个人中心下拉） | — | ✅ 2026-08-13 | 侧边栏（logo/搜索/菜单树）+ 顶栏（折叠/面包屑/用户下拉）+ 页签栏 + 内容区；样式复刻 Vue 版（#2c3147 侧栏） |
| T1.3 | 动态路由：登录 → permmenu → deepTree 菜单 → filter(type==1) 路由注册 | 4.1 | ✅ 2026-08-13 | **修复 bug**：首页路径误从扁平列表取（应组树），致 用户列表 被误标 isHome；组树后正确。扁平数组契约 ✓ |
| T1.4 | 路由守卫（无 token 跳登录 / 404 / 工作台重定向） | — | ✅ 2026-08-13 | Layout 守卫 + 登录页已登录回跳 + 401/403/404/500/502 页面 |
| T1.5 | EPS vite 插件：构建期注入 EPS → 生成 service 层 | 8.x | ✅ 2026-08-13 | U3 决策：**虚拟模块 + 提交生成 d.ts**（见 ADR D4）。`virtual:eps` 构建期注入；`service.base.sys.user.page()` 全量可用（20 实体/119 接口）；权限码 map（base:sys:user:add 等）；`pnpm eps` 重新生成；后端加接口 → pnpm eps + 重建 bundle |
| T1.6 | i18n（zh-CN/en-US，AntD locale 联动） | — | ⬜ | 当前硬编码中文；AntD zhCN 已接 |
| T1.7 | 主题（暗色切换/主色） | — | ⬜ | colorPrimary #1668dc 已设；暗色切换未做 |

### W2：CRUD 组件
| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| T2.1 | CoolTable：分页/搜索/排序/工具栏/选择/字典渲染 | ✅ 2026-08-13 | 列配置对齐 Vue（selection/index/op/component/formatter/dict/sortable）；op 列 edit/delete/slot-xxx；服务端排序 order/sort；单元格内联更新（cl-switch→update+refresh） |
| T2.2 | CoolForm：动态表单/校验/组件联动 | ✅ 2026-08-13 | items 对齐 Vue（函数式 item/span/required/rules/value）；hidden({scope}) 表单值联动；动态 options（对应 setOptions） |
| T2.3 | CoolDialog：新增/编辑弹窗上下文 | ✅ 2026-08-13 | 编辑默认 service.info 拉取合并（对齐 Vue getInfo）；onInfo/onOpened/onSubmit({next}) 钩子；成功刷新列表 |
| T2.4 | `<Permission>` 组件 / usePermission 接入按钮 | ✅ 2026-08-13 | 组件已实现（admin 豁免）；页面级接入随 W3 用户页实测 |
| T2.5 | 组件注册表 + 字典 store + 工具栏组件 | ✅ 2026-08-13 | el-input/select/radio/switch/checkbox/date/tree-select、cl-select/avatar/image/code-json/upload/editor、slot-value；dict store 启动 refresh + get/find；Refresh/Add/MultiDelete/SearchKey/SearchSelect/Flex1/Pagination |

### W3：base 页面
| # | 页面 | 状态 | 备注 |
|---|---|---|---|
| T3.1 | 登录 / 工作台 dashboard | ✅ 2026-08-13 | dashboard：4 统计卡 + 访问趋势折线 + 分类占比饼图 + 热销商品表（echarts，P2 静态演示页对齐） |
| T3.2 | 用户管理（含部门树联动/批量移动/角色分配） | ✅ 2026-08-13 | 组织架构树（右键新增/编辑/删除/新增成员、拖动排序保存 order）、部门过滤、角色 options 动态加载、状态开关内联更新、单个/批量转移（cl-dept-select） |
| T3.3 | 角色管理（含菜单/部门授权树） | ✅ 2026-08-13 | 功能权限 cl-menu-check 勾选树 + 数据权限 relevance 开关 + cl-dept-check 部门勾选（slot-relevance 插槽） |
| T3.4 | 菜单管理（树形/图标/导入导出） | ✅ 2026-08-13 | 树形表格（list 树契约）、类型/图标/上级节点选择器、slot-add 子节点新增、导入导出 JSON 弹窗；刷新同步侧边菜单 |
| T3.5 | 部门管理（树形/拖拽排序） | ✅ 2026-08-13 | 与用户页左侧组织架构共用（种子菜单 /sys/department 指向用户页，与 Vue 一致） |
| T3.6 | 参数配置 / 操作日志 / 个人中心 | ✅ 2026-08-13 | 参数配置（W2 验收页）；日志（清空/保存天数 getKeep+setKeep/keyword）；个人中心（头像上传/昵称/改密 personUpdate） |

### W4：其余模块
| # | 页面 | 状态 | 备注 |
|---|---|---|---|
| T4.1 | dict 字典管理 | ✅ 2026-08-13 | 左侧类型列表（增改）+ 右侧数据树形表格（typeId 过滤/slot-add 子集新增/刷新字典缓存）；U5 规避：排序发 order/sort |
| T4.2 | recycle 回收站 | ✅ 2026-08-13 | 批量恢复/单行恢复（restore 契约） |
| T4.3 | space 云空间 | ✅ 2026-08-13 | 简化版：分类树 + 文件网格（多选删除/预览）+ 上传（upload 契约 file 字段） |
| T4.4 | task 定时任务 | ✅ 2026-08-13 | 卡片式列表（进行中/已停止、启停/立即执行/日志/删除）+ cron/间隔表单联动 + 日志弹窗（task log 契约） |
| T4.5 | user 用户模块 | ✅ 2026-08-13 | 用户信息 CRUD（性别/登录方式/状态字典） |
| T4.6 | helper（AI 编码/插件）+ demo（CRUD 示例） | ✅ 2026-08-13 | 插件市场（plugin.info 分页卡片）；AI 编码（coding getModuleTree/createCode）；CRUD 示例（demo.goods） |

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
| U1 | React 版富文本编辑器选型（对应 wangeditor） | ⬜ | 参数配置页 html 编辑需要（暂 TextArea 占位） |
| U2 | 图标体系：官方菜单 icon 字符串（如 icon-setting）→ AntD 图标映射 | 🚧 | `src/cool/components/icon.tsx` 已建映射表（19 项，覆盖种子菜单全部 icon）；后续新菜单 icon 需补充 |
| U3 | EPS vite 插件实现方式（虚拟模块 vs 代码生成） | ✅ 2026-08-13 | **虚拟模块（构建期注入）+ 提交生成 d.ts**（ADR D4）；缓存兜底链：远程 → node_modules/.cache → build/cool/eps.json（种子，已提交） |
| U4 | **上游缺口**：nest 后端 user/page 未返回 roleName、未排除 admin、不支持 departmentIds 过滤（官方 midway 有：LEFT JOIN 角色名、`a.username != 'admin'`、`a.departmentId in (?)`） | 🚧 待 nest 修复 | React 侧已实现 departmentIds 过滤请求（后端忽略）；roleName 列已渲染（后端修复即生效）；待列入 nest PROGRESS 二期行 |
| U5 | **上游缺口**：nest 后端 menu/list 不提取 `prop` 参数（Vue 版发 `{prop, order}` 排序会 1003 core error） | 🚧 待 nest 修复 | React 侧按契约 1.1 命名发 `{order, sort}`（实测可用）；建议 nest list 同步提取 prop |

## 五、决策记录（ADR）

| # | 决策 | 内容 | 日期 |
|---|---|---|---|
| D1 | 技术栈 | React 18 + AntD 5 + react-router v6 + zustand + axios + i18next + echarts | 2026-08-13 |
| D2 | 复刻策略 | 结构镜像 Vue 版（src/cool 核心 + src/modules 页面一一对应），行为逐页比对 | 2026-08-13 |
| D3 | 契约层先行 | 请求层/状态/树工具按契约实现后再做页面（对应 W0） | 2026-08-13 |
| D4 | EPS 注入方案 | vite 虚拟模块（virtual:eps 构建期注入，对齐 Vue @cool-vue/vite-plugin）+ 生成 d.ts 提交仓库；缓存兜底链：远程 → node_modules/.cache → build/cool/eps.json 种子；`pnpm eps` 独立再生成；后端加接口须 pnpm eps + 重建 bundle（对齐 nest D10） | 2026-08-13 |

## 六、验收记录

| 日期 | 验收项 | 方法 | 结果 |
|---|---|---|---|
| 2026-08-13 | W0 骨架 | pnpm install + tsc -b + vite build 通过；远端推送成功 | ✅ |
| 2026-08-13 | W1 登录链路 | ego-browser 实测：登录页渲染（验证码 svg）→ 登录 → person + permmenu → 首页布局（侧边菜单树/顶栏/页签）→ 菜单点击跳转 /sys/user → iframe 菜单（文档官网）→ 退出登录确认 → 回登录页 → 刷新 /sys/user 恢复 | ✅ 全部通过（期间修复 1 bug：首页路径误从扁平列表取，见 T1.3） |
| 2026-08-13 | W1 菜单结构 | 侧边菜单与官方 seed 比对：首页/系统管理(权限管理/参数配置/监控管理/任务管理)/数据管理/扩展管理/用户管理/框架教程，图标映射正确 | ✅ |
| 2026-08-13 | T1.5 EPS 服务层 | ego-browser 页面内动态 import 实测：user.page({page:1,size:20})→{list,pagination}、menu.list()→7、dict.type.list()→2、自定义接口 move/clear 绑定、权限码 map（base:sys:user:add 等） | ✅ 全通过 |
| 2026-08-13 | W2 CRUD 框架 | ego-browser 参数配置页端到端：列表渲染（3 条+字典映射+popover 数据预览）→ 新增（radio 联动 hidden 字段/onSubmit 转换）→ 编辑（info 回填+onOpened 映射）→ 删除（确认+刷新）→ 关键字/类型筛选、分页 | ✅ 全通过（期间修复 2 框架 bug：useRoutes 条件调用致 hook 顺序错误、lazy 组件缺 Suspense） |
| 2026-08-13 | W3 base 页面 | ego-browser 8 页面逐页实测：用户页（组织架构树 3 节点/新增用户含角色动态加载/状态开关内联 update/转移弹窗+部门树选择器）、角色页、日志页、菜单页（树形表格 7 展开/新增弹窗含图标选择器）、个人中心、参数页、工作台（统计卡+图表）、部门树右键菜单 | ✅ 全通过（期间修复：deepTree 兼容树形输入、首页 index 路由 Navigate 自循环；发现上游缺口 U4/U5） |
| 2026-08-13 | W4 其余模块 | ego-browser 7 页面实测：字典（类型列表+树表）、回收站、云空间（分类+文件网格）、定时任务（卡片列表+日志弹窗）、用户模块、插件市场、CRUD 示例 | ✅ 全部渲染通过 |

## 七、下一个动作

1. **P 对齐验收**（T5.1-T5.6）：
   - T5.1 17 页面与 Vue 版逐页比对（egolite 实测，含弹窗/按钮级交互细节）
   - T5.2 接口抓包 diff（出入参与 AGENTS.md 一致）
   - T5.3 按钮级权限实测（非超管/越权 403）
   - T5.4 token 生命周期实测（401 续期/改密失效/logout 作废）
   - T5.5 EPS 全量消费比对（eps.snapshot.json）
   - T5.6 Docker 可插拔替换 admin-ui 容器实测
2. **上游同步**：U4/U5 已写入两仓库 PROGRESS（nest 待修复）
3. 每任务验收后更新本文件与 `../cool-admin-nest/PROGRESS.md`（二期行）
