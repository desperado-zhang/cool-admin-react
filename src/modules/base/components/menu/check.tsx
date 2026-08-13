/**
 * 菜单勾选树（对应 Vue 版 base/components/menu/check.vue）
 * 注册组件名：cl-menu-check（角色功能权限授权）
 */
import { useEffect, useState } from "react";
import { Tree } from "antd";
import { service } from "@/cool/service";
import { registerComponent } from "@/cool/crud/registry";

function MenuCheck({ value, onChange }: { value?: unknown; onChange?: (value: unknown) => void }) {
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
		<Tree
			checkable
			defaultExpandAll
			treeData={tree as never}
			fieldNames={{ title: "name", key: "id", children: "children" }}
			checkedKeys={(value as React.Key[]) || []}
			onCheck={(checked) => {
				onChange?.(Array.isArray(checked) ? checked : checked.checked);
			}}
			style={{ maxHeight: 320, overflow: "auto" }}
		/>
	);
}

registerComponent("cl-menu-check", (ctx) => <MenuCheck value={ctx.value} onChange={ctx.onChange} />);
