import { useEffect, useMemo } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { App as AntApp, ConfigProvider, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useUserStore } from "./cool/store/user";
import { useMenuStore } from "./cool/store/menu";
import { buildRoutes } from "./cool/router/routes";
import "./index.css";

dayjs.locale("zh-cn");

export default function App() {
	return (
		<ConfigProvider
			locale={zhCN}
			theme={{
				cssVar: true,
				token: {
					colorPrimary: "#1668dc"
				}
			}}
		>
			<AntApp>
				<BrowserRouter>
					<AppRoot />
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

	return useRoutes(routes);
}
