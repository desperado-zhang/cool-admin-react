import { useEffect, useState } from "react";
import { ConfigProvider, App as AntApp, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./App.css";

dayjs.locale("zh-cn");

export default function App() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);

	return (
		<ConfigProvider
			locale={zhCN}
			theme={{
				cssVar: true,
				algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorPrimary: "#1668dc"
				}
			}}
		>
			<AntApp>
				<div className="app-placeholder" onClick={() => setDark((d) => !d)}>
					cool-admin-react 骨架已就绪（点击切换暗色主题）
				</div>
			</AntApp>
		</ConfigProvider>
	);
}
