/**
 * 路由表构建（静态 + 动态）
 * 对齐 Vue 版：'/' 为布局（index），动态子路由由 permmenu 生成（type==1）
 * - /login、/401、/403、/404、/500、/502 为顶级页面（不进布局）
 * - /my/info 为布局内固定视图（个人中心）
 * - '/' 重定向到第一个 type=1 菜单（首页）
 */
import { Navigate, type RouteObject } from "react-router-dom";
import { useMenuStore } from "../store/menu";
import Layout from "@/modules/base/pages/main";
import LoginPage from "@/modules/base/pages/login";
import ErrorPage from "@/modules/base/pages/error";
import { resolveViewElement } from "./view-loader";

export function buildRoutes(): RouteObject[] {
	const { routes: menuRoutes, group } = useMenuStore.getState();
	const homePath = useMenuStore.getState().getPath(group) || "/";
	const homeMenu = (group.flatMap((e) => [e, ...(e.children || [])]) as { path: string; viewPath?: string | null; meta?: { isHome?: boolean } }[]).find(
		(e) => e.meta?.isHome
	);

	// 首页：path 为 '/' 时直接在 index 渲染（否则 Navigate 自循环）
	const indexRoute: RouteObject =
		homePath === "/"
			? {
					index: true,
					element: resolveViewElement(homeMenu?.viewPath)
				}
			: {
					index: true,
					element: <Navigate to={homePath} replace />
				};

	return [
		{
			path: "/login",
			element: <LoginPage />
		},
		{
			path: "/",
			element: <Layout />,
			children: [
				indexRoute,
				{
					path: "my/info",
					handle: { label: "个人中心" },
					element: resolveViewElement("modules/base/views/info.tsx")
				},
				...menuRoutes
			]
		},
		{
			path: "/401",
			element: <ErrorPage code={401} />
		},
		{
			path: "/403",
			element: <ErrorPage code={403} />
		},
		{
			path: "/404",
			element: <ErrorPage code={404} />
		},
		{
			path: "/500",
			element: <ErrorPage code={500} />
		},
		{
			path: "/502",
			element: <ErrorPage code={502} />
		},
		{
			path: "*",
			element: <ErrorPage code={404} />
		}
	];
}
