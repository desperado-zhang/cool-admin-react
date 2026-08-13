/**
 * 菜单管理（对应 Vue 版 base/views/menu/index.vue）
 * - 树形表格（菜单 list 契约返回树形）
 * - 图标/上级节点/权限选择器 + 导入导出
 */
import { App, Button, Tag } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { service, asService } from "@/cool/service";
import { useMenuStore } from "@/cool/store/menu";
import {
	AddBtn,
	CoolCrudProvider,
	CoolDialog,
	CoolTable,
	Flex1,
	MultiDeleteBtn,
	RefreshBtn,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";
import { useFormDialog } from "@/cool/crud/useFormDialog";
import { menuIcon } from "@/cool/components/icon";
import "@/modules/base/components/menu/icon";
import "@/modules/base/components/menu/select";

const typeOptions = [
	{ label: "目录", value: 0 },
	{ label: "菜单", value: 1 },
	{ label: "权限", value: 2 }
];

export default function SysMenu() {
	const crud = useCoolCrud({
		service: asService(service.base.sys.menu),
		onRefresh: async (_params, { render }) => {
			// 注意：Vue 发 {prop, order}，nest 后端未提取 prop 会 1003（上游待修复，见 PROGRESS 待确认项）
			// 此处按契约 1.1 命名发 {order, sort}
			const res = await service.base.sys.menu.list({ order: "orderNum", sort: "asc" });
			render(res as never);
			// 同步左侧菜单
			useMenuStore.getState().get();
		}
	});
	const { message } = App.useApp();
	const impExp = useFormDialog();

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ prop: "name", label: "名称", width: 200, align: "left" },
		{
			prop: "isShow",
			label: "是否显示",
			width: 100,
			component: {
				name: "cl-switch",
				props: {}
			}
		},
		{
			prop: "icon",
			label: "图标",
			width: 100,
			formatter(row) {
				const Icon = menuIcon(row.icon as string);
				return Icon ? <Icon /> : null;
			}
		},
		{ prop: "type", label: "类型", width: 110, dict: typeOptions },
		{
			prop: "router",
			label: "节点路由",
			minWidth: 170,
			formatter(row) {
				if (row.type === 1) {
					return <a style={{ color: "#52c41a" }}>{row.router as string}</a>;
				}
				return row.router as string;
			}
		},
		{ prop: "keepAlive", label: "路由缓存", width: 100, component: { name: "cl-switch" } },
		{ prop: "viewPath", label: "文件路径", minWidth: 200, showOverflowTooltip: true },
		{
			prop: "perms",
			label: "权限",
			minWidth: 300,
			formatter(row) {
				const perms = String(row.perms || "").split(",").filter(Boolean);
				return perms.map((p) => <Tag key={p}>{p}</Tag>);
			}
		},
		{ prop: "orderNum", label: "排序号", width: 100, sortable: "asc" },
		{ prop: "updateTime", label: "更新时间", sortable: "custom", width: 170 },
		{
			type: "op",
			width: 250,
			buttons: ["slot-add", "edit", "delete"]
		}
	];

	const items: FormItem[] = [
		{ prop: "type", value: 0, label: "节点类型", required: true, component: { name: "el-radio-group", options: typeOptions } },
		{ prop: "name", label: "节点名称", required: true, component: { name: "el-input" } },
		{ prop: "parentId", label: "上级节点", component: { name: "cl-menu-select" } },
		{
			prop: "router",
			label: "节点路由",
			hidden: (scope) => scope.type != 1,
			component: { name: "el-input", props: { placeholder: "请输入节点路由，如：/test" } }
		},
		{
			prop: "keepAlive",
			value: true,
			label: "路由缓存",
			hidden: (scope) => scope.type != 1,
			component: {
				name: "el-radio-group",
				options: [
					{ label: "开启", value: true },
					{ label: "关闭", value: false }
				]
			}
		},
		{
			prop: "isShow",
			label: "是否显示",
			value: true,
			hidden: (scope) => scope.type == 2,
			component: { name: "el-switch" }
		},
		{
			prop: "viewPath",
			label: "文件路径",
			hidden: (scope) => scope.type != 1,
			component: { name: "el-input", props: { placeholder: "modules/base/views/xxx.vue" } }
		},
		{
			prop: "icon",
			label: "图标",
			hidden: (scope) => scope.type == 2,
			component: { name: "cl-menu-icon", props: { showIcon: true } }
		},
		{
			prop: "orderNum",
			label: "排序号",
			component: { name: "el-input-number", props: { placeholder: "请填写排序号", min: 0, max: 99 } }
		},
		{
			prop: "perms",
			label: "权限",
			hidden: (scope) => scope.type != 2,
			component: { name: "el-input", props: { placeholder: "如：base:sys:user:add" } }
		}
	];

	/** 导入 */
	const toImport = () => {
		impExp.open({
			title: "导入菜单",
			width: 600,
			items: [
				{
					prop: "data",
					label: "菜单 JSON",
					required: true,
					component: { name: "el-input", props: { type: "textarea", rows: 12, placeholder: "粘贴菜单 JSON" } }
				}
			],
			onSubmit: async (data, { done, close }) => {
				try {
					await service.base.sys.menu.import({ data: JSON.parse(data.data as string) });
					message.success("导入成功");
					close();
					refresh();
				} catch (err) {
					message.error((err as Error).message);
					done();
				}
			}
		});
	};

	/** 导出 */
	const toExport = async () => {
		try {
			const res = await service.base.sys.menu.export();
			impExp.open({
				title: "导出菜单",
				width: 600,
				form: { data: JSON.stringify(res, null, 2) },
				items: [
					{
						prop: "data",
						label: "菜单 JSON",
						component: { name: "el-input", props: { type: "textarea", rows: 16 } }
					}
				],
				onSubmit: async (_data, { done }) => {
					done();
				}
			});
		} catch (err) {
			message.error((err as Error).message);
		}
	};

	/** 刷新（同步侧边菜单由 onRefresh 完成） */
	const refresh = () => crud.refresh({ prop: "orderNum", order: "asc" });

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<AddBtn />
					<MultiDeleteBtn />
					<Flex1 />
					<Button icon={<UploadOutlined />} onClick={toImport}>
						导入
					</Button>
					<Button icon={<DownloadOutlined />} onClick={toExport}>
						导出
					</Button>
				</Toolbar>

				<CoolTable
					columns={columns}
					slots={{
						"slot-add": (row) => (
							<Button
								type="link"
								size="small"
								style={{ color: "#52c41a" }}
								onClick={() =>
									crud.rowAppend({
										parentId: row.id,
										parentType: row.type,
										type: (row.type as number) + 1,
										keepAlive: true,
										isShow: true
									})
								}
							>
								新增
							</Button>
						)
					}}
				/>

				<CoolDialog
					dialog={{ width: 800 }}
					items={items}
					onSubmit={(data, { next }) => {
						next({
							...data,
							parentId: data.parentId || null,
							perms: data.perms || null
						});
					}}
				/>
			</div>

			{impExp.holder}
		</CoolCrudProvider>
	);
}
