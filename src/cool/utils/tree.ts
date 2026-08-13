/**
 * 菜单树工具
 * 契约来源：cool-admin-nest AGENTS.md 4.1
 * permmenu.menus 为扁平数组，前端自行 deepTree 组树（与 Vue 版 store/menu.ts setGroup 行为一致）
 */

import type { TreeNode, TreeLike } from "../types";

/**
 * 扁平数组 → 树（按 parentId 组装，保持 orderNum 排序）
 */
export function deepTree<T extends TreeLike>(list: T[]): TreeNode<T>[] {
	const nodes = [...list].sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0)) as TreeNode<T>[];
	const map = new Map<number, TreeNode<T>>();

	for (const node of nodes) {
		node.children = [];
		map.set(node.id, node);
	}

	const roots: TreeNode<T>[] = [];
	for (const node of nodes) {
		const parent = node.parentId != null ? map.get(node.parentId) : undefined;
		if (parent) {
			parent.children!.push(node);
		} else {
			roots.push(node);
		}
	}

	const clean = (items: TreeNode<T>[]) => {
		for (const item of items) {
			if (item.children?.length) clean(item.children);
			else delete item.children;
		}
	};
	clean(roots);

	return roots;
}

/**
 * 树 → 扁平数组
 */
export function flatTree<T extends TreeLike>(tree: TreeNode<T>[]): T[] {
	const result: T[] = [];
	const walk = (items: TreeNode<T>[]) => {
		for (const item of items) {
			const { children, ...node } = item;
			result.push(node as T);
			if (children?.length) walk(children);
		}
	};
	walk(tree);
	return result;
}

/**
 * 在扁平菜单数组中过滤出 type=1 的菜单（用于生成路由，契约 4.1）
 */
export function filterRouterMenus<T extends TreeLike & { type: number }>(list: T[]) {
	return list.filter((m) => m.type === 1);
}
