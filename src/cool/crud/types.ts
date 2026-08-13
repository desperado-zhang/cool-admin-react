/**
 * CRUD 框架类型（配置形状对齐 Vue 版 cl-crud，命名一致便于逐页移植）
 */
import type { ReactNode } from "react";

/** 组件配置（对应 Vue component: { name, props, options }） */
export interface ComponentConfig {
	name: string;
	props?: Record<string, unknown>;
	options?: { label: string; value: unknown }[];
	[key: string]: unknown;
}

/** 字典选项（dict.get 返回项或手写 options） */
export interface DictOption {
	label: string;
	value: unknown;
	name?: string;
	id?: number;
	orderNum?: number;
	[key: string]: unknown;
}

/** 表格列配置（对应 Vue useTable columns） */
export interface ColumnConfig {
	/** selection 选择列 / index 序号列 / op 操作列 */
	type?: "selection" | "index" | "op";
	/** 字段名 */
	prop?: string;
	/** 标题 */
	label?: string;
	width?: number | string;
	minWidth?: number;
	headerAlign?: "left" | "center" | "right";
	align?: "left" | "center" | "right";
	/** 排序：true 双向 / 'desc' 默认倒序 / 'custom' 服务端排序 */
	sortable?: boolean | "desc" | "asc" | "custom";
	showOverflowTooltip?: boolean;
	/** 字典：string（字典 key）或选项数组 */
	dict?: string | DictOption[];
	/** 值格式化 */
	formatter?: (row: Record<string, unknown>) => unknown;
	/** 自定义组件渲染 */
	component?: ComponentConfig | (() => ComponentConfig);
	/** 插槽名（页面通过 slots 提供） */
	slot?: string;
	/** op 列按钮（'edit' | 'delete' | 'slot-xxx' | 自定义 key） */
	buttons?: string[];
	hidden?: boolean;
	/** 不参与排序号 */
	orderNum?: number;
}

/** 表单项配置（对应 Vue useUpsert items；可为函数按模式动态生成） */
export interface FormItemConfig {
	prop?: string;
	label?: string;
	/** 栅格宽度（24 分） */
	span?: number;
	required?: boolean;
	/** 默认值 */
	value?: unknown;
	rules?: Record<string, unknown>[];
	dict?: string | DictOption[];
	component?: ComponentConfig | (() => ComponentConfig);
	/** 隐藏：布尔或按表单值联动（对应 Vue hidden({ scope })） */
	hidden?: boolean | ((scope: Record<string, unknown>) => boolean);
	placeholder?: string;
}

export type FormItem = FormItemConfig | ((ctx: { mode: "add" | "edit" }) => FormItemConfig | false);

/** 页面对话框插槽 */
export type TableSlots = Record<string, (row: Record<string, unknown>, rowIndex: number) => ReactNode>;
