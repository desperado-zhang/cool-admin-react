/**
 * 工作台（对应 Vue 版 demo/views/home/index.vue，P2 静态演示页）
 * 统计卡片 + echarts 图表（静态演示数据）
 */
import ReactECharts from "echarts-for-react";
import { Card, Col, Row, Space, Statistic, Table, Tag } from "antd";
import { EyeOutlined, PayCircleOutlined, TeamOutlined, RiseOutlined } from "@ant-design/icons";
import "./index.scss";

const countCards = [
	{ label: "总用户数", value: 12846, icon: <TeamOutlined />, color: "#1668dc" },
	{ label: "总浏览量", value: 158621, icon: <EyeOutlined />, color: "#52c41a" },
	{ label: "支付订单", value: 8962, icon: <PayCircleOutlined />, color: "#fa8c16" },
	{ label: "转化率", value: 68.5, suffix: "%", icon: <RiseOutlined />, color: "#eb2f96" }
];

const lineOption = {
	title: { text: "访问趋势", left: 20, top: 10, textStyle: { fontSize: 15 } },
	tooltip: { trigger: "axis" },
	grid: { left: 60, right: 30, top: 60, bottom: 40 },
	xAxis: {
		type: "category",
		data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
	},
	yAxis: { type: "value" },
	series: [
		{
			name: "访问量",
			type: "line",
			smooth: true,
			areaStyle: { opacity: 0.15 },
			data: [820, 932, 901, 934, 1290, 1330, 1320]
		},
		{
			name: "订单量",
			type: "line",
			smooth: true,
			data: [120, 232, 301, 434, 390, 330, 320]
		}
	]
};

const pieOption = {
	title: { text: "商品分类占比", left: 20, top: 10, textStyle: { fontSize: 15 } },
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

const hotGoods = [
	{ rank: 1, name: "智能手表 Pro", sales: 3214, price: 1999 },
	{ rank: 2, name: "无线降噪耳机", sales: 2801, price: 899 },
	{ rank: 3, name: "便携充电宝", sales: 2145, price: 129 },
	{ rank: 4, name: "机械键盘", sales: 1832, price: 459 },
	{ rank: 5, name: "4K 显示器", sales: 1268, price: 2299 }
];

export default function Home() {
	return (
		<div className="demo-home">
			<Row gutter={10}>
				{countCards.map((c) => (
					<Col lg={6} md={12} xs={24} key={c.label}>
						<Card className="demo-home__card" styles={{ body: { padding: 20 } }}>
							<Statistic
								title={
									<Space>
										<span>{c.label}</span>
									</Space>
								}
								value={c.value}
								suffix={c.suffix}
								prefix={<span style={{ color: c.color, fontSize: 26, marginRight: 8 }}>{c.icon}</span>}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Row gutter={10}>
				<Col span={24}>
					<Card className="demo-home__card">
						<ReactECharts option={lineOption} style={{ height: 320 }} />
					</Card>
				</Col>
			</Row>

			<Row gutter={10}>
				<Col lg={14} xs={24}>
					<Card className="demo-home__card" title="热销商品" size="small">
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
								{ title: "商品", dataIndex: "name" },
								{ title: "销量", dataIndex: "sales" },
								{
									title: "价格",
									dataIndex: "price",
									render: (v: number) => `¥${v}`
								}
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


