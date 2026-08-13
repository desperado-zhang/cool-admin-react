/**
 * EPS 生成器（对应 @cool-vue/vite-plugin 的 eps 模块）
 * - loadEps：请求后端 EPS（失败回退种子缓存 build/cool/eps.json）
 * - buildService：service 树（namespace / permission / search / api 元数据）
 * - generateDts：实体接口 + 服务接口 + PageResponse 类型（对应 eps.d.ts）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** EPS 源地址（可在 vite.config / .env 覆盖） */
export const EPS_URL = (process.env.VITE_EPS_URL || "http://localhost:8001") + "/admin/base/open/eps";

/** 运行时缓存（每次请求成功更新） */
export const CACHE_PATH = path.join(__dirname, "../../node_modules/.cache/cool-eps.json");

/** 种子缓存（提交仓库，离线构建兜底） */
export const SEED_PATH = path.join(__dirname, "../cool/eps.json");

/** 生成类型文件 */
export const DTS_PATH = path.join(__dirname, "../../src/cool/types/eps.generated.d.ts");

/** 首字母大写 */
function firstUpperCase(value) {
	return value.replace(/\b(\w)(\w*)/g, (_, $1, $2) => $1.toUpperCase() + $2);
}

/** 横杠转驼峰 */
function toCamel(str) {
	return str.replace(/([^-])(?:-+([^-]))/g, (_, $1, $2) => $1 + $2.toUpperCase());
}

/** 格式化名字（去特殊字符） */
function formatName(name) {
	return (name || "").replace(/[:,\s,\/,-]/g, "");
}

function checkName(name) {
	return name && !["{", "}", ":"].some((e) => name.includes(e));
}

/** 列类型映射（对齐 Vue config.eps.mapping） */
function getType(type) {
	const mapping = [
		{ type: "string", test: ["varchar", "text", "simple-json", "char", "longtext"] },
		{ type: "string[]", test: ["simple-array"] },
		{ type: "Date", test: ["datetime", "date", "timestamp"] },
		{ type: "number", test: ["tinyint", "int", "decimal", "float", "double", "smallint"] },
		{ type: "BigInt", test: ["bigint"] },
		{ type: "any", test: ["json"] }
	];

	for (const m of mapping) {
		if (m.test.includes(type)) return m.type;
	}

	return type || "any";
}

/** 加载 EPS 实体列表（远程 → 运行时缓存 → 种子） */
export async function loadEps() {
	let list = [];

	// 1. 远程请求（超时 5s）
	try {
		const res = await fetch(EPS_URL, { signal: AbortSignal.timeout(5000) });
		const body = await res.json();

		if (body.code === 1000 && body.data) {
			list = Object.values(body.data).flat().filter(Boolean);
		} else {
			console.warn(`[cool-eps] ${body.message || "Failed to fetch eps"}`);
		}
	} catch {
		console.warn(`[cool-eps] API 服务不可达 → ${EPS_URL}（回退缓存）`);
	}

	// 2. 运行时缓存
	if (!list.length && fs.existsSync(CACHE_PATH)) {
		list = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
	}

	// 3. 种子缓存
	if (!list.length && fs.existsSync(SEED_PATH)) {
		list = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
	}

	// 补全缺省字段
	for (const e of list) {
		if (!e.namespace) e.namespace = "";
		if (!e.api) e.api = [];
		if (!e.columns) e.columns = [];
	}

	return list;
}

/** pageQueryOp source → 列对象（对齐 Vue findColumns） */
function findColumns(sources, item) {
	const columns = [item.columns, item.pageColumns].flat().filter(Boolean);
	return (sources || []).map((e) => columns.find((c) => c.source === e)).filter(Boolean);
}

/** 构建 search（对齐 Vue getData） */
function buildSearch(e) {
	if (e.search) return e.search;
	return {
		fieldEq: findColumns(e.pageQueryOp?.fieldEq, e),
		fieldLike: findColumns(e.pageQueryOp?.fieldLike, e),
		keyWordLikeFields: findColumns(e.pageQueryOp?.keyWordLikeFields, e)
	};
}

