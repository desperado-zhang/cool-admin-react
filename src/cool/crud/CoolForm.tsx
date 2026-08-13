/**
 * 配置式表单（对应 Vue 版 cl-form）
 * - items 配置对齐 Vue（prop/label/span/required/rules/value/component/dict）
 * - item 可为函数：按 mode 动态生成（如密码项仅新增必填）
 * - 组件渲染走 registry；options 优先级：item.component.options → 页面动态 options → 字典
 */
import { Form, Row, Col } from "antd";
import type { FormInstance } from "antd";
import { getComponent } from "./registry";
import { useDictStore } from "../store/dict";
import type { DictOption, FormItem } from "./types";

interface CoolFormProps {
	form: FormInstance;
	items: FormItem[];
	mode: "add" | "edit";
	/** 页面动态设置的选项（对应 Vue setOptions） */
	options?: Record<string, DictOption[]>;
}

/** 表单项的隐藏条件（对应 Vue item.hidden({ scope })） */
export type ItemHidden = (scope: Record<string, unknown>) => boolean;

function FieldRenderer({
	value,
	onChange,
	cfg,
	options
}: {
	value?: unknown;
	onChange?: (value: unknown) => void;
	cfg: { name: string; props?: Record<string, unknown>; options?: DictOption[] };
	options?: DictOption[];
}) {
	const renderer = getComponent(cfg.name);

	if (!renderer) {
		console.warn(`[cool-form] 组件未注册：${cfg.name}`);
		return null;
	}

	return renderer({
		value,
		onChange,
		props: cfg.props || {},
		options: cfg.options || options
	});
}

export default function CoolForm({ form, items, mode, options }: CoolFormProps) {
	const dictStore = useDictStore();

	// 全表单值监听（item.hidden({ scope }) 联动）
	const values = (Form.useWatch([], form) || {}) as Record<string, unknown>;

	return (
		<Form form={form} labelCol={{ flex: "110px" }}>
			<Row gutter={16}>
				{items.map((item, index) => {
					const cfg = typeof item === "function" ? item({ mode }) : item;
					if (!cfg) return null;

					// hidden({ scope })
					if (typeof cfg.hidden === "function" && cfg.hidden(values)) return null;
					if (cfg.hidden === true) return null;

					const componentCfg = typeof cfg.component === "function" ? cfg.component() : cfg.component;
					const component = componentCfg || { name: "el-input" };

					// 选项：component.options → 页面动态 → 字典
					let opts: DictOption[] | undefined;
					if (component.options) {
						opts = component.options as DictOption[];
					} else if (cfg.prop && options?.[cfg.prop]) {
						opts = options[cfg.prop];
					} else if (typeof cfg.dict === "string") {
						opts = dictStore.get(cfg.dict);
					} else if (Array.isArray(cfg.dict)) {
						opts = cfg.dict;
					}

					const rules = [...(cfg.rules || [])];
					if (cfg.required) {
						rules.unshift({ required: true, message: `${cfg.label || "该项"}不能为空` });
					}

					return (
						<Col span={cfg.span || 24} key={cfg.prop || index}>
							<Form.Item name={cfg.prop} label={cfg.label} rules={rules} initialValue={cfg.value}>
								<FieldRenderer cfg={component} options={opts} />
							</Form.Item>
						</Col>
					);
				})}
			</Row>
		</Form>
	);
}
