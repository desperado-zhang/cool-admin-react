/**
 * 用户状态（token / 用户信息）
 * 契约来源：cool-admin-nest AGENTS.md 3.1/4
 * 行为对齐 Vue 版 base/store/user.ts：
 * - setToken 按 expire 秒数写入 localStorage（token / refreshToken 分离）
 * - logout 清除缓存并跳登录页
 */
import { create } from "zustand";
import { storage } from "../utils/storage";
import { service } from "../service";
import type { TokenResult, UserInfo } from "../types";
import { useMenuStore } from "./menu";
import { useProcessStore } from "./process";

interface UserState {
	token: string;
	userInfo: UserInfo | null;

	setToken: (data: TokenResult) => void;
	set: (info: UserInfo) => void;
	clear: () => void;
	logout: () => Promise<void>;
	get: () => Promise<UserInfo>;
}

/** 初始 token（过期则不生效，与 Vue 版 storage 语义一致） */
const initToken = storage.isExpired("token") ? "" : (storage.get<string>("token") || "");
const initUserInfo = storage.get<UserInfo>("userInfo") || null;

export const useUserStore = create<UserState>()((set, get) => ({
	token: initToken,
	userInfo: initUserInfo,

	setToken(data) {
		storage.set("token", data.token, data.expire);
		storage.set("refreshToken", data.refreshToken, data.refreshExpire);
		set({ token: data.token });
	},

	set(info) {
		storage.set("userInfo", info);
		set({ userInfo: info });
	},

	clear() {
		storage.remove("userInfo");
		storage.remove("token");
		storage.remove("refreshToken");
		set({ token: "", userInfo: null });
		useMenuStore.getState().clear();
		useProcessStore.getState().clear();
	},

	async logout() {
		try {
			await service.base.comm.logout();
		} catch {
			// 服务端已失效也不阻塞本地清理
		}
		get().clear();
		window.location.href = "/login";
	},

	async get() {
		const info = await service.base.comm.person();
		get().set(info);
		return info;
	}
}));
