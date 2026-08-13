/**
 * 操作日志（对应 Vue 版 base/views/log.vue）
 * 契约来源：cool-admin-nest AGENTS.md 5.6（仅 page + clear/setKeep/getKeep）
 */
import { useEffect, useState } from "react";
import { App, Button, InputNumber } from "antd";
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

export default function SysLog() {
	const crud = useCoolCrud({ service: asService(service.base.sys.log) });
	const { message, modal } = App.useApp();
	const [day, setDay] = useState(1);

	useEffect(() => {
		service.base.sys.log.getKeep().then((res) => {
			setDay(Number(res));
		});
	}, []);

	const saveDay = () => {
		service.base.sys.log
			.setKeep({ value: day })
			.then(() => message.success("保存成功"))
			.catch((err: Error) => message.error(err.message));
	};

	const clear = () => {
		modal.confirm({
			title: "提示",
			content: "是否要清空日志？",
			okType: "danger",
			onOk: async () => {
				try {
					await service.base.sys.log.clear();
					message.success("清空成功");
					crud.refresh();
				} catch (err) {
					message.error((err as Error).message);
				}
			}
		});
	};

	const columns: ColumnConfig[] = [
		{ type: "index", label: "#", width: 60 },
		{ prop: "userId", label: "用户ID", minWidth: 100 },
		{ prop: "name", label: "用户昵称", minWidth: 120 },
		{ prop: "action", label: "请求地址", minWidth: 200, showOverflowTooltip: true },
		{ prop: "params", label: "参数", minWidth: 200, component: { name: "cl-code-json", props: { popover: true } } },
		{
			prop: "ip",
			label: "ip",
			minWidth: 150,
			formatter(row) {
				return String(row.ip || "").split(",").join(", ");
			}
		},
		{ prop: "createTime", label: "请求时间", minWidth: 170, sortable: "desc" }
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="cl-crud">
				<Toolbar>
					<RefreshBtn />
					<Permission perm={service.base.sys.log.permission.clear}>
						<Button danger onClick={clear}>
							清空
						</Button>
					</Permission>
					<span style={{ marginLeft: 8 }}>
						日志保存天数：
						<InputNumber
							controls
							min={1}
							max={10000}
							value={day}
							onChange={(v) => setDay(v || 1)}
							onBlur={saveDay}
						/>
					</span>
					<Flex1 />
					<SearchKey placeholder="搜索请求地址、用户昵称、ip" />
				</Toolbar>

				<CoolTable columns={columns} />

				<div style={{ display: "flex", marginTop: 12 }}>
					<Flex1 />
					<CoolPagination />
				</div>
			</div>
		</CoolCrudProvider>
	);
}
