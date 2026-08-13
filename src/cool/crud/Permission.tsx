/**
 * 按钮级权限组件（对应 Vue 版 v-permission 指令）
 * 超管（username==='admin'）恒显示
 */
import { usePermission } from "../hooks/usePermission";

export default function Permission({
	perm,
	children
}: {
	perm?: string;
	children: React.ReactNode;
}) {
	const { has } = usePermission();

	if (!has(perm)) {
		return null;
	}

	return <>{children}</>;
}
