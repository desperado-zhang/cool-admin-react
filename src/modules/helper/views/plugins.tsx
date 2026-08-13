/**
 * 插件市场（对应 Vue 版 helper/views/plugins.vue，简化版）
 * - 插件分页卡片列表（plugin.info）
 */
import { useEffect, useState } from "react";
import { App, Button, Card, Col, Empty, Pagination, Row, Tag } from "antd";
import { service, asService } from "@/cool/service";
import type { BaseService } from "@/cool/service/base";

interface PluginItem {
	id: number;
	name: string;
	keyName?: string;
	description?: string;
	author?: string;
	version?: string;
	logo?: string;
	status?: number;
	[key: string]: unknown;
}

export default function Plugins() {
	const { message } = App.useApp();
	const [list, setList] = useState<PluginItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });

	const pluginService = asService(service.plugin.info);

	const refresh = (page = pagination.page) => {
		setLoading(true);
		pluginService
			.page({ page, size: pagination.size })
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
	}, []);

	return (
		<div className="cl-crud">
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
				<span style={{ fontSize: 15, fontWeight: "bold" }}>插件市场</span>
				<Button type="primary" onClick={() => refresh()}>
					刷新
				</Button>
			</div>

			<Row gutter={12}>
				{list.map((p) => (
					<Col span={6} key={p.id}>
						<Card size="small" loading={loading} style={{ marginBottom: 12 }} title={p.name}>
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
		</div>
	);
}

export type { BaseService };
