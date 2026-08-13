/**
 * 用户列表（对应 Vue 版 base/views/user/index.vue）
 * - 左侧组织架构树 + 右侧用户 CRUD
 * - 部门过滤（departmentIds 含子孙）；角色分配（roleIdList）；批量/单个转移
 */
import { useRef, useState } from "react";
import { Button, Tag } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { service, asService } from "@/cool/service";
import {
	AddBtn,
	CoolCrudProvider,
	CoolDialog,
	CoolPagination,
	CoolTable,
	Flex1,
	MultiDeleteBtn,
	Permission,
	RefreshBtn,
	SearchKey,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type DictOption,
	type FormItem
} from "@/cool/crud";
import DeptList from "./components/dept-list";
import UserMove, { type UserMoveRef } from "./components/user-move";
import "@/modules/base/components/dept/select";
import "./index.scss";

interface Dept {
	id: number;
	name: string;
	parentId: number | null;
	children?: Dept[];
}

export default function SysUser() {
	const crud = useCoolCrud({ service: asService(service.base.sys.user) });
	const moveRef = useRef<UserMoveRef>(null);
	const [selectedDept, setSelectedDept] = useState<Dept>();
	const [roleOptions, setRoleOptions] = useState<DictOption[]>([]);

	const perm = service.base.sys.user.permission;

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ prop: "headImg", label: "头像", component: { name: "cl-avatar", props: { size: 32 } } },
		{ prop: "username", label: "用户名", minWidth: 150 },
		{ prop: "name", label: "姓名", minWidth: 120 },
		{ prop: "nickName", label: "昵称", minWidth: 120 },
		{ prop: "departmentName", label: "部门名称", minWidth: 120 },
		{
			prop: "roleName",
			label: "角色",
			minWidth: 160,
			formatter(row) {
				const names = String(row.roleName || "").split(",");
				return names.map((n) => (n ? <Tag key={n}>{n}</Tag> : null));
			}
		},
		{ prop: "status", label: "状态", minWidth: 100, component: { name: "cl-switch" } },
		{ prop: "phone", label: "手机号码", minWidth: 120 },
		{ prop: "remark", label: "备注", minWidth: 200, showOverflowTooltip: true },
		{ prop: "createTime", label: "创建时间", sortable: "desc", minWidth: 170 },
		{ type: "op", buttons: ["slot-btn", "edit", "delete"], width: 270 }
	];

	const items: FormItem[] = [
		{ prop: "headImg", label: "头像", component: { name: "cl-upload", props: { text: "选择头像" } } },
		{ prop: "name", label: "姓名", span: 12, required: true, component: { name: "el-input" } },
		{ prop: "nickName", label: "昵称", span: 12, required: true, component: { name: "el-input" } },
		{ prop: "username", label: "用户名", span: 12, required: true, component: { name: "el-input" } },
		({ mode }) => ({
			prop: "password",
			label: "密码",
			span: 12,
			required: mode === "add",
			component: { name: "el-input", props: { type: "password", autoComplete: "new-password" } },
			rules: [{ min: 6, max: 16, message: "密码长度在 6 到 16 个字符" }]
		}),
		{
			prop: "roleIdList",
			label: "角色",
			value: [],
			required: true,
			component: { name: "el-select", props: { multiple: true, maxCount: 3 } }
		},
		{ prop: "phone", label: "手机号码", span: 12, component: { name: "el-input" } },
		{ prop: "email", label: "邮箱", span: 12, component: { name: "el-input" } },
		{ prop: "remark", label: "备注", component: { name: "el-input", props: { type: "textarea", rows: 4 } } },
		{
			prop: "status",
			label: "状态",
			value: 1,
			component: {
				name: "el-radio-group",
				options: [
					{ label: "启用", value: 1 },
					{ label: "禁用", value: 0 }
				]
			}
		}
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="sys-user">
				<div className="sys-user__left">
					<DeptList
						onSelect={(item, ids) => {
							setSelectedDept(item);
							crud.refresh({ page: 1, departmentIds: ids });
						}}
						onUserAdd={(item) => {
							crud.rowAppend({ departmentId: item.id });
						}}
					/>
				</div>

				<div className="sys-user__right">
					<div className="cl-crud">
						<Toolbar>
							<RefreshBtn />
							<AddBtn />
							<MultiDeleteBtn />
							<Permission perm={perm.move}>
								<Button
									icon={<SwapOutlined />}
									disabled={!crud.selection.length}
									onClick={() => moveRef.current?.open(crud.selection.map((e) => e.id as number), () => crud.refresh())}
								>
									转移
								</Button>
							</Permission>
							<Flex1 />
							<SearchKey placeholder="搜索用户名、姓名" />
						</Toolbar>

						<CoolTable
							columns={columns}
							slots={{
								"slot-btn": (row) => (
									<Permission perm={perm.move}>
										<Button
											type="link"
											size="small"
											icon={<SwapOutlined />}
											onClick={() =>
												moveRef.current?.open([row.id as number], () => crud.refresh())
											}
										>
											转移
										</Button>
									</Permission>
								)
							}}
						/>

						<div style={{ display: "flex", marginTop: 12 }}>
							<Flex1 />
							<CoolPagination />
						</div>

						<CoolDialog
							dialog={{ width: 800 }}
							items={items}
							options={{ roleIdList: roleOptions }}
							onOpen={() => {
								// 设置角色选项（对应 Vue setOptions）
								service.base.sys.role.list().then((res) => {
									setRoleOptions(
										(res as { id: number; name: string }[]).map((e) => ({
											label: e.name || "",
											value: e.id
										}))
									);
								});
							}}
							onSubmit={(data, { next }) => {
								next({
									departmentId: selectedDept?.id,
									...data
								});
							}}
						/>
					</div>
				</div>

				<UserMove ref={moveRef} />
			</div>
		</CoolCrudProvider>
	);
}
