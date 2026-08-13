/**
 * 字典状态（对应 Vue 版 dict/store/dict.ts）
 * - 启动（hasToken）时 refresh 拉取全部字典
 * - get(key) 返回按 orderNum 排序的选项
 * - find(key, value) 返回 label
 */
import { create } from "zustand";
import { service } from "../service";
import type { DictOption } from "../crud/types";

interface DictState {
	data: Record<string, DictOption[]>;
	ready: boolean;

	get: (key: string) => DictOption[];
	find: (key: string, value: unknown) => string;
	refresh: (types?: string[]) => Promise<Record<string, DictOption[]>>;
}

type RawDictItem = Record<string, unknown>;

function normalize(items: RawDictItem[]): DictOption[] {
	return items
		.map((e) => ({
			...(e as unknown as DictOption),
			label: (e.name as string) || "",
			value: (e.value as unknown) === "" || e.value == null ? e.id : e.value
		}))
		.sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0));
}

export const useDictStore = create<DictState>()((set, get) => ({
	data: {},
	ready: false,

	get(key) {
		return get().data[key] || [];
	},

	find(key, value) {
		const item = get()
			.get(key)
			.find((e) => e.value === value);
		return item?.label || String(value ?? "");
	},

	async refresh(types) {
		const res = await service.dict.info.data({
			types: types?.filter((e) => e)
		});

		const data: Record<string, DictOption[]> = {};
		for (const [key, arr] of Object.entries(res || {})) {
			data[key] = normalize(arr as Record<string, unknown>[]);
		}

		set({ data: { ...get().data, ...data }, ready: true });
		return data;
	}
}));
