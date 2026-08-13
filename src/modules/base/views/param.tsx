/**
 * 参数配置（对应 Vue 版 base/views/param.vue）
 * 契约来源：cool-admin-nest AGENTS.md 5.5（add/delete/update/info/page，无 list）
 */
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
	SearchSelect,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";

const dataTypeOptions = [
	{ label: "字符串", value: 0 },
	{ label: "富文本", value: 1 },
	{ label: "文件", value: 2 }
];

export default function SysParam() {
	const crud = useCoolCrud({ service: asService(service.base.sys.param) });

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ label: "名称", prop: "name", minWidth: 150 },
		{ label: "keyName", prop: "keyName", minWidth: 150 },
		{
			label: "数据",
			prop: "data",
			minWidth: 200,
			component: { name: "cl-code-json", props: { popover: true } }
		},
		{ label: "数据类型", prop: "dataType", minWidth: 120, dict: dataTypeOptions },
		{ label: "备注", prop: "remark", minWidth: 200, showOverflowTooltip: true },
		{ type: "op" }
	];

	const items: FormItem[] = [
		{ prop: "name", label: "名称", span: 12, required: true, component: { name: "el-input" } },
		{
			prop: "keyName",
			label: "keyName",
			span: 12,
			required: true,
			component: { name: "el-input", props: { placeholder: "请输入Key" } }
		},
		{
			prop: "dataType",
			label: "类型",
			value: 0,
			required: true,
			component: { name: "el-radio-group", options: dataTypeOptions }
		},
		{
			prop: "data_0",
			label: "数据",
			hidden: (scope) => scope.dataType != 0,
			required: true,
			component: { name: "el-input", props: { rows: 12, type: "textarea" } }
		},
		{
			prop: "data_1",
			label: "数据",
			hidden: (scope) => scope.dataType != 1,
			required: true,
			component: { name: "cl-editor", props: { name: "cl-editor-wang" } }
		},
		{
			prop: "data_2",
			label: "数据",
			hidden: (scope) => scope.dataType != 2,
			required: true,
			component: { name: "cl-upload", props: { multiple: true, type: "file" } }
		},
		{
			prop: "remark",
			label: "备注",
			component: { name: "el-input", props: { placeholder: "请输入备注", rows: 3, type: "textarea" } }
		}
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<AddBtn />
					<MultiDeleteBtn />
					<Flex1 />
					<SearchSelect prop="dataType" options={dataTypeOptions} placeholder="数据类型" />
					<SearchKey placeholder="搜索名称、keyName" />
				</Toolbar>

				<CoolTable columns={columns} />

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>

				<CoolDialog
					dialog={{ width: 1000 }}
					items={items}
					onOpened={(data) => {
						data[`data_${data.dataType}`] = data.data;
					}}
					onSubmit={(data, { next }) => {
						next({
							...data,
							data: data[`data_${data.dataType}`],
							data_0: undefined,
							data_1: undefined,
							data_2: undefined
						});
					}}
				/>
			</div>
		</CoolCrudProvider>
	);
}
