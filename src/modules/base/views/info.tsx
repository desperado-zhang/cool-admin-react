/**
 * 个人中心（对应 Vue 版 base/views/info.vue）
 * 契约来源：cool-admin-nest AGENTS.md 第 4 章 personUpdate
 */
import { useEffect, useState } from "react";
import { App, Button, Form, Input } from "antd";
import { service } from "@/cool/service";
import { useUserStore } from "@/cool/store/user";
import { getComponent } from "@/cool/crud/registry";

export default function MyInfo() {
	const { message } = App.useApp();
	const userInfo = useUserStore((s) => s.userInfo);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		form.setFieldsValue({
			headImg: userInfo?.headImg || "",
			nickName: userInfo?.nickName || ""
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const save = async () => {
		const data = form.getFieldsValue();
		setLoading(true);

		try {
			await service.base.comm.personUpdate(data);
			form.setFieldsValue({ password: "", oldPassword: "" });
			message.success("修改成功");
			useUserStore.getState().get();
		} catch (err) {
			message.error((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const Upload = getComponent("cl-upload")!;

	return (
		<div className="view-my">
			<div style={{ padding: 20, width: 400, maxWidth: "100%" }}>
				<div style={{ marginBottom: 30, fontSize: 15, fontWeight: "bold" }}>基本信息</div>

				<Form form={form} layout="vertical" disabled={loading}>
					<Form.Item label="头像" name="headImg">
						<UploadCtx renderer={Upload} />
					</Form.Item>

					<Form.Item label="昵称" name="nickName">
						<Input placeholder="请填写昵称" allowClear />
					</Form.Item>

					<Form.Item label="原密码" name="oldPassword">
						<Input.Password placeholder="请填写原密码" autoComplete="new-password" />
					</Form.Item>

					<Form.Item label="新密码" name="password">
						<Input.Password placeholder="请填写新密码" autoComplete="new-password" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" loading={loading} onClick={save}>
							保存修改
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}

function UploadCtx({
	renderer,
	value,
	onChange
}: {
	renderer: (ctx: any) => React.ReactNode;
	value?: unknown;
	onChange?: (value: unknown) => void;
}) {
	return <>{renderer({ value, onChange, props: {} })}</>;
}
