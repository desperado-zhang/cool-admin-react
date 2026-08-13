/**
 * 新增/编辑弹窗（对应 Vue 版 cl-upsert）
 * - 编辑默认拉取 info 合并表单（对齐 Vue getInfo；可用 onInfo 覆盖）
 * - onSubmit(data, { next })：页面可在提交前改写数据
 * - submit 成功 → 关闭 + 刷新列表
 */
import { useEffect, useState } from "react";
import { App, Form, Modal } from "antd";
import { useCoolCrudContext } from "./useCoolCrud";
import CoolForm from "./CoolForm";
import type { DictOption, FormItem } from "./types";

interface CoolDialogProps {
	dialog?: {
		width?: string | number;
		title?: string;
	};
	items: FormItem[];
	/** 页面动态选项（对应 Vue Upsert.setOptions） */
	options?: Record<string, DictOption[]>;
	/** 编辑时默认 service.info 拉取；false 则直接用行数据 */
	info?: boolean;
	onSubmit?: (data: Record<string, unknown>, ctx: { next: (data: Record<string, unknown>) => void }) => void;
	onOpen?: () => void;
	/** 表单绑定前转换数据（对应 Vue onOpened） */
	onOpened?: (data: Record<string, unknown>) => void;
	/** 表单插槽（slot-xxx 组件渲染） */
	slots?: Record<string, (ctx: { value?: unknown; onChange?: (v: unknown) => void }) => React.ReactNode>;
	onInfo?: (
		data: Record<string, unknown>,
		ctx: {
			close: () => void;
			next: () => Promise<void>;
			done: (data?: Record<string, unknown>) => void;
		}
	) => void;
}

export default function CoolDialog({ dialog, items, options, info = true, onSubmit, onOpen, onOpened, slots, onInfo }: CoolDialogProps) {
	const crud = useCoolCrudContext();
	const { message } = App.useApp();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const { open, mode, form: data } = crud.upsert;

	// 打开时绑定数据（编辑默认拉 info，对齐 Vue getInfo）
	useEffect(() => {
		if (!open) return;

		onOpen?.();

		const bind = (d?: Record<string, unknown>) => {
			if (!d) return;
			onOpened?.(d);
			form.setFieldsValue(d);
		};

		const next = async () => {
			try {
				const res: Record<string, unknown> = await crud.service.info({ id: data.id });
				bind({ ...res, ...data });
			} catch (err) {
				message.error((err as Error).message);
			}
		};

		if (mode === "edit" && info) {
			if (onInfo) {
				onInfo(data, { close: crud.close, next, done: bind });
			} else {
				next();
			}
		} else {
			bind(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// 提交
	const onOk = async () => {
		let values: Record<string, unknown> = {};

		try {
			values = await form.validateFields();
		} catch {
			return;
		}

		// 页面改写（如注入 departmentId）
		onSubmit?.(values, { next: (d) => (values = d) });

		setLoading(true);
		const ok = await crud.submit(values);
		setLoading(false);

		if (ok) {
			form.resetFields();
		}
	};

	return (
		<Modal
			open={open}
			title={dialog?.title || (mode === "add" ? "新增" : "编辑")}
			width={dialog?.width || 600}
			onOk={onOk}
			onCancel={crud.close}
			confirmLoading={loading}
			destroyOnClose
		>
			<CoolForm form={form} items={items} mode={mode} options={options} slots={slots} />
		</Modal>
	);
}
