/**
 * 按钮级权限（对应 Vue 版 v-permission 指令）
 * 契约来源：cool-admin-nest AGENTS.md 4.1 / 官方 authority.ts
 * - 超管（username === 'admin'）恒放行
 * - 无权限码要求的操作恒放行
 */
import { useUserStore } from "../store/user";
import { useMenuStore } from "../store/menu";

export function usePermission() {
	const userInfo = useUserStore((s) => s.userInfo);
	const perms = useMenuStore((s) => s.perms);

	const has = (perm?: string) => {
		if (userInfo?.username === "admin") return true;
		if (!perm) return true;
		return perms.includes(perm);
	};

	return { has, perms };
}
