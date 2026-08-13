/**
 * 应用状态（折叠/全屏/暗色主题）
 * 对齐 Vue 版 base/store/app.ts
 */
import { create } from "zustand";

interface AppState {
	/** 应用名（对应 VITE_NAME） */
	name: string;
	/** 侧边栏是否折叠 */
	isFold: boolean;
	/** 是否全屏（隐藏侧边栏与顶栏） */
	isFull: boolean;
	/** 暗色主题 */
	dark: boolean;

	fold: (v?: boolean) => void;
	setFull: (state: boolean) => void;
	setDark: (v?: boolean) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
	name: "COOL-ADMIN",
	isFold: false,
	isFull: false,
	dark: false,

	fold(v) {
		set({ isFold: v === undefined ? !get().isFold : v });
	},

	setFull(state) {
		set({ isFull: state });
	},

	setDark(v) {
		set({ dark: v === undefined ? !get().dark : v });
	}
}));
