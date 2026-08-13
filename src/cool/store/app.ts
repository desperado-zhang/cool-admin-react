/**
 * 应用状态（折叠/全屏）
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

	fold: (v?: boolean) => void;
	setFull: (state: boolean) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
	name: "COOL-ADMIN",
	isFold: false,
	isFull: false,

	fold(v) {
		set({ isFold: v === undefined ? !get().isFold : v });
	},

	setFull(state) {
		set({ isFull: state });
	}
}));
