/**
 * 独立表单弹窗（对应 Vue 版 useForm：脱离 CRUD 的临时表单）
 * 用法：const { open, holder } = useFormDialog(); open({ title, width, items, form, onSubmit })
 * onSubmit(data, { done, close })：done 结束提交 loading，close 关闭
 */
import { useState } from "react";
import { Form, Modal } from "antd";
import CoolForm from "./CoolForm";
import type { FormItem } from "./types";

export interface FormDialogConfig {
	title?: string;
	width?: string | number;
	items: FormItem[];
	form?: Record<string, unknown>;
	labelWidth?: string | number;
	onSubmit: (data: Record<string, unknown>, ctx: { done: () => void; close: () => void }) => void | Promise<void>;
}

export function useFormDialog() {
	const [state, setState] = useState<{ open: boolean; config: FormDialogConfig | null }>({ open: false, config: null });
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const open = (config: FormDialogConfig) => {
		form.resetFields();
		if (config.form) {
			form.setFieldsValue(config.form);
		}
		setState({ open: true, config });
	};

	const close = () => {
		setState((s) => ({ ...s, open: false }));
	};

	const onOk = async () => {
		const config = state.config;
		if (!config) return;

		let data: Record<string, unknown>;
		try {
			data = await form.validateFields();
		} catch {
			return;
		}

		setLoading(true);
		try {
			await config.onSubmit(data, {
				done: () => setLoading(false),
				close
			});
		} finally {
			setLoading(false);
		}
	};

	const holder = (
		<Modal
			open={state.open}
			title={state.config?.title}
			width={state.config?.width || 500}
			onOk={onOk}
			onCancel={close}
			confirmLoading={loading}
			destroyOnClose
		>
			{state.config ? (
				<CoolForm form={form} items={state.config.items} mode="add" />
			) : null}
		</Modal>
	);

	return { open, close, holder };
}
