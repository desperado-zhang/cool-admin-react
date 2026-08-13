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
	/** keep-alive 缓存 key 列表（react-activation） */
	cacheKeys: string[];

	add: (data: ProcessItem) => void;
	close: () => void;
	remove: (index: number) => void;
	clear: () => void;
	setTitle: (title: string) => void;
}

/** 路径 → keep-alive key（对齐 Vue caches 命名） */
export function pathKey(path: string) {
	return path.substring(1).replace(/\//g, "-") || "home";
}

export const useProcessStore = create<ProcessState>()((set) => ({
	list: [],
	cacheKeys: [],

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

			// keep-alive：keepAlive 页签加入缓存列表
			const cacheKeys = [...state.cacheKeys];
			if (data.meta?.keepAlive) {
				const key = pathKey(data.path);
				if (!cacheKeys.includes(key)) cacheKeys.push(key);
			}

			return { list, cacheKeys };
		});
	},

	close() {
		set((state) => {
			const index = state.list.findIndex((e) => e.active);
			const list = [...state.list];
			if (index > -1) {
				const item = list.splice(index, 1)[0];
				return { list, cacheKeys: state.cacheKeys.filter((k) => k !== pathKey(item.path)) };
			}
			return {};
		});
	},

	remove(index) {
		set((state) => {
			const list = [...state.list];
			const item = list.splice(index, 1)[0];
			return item ? { list, cacheKeys: state.cacheKeys.filter((k) => k !== pathKey(item.path)) } : { list };
		});
	},

	clear() {
		set({ list: [], cacheKeys: [] });
	},

	setTitle(title) {
		set((state) => ({
			list: state.list.map((e) => (e.active && e.meta ? { ...e, meta: { ...e.meta, label: title } } : e))
		}));
	}
}));
