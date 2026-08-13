/**
 * EPS 服务层（对应 Vue 版 cool/bootstrap/eps.ts）
 * - virtual:eps 由 vite 插件构建期注入（EPS 118/118 全量接口）
 * - createEps：遍历 service 树，为每个 namespace 叶子绑定 BaseService 方法
 * - service.base.sys.user.page({...}) 风格调用
 */
import { eps } from "virtual:eps";
import { BaseService } from "./base";

export const service = {} as Eps.Service;

export function createEps() {
	// 绑定 request 与方法
	const set = (d: any) => {
		if (d.namespace) {
			const a: any = new BaseService(d.namespace);

			for (const i in d) {
				const { path, method = "get" } = d[i];

				if (path) {
					a[i] = function (data?: any) {
						return this.request({
							url: path,
							method,
							[method.toLowerCase() === "post" ? "data" : "params"]: data
						});
					};
				}
			}

			// 将 BaseService 实例方法与绑定的 api 方法复制到叶子
			for (const i in a) {
				d[i] = a[i];
			}
		} else {
			for (const i in d) {
				set(d[i]);
			}
		}
	};

	set(eps.service);

	// 合并到共享 service 对象
	Object.assign(service, eps.service);
}