/** 构建 service 树（对齐 Vue createService） */
export function buildService(list) {
	const service = {};
	const id = "admin";

	for (const e of list) {
		const prefix = e.prefix || "";
		const path = prefix[0] === "/" ? prefix.substring(1) : prefix;
		const arr = path.replace(id, "").split("/").filter(Boolean).map(toCamel);

		const deep = (d, i) => {
			const k = arr[i];
			if (!k) return;

			if (arr[i + 1]) {
				if (!d[k]) d[k] = {};
				deep(d[k], i + 1);
			} else {
				if (!d[k]) d[k] = { permission: {} };
				if (!d[k].namespace) d[k].namespace = path;

				// 搜索配置
				d[k].search = buildSearch(e);

				// 方法（跳过含 -: 的名字）
				for (const a of e.api || []) {
					const n = (a.path || "").replace("/", "");
					if (n && !/[-:]/g.test(n)) {
						d[k][n] = a;
					}
				}

				// 权限码：namespace 去掉 admin/ 前缀，/ → :（方法挂完后生成）
				if (d[k].namespace) {
					Object.keys(d[k])
						.filter((n) => !["namespace", "permission", "search"].includes(n))
						.forEach((n) => {
							d[k].permission[n] = `${d[k].namespace.replace(`${id}/`, "")}/${n}`.replace(/\//g, ":");
						});
				}
			}
		};

		deep(service, 0);
	}

	return service;
}

/** 生成 d.ts 内容（对齐 Vue createDescribe） */
export function generateDts(list, service) {
	// ===== 实体接口 =====
	let entity = "";
	for (const item of list) {
		if (!checkName(item.name)) continue;

		let t = `\tinterface ${formatName(item.name)} {\n`;

		const columns = [...(item.columns || []), ...(item.pageColumns || [])];
		const uniq = [];
		for (const col of columns) {
			if (col && !uniq.some((u) => u.source === col.source)) uniq.push(col);
		}

		for (const col of uniq) {
			t += `\t\t/**
\t\t * ${(col.comment || "").replace(/\*\//g, "")}
\t\t */
\t\t${col.propertyName}?: ${getType(col.type)};\n\n`;
		}

		t += `\t\t/**
\t\t * 任意键值
\t\t */
\t\t[key: string]: any;\n\t}\n\n`;

		entity += t;
	}

	// ===== 服务接口 =====
	let controller = "";
	let chain = "";
	let pageResponse = "";

	const deep = (d, k = "") => {
		for (const i in d) {
			const name = k + toCamel(firstUpperCase(formatName(i)));
			if (!checkName(name)) continue;

			if (d[i].namespace) {
				const item = list.find((e) => (e.prefix || "") === `/${d[i].namespace}`);
				if (!item) continue;

				let t = `\tinterface ${name} {\n`;

				// 方法
				const permission = [];
				for (const a of item.api || []) {
					const n = toCamel(formatName((a.path || "").split("/").pop()));
					if (!checkName(n) || !n) continue;

					// 参数类型（对齐 Vue：dts 为空 → any）
					let q = [];
					const parameters = (a.dts || {}).parameters || [];
					for (const p of parameters) {
						if (p.description) q.push(`\n/** ${p.description}  */\n`);
						if (!checkName(p.name)) continue;
						q.push(`${p.name}${p.required ? "" : "?"}: ${p.schema?.type || "string"};`);
					}
					if (!q.length) q = ["any"];
					else {
						q.unshift("{");
						q.push("}");
					}

					// 返回类型
					let res = "any";
					const en = item.name || "any";
					switch (a.path) {
						case "/page":
							res = `${name}PageResponse`;
							pageResponse += `\tinterface ${name}PageResponse {\n\t\tpagination: PagePagination;\n\t\tlist: ${en}[];\n\t}\n\n`;
							break;
						case "/list":
							res = `${en}[]`;
							break;
						case "/info":
							res = en;
							break;
					}

					t += `\t\t/**
\t\t * ${(a.summary || n).replace(/\*\//g, "")}
\t\t */
\t\t${n}(data${q.length === 1 ? "?" : ""}: ${q.join("")}): Promise<${res}>;\n\n`;

					if (!permission.includes(n)) permission.push(n);
				}

				// 权限标识
				t += `\t\t/**
\t\t * 权限标识
\t\t */
\t\tpermission: { ${permission.map((e) => `${e}: string;`).join(" ")} };\n\n`;
				t += `\t\t/**
\t\t * 请求方法
\t\t */
\t\trequest: Request;\n\t}\n\n`;

				controller += t;
				chain += `\t${formatName(i)}: ${name};\n`;
			} else {
				chain += `\t${formatName(i)}: {\n`;
				deep(d[i], name);
				chain += `\t};\n`;
			}
		}
	};

	deep(service);

	return `/**
 * EPS 类型描述（自动生成，勿手改）
 * 重新生成：pnpm eps（请求后端 EPS，失败回退 build/cool/eps.json）
 */
declare namespace Eps {
	type json = any;

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	${entity}
	${pageResponse}
	${controller}
	interface Service {
		request: Request;
${chain}
	}
}

declare module "virtual:eps" {
	const eps: {
		service: any;
		list: any[];
		isUpdate: boolean;
	};

	export { eps };
}
`;
}

/** 写入缓存（有变化才写） */
export function writeCache(list) {
	const content = JSON.stringify(
		list.map((e) => ({
			prefix: e.prefix,
			name: e.name || "",
			module: e.module,
			info: e.info,
			api: (e.api || []).map((a) => ({
				method: a.method,
				path: a.path,
				summary: a.summary,
				ignoreToken: a.ignoreToken
			})),
			columns: e.columns,
			pageColumns: e.pageColumns,
			pageQueryOp: e.pageQueryOp
		}))
	);

	const dir = path.dirname(CACHE_PATH);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

	if (!fs.existsSync(CACHE_PATH) || fs.readFileSync(CACHE_PATH, "utf8") !== content) {
		fs.writeFileSync(CACHE_PATH, content);
		return true;
	}
	return false;
}

/** 写入 d.ts（有变化才写） */
export function writeDts(content) {
	if (!fs.existsSync(DTS_PATH) || fs.readFileSync(DTS_PATH, "utf8") !== content) {
		fs.writeFileSync(DTS_PATH, content);
		return true;
	}
	return false;
}
