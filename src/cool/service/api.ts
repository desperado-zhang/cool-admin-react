/**
 * API 服务层（结构对齐 Vue 版 EPS 生成的 service 树）
 * 当前为手写版：base.open / base.comm（W1 登录链路所需）。
 * T1.5 EPS vite 插件落地后，其余模块（base.sys.* / dict.* / task.* 等）由 EPS 全量生成。
 */
import { get, post } from "./request";
import type { CaptchaResult, LoginDTO, PermMenuResult, TokenResult, UserInfo } from "../types";

export const service = {
	base: {
		open: {
			/** 登录（3.1） */
			login: (data: LoginDTO) => post<TokenResult>("/admin/base/open/login", data),
			/** 验证码（3.2） */
			captcha: (params: Record<string, unknown>) => get<CaptchaResult>("/admin/base/open/captcha", params),
			/** 刷新 token（3.3） */
			refreshToken: (params: { refreshToken: string }) => get<TokenResult>("/admin/base/open/refreshToken", params),
			/** EPS 接口描述（3.4） */
			eps: () => get<unknown>("/admin/base/open/eps"),
			/** 富文本参数（3.5，不包装直出 HTML） */
			html: (params: Record<string, unknown>) => get<string>("/admin/base/open/html", params)
		},
		comm: {
			/** 当前登录人（4） */
			person: () => get<UserInfo>("/admin/base/comm/person"),
			/** 修改个人信息（4） */
			personUpdate: (data: Record<string, unknown>) => post("/admin/base/comm/personUpdate", data),
			/** 权限与菜单（4.1，扁平数组） */
			permmenu: () => get<PermMenuResult>("/admin/base/comm/permmenu"),
			/** 退出（4） */
			logout: () => post("/admin/base/comm/logout"),
			/** 上传模式（4） */
			uploadMode: () => get<unknown>("/admin/base/comm/uploadMode"),
			/** 文件上传（4.2，multipart 字段 file） */
			upload: (data: FormData) => post<{ url: string }>("/admin/base/comm/upload", data)
		}
	}
};
