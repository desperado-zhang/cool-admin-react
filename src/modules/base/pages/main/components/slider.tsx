/**
 * 左侧菜单栏（对应 Vue 版 main/components/slider.vue + bmenu.tsx）
 * - 菜单树来自 permmenu 组树（扁平数组契约）
 * - 支持关键字过滤 / 折叠
 */
import { createElement, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAppStore } from "@/cool/store/app";
import { useMenuStore, type FormattedMenu } from "@/cool/store/menu";
import { menuIcon } from "@/cool/components/icon";
import type { MenuProps } from "antd";

export default function Slider() {
	const navigate = useNavigate();
	const location = useLocation();

	const isFold = useAppStore((s) => s.isFold);
	const name = useAppStore((s) => s.name);
	const group = useMenuStore((s) => s.group);
	const homePath = useMenuStore((s) => s.getPath(s.group));
	const [keyWord, setKeyWord] = useState("");

	// 选中项：首页映射到 '/'（与 Vue bmenu 一致）
	const selectedKeys = useMemo(() => {
		const path = location.pathname;
		if (path === "/" || path === homePath) return ["/"];
		return [path];
	}, [location.pathname, homePath]);

	// 菜单树 → AntD Menu items（过滤逻辑对齐 Vue bmenu filterMenu）
	const items = useMemo(() => {
		const kw = keyWord.toLowerCase();

		const deep = (list: FormattedMenu[], show: boolean): MenuProps["items"] => {
			let s = show;

			const filterMenu = (item: FormattedMenu): boolean => {
				if (!item.isShow) return false;
				if (s) return true;
				if (item.meta.label.toLowerCase().includes(kw)) return true;
				if (item.children?.length) return item.children.some(filterMenu);
				return false;
			};

			return list.filter(filterMenu).map((e) => {
				if (e.meta.label.toLowerCase().includes(kw)) {
					s = true;
				}

				const icon = menuIcon(e.icon);
				const iconEl = icon ? createElement(icon) : undefined;

				if (e.type === 0) {
					return {
						key: String(e.id),
						icon: iconEl,
						label: e.meta.label,
						children: deep(e.children || [], s)
					};
				}

				return {
					key: e.meta.isHome ? "/" : e.path,
					icon: iconEl,
					label: e.meta.label
				};
			});
		};

		return deep(group, false);
	}, [group, keyWord]);

	// 点击菜单
	const onSelect: MenuProps["onClick"] = ({ key }) => {
		if (key !== location.pathname) {
			navigate(key);
		}
	};

	return (
		<div className={`app-slider ${isFold ? "is-collapse" : ""}`}>
			<div className="app-slider__logo">
				<img src="/logo.png" alt="Logo" />
				{!isFold ? <span>{name}</span> : null}
			</div>

			<div className="app-slider__search">
				<Input
					value={keyWord}
					placeholder="搜索关键字"
					allowClear
					prefix={<SearchOutlined style={{ color: "#e5eaf3" }} />}
					onChange={(e) => setKeyWord(e.target.value)}
				/>
			</div>

			<div className="app-slider__container">
				<div className="app-slider__menu">
					<Menu
						mode="inline"
						theme="dark"
						inlineCollapsed={isFold}
						items={items}
						selectedKeys={selectedKeys}
						onClick={onSelect}
					/>
				</div>
			</div>
		</div>
	);
}
