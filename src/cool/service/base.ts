/**
 * BaseService（对应 Vue 版 cool/service/base.ts）
 * - request 前缀拼接 namespace
 * - 通用 CRUD 快捷方法（list/page/info/update/delete/add）
 */
import request from "./request";
import type { AxiosRequestConfig } from "axios";

export class BaseService {
	namespace?: string;

	constructor(namespace?: string) {
		if (namespace) {
			this.namespace = namespace;
		}
	}

	// 发送请求（箭头函数绑定实例，方法被解构复制后 this 不丢失）
	request = (options: AxiosRequestConfig = {}) => {
		let url = options.url;

		if (url && url.indexOf("http") < 0) {
			if (this.namespace) {
				url = this.namespace + url;
			}
		}

		return request({
			...options,
			url
		});
	};

	// 获取列表
	list = (data?: unknown) =>
		this.request({
			url: "/list",
			method: "POST",
			data
		});

	// 分页查询
	page = (data?: unknown) =>
		this.request({
			url: "/page",
			method: "POST",
			data
		});

	// 获取信息
	info = (params?: unknown) =>
		this.request({
			url: "/info",
			params
		});

	// 更新数据
	update = (data?: unknown) =>
		this.request({
			url: "/update",
			method: "POST",
			data
		});

	// 删除数据
	delete = (data?: unknown) =>
		this.request({
			url: "/delete",
			method: "POST",
			data
		});

	// 添加数据
	add = (data?: unknown) =>
		this.request({
			url: "/add",
			method: "POST",
			data
		});
}
