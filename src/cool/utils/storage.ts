/**
 * localStorage 封装（与 Vue 版 cool/utils/storage 行为一致）
 * - set(key, value, expires) expires 单位秒，过期时间存 `${key}_deadtime`
 * - isExpired 提前 2s 判定（Vue 版语义）
 */
const suffix = "_deadtime";

export const storage = {
	get<T = unknown>(key: string): T | undefined {
		try {
			const value = localStorage.getItem(key);
			return value ? (JSON.parse(value) as T) : undefined;
		} catch {
			return undefined;
		}
	},

	set(key: string, value: unknown, expires?: number) {
		localStorage.setItem(key, JSON.stringify(value));

		if (expires) {
			localStorage.setItem(`${key}${suffix}`, String(Date.now() + expires * 1000));
		}
	},

	remove(key: string) {
		localStorage.removeItem(key);
		localStorage.removeItem(`${key}${suffix}`);
	},

	isExpired(key: string) {
		const expiration = storage.getExpiration(key) || 0;
		return expiration - Date.now() <= 2000;
	},

	getExpiration(key: string) {
		const value = localStorage.getItem(`${key}${suffix}`);
		return value ? Number(value) : 0;
	},

	clearAll() {
		localStorage.clear();
	}
};
