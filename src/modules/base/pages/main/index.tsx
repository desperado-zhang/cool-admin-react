/**
 * 主布局（对应 Vue 版 base/pages/main/index.vue + 路由守卫）
 * - 未登录 → 跳登录页
 * - 左侧 slider + 右侧（topbar + 页签 + 视图）
 */
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { KeepAlive } from "react-activation";
import { useUserStore } from "@/cool/store/user";
import { useAppStore } from "@/cool/store/app";
import { useMenuStore } from "@/cool/store/menu";
import { useProcessStore } from "@/cool/store/process";
import { flatTree } from "@/cool/utils/tree";
import Slider from "./components/slider";
import Topbar from "./components/topbar";
import Process from "./components/process";
import "./layout.scss";

export default function Layout() {
	const token = useUserStore((s) => s.token);

	// 路由守卫（对齐 Vue 版 beforeEach）
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return <AppLayout />;
}

function AppLayout() {
	const location = useLocation();
	const isFold = useAppStore((s) => s.isFold);
	const isFull = useAppStore((s) => s.isFull);
	const group = useMenuStore((s) => s.group);

	// 路径 key（对齐 Vue keep-alive caches 命名：path 去 / 后 / → -）
	const pathKey = location.pathname.substring(1).replace(/\//g, "-") || "home";

	// 路由变化 → 添加页签（对齐 Vue 守卫 process.add）
	useEffect(() => {
		const path = location.pathname;
		const list = flatTree(group);
		const item = list.find((e) => e.path === path);

		useProcessStore.getState().add({
			path,
			meta: {
				label: item?.meta.label || (path === "/my/info" ? "个人中心" : path),
				keepAlive: item?.meta.keepAlive,
				isHome: !!item?.meta.isHome
			}
		});
	}, [location.pathname, group]);

	// keep-alive 缓存列表（仅 keepAlive 页签；关闭页签时 drop）
	const cacheKeys = useProcessStore((s) => s.cacheKeys);

	return (
		<div className={`app-layout ${isFold ? "is-collapse" : ""} ${isFull ? "is-full" : ""}`}>
			<div className="app-layout__mask" onClick={() => useAppStore.getState().fold(true)} />

			<div className="app-layout__left">
				<Slider />
			</div>

			<div className="app-layout__right">
				<Topbar />
				<Process />
				<KeepAlive key={pathKey} name={pathKey} cacheList={cacheKeys}>
					<div className="app-layout__views">
						<Outlet />
					</div>
				</KeepAlive>
			</div>
		</div>
	);
}
