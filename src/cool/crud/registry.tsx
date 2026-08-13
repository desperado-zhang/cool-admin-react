/**
 * 组件注册表（对应 Vue 版 cl-crud 组件体系）
 * - 表格单元格与表单项共用：name 对应 Vue 组件名（el-input / cl-select / cl-switch ...）
 * - 表格上下文可选传入 row / service / refresh，实现单元格即时更新（如状态开关）
 */
import { Avatar, Checkbox, DatePicker, Image, Input, InputNumber, Popover, Radio, Select, Switch, TreeSelect, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import type { DictOption } from "./types";

export interface ComponentRenderContext {
	value: unknown;
	onChange?: (value: unknown) => void;
	props: Record<string, unknown>;
	options?: DictOption[];
	/** 表格行数据 */
	row?: Record<string, unknown>;
	prop?: string;
	/** 行内更新（表格上下文提供） */
	service?: { update: (data: Record<string, unknown>) => Promise<unknown> };
	refresh?: () => void;
	/** 页面插槽 */
	slots?: Record<string, (row: Record<string, unknown>, rowIndex: number) => ReactNode>;
	rowIndex?: number;
}

export type ComponentRenderer = (ctx: ComponentRenderContext) => ReactNode;

const registry: Record<string, ComponentRenderer> = {};

export function registerComponent(name: string, renderer: ComponentRenderer) {
	registry[name] = renderer;
}

export function getComponent(name: string): ComponentRenderer | undefined {
	return registry[name];
}

/* ===== 内置组件 ===== */

registerComponent("el-input", ({ value, onChange, props }) => {
	const { type, ...rest } = props as Record<string, unknown>;

	if (type === "textarea") {
		return <Input.TextArea value={value as string} onChange={(e) => onChange?.(e.target.value)} {...rest} />;
	}

	return <Input value={value as string} onChange={(e) => onChange?.(e.target.value)} {...rest} />;
});

registerComponent("el-input-number", ({ value, onChange, props }) => {
	return <InputNumber value={value as number} onChange={(v) => onChange?.(v)} {...props} />;
});

registerComponent("el-select", ({ value, onChange, props, options }) => {
	return (
		<Select
			value={value as unknown}
			onChange={(v) => onChange?.(v)}
			options={options}
			allowClear
			placeholder="请选择"
			{...props}
		/>
	);
});

registerComponent("cl-select", getComponent("el-select")!);

registerComponent("el-radio-group", ({ value, onChange, props, options }) => {
	return (
		<Radio.Group
			value={value as unknown}
			onChange={(e) => onChange?.(e.target.value)}
			options={options as never}
			{...props}
		/>
	);
});

registerComponent("el-switch", ({ value, onChange, props, row, prop, service, refresh }) => {
	const active = (props.activeValue as unknown) ?? 1;
	const inactive = (props.inactiveValue as unknown) ?? 0;

	return (
		<Switch
			checked={(value as unknown) === active}
			checkedChildren={props.activeText as string}
			unCheckedChildren={props.inactiveText as string}
			onChange={async (checked) => {
				const val = checked ? active : inactive;
				onChange?.(val);

				// 表格内联更新
				if (row && prop && service) {
					try {
						await service.update({ id: row.id, [prop]: val });
						refresh?.();
					} catch {
						// 失败由请求层提示
					}
				}
			}}
		/>
	);
});

registerComponent("cl-switch", getComponent("el-switch")!);

registerComponent("el-checkbox-group", ({ value, onChange, props, options }) => {
	return (
		<Checkbox.Group
			value={value as unknown[]}
			onChange={(v) => onChange?.(v)}
			options={options as never}
			{...props}
		/>
	);
});

registerComponent("el-date-picker", ({ value, onChange, props }) => {
	if (props.display) {
		return <>{value as ReactNode}</>;
	}
	return <DatePicker value={value as never} onChange={(v) => onChange?.(v)} {...props} />;
});

registerComponent("cl-date-picker", getComponent("el-date-picker")!);

registerComponent("el-tree-select", ({ value, onChange, props, options }) => {
	return (
		<TreeSelect
			value={value as never}
			onChange={(v) => onChange?.(v)}
			treeData={options as never}
			allowClear
			placeholder="请选择"
			{...props}
		/>
	);
});

registerComponent("cl-avatar", ({ value, props }) => {
	const size = (props.size as number) || 26;
	return <Avatar size={size} src={value as string} />;
});

registerComponent("cl-image", ({ value, props }) => {
	return <Image width={props.width as number} src={value as string} />;
});

registerComponent("cl-number", ({ value }) => {
	return <>{String(value ?? "")}</>;
});

registerComponent("cl-link", ({ value }) => {
	return <a>{value as ReactNode}</a>;
});

registerComponent("slot-value", ({ row, slots, prop, rowIndex }) => {
	const name = (prop === "slot" ? undefined : prop) as string;
	if (!row || !slots?.[name]) return null;
	return slots[name](row, rowIndex ?? 0);
});

registerComponent("cl-code-json", ({ value, props }) => {
	const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);

	if (props.popover) {
		return (
			<Popover
				trigger="click"
				content={
					<pre style={{ maxWidth: 500, maxHeight: 400, overflow: "auto", margin: 0, fontSize: 12 }}>{text}</pre>
				}
			>
				<span style={{ cursor: "pointer", color: "#1668dc" }}>查看</span>
			</Popover>
		);
	}

	return (
		<pre style={{ maxWidth: 300, maxHeight: 200, overflow: "auto", margin: 0, fontSize: 12 }}>{text}</pre>
	);
});

registerComponent("cl-upload", ({ value, onChange, props }) => {
	const isImage = props.type !== "file";
	const multiple = !!props.multiple;
	const url = "/admin/base/comm/upload";

	// 值：单文件为 url 字符串，多文件为数组
	const list = (Array.isArray(value) ? value : value ? [value] : []).map((u, i) => ({
		uid: String(i),
		name: String(u).split("/").pop() || "file",
		status: "done" as const,
		url: u as string
	}));

	return (
		<Upload
			action={url}
			name="file"
			listType={isImage ? "picture-card" : "text"}
			fileList={list}
			multiple={multiple}
			headers={{ Authorization: localStorage.getItem("token")?.replace(/^"|"$/g, "") || "" }}
			onChange={(info) => {
				const done = info.fileList.filter((f) => f.status === "done");
				if (!multiple) {
					onChange?.(done[0]?.response?.url ?? done[0]?.url ?? undefined);
				} else {
					onChange?.(done.map((f) => f.response?.url ?? f.url));
				}
			}}
		>
			{isImage ? (
				<div>
					<PlusOutlined />
					<div style={{ marginTop: 8 }}>上传</div>
				</div>
			) : (
				<button type="button" style={{ border: 0, background: "none", cursor: "pointer" }}>
					<UploadOutlined /> {(props.text as string) || "点击上传"}
				</button>
			)}
		</Upload>
	);
});

// 富文本编辑器（U1：正式选型待定，暂以 TextArea 占位）
registerComponent("cl-editor", ({ value, onChange }) => {
	return <Input.TextArea rows={12} value={value as string} onChange={(e) => onChange?.(e.target.value)} />;
});

registerComponent("cl-editor-wang", getComponent("cl-editor")!);
