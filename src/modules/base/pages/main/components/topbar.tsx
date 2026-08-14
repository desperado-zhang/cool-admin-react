/**
 * 顶栏（对应 Vue 版 main/components/topbar.vue）
 * - 折叠开关 + 面包屑 + 语言切换 + 暗色主题 + 用户下拉（个人中心 / 退出登录）
 */
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { App, Avatar, Breadcrumb, Dropdown } from "antd";
import { GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAppStore } from "@/cool/store/app";
import { useUserStore } from "@/cool/store/user";
import { useMenuStore, type FormattedMenu } from "@/cool/store/menu";
import { languages, useI18nStore, type Locale } from "@/locales";
import { service } from "@/cool/service";

export default function Topbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { modal } = App.useApp();
	const { t } = useTranslation();

	const isFold = useAppStore((s) => s.isFold);
	const fold = useAppStore((s) => s.fold);
	const dark = useAppStore((s) => s.dark);
	const setDark = useAppStore((s) => s.setDark);
	const locale = useI18nStore((s) => s.locale);
	const setLocale = useI18nStore((s) => s.setLocale);
	const userInfo = useUserStore((s) => s.userInfo);
	const group = useMenuStore((s) => s.group);

	// 面包屑：当前路径的树链（对齐 Vue route-nav）
	const breadcrumb = useMemo(() => {
		const path = location.pathname;

		const deep = (item: FormattedMenu): FormattedMenu[] | false => {
			if (path === "/") return false;
			if (item.path === path) return [item];
			if (item.children?.length) {
				for (const child of item.children) {
					const ret = deep(child);
					if (ret) return [item, ...ret];
				}
			}
			return false;
		};

		for (const item of group) {
			const ret = deep(item);
			if (ret) return ret;
		}

		return path === "/my/info" ? [{ name: "个人中心", meta: { label: "个人中心" } } as FormattedMenu] : [];
	}, [location.pathname, group]);

	// 退出登录
	const onExit = () => {
		modal.confirm({
			title: t("common.tip"),
			content: t("layout.logoutConfirm"),
			okType: "danger",
			onOk: async () => {
				await service.base.comm.logout();
				useUserStore.getState().logout();
			}
		});
	};

	return (
		<div className="app-topbar">
			<div className="app-topbar__fold" onClick={() => fold()}>
				{isFold ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			</div>

			<Breadcrumb
				className="app-topbar__nav"
				items={breadcrumb.map((e) => ({ title: <span>{e.meta.label}</span> }))}
			/>

			<div className="app-topbar__flex" />

			{/* AI 极速编码（对齐官方 demo 顶栏） */}
			<div className="app-topbar__ai" onClick={() => navigate("/helper/ai-code")}>
				<div className="app-topbar__ai-t1">AI极速编码</div>
				<div className="app-topbar__ai-t2">Start</div>
			</div>

			{/* 语言切换（对齐 Vue config.i18n.languages） */}
			<Dropdown
				menu={{
					items: languages.map((l) => ({
						key: l.value,
						label: l.label,
						disabled: locale === l.value,
						onClick: () => setLocale(l.value as Locale)
					}))
				}}
			>
				<div className="app-topbar__tool" title="Language">
					<GlobalOutlined />
				</div>
			</Dropdown>

			{/* 暗色主题 */}
			<div className="app-topbar__tool" title="Theme" onClick={() => setDark()}>
				{dark ? <SunOutlined /> : <MoonOutlined />}
			</div>

			{userInfo ? (
				<Dropdown
					menu={{
						items: [
							{
								key: "my",
								label: t("layout.personalCenter"),
								onClick: () => navigate("/my/info")
							},
							{
								key: "exit",
								danger: true,
								label: t("layout.logout"),
								onClick: onExit
							}
						]
					}}
				>
					<div className="app-topbar__user">
						<span>{userInfo.nickName || userInfo.name || userInfo.username}</span>
						<Avatar size={26} src={userInfo.headImg} />
					</div>
				</Dropdown>
			) : null}
		</div>
	);
}
