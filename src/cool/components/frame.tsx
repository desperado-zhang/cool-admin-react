/**
 * iframe 页面（对应 Vue 版 base/views/frame.vue）
 * viewPath 为 http(s) 链接的菜单渲染此组件
 */
interface FrameProps {
	url: string;
}

export default function Frame({ url }: FrameProps) {
	return (
		<div className="frame" style={{ height: "100%", width: "100%" }}>
			<iframe src={url} title={url} style={{ height: "100%", width: "100%", border: 0 }} />
		</div>
	);
}
