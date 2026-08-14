/**
 * 插件市场（对应官方 demo 版 helper/views/plugins.vue，简化版）
 * - segmented 已安装/全部插件 切换
 * - 插件卡片（logo/名称/版本/作者/描述 + 文档 readme 弹窗）
 */
import { useEffect, useState } from "react";
import { App, Button, Card, Col, Empty, Modal, Pagination, Row, Segmented, Tag } from "antd";
import { service, asService } from "@/cool/service";

interface PluginItem {
	id: number;
	name: string;
	keyName?: string;
	description?: string;
	author?: string;
	version?: string;
	logo?: string;
	readme?: string;
	status?: number;
	[key: string]: unknown;
}

export default function Plugins() {
	const { message } = App.useApp();
	const [tab, setTab] = useState<string | number>("已安装");
	const [list, setList] = useState<PluginItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
	const [readme, setReadme] = useState<PluginItem>();

	const pluginService = asService(service.plugin.info);

	const refresh = (page = pagination.page) => {
		setLoading(true);
		pluginService
			.page({ page, size: pagination.size, ...(tab === "已安装" ? { status: 1 } : {}) })
			.then((res: { list: PluginItem[]; pagination: { total: number } }) => {
				setList(res?.list || []);
				setPagination((p) => ({ ...p, page, total: res?.pagination?.total || 0 }));
			})
			.catch((err: Error) => message.error(err.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		refresh(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tab]);

	return (
		<div className="cl-crud">
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
				<Segmented options={["已安装", "全部插件"]} value={tab} onChange={setTab} />
				<Button type="primary" onClick={() => refresh()}>
					刷新
				</Button>
			</div>

			<Row gutter={12}>
				{list.map((p) => (
					<Col lg={6} md={12} xs={24} key={p.id}>
						<Card
							size="small"
							loading={loading}
							style={{ marginBottom: 12 }}
							title={
								<span>
									{p.logo ? <img src={p.logo} alt="" style={{ height: 18, marginRight: 6, verticalAlign: "middle" }} /> : null}
									{p.name}
								</span>
							}
							extra={
								<Button type="link" size="small" onClick={() => setReadme(p)}>
									文档
								</Button>
							}
						>
							<p style={{ minHeight: 40, fontSize: 12, color: "#909399" }}>{p.description}</p>
							<Tag>{p.author}</Tag>
							<Tag color="blue">v{p.version}</Tag>
						</Card>
					</Col>
				))}
			</Row>

			{!loading && !list.length ? <Empty description="暂无插件" /> : null}

			<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
				<Pagination
					current={pagination.page}
					pageSize={pagination.size}
					total={pagination.total}
					onChange={refresh}
				/>
			</div>

			{/* readme 文档弹窗 */}
			<Modal
				open={!!readme}
				title={readme ? `${readme.name} - 文档` : ""}
				footer={null}
				width={720}
				onCancel={() => setReadme(undefined)}
			>
				<pre style={{ whiteSpace: "pre-wrap", fontSize: 13, maxHeight: 520, overflow: "auto" }}>
					{readme?.readme || readme?.description}
				</pre>
			</Modal>
		</div>
	);
}
