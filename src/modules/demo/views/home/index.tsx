/**
 * 工作台（对应官方 demo 版 demo/views/home，P2 静态演示页对齐）
 * - 4 统计卡（总用户数/浏览量/付款笔数/总销售额）
 * - 销售金额/销售订单切换 + 趋势图
 * - 热门商品排行 + 分类占比
 */
import ReactECharts from "echarts-for-react";
import { Card, Col, Row, Segmented, Space, Statistic, Table, Tag } from "antd";
import { EyeOutlined, PayCircleOutlined, RiseOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";

const cards = [
	{
		label: "总用户数",
		value: 74921,
		icon: <TeamOutlined />,
		color: "#1668dc",
		extra: (
			<span>
				日增用户数 <b>69</b>
			</span>
		)
	},
	{
		label: "浏览量",
		value: 158621,
		icon: <EyeOutlined />,
		color: "#52c41a",
		extra: (
			<span>
				访客数 <b>142</b>
			</span>
		)
	},
	{
		label: "付款笔数",
		value: 5903,
		suffix: "笔",
		icon: <PayCircleOutlined />,
		color: "#fa8c16",
		extra: (
			<span>
				转化率 <b>60%</b>
			</span>
		)
	},
	{
		label: "总销售额",
		value: 9608706,
		suffix: "元",
		icon: <RiseOutlined />,
		color: "#eb2f96",
		extra: (
			<Space size={12}>
				<span>
					周同比 <b style={{ color: "#52c41a" }}>+7%</b>
				</span>
				<span>
					日同比 <b style={{ color: "#f5222d" }}>-4%</b>
				</span>
			</Space>
		)
	}
];

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const saleAmount = [320, 302, 341, 374, 390, 450, 420, 500, 460, 520, 580, 560];
const saleOrders = [120, 132, 101, 134, 190, 230, 210, 182, 191, 234, 290, 330];

const hotGoods = [
	{ rank: 1, name: "智能手表 Pro", amount: 102400, orders: 3214, rise: "+12%", time: "2026-08-01" },
	{ rank: 2, name: "无线降噪耳机", amount: 89600, orders: 2801, rise: "+8%", time: "2026-07-28" },
	{ rank: 3, name: "机械键盘", amount: 71200, orders: 1832, rise: "+5%", time: "2026-07-25" },
	{ rank: 4, name: "4K 显示器", amount: 66800, orders: 1268, rise: "-2%", time: "2026-07-20" },
	{ rank: 5, name: "便携充电宝", amount: 54300, orders: 2145, rise: "+15%", time: "2026-07-18" }
];

const pieOption = {
	title: { text: "分类占比", left: 20, top: 10, textStyle: { fontSize: 15 } },
	tooltip: { trigger: "item" },
	legend: { bottom: 0 },
	series: [
		{
			name: "分类",
			type: "pie",
			radius: ["40%", "65%"],
			label: { show: false },
			data: [
				{ value: 1048, name: "电子产品" },
				{ value: 735, name: "服装鞋包" },
				{ value: 580, name: "家居生活" },
				{ value: 484, name: "美妆个护" },
				{ value: 300, name: "食品生鲜" }
			]
		}
	]
};

export default function Home() {
	const [mode, setMode] = useState<string | number>("销售金额");

	const lineOption = {
		tooltip: { trigger: "axis" },
		grid: { left: 50, right: 20, top: 30, bottom: 30 },
		xAxis: { type: "category", data: months },
		yAxis: { type: "value" },
		series: [
			{
				name: mode,
				type: "line",
				smooth: true,
				areaStyle: { opacity: 0.15 },
				data: mode === "销售金额" ? saleAmount : saleOrders
			}
		]
	};

	return (
		<div className="demo-home">
			<Row gutter={10}>
				{cards.map((c) => (
					<Col lg={6} md={12} xs={24} key={c.label}>
						<Card className="demo-home__card" styles={{ body: { padding: 20 } }}>
							<Statistic
								title={
									<Space>
										<span style={{ color: c.color, fontSize: 24 }}>{c.icon}</span>
										<span>{c.label}</span>
									</Space>
								}
								value={c.value}
								suffix={c.suffix}
							/>
							<div style={{ marginTop: 8, fontSize: 12, color: "#909399" }}>{c.extra}</div>
						</Card>
					</Col>
				))}
			</Row>

			<Row gutter={10}>
				<Col span={24}>
					<Card
						className="demo-home__card"
						title={
							<Segmented
								options={["销售金额", "销售订单"]}
								value={mode}
								onChange={setMode}
							/>
						}
						extra="2026年"
						size="small"
					>
						<ReactECharts option={lineOption} style={{ height: 320 }} />
					</Card>
				</Col>
			</Row>

			<Row gutter={10}>
				<Col lg={14} xs={24}>
					<Card
						className="demo-home__card"
						title="热门商品排行"
						extra={
							<Segmented options={["今日", "本周", "本月"]} defaultValue="今日" />
						}
						size="small"
					>
						<Table
							size="small"
							pagination={false}
							rowKey="rank"
							dataSource={hotGoods}
							columns={[
								{
									title: "排名",
									dataIndex: "rank",
									width: 60,
									render: (v: number) => {
										const colors = ["#f5222d", "#fa8c16", "#fadb14"];
										return <Tag color={colors[v - 1] || "default"}>{v}</Tag>;
									}
								},
								{ title: "商品名称", dataIndex: "name" },
								{
									title: "商品金额",
									dataIndex: "amount",
									render: (v: number) => `¥${v.toLocaleString()}`
								},
								{ title: "下单次数", dataIndex: "orders" },
								{
									title: "日涨幅",
									dataIndex: "rise",
									render: (v: string) => (
										<span style={{ color: v.startsWith("+") ? "#f5222d" : "#52c41a" }}>{v}</span>
									)
								},
								{ title: "上架时间", dataIndex: "time" }
							]}
						/>
					</Card>
				</Col>
				<Col lg={10} xs={24}>
					<Card className="demo-home__card">
						<ReactECharts option={pieOption} style={{ height: 300 }} />
					</Card>
				</Col>
			</Row>
		</div>
	);
}
