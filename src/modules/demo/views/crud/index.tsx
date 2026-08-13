/**
 * CRUD 示例（对应 Vue 版 demo/views/crud/index.vue，简化版）
 * - demo.goods 商品管理 CRUD 示例（演示框架能力）
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
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";

const statusOptions = [
	{ label: "下架", value: 0 },
	{ label: "上架", value: 1 }
];

export default function CrudDemo() {
	const crud = useCoolCrud({ service: asService(service.demo.goods) });

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ type: "index", label: "#", width: 60 },
		{ label: "商品名称", prop: "name", minWidth: 150 },
		{ label: "主图", prop: "mainImage", width: 100, component: { name: "cl-image", props: { width: 40 } } },
		{ label: "价格", prop: "price", minWidth: 120 },
		{ label: "类型", prop: "type", dict: statusOptions, minWidth: 100 },
		{ label: "库存", prop: "stock", minWidth: 100 },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{ label: "创建时间", prop: "createTime", sortable: "desc", minWidth: 170 },
		{ type: "op" }
	];

	const items: FormItem[] = [
		{ prop: "name", label: "商品名称", span: 12, required: true, component: { name: "el-input" } },
		{ prop: "price", label: "价格", span: 12, required: true, component: { name: "el-input-number", props: { min: 0, precision: 2 } } },
		{ prop: "mainImage", label: "主图", span: 12, component: { name: "cl-upload" } },
		{ prop: "type", label: "类型", span: 12, value: 0, component: { name: "el-radio-group", options: statusOptions } },
		{ prop: "stock", label: "库存", span: 12, component: { name: "el-input-number", props: { min: 0 } } },
		{ prop: "status", label: "状态", span: 12, value: 1, component: { name: "el-switch", props: { activeValue: 1, inactiveValue: 0 } } },
		{ prop: "description", label: "描述", component: { name: "el-input", props: { type: "textarea", rows: 3 } } }
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<AddBtn />
					<MultiDeleteBtn />
					<Flex1 />
					<SearchKey placeholder="搜索商品名称" />
				</Toolbar>

				<CoolTable columns={columns} />

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>

				<CoolDialog dialog={{ width: 700 }} items={items} />
			</div>
		</CoolCrudProvider>
	);
}
