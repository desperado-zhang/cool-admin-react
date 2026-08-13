/**
 * 菜单图标映射（U2：icon 字符串 → AntD 图标）
 * 官方菜单 seed 的 icon 命名（icon-xxx）映射到 @ant-design/icons
 */
import {
	AppstoreOutlined,
	ApartmentOutlined,
	BlockOutlined,
	BookOutlined,
	CheckSquareOutlined,
	DatabaseOutlined,
	DeleteOutlined,
	DesktopOutlined,
	FileTextOutlined,
	FundOutlined,
	MenuOutlined,
	SafetyOutlined,
	ScheduleOutlined,
	SettingOutlined,
	ShoppingOutlined,
	SlidersOutlined,
	StarOutlined,
	ThunderboltOutlined,
	UserOutlined
} from "@ant-design/icons";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType> = {
	"icon-user": UserOutlined,
	"icon-set": SettingOutlined,
	"icon-data": DatabaseOutlined,
	"icon-extend": AppstoreOutlined,
	"icon-task": ScheduleOutlined,
	"icon-dict": BookOutlined,
	"icon-log": FileTextOutlined,
	"icon-menu": MenuOutlined,
	"icon-dept": ApartmentOutlined,
	"icon-params": SlidersOutlined,
	"icon-monitor": FundOutlined,
	"icon-activity": ThunderboltOutlined,
	"icon-component": BlockOutlined,
	"icon-delete": DeleteOutlined,
	"icon-goods": ShoppingOutlined,
	"icon-favor": StarOutlined,
	"icon-radioboxfill": CheckSquareOutlined,
	"icon-auth": SafetyOutlined,
	"icon-home": DesktopOutlined
};

export function menuIcon(name?: string | null): ComponentType | undefined {
	if (!name) return undefined;
	return iconMap[name] || AppstoreOutlined;
}
