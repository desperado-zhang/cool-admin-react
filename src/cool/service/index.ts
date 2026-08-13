export { default as request, get, post, BizError } from "./request";
export { BaseService } from "./base";
export { service, createEps } from "./eps";

/** EPS 服务叶子 → BaseService 类型（CRUD 框架使用；EPS 类型与 BaseService 结构差异仅类型层面） */
export const asService = (s: unknown) => s as import("./base").BaseService;
