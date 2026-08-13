/**
 * EPS 类型/缓存生成 CLI
 * 用法：pnpm eps（请求后端 EPS → 写运行时缓存 + src/cool/types/eps.generated.d.ts）
 * 后端新增接口后：pnpm eps && pnpm build（对应 Vue D10：EPS 构建时注入，重建 bundle）
 */
import { buildService, generateDts, loadEps, writeCache, writeDts } from "../build/eps/generator.mjs";

const list = await loadEps();
const service = buildService(list);
const updatedCache = writeCache(list);
const updatedDts = writeDts(generateDts(list, service));

console.log(`[cool-eps] 实体 ${list.length} 个，接口 ${list.reduce((s, e) => s + (e.api || []).length, 0)} 个`);
if (updatedDts) console.log("[cool-eps] d.ts 已更新");
if (updatedCache) console.log("[cool-eps] 缓存已更新");
if (!updatedDts && !updatedCache) console.log("[cool-eps] 无变化");
