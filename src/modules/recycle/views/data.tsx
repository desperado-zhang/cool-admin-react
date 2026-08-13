/**
 * 数据回收站（对应 Vue 版 recycle/views/data.vue）
 */
import { App, Button } from "antd";
import { service, asService } from "@/cool/service";
import {
	CoolCrudProvider,
	CoolPagination,
	CoolTable,
	Flex1,
	Permission,
	RefreshBtn,
	SearchKey,
	Toolbar,
	useCoolCrud,
	type ColumnConfig
} from "@/cool/crud";

export default function RecycleData() {
	const crud = useCoolCrud({ service: asService(service.recycle.data) });
	const { message, modal } = App.useApp();

	const restore = (id?: number) => {
		const ids = id ? [id] : crud.selection.map((e) => e.id as number);

		modal.confirm({
			title: "提示",
			content: "此操作将恢复被删除的数据，是否继续？",
			onOk: async () => {
				try {
					await service.recycle.data.restore({ ids });
					message.success("数据恢复成功");
					crud.refresh();
				} catch (err) {
					message.error((err as Error).message);
				}
			}
		});
	};

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ label: "操作人", prop: "userName", minWidth: 120 },
		{ label: "被删除的数据", prop: "data", minWidth: 200, component: { name: "cl-code-json", props: { popover: true } } },
		{ label: "请求的接口", prop: "url", showOverflowTooltip: true, minWidth: 150 },
		{ label: "请求参数", prop: "params", minWidth: 150, component: { name: "cl-code-json", props: { popover: true } } },
		{ label: "删除条数", prop: "count", minWidth: 120, sortable: "custom" },
		{ label: "创建时间", prop: "createTime", minWidth: 170, sortable: "desc" },
		{
			type: "op",
			width: 120,
			buttons: ["slot-restore"]
		}
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<Permission perm={service.recycle.data.permission.restore}>
						<Button
							style={{ background: "#52c41a", borderColor: "#52c41a", color: "#fff" }}
							disabled={!crud.selection.length}
							onClick={() => restore()}
						>
							批量恢复
						</Button>
					</Permission>
					<Flex1 />
					<SearchKey />
				</Toolbar>

				<CoolTable
					columns={columns}
					slots={{
						"slot-restore": (row) => (
							<Button type="link" size="small" style={{ color: "#52c41a" }} onClick={() => restore(row.id as number)}>
								恢复
							</Button>
						)
					}}
				/>

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>
			</div>
		</CoolCrudProvider>
	);
}
