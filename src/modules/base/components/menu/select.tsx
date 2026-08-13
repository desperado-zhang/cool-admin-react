/**
 * 上级菜单选择（对应 Vue 版 base/components/menu/select.vue）
 * 注册组件名：cl-menu-select
 */
import { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import { service } from "@/cool/service";
import { registerComponent } from "@/cool/crud/registry";

function MenuSelect({
	value,
	onChange
}: {
	value?: unknown;
	onChange?: (value: unknown) => void;
}) {
	const [tree, setTree] = useState<Record<string, unknown>[]>([]);

	useEffect(() => {
		service.base.sys.menu
			.list()
			.then((res) => setTree(res as never))
			.catch(() => {
				// 请求层已提示
			});
	}, []);

	return (
		<TreeSelect
			value={value as never}
			onChange={(v) => onChange?.(v || null)}
			treeData={tree as never}
			fieldNames={{ label: "name", value: "id", children: "children" }}
			treeDefaultExpandAll
			allowClear
			placeholder="请选择上级节点"
			style={{ width: "100%" }}
		/>
	);
}

registerComponent("cl-menu-select", (ctx) => <MenuSelect {...ctx} />);
