import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { config } from "@/config";
import { CoolCode, type CoolResult } from "../types";
import { useUserStore } from "../store/user";

/**
 * 业务异常（对应后端 BizException）
 */
export class BizError extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.code = code;
	}
}

/**
 * 契约层 axios 实例
 * 契约来源：cool-admin-nest AGENTS.md 0.1 / 3.3 / 4.1
 * - HTTP 200 + code 1000 → 直接返回 data
 * - code 1001/1002/1003 → reject BizError（message 为后端文案）
 * - HTTP 401 → 尝试 refreshToken 单飞续期 → 重放原请求；失败则清 token 跳登录页
 * - HTTP 403 → 拒绝并提示无权限
 */

const request = axios.create({
	baseURL: config.baseURL,
	timeout: 30000
});

/** 裸实例（refreshToken 自调用，避免拦截器递归） */
const rawRequest = axios.create({
	baseURL: config.baseURL,
	timeout: 30000
});

request.interceptors.request.use((c) => {
	const { token } = useUserStore.getState();
	if (token) {
		c.headers.Authorization = token;
	}
	return c;
});

/** 401 单飞续期：多个并发请求共享同一次 refresh */
let refreshing: Promise<string> | null = null;

function toLogin() {
	useUserStore.getState().logout();
	if (window.location.pathname !== config.loginPath) {
		window.location.href = config.loginPath;
	}
}

async function refresh(): Promise<string> {
	const { refreshToken } = useUserStore.getState();
	if (!refreshToken) throw new BizError("登录失效~", CoolCode.BizFail);
	const res = await rawRequest.get<CoolResult<{ token: string; refreshToken: string }>>("/admin/base/open/refreshToken", {
		params: { refreshToken }
	});
	const body = res.data;
	if (body.code !== CoolCode.Success) throw new BizError(body.message, body.code);
	useUserStore.getState().setToken(body.data.token, body.data.refreshToken);
	return body.data.token;
}

request.interceptors.response.use(
	(response: AxiosResponse) => {
		// 统一响应包装：直接解开 data
		const body = response.data as CoolResult;
		if (body && typeof body === "object" && "code" in body) {
			if (body.code === CoolCode.Success) {
				return body.data as never;
			}
			return Promise.reject(new BizError(body.message || "请求失败~", body.code));
		}
		// 非包装响应（如 html 直出接口）原样返回
		return body as never;
	},
	async (error: AxiosError) => {
		const { response } = error;

		// HTTP 401：token 失效 → 尝试续期重放（契约 3.3）
		if (response?.status === 401 && error.config && !AxiosHeaders.from(error.config.headers).has("__isRetry")) {
			try {
				refreshing = refreshing || refresh();
				const token = await refreshing;
				refreshing = null;
				const headers = AxiosHeaders.from(error.config.headers);
				headers.set("Authorization", token);
				headers.set("__isRetry", "true");
				error.config.headers = headers;
				return request(error.config);
			} catch {
				refreshing = null;
				toLogin();
				return Promise.reject(new BizError("登录失效~", CoolCode.BizFail));
			}
		}

		// HTTP 403：无权限（契约：鉴权语义官方 authority.ts）
		if (response?.status === 403) {
			const body = response.data as CoolResult | undefined;
			return Promise.reject(new BizError(body?.message || "无权限访问~", body?.code || CoolCode.BizFail));
		}

		return Promise.reject(error);
	}
);

export function get<T = unknown>(url: string, params?: Record<string, unknown>, cfg?: AxiosRequestConfig): Promise<T> {
	return request.get(url, { params, ...cfg }) as Promise<T>;
}

export function post<T = unknown>(url: string, data?: unknown, cfg?: AxiosRequestConfig): Promise<T> {
	return request.post(url, data, cfg) as Promise<T>;
}

export default request;
