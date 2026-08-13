import { create } from "zustand";
import { persist } from "zustand/middleware";
import { config } from "@/config";
import type { MenuItem } from "../types";

/**
 * 用户状态（token / 权限 / 菜单）
 * 契约来源：cool-admin-nest AGENTS.md 4.1
 * - menus：permmenu 返回的扁平数组（组树在组件层做）
 * - perms：扁平权限码数组（按钮级显隐依据）
 */
interface UserState {
	token: string;
	refreshToken: string;
	userInfo: Record<string, unknown> | null;
	menus: MenuItem[];
	perms: string[];

	setToken: (token: string, refreshToken?: string) => void;
	setPermMenu: (perms: string[], menus: MenuItem[]) => void;
	setUserInfo: (info: Record<string, unknown>) => void;
	logout: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			token: "",
			refreshToken: "",
			userInfo: null,
			menus: [],
			perms: [],

			setToken: (token, refreshToken) =>
				set((s) => ({
					token,
					refreshToken: refreshToken ?? s.refreshToken
				})),

			setPermMenu: (perms, menus) => set({ perms, menus }),

			setUserInfo: (userInfo) => set({ userInfo }),

			logout: () => set({ token: "", refreshToken: "", userInfo: null, menus: [], perms: [] })
		}),
		{
			name: config.tokenKey,
			partialize: (s) => ({
				token: s.token,
				refreshToken: s.refreshToken
			})
		}
	)
);

/**
 * 权限判断（对应 Vue 版 v-permission 指令）
 * - 超管（username === 'admin'）恒放行（契约：官方 authority.ts）
 */
export function usePermission() {
	const { perms, userInfo } = useUserStore();

	const has = (perm: string) => {
		if ((userInfo as { username?: string } | null)?.username === "admin") return true;
		if (!perm) return true;
		return perms.includes(perm);
	};

	return { has, perms };
}
