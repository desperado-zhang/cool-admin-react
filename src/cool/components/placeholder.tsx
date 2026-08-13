/**
 * 页面占位（viewPath 对应的 React 组件尚未实现时显示）
 * 页面实现后自动被替换，无需改动路由
 */
import { Empty } from "antd";

export default function Placeholder() {
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#fff",
				borderRadius: 6
			}}
		>
			<Empty description="页面开发中" />
		</div>
	);
}
