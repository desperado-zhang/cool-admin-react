import { useEffect, useMemo } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AliveScope } from "react-activation";
import { App as AntApp, ConfigProvider, Spin, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useUserStore } from "./cool/store/user";
import { useMenuStore } from "./cool/store/menu";
import { useAppStore } from "./cool/store/app";
import { useI18nStore } from "./locales";
import { buildRoutes } from "./cool/router/routes";
import "./index.css";

dayjs.locale("zh-cn");

export default function App() {
	const locale = useI18nStore((s) => s.locale);
	const dark = useAppStore((s) => s.dark);

	// 暗色主题
	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
		document.body.style.backgroundColor = dark ? "#141414" : "";
	}, [dark]);

	return (
		<ConfigProvider
			locale={locale === "zh-CN" ? zhCN : enUS}
			theme={{
				cssVar: true,
				algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorPrimary: "#1668dc"
				}
			}}
		>
			<AntApp>
				<BrowserRouter>
					<AliveScope>
						<AppRoot />
					</AliveScope>
				</BrowserRouter>
			</AntApp>
		</ConfigProvider>
	);
}

function AppRoot() {
	const token = useUserStore((s) => s.token);
	const ready = useMenuStore((s) => s.ready);

	// 启动引导（对齐 Vue base/config onLoad）：
	// 有 token → 拉取用户信息 + 菜单权限（permmenu）
	useEffect(() => {
		if (!token || useMenuStore.getState().ready) return;

		Promise.all([useUserStore.getState().get(), useMenuStore.getState().get()]).catch(() => {
			// 401 由请求层统一处理（续期/跳登录）
		});
	}, [token]);

	const routes = useMemo(() => buildRoutes(), [ready, token]);

	// useRoutes 必须无条件调用（hooks 顺序固定）
	const element = useRoutes(routes);

	// 首次加载中
	if (token && !ready) {
		return (
			<div
				style={{
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#fff"
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return element;
}
