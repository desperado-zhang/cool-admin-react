/**
 * 菜单状态（menus 扁平数组 → 组树 / 权限码 / 动态路由）
 * 契约来源：cool-admin-nest AGENTS.md 4.1
 * 行为对齐 Vue 版 base/store/menu.ts：
 * - permmenu.menus 为扁平数组，deepTree 自行组树
 * - filter(type==1) 生成路由；若后端返回树形则子菜单 404
 * - 首个 type=1 菜单为首页（isHome），'/' 重定向到它
 */
import { create } from "zustand";
import { service } from "../service";
import { deepTree } from "../utils/tree";
import { resolveViewElement } from "../router/view-loader";
import type { MenuItem, PermMenuResult } from "../types";
import type { RouteObject } from "react-router-dom";

export interface FormattedMenu extends MenuItem {
	/** 格式化后的路由地址（revisePath：无 / 前缀自动补） */
	path: string;
	name: string;
	meta: {
		label: string;
		keepAlive: boolean;
		isHome?: boolean;
		iframeUrl?: string;
	};
	children?: FormattedMenu[];
}

interface MenuState {
	/** permmenu 原始扁平数组 */
	all: MenuItem[];
	/** 组树（isShow 过滤在渲染层做） */
	group: FormattedMenu[];
	/** 扁平权限码数组 */
	perms: string[];
	/** type==1 生成的动态路由 */
	routes: RouteObject[];
	/** 是否完成加载 */
	ready: boolean;

	get: () => Promise<FormattedMenu[]>;
	clear: () => void;
	/** 取树中第一个 type=1 的路径（首页） */
	getPath: (data: FormattedMenu[] | FormattedMenu) => string;
}

/** 路径补 / 前缀（对齐 Vue revisePath） */
function revisePath(path: string) {
	if (!path) return "";
	return path.startsWith("/") ? path : `/${path}`;
}

/** 菜单格式化（对齐 Vue menu.get 的 next()） */
function format(e: MenuItem): FormattedMenu {
	const path = revisePath(e.router || String(e.id));
	const isShow = e.isShow === undefined ? true : e.isShow;

	return {
		...e,
		path,
		isShow,
		name: `${e.name}-${e.id}`,
		meta: {
			label: e.name,
			keepAlive: e.keepAlive || false,
			iframeUrl: e.viewPath?.startsWith("http") ? e.viewPath : undefined
		}
	};
}

/** 取树中第一个 type=1 的路径（对齐 Vue getPath） */
function getPath(data: FormattedMenu[] | FormattedMenu): string {
	const list = Array.isArray(data) ? data : [data];
	let path = "";

	const deep = (arr: FormattedMenu[]) => {
		for (const e of arr) {
			if (e.type === 0) {
				deep(e.children || []);
			} else if (e.type === 1) {
				if (!path) path = e.path;
			}
		}
	};

	deep(list);
	return path;
}

/** 生成动态路由（对齐 Vue setRoutes：首页路径从组树取，路由从扁平列表 filter type==1） */
function buildRoutes(list: FormattedMenu[], fp: string): RouteObject[] {
	// 标记首页
	const home = list.find((e) => (e.meta.isHome = e.path === fp));

	// filter(type==1) 生成路由
	return list
		.filter((e) => e.type === 1)
		.map((e) => {
			const viewPath = e.viewPath;
			const base: RouteObject = {
				path: e.path,
				handle: { menu: e, isHome: !!home && home.path === e.path }
			};

			if (viewPath) {
				base.element = resolveViewElement(viewPath);
			} else {
				base.element = resolveViewElement(null);
			}

			return base;
		});
}

export const useMenuStore = create<MenuState>()((set) => ({
	all: [],
	group: [],
	perms: [],
	routes: [],
	ready: false,

	async get() {
		const res: PermMenuResult = await service.base.comm.permmenu();

		// 过滤 type==2 按钮并格式化（与 Vue 一致）
		const list: FormattedMenu[] = (res.menus || [])
			.filter((e) => e.type !== 2)
			.map(format);

		// 组树 + 首页路径（从树取，与 Vue setRoutes 一致）
		const groupTree = deepTree(list) as FormattedMenu[];
		const fp = getPath(groupTree);

		set({
			all: res.menus || [],
			perms: res.perms || [],
			group: groupTree,
			routes: buildRoutes(list, fp),
			ready: true
		});

		return list;
	},

	clear() {
		set({ all: [], group: [], perms: [], routes: [], ready: false });
	},

	getPath
}));
