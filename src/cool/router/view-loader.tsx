/**
 * viewPath → React 组件解析
 * 对齐 Vue 版 cool/router 的 files 扫描机制：
 * - 'modules/base/views/user/index.vue' → /src/modules/base/views/user/index.tsx
 * - 'http(s)://...' → iframe（Frame 组件）
 * - 组件未实现 → 开发中占位页（页面完成后自动生效）
 */
import { lazy, Suspense, type ReactNode } from "react";
import { Spin } from "antd";
import Frame from "../components/frame";
import Placeholder from "../components/placeholder";

const views = import.meta.glob("/src/modules/*/views/**/*.tsx");

/** Suspense 兜底 */
function PageLoading() {
	return (
		<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Spin />
		</div>
	);
}

export function resolveViewElement(viewPath?: string | null): ReactNode {
	if (!viewPath) {
		return <Placeholder />;
	}

	// 外部链接 → iframe
	if (/^https?:\/\//.test(viewPath)) {
		return <Frame url={viewPath} />;
	}

	// Vue viewPath → React 文件路径
	const key = "/src/" + viewPath.replace(/\.vue$/, ".tsx");
	const loader = views[key];

	if (!loader) {
		return <Placeholder />;
	}

	const Comp = lazy(loader as () => Promise<{ default: React.ComponentType }>);
	return (
		<Suspense fallback={<PageLoading />}>
			<Comp />
		</Suspense>
	);
}
