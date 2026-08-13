/**
 * 后端契约类型
 * 契约来源：cool-admin-nest AGENTS.md 第 0/1/4 章
 */

/** 统一响应包装（0.1）：HTTP 恒 200，业务结果由 code 表达 */
export interface CoolResult<T = unknown> {
	code: number;
	message: string;
	data: T;
}

/** 业务错误码（0.1） */
export enum CoolCode {
	Success = 1000,
	BizFail = 1001,
	ParamFail = 1002,
	CoreFail = 1003
}

/** 分页入参（1.1） */
export interface PageParams {
	page: number;
	size: number;
	keyword?: string;
	order?: string;
	sort?: "asc" | "desc";
	[key: string]: unknown;
}

/** 分页返回（1.1） */
export interface PageResult<T> {
	list: T[];
	pagination: {
		page: number;
		size: number;
		total: number;
	};
}

/** 登录返回（3.1） */
export interface TokenResult {
	token: string;
	expire: number;
	refreshToken: string;
	refreshExpire: number;
}

/** 用户信息（5.1 base_sys_user，password 已脱敏） */
export interface UserInfo {
	id: number;
	createTime?: string;
	updateTime?: string;
	departmentId?: number | null;
	departmentName?: string;
	username: string;
	password?: string;
	passwordV?: number;
	name?: string;
	nickName?: string;
	headImg?: string;
	phone?: string;
	email?: string;
	remark?: string;
	status?: number;
	roleIdList?: number[];
	[key: string]: unknown;
}

/** 登录入参（3.1） */
export interface LoginDTO {
	username: string;
	password: string;
	captchaId: string;
	verifyCode: string;
}

/** 验证码返回（3.2） */
export interface CaptchaResult {
	captchaId: string;
	data: string;
}

/** 菜单节点（4.1）：permmenu.menus 为扁平数组，含 type=2 按钮节点 */
export interface MenuItem {
	id: number;
	parentId: number | null;
	name: string;
	router: string | null;
	perms: string | null;
	type: 0 | 1 | 2; // 0 目录 / 1 菜单 / 2 按钮
	icon: string | null;
	orderNum: number;
	viewPath: string | null;
	keepAlive: boolean;
	isShow: boolean;
}

/** permmenu 返回（4.1） */
export interface PermMenuResult {
	perms: string[];
	menus: MenuItem[];
}

/** 树形结构的通用字段（菜单/部门/字典等） */
export type TreeLike = {
	id: number;
	parentId: number | null;
	orderNum?: number;
};

/** 树节点（deepTree 组树后） */
export type TreeNode<T extends TreeLike> = T & { children?: TreeNode<T>[] };
