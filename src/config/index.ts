/**
 * 全局配置
 * 契约来源：cool-admin-nest AGENTS.md 第 0 章
 * - 开发环境经 vite proxy 转发至 admin-api（默认 http://localhost:8001）
 * - 生产环境同源部署（nginx 反代）
 */
export const config = {
	/** API 基础路径（与 Vue 版一致：相对路径 + vite/nginx 代理） */
	baseURL: "/",
	/** 登录路由 */
	loginPath: "/login",
	/** token 存取 key（与 Vue 版 localStorage 语义一致） */
	tokenKey: "cool-token",
	refreshTokenKey: "cool-refresh-token"
};
