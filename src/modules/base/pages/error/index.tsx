/**
 * 错误页（对应 Vue 版 base/pages/error/{401,403,404,500,502}.vue）
 */
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const errorMap: Record<number, { title: string; subTitle: string }> = {
	401: { title: "401", subTitle: "抱歉，您没有访问权限" },
	403: { title: "403", subTitle: "抱歉，您没有访问权限" },
	404: { title: "404", subTitle: "抱歉，您访问的页面不存在" },
	500: { title: "500", subTitle: "抱歉，服务器出错了" },
	502: { title: "502", subTitle: "抱歉，网关出错了" }
};

export default function ErrorPage({ code }: { code: number }) {
	const navigate = useNavigate();
	const info = errorMap[code] || errorMap[404];

	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#fff"
			}}
		>
			<Result
				status={code === 404 ? "404" : code === 403 ? "403" : code === 500 ? "500" : "error"}
				title={info.title}
				subTitle={info.subTitle}
				extra={
					<Button type="primary" onClick={() => navigate("/")}>
						返回首页
					</Button>
				}
			/>
		</div>
	);
}
