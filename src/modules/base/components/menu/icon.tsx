/**
 * 菜单图标选择（对应 Vue 版 base/components/menu/icon.vue）
 * 注册组件名：cl-menu-icon
 */
import { Select } from "antd";
import { registerComponent } from "@/cool/crud/registry";
import { menuIcon } from "@/cool/components/icon";

/** 图标名清单（icon.tsx 映射表的 key） */
const iconNames = [
	"icon-user",
	"icon-set",
	"icon-data",
	"icon-extend",
	"icon-task",
	"icon-dict",
	"icon-log",
	"icon-menu",
	"icon-dept",
	"icon-params",
	"icon-monitor",
	"icon-activity",
	"icon-component",
	"icon-delete",
	"icon-goods",
	"icon-favor",
	"icon-radioboxfill",
	"icon-auth",
	"icon-home"
];

function MenuIconSelect({
	value,
	onChange,
	props
}: {
	value?: unknown;
	onChange?: (value: unknown) => void;
	props: Record<string, unknown>;
}) {
	const showIcon = !!props.showIcon;

	return (
		<Select
			allowClear
			placeholder="请选择图标"
			value={value as string}
			onChange={(v) => onChange?.(v)}
			options={iconNames.map((name) => {
				const Icon = menuIcon(name) as React.ComponentType<{ style?: React.CSSProperties }> | undefined;
				return {
					value: name,
					label: (
						<span>
							{showIcon && Icon ? <Icon style={{ marginRight: 6 }} /> : null}
							{name}
						</span>
					)
				};
			})}
		/>
	);
}

registerComponent("cl-menu-icon", (ctx) => (
	<MenuIconSelect value={ctx.value} onChange={ctx.onChange} props={ctx.props} />
));

export default MenuIconSelect;
