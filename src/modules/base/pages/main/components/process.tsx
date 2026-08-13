/**
 * 页签栏（对应 Vue 版 main/components/process.vue，简化版）
 * - 点击切换 / 关闭；首页与 process===false 的路由不进页签
 */
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { useProcessStore } from "@/cool/store/process";

export default function Process() {
	const navigate = useNavigate();
	const list = useProcessStore((s) => s.list);

	if (!list.length) return null;

	return (
		<div className="app-process">
			<Tabs
				type="editable-card"
				hideAdd
				size="small"
				items={list.map((e) => ({
					key: e.path,
					label: e.meta?.label || e.path,
					closable: true
				}))}
				activeKey={list.find((e) => e.active)?.path}
				onChange={(key) => navigate(key)}
				onEdit={(key, action) => {
					if (action === "remove" && typeof key === "string") {
						const store = useProcessStore.getState();
						const index = store.list.findIndex((e) => e.path === key);
						const wasActive = store.list[index]?.active;
						store.remove(index);

						// 关闭当前页签 → 跳相邻页签或首页
						if (wasActive) {
							const rest = useProcessStore.getState().list;
							const next = rest[index] || rest[rest.length - 1];
							navigate(next?.path || "/");
						}
					}
				}}
			/>
		</div>
	);
}
