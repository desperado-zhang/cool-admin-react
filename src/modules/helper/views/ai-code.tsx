/**
 * AI 编码（对应 Vue 版 helper/views/ai-code.vue，简化版）
 * 契约：coding 模块（getModuleTree / createCode）
 */
import { useEffect, useState } from "react";
import { App, Button, Card, Col, Input, Row, Tree } from "antd";
import { service } from "@/cool/service";

export default function AiCode() {
	const { message } = App.useApp();
	const [tree, setTree] = useState<Record<string, unknown>[]>([]);
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState("");

	const loadTree = () => {
		setLoading(true);
		service.base.coding
			.getModuleTree()
			.then((res) => setTree(res as never))
			.catch((err: Error) => message.error(err.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadTree();
	}, []);

	const create = async () => {
		if (!prompt) {
			message.warning("请输入需求描述");
			return;
		}

		setLoading(true);
		try {
			await service.base.coding.createCode({ prompt });
			message.success("代码生成成功");
			loadTree();
		} catch (err) {
			message.error((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="cl-crud">
			<Row gutter={12}>
				<Col span={10}>
					<Card size="small" title="模块结构">
						<Tree
							treeData={tree as never}
							fieldNames={{ title: "name", key: "id", children: "children" }}
							defaultExpandAll
						/>
					</Card>
				</Col>
				<Col span={14}>
					<Card size="small" title="AI 编码助手">
						<Input.TextArea
							rows={8}
							value={prompt}
							placeholder="描述你要生成的功能，如：生成一个商品管理模块，包含名称、价格、库存字段"
							onChange={(e) => setPrompt(e.target.value)}
						/>
						<div style={{ marginTop: 12 }}>
							<Button type="primary" loading={loading} onClick={create}>
								生成代码
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
}
