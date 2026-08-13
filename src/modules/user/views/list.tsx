/**
 * 用户扩展模块（对应 Vue 版 user/views/list.vue）
 */
import { service, asService } from "@/cool/service";
import {
	CoolCrudProvider,
	CoolDialog,
	CoolPagination,
	CoolTable,
	Flex1,
	MultiDeleteBtn,
	RefreshBtn,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";

const genderOptions = [
	{ label: "未知", value: 0 },
	{ label: "男", value: 1 },
	{ label: "女", value: 2 }
];

const loginTypeOptions = [
	{ label: "小程序", value: 0 },
	{ label: "公众号", value: 1 },
	{ label: "H5", value: 2 }
];

const statusOptions = [
	{ label: "禁用", value: 0 },
	{ label: "正常", value: 1 },
	{ label: "已注销", value: 2 }
];

export default function UserList() {
	const crud = useCoolCrud({ service: asService(service.user.info) });

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ label: "昵称", prop: "nickName", minWidth: 150 },
		{ label: "头像", prop: "avatarUrl", minWidth: 100, component: { name: "cl-avatar" } },
		{ label: "手机号", prop: "phone", minWidth: 120 },
		{ label: "性别", prop: "gender", dict: genderOptions, minWidth: 120 },
		{ label: "登录方式", prop: "loginType", dict: loginTypeOptions, minWidth: 120 },
		{ label: "状态", prop: "status", dict: statusOptions, minWidth: 120 },
		{ label: "创建时间", prop: "createTime", sortable: "desc", minWidth: 170 },
		{ type: "op" }
	];

	const items: FormItem[] = [
		{ prop: "avatarUrl", label: "头像", component: { name: "cl-upload" } },
		{ prop: "nickName", label: "昵称", required: true, component: { name: "el-input" } },
		{ prop: "phone", label: "手机号", component: { name: "el-input", props: { maxLength: 11 } } },
		{ prop: "gender", label: "性别", value: 1, component: { name: "el-radio-group", options: genderOptions } },
		{ prop: "status", label: "状态", value: 1, component: { name: "el-radio-group", options: statusOptions } }
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<MultiDeleteBtn />
					<Flex1 />
				</Toolbar>

				<CoolTable columns={columns} />

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>

				<CoolDialog items={items} />
			</div>
		</CoolCrudProvider>
	);
}
