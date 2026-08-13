/**
 * 部门选择器（对应 Vue 版 base/components/dept/select.vue + check.vue）
 * 注册组件名：cl-dept-select（单选）/ cl-dept-check（多选勾选）
 */
import { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import { service } from "@/cool/service";
import { deepTree } from "@/cool/utils/tree";
import { registerComponent } from "@/cool/crud/registry";

interface DeptNode {
	id: number;
	name: string;
	parentId: number | null;
	children?: DeptNode[];
	[key: string]: unknown;
}

function useDeptList() {
	const [list, setList] = useState<DeptNode[]>([]);

	useEffect(() => {
		service.base.sys.department
			.list()
			.then((res) => {
				setList(deepTree(res as never) as never);
			})
			.catch(() => {
				// 请求层已提示
			});
	}, []);

	return list;
}

function DeptSelect({
	value,
	onChange,
	props
}: {
	value?: unknown;
	onChange?: (value: unknown) => void;
	props: Record<string, unknown>;
}) {
	const list = useDeptList();
	const multiple = !!props.multiple;

	return (
		<TreeSelect
			value={value as never}
			onChange={(v) => onChange?.(v)}
			treeData={list as never}
			fieldNames={{ label: "name", value: "id", children: "children" }}
			treeDefaultExpandAll
			multiple={multiple}
			showCheckedStrategy={multiple ? TreeSelect.SHOW_CHILD : undefined}
			treeCheckable={multiple}
			allowClear
			placeholder="请选择部门"
			style={{ width: "100%" }}
		/>
	);
}

registerComponent("cl-dept-select", (ctx) => <DeptSelect {...ctx} />);
registerComponent("cl-dept-check", (ctx) => <DeptSelect {...ctx} />);
