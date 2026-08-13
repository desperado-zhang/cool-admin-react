/**
 * 页签状态（顶栏下方多页签导航）
 * 对齐 Vue 版 base/store/process.ts（简化：暂不支持右键菜单）
 */
import { create } from "zustand";

export interface ProcessItem {
	path: string;
	name?: string;
	meta?: {
		label?: string;
		keepAlive?: boolean;
		isHome?: boolean;
		/** 不进页签（process === false） */
		process?: boolean;
	};
	active?: boolean;
}

interface ProcessState {
	list: ProcessItem[];

	add: (data: ProcessItem) => void;
	close: () => void;
	remove: (index: number) => void;
	clear: () => void;
	setTitle: (title: string) => void;
}

export const useProcessStore = create<ProcessState>()((set) => ({
	list: [],

	add(data) {
		set((state) => {
			// 首页与 process === false 的路由不进页签
			if (data.meta?.isHome || data.meta?.process === false) {
				return {};
			}

			const list = state.list.map((e) => ({ ...e, active: false }));
			const index = list.findIndex((e) => e.path === data.path);

			if (index < 0) {
				list.push({ ...data, active: true });
			} else {
				list[index] = { ...data, active: true };
			}

			return { list };
		});
	},

	close() {
		set((state) => {
			const index = state.list.findIndex((e) => e.active);
			const list = [...state.list];
			if (index > -1) list.splice(index, 1);
			return { list };
		});
	},

	remove(index) {
		set((state) => {
			const list = [...state.list];
			list.splice(index, 1);
			return { list };
		});
	},

	clear() {
		set({ list: [] });
	},

	setTitle(title) {
		set((state) => ({
			list: state.list.map((e) => (e.active && e.meta ? { ...e, meta: { ...e.meta, label: title } } : e))
		}));
	}
}));
