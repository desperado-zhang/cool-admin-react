/**
 * vite 插件：构建期注入 EPS（对应 @cool-vue/vite-plugin）
 * - 虚拟模块 virtual:eps 导出 { service, list, isUpdate }
 * - 页面刷新时失效虚拟模块 → 重新拉取（后端加接口后刷新页面即生效）
 * - 拉取成功后同步缓存与 d.ts
 */
import { buildService, loadEps, writeCache, writeDts, generateDts } from "./generator.mjs";

export function coolEpsPlugin() {
	return {
		name: "cool-eps",
		enforce: "pre",

		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				// 页面刷新时触发：失效虚拟模块
				if (req.url === "/@vite/client") {
					const mod = server.moduleGraph.getModuleById("\0virtual:eps");
					if (mod) {
						server.moduleGraph.invalidateModule(mod);
					}
				}
				next();
			});
		},

		resolveId(id) {
			if (id === "virtual:eps") {
				return "\0virtual:eps";
			}
		},

		async load(id) {
			if (id !== "\0virtual:eps") return;

			const list = await loadEps();
			const service = buildService(list);

			// 同步缓存与类型
			writeCache(list);
			writeDts(generateDts(list, service));

			return `export const eps = ${JSON.stringify({ service, list, isUpdate: false })}`;
		}
	};
}
