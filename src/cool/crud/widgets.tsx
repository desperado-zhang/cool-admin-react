/**
 * 工具栏与辅助组件（对应 Vue 版 cl-crud 配套组件）
 * RefreshBtn / AddBtn / MultiDeleteBtn / SearchKey / Flex1 / CoolPagination
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Pagination, Select, Space } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useCoolCrudContext } from "./useCoolCrud";
import { usePermission } from "../hooks/usePermission";

/** 刷新按钮 */
export function RefreshBtn({ label }: { label?: string }) {
	const crud = useCoolCrudContext();
	const { t } = useTranslation();

	return (
		<Button icon={<ReloadOutlined />} onClick={() => crud.refresh()}>
			{label ?? t("common.refresh")}
		</Button>
	);
}

/** 新增按钮（权限：service.permission.add，对齐 Vue cl-add-btn） */
export function AddBtn({ label }: { label?: string }) {
	const crud = useCoolCrudContext();
	const { has } = usePermission();
	const { t } = useTranslation();

	if (!has((crud.service as unknown as { permission?: { add?: string } })?.permission?.add)) {
		return null;
	}

	return (
		<Button type="primary" icon={<PlusOutlined />} onClick={() => crud.rowAppend()}>
			{label ?? t("common.add")}
		</Button>
	);
}

/** 批量删除按钮（权限：service.permission.delete，对齐 Vue cl-multi-delete-btn） */
export function MultiDeleteBtn({ label }: { label?: string }) {
	const crud = useCoolCrudContext();
	const { has } = usePermission();
	const { t } = useTranslation();

	if (!has((crud.service as unknown as { permission?: { delete?: string } })?.permission?.delete)) {
		return null;
	}

	return (
		<Button
			danger
			icon={<DeleteOutlined />}
			disabled={!crud.selection.length}
			onClick={() => crud.rowDelete(crud.selection.map((e) => e.id as number))}
		>
			{label ?? t("common.delete")}
		</Button>
	);
}

/** 关键字搜索（对应 cl-search-key） */
export function SearchKey({
	placeholder,
	delay = 300
}: {
	placeholder?: string;
	delay?: number;
}) {
	const crud = useCoolCrudContext();
	const { t } = useTranslation();
	const [value, setValue] = useState("");

	const onChange = (v: string) => {
		setValue(v);
		clearTimeout((window as unknown as Record<string, number>).__coolSearchTimer);
		(window as unknown as Record<string, number>).__coolSearchTimer = window.setTimeout(() => {
			crud.refresh({ keyword: v || undefined });
		}, delay);
	};

	return (
		<Input
			allowClear
			style={{ width: 220 }}
			prefix={<SearchOutlined />}
			placeholder={placeholder ?? t("common.searchPlaceholder")}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onPressEnter={() => crud.refresh({ keyword: value || undefined })}
		/>
	);
}

/** 弹性占位 */
export function Flex1() {
	return <div style={{ flex: 1 }} />;
}

/** 工具栏筛选下拉（对应 Vue cl-select：选中即刷新 params[prop]） */
export function SearchSelect({
	prop,
	options,
	placeholder,
	width = 120
}: {
	prop: string;
	options: { label: string; value: unknown }[];
	placeholder?: string;
	width?: number;
}) {
	const crud = useCoolCrudContext();
	const { t } = useTranslation();

	return (
		<Select
			allowClear
			style={{ width }}
			placeholder={placeholder ?? t("common.searchPlaceholder")}
			options={options}
			value={(crud.params[prop] as never) ?? undefined}
			onChange={(v) => crud.refresh({ [prop]: v })}
		/>
	);
}

/** 分页（对应 cl-pagination） */
export function CoolPagination() {
	const crud = useCoolCrudContext();

	return (
		<Pagination
			current={crud.pagination.page}
			pageSize={crud.pagination.size}
			total={crud.pagination.total}
			showSizeChanger
			showTotal={(total) => `共 ${total} 条`}
			onChange={(page, size) => crud.onPageChange(page, size)}
		/>
	);
}

/** 工具栏行 */
export function Toolbar({ children }: { children: React.ReactNode }) {
	return (
		<div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
			<Space size={8}>{children}</Space>
		</div>
	);
}
