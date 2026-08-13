/**
 * 配置式表格（对应 Vue 版 cl-table）
 * - columns 配置对齐 Vue（selection/index/op/component/formatter/dict/sortable）
 * - 操作列：edit → rowEdit；delete → 确认删除；slot-xxx → 页面插槽
 * - 服务端排序：sortable → refresh({ order, sort })
 */
import { useMemo } from "react";
import { Button, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useCoolCrudContext } from "./useCoolCrud";
import { usePermission } from "../hooks/usePermission";
import { getComponent } from "./registry";
import { useDictStore } from "../store/dict";
import type { ColumnConfig, DictOption, TableSlots } from "./types";

interface CoolTableProps {
	columns: ColumnConfig[];
	slots?: TableSlots;
	rowKey?: string;
	height?: string | number;
}

export default function CoolTable({ columns, slots, rowKey = "id", height }: CoolTableProps) {
	const crud = useCoolCrudContext();
	const dictStore = useDictStore();
	const { has } = usePermission();

	/** 字典选项解析 */
	const resolveDict = (dict?: string | DictOption[]): DictOption[] => {
		if (!dict) return [];
		if (typeof dict === "string") return dictStore.get(dict);
		return dict;
	};

	const cols = useMemo<TableProps<Record<string, unknown>>["columns"]>(() => {
		const result: TableProps<Record<string, unknown>>["columns"] = [];

		for (const item of columns) {
			if (item.hidden) continue;

			// 选择列：由 AntD rowSelection 自动渲染（与 Vue selection 列等效）
			if (item.type === "selection") {
				continue;
			}

			// 序号列
			if (item.type === "index") {
				result.push({
					title: item.label || "#",
					width: item.width || 60,
					align: "center",
					render: (_v, _r, index) => index + 1
				});
				continue;
			}

			// 操作列
			if (item.type === "op") {
				const buttons = item.buttons || ["edit", "delete"];
				const perm = (crud.service as unknown as { permission?: Record<string, string> })?.permission;

				result.push({
					title: item.label || "操作",
					width: item.width || 180,
					align: "center",
					fixed: "right",
					render: (_v, row, rowIndex) => (
						<>
							{buttons.map((btn) => {
								if (btn === "edit") {
									if (!has(perm?.update)) return null;
									return (
										<Button
											key={btn}
											type="link"
											size="small"
											icon={<EditOutlined />}
											onClick={() => crud.rowEdit(row)}
										>
											编辑
										</Button>
									);
								}

								if (btn === "delete") {
									if (!has(perm?.delete)) return null;
									return (
										<Button
											key={btn}
											type="link"
											size="small"
											danger
											icon={<DeleteOutlined />}
											onClick={() => crud.rowDelete([row.id as number])}
										>
											删除
										</Button>
									);
								}

								// 自定义插槽按钮
								const name = btn.startsWith("slot-") ? btn.replace("slot-", "") : btn;
								return slots?.[name] ? <span key={btn}>{slots[name](row, rowIndex)}</span> : null;
							})}
						</>
					)
				});
				continue;
			}

			const prop = item.prop || "";
			const dict = resolveDict(item.dict);

			result.push({
				title: item.label,
				dataIndex: prop,
				width: item.width,
				align: item.align,
				ellipsis: item.showOverflowTooltip,
				...(item.sortable ? { sorter: true } : {}),
				render: (value, row, index) => {
					// 插槽
					if (item.slot && slots?.[item.slot]) {
						return slots[item.slot](row, index);
					}

					// 组件
					if (item.component) {
						const cfg = typeof item.component === "function" ? item.component() : item.component;
						const renderer = getComponent(cfg.name);

						if (!renderer) {
							console.warn(`[cool-table] 组件未注册：${cfg.name}`);
							return value as never;
						}

						return renderer({
							value: row[prop],
							row,
							rowIndex: index,
							prop,
							props: cfg.props || {},
							options: (cfg.options as DictOption[]) || undefined,
							slots,
							service: crud.service,
							refresh: crud.refresh
						});
					}

					// formatter
					if (item.formatter) {
						return item.formatter(row) as never;
					}

					// 字典映射
					if (dict.length) {
						const d = dict.find((e) => e.value === value);
						return (d?.label ?? String(value ?? "")) as never;
					}

					return value as never;
				}
			});
		}

		return result;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns, crud.list, dictStore.data, slots]);

	return (
		<Table
			rowKey={rowKey}
			columns={cols}
			dataSource={crud.list}
			loading={crud.loading}
			size="small"
			pagination={false}
			scroll={height ? { y: height } : undefined}
			rowSelection={
				columns.some((e) => e.type === "selection")
					? {
							selectedRowKeys: crud.selection.map((e) => e.id as React.Key),
							onChange: (_keys, rows) => {
								crud.setSelection(rows);
							}
						}
					: undefined
			}
			onChange={(_pagination, _filters, sorter) => {
				const s = Array.isArray(sorter) ? sorter[0] : sorter;
				if (s?.order) {
					crud.refresh({
						order: s.field,
						sort: s.order === "ascend" ? "asc" : "desc"
					});
				}
			}}
		/>
	);
}
