/**
 * 角色管理（对应 Vue 版 base/views/role.vue）
 * - 功能权限：cl-menu-check 菜单勾选树
 * - 数据权限：relevance 开关 + cl-dept-check 部门勾选树（slot-relevance 插槽）
 */
import { Form, Switch } from "antd";
import { service, asService } from "@/cool/service";
import {
	AddBtn,
	CoolCrudProvider,
	CoolDialog,
	CoolPagination,
	CoolTable,
	Flex1,
	MultiDeleteBtn,
	RefreshBtn,
	SearchKey,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";
import { getComponent } from "@/cool/crud/registry";
import "@/modules/base/components/dept/select";
import "@/modules/base/components/menu/check";

export default function SysRole() {
	const crud = useCoolCrud({ service: asService(service.base.sys.role) });

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ prop: "name", label: "名称", minWidth: 150 },
		{ prop: "label", label: "标识", minWidth: 120 },
		{ prop: "remark", label: "备注", showOverflowTooltip: true, minWidth: 150 },
		{ prop: "createTime", label: "创建时间", sortable: "desc", minWidth: 170 },
		{ prop: "updateTime", label: "更新时间", sortable: "custom", minWidth: 170 },
		{ type: "op" }
	];

	const items: FormItem[] = [
		{ prop: "name", label: "名称", span: 12, required: true, component: { name: "el-input" } },
		{ prop: "label", label: "标识", span: 12, required: true, component: { name: "el-input" } },
		{ prop: "remark", label: "备注", span: 24, component: { name: "el-input", props: { type: "textarea", rows: 4 } } },
		{ prop: "menuIdList", label: "功能权限", value: [], component: { name: "cl-menu-check" } },
		{ prop: "relevance", label: "数据权限", component: { name: "slot-relevance" } }
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<AddBtn />
					<MultiDeleteBtn />
					<Flex1 />
					<SearchKey placeholder="搜索名称" />
				</Toolbar>

				<CoolTable columns={columns} />

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>

				<CoolDialog
					dialog={{ width: 800 }}
					items={items}
					slots={{
						relevance: ({ value, onChange }) => {
							const DeptCheck = getComponent("cl-dept-check")!;

							return (
								<div>
									<div style={{ display: "flex", alignItems: "center" }}>
										<Switch checked={(value as number) == 1} onChange={(v) => onChange?.(v ? 1 : 0)} />
										<span style={{ marginLeft: 10, fontSize: 12 }}>是否关联上下级</span>
									</div>
									<div
										style={{
											marginTop: 10,
											border: "1px solid #f0f0f0",
											borderRadius: 6,
											padding: 6,
											maxHeight: 240,
											overflow: "auto"
										}}
									>
										<Form.Item name="departmentIdList" noStyle>
											<DeptCheckInner renderer={DeptCheck} />
										</Form.Item>
									</div>
								</div>
							);
						}
					}}
					onSubmit={(data, { next }) => {
						next({
							...data,
							departmentIdList: data.departmentIdList || []
						});
					}}
				/>
			</div>
		</CoolCrudProvider>
	);
}

/** 部门勾选树（接收 Form.Item 注入的 value/onChange） */
function DeptCheckInner({
	renderer,
	value,
	onChange
}: {
	renderer: (ctx: any) => React.ReactNode;
	value?: unknown;
	onChange?: (value: unknown) => void;
}) {
	return <>{renderer({ value, onChange, props: {} })}</>;
}
