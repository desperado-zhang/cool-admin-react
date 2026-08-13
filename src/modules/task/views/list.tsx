/**
 * 定时任务（对应 Vue 版 task/views/list.vue）
 * - 卡片式任务列表（进行中/已停止、启停/日志/删除）
 * - 新增/编辑表单（cron/间隔、service、开始时间）
 * - 任务日志弹窗
 */
import { useEffect, useState } from "react";
import { App, Button, DatePicker, Empty, Form, Input, InputNumber, Modal, Radio, Table, Tag } from "antd";
import { CaretRightOutlined, DeleteOutlined, PauseOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { service } from "@/cool/service";
import { Permission } from "@/cool/crud";
import dayjs from "dayjs";
import "./list.scss";

interface TaskItem {
	id: number;
	name: string;
	service: string;
	taskType: number;
	cron?: string;
	every?: number;
	_every?: number;
	status: number;
	type?: number;
	remark?: string;
	startDate?: string;
}

export default function TaskList() {
	const { message, modal } = App.useApp();
	const [list, setList] = useState<TaskItem[]>([]);
	const [dialog, setDialog] = useState<{ open: boolean; item?: TaskItem }>({ open: false });
	const [logItem, setLogItem] = useState<TaskItem>();
	const [form] = Form.useForm();

	const refresh = () => {
		service.task.info
			.page({ size: 100, page: 1 })
			.then((r: unknown) => {
				const res = r as { list: TaskItem[] };
			setList(
				((res.list || []) as TaskItem[]).map((e) => ({
					...e,
					_every: e.every ? parseInt(String(e.every / 1000)) : undefined
				}))
			);
		});
	};

	useEffect(() => {
		refresh();
	}, []);

	const confirm = (content: string, onOk: () => Promise<void>) => {
		modal.confirm({
			title: "提示",
			content,
			onOk
		});
	};

	const start = (item: TaskItem) => {
		confirm(`此操作将启用任务（${item.name}），是否继续？`, async () => {
			await service.task.info.start({ id: item.id, type: item.type });
			refresh();
		});
	};

	const stop = (item: TaskItem) => {
		confirm(`此操作将停用任务（${item.name}），是否继续？`, async () => {
			await service.task.info.stop({ id: item.id });
			refresh();
		});
	};

	const remove = (item: TaskItem) => {
		confirm(`此操作将删除任务（${item.name}），是否继续？`, async () => {
			await service.task.info.delete({ ids: [item.id] });
			refresh();
		});
	};

	const once = (item: TaskItem) => {
		service.task.info
			.once({ id: item.id })
			.then(() => refresh())
			.catch((err: Error) => message.error(err.message));
	};

	/** 打开新增/编辑 */
	const edit = (item?: TaskItem) => {
		setDialog({ open: true, item });
		form.resetFields();
		form.setFieldsValue({
			...(item || {}),
			taskType: item?.taskType ?? 0,
			every: item?.every ? item.every / 1000 : undefined,
			startDate: item?.startDate ? dayjs(item.startDate) : undefined
		});
	};

	const taskType = Form.useWatch("taskType", form);

	const save = async () => {
		const data = await form.validateFields().catch(() => null);
		if (!data) return;

		const payload: Record<string, unknown> = {
			...data,
			every: data.every ? data.every * 1000 : undefined,
			startDate: data.startDate ? data.startDate.format("YYYY-MM-DD HH:mm:ss") : undefined
		};

		try {
			await (service.task.info as unknown as Record<string, (d: unknown) => Promise<unknown>>)[dialog.item?.id ? "update" : "add"](payload);
			message.success("保存成功");
			setDialog({ open: false });
			refresh();
		} catch (err) {
			message.error((err as Error).message);
		}
	};

	return (
		<div className="task-list">
			<div className="task-list__grid">
				{list.map((item) => (
					<div key={item.id} className="task-list__item" onClick={() => edit(item)}>
						<p className="task-list__name">{item.name}</p>
						<p className="task-list__row">
							<span>执行服务</span>
							<span>{item.service}</span>
						</p>
						<p className="task-list__row">
							<span>定时规则</span>
							<span>{item.taskType == 1 ? `间隔${item._every}秒执行` : item.cron}</span>
						</p>

						<div className="task-list__status">
							{item.status ? (
								<>
									<Permission perm={service.task.info.permission.stop}>
										<span
											className="task-list__icon"
											onClick={(e) => {
												e.stopPropagation();
												stop(item);
											}}
										>
											<PauseOutlined />
										</span>
									</Permission>
									<Tag color="success">进行中</Tag>
								</>
							) : (
								<>
									<Permission perm={service.task.info.permission.start}>
										<span
											className="task-list__icon"
											onClick={(e) => {
												e.stopPropagation();
												start(item);
											}}
										>
											<CaretRightOutlined />
										</span>
									</Permission>
									<Tag color="error">已停止</Tag>
								</>
							)}

							<div className="task-list__flex" />

							<Permission perm={service.task.info.permission.once}>
								<span
									className="task-list__icon"
									title="立即执行"
									onClick={(e) => {
										e.stopPropagation();
										once(item);
									}}
								>
									<CaretRightOutlined />
								</span>
							</Permission>
							<Permission perm={service.task.info.permission.log}>
								<span
									className="task-list__icon"
									onClick={(e) => {
										e.stopPropagation();
										setLogItem(item);
									}}
								>
									<UnorderedListOutlined />
								</span>
							</Permission>
							<Permission perm={service.task.info.permission.delete}>
								<span
									className="task-list__icon"
									onClick={(e) => {
										e.stopPropagation();
										remove(item);
									}}
								>
									<DeleteOutlined />
								</span>
							</Permission>
						</div>
					</div>
				))}

				<Permission perm={service.task.info.permission.add}>
					<div className="task-list__item task-list__add" onClick={() => edit()}>
						<PlusOutlined style={{ fontSize: 36 }} />
						<p>添加计划任务</p>
					</div>
				</Permission>

				{!list.length ? (
					<div style={{ width: "100%", padding: 60 }}>
						<Empty description="暂无任务" />
					</div>
				) : null}
			</div>

			{/* 新增/编辑弹窗 */}
			<Modal
				open={dialog.open}
				title="编辑计划任务"
				width={600}
				onOk={save}
				onCancel={() => setDialog({ open: false })}
				destroyOnClose
			>
				<Form form={form} labelCol={{ flex: "80px" }}>
					<Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
						<Input placeholder="请输入名称" />
					</Form.Item>
					<Form.Item label="类型" name="taskType" rules={[{ required: true }]}>
						<Radio.Group
							options={[
								{ label: "cron", value: 0 },
								{ label: "时间间隔", value: 1 }
							]}
						/>
					</Form.Item>
					{taskType != 1 ? (
						<Form.Item label="cron" name="cron" rules={[{ required: true, message: "请输入 cron 表达式" }]}>
							<Input placeholder="* * * * * *" />
						</Form.Item>
					) : null}
					{taskType == 1 ? (
						<Form.Item label="间隔(秒)" name="every" rules={[{ required: true, message: "请输入间隔" }]}>
							<InputNumber min={1} max={100000000} style={{ width: "100%" }} />
						</Form.Item>
					) : null}
					<Form.Item label="service" name="service">
						<Input placeholder="taskDemoService.test([1, 2])" />
					</Form.Item>
					{taskType != 1 ? (
						<Form.Item label="开始时间" name="startDate">
							<DatePicker showTime style={{ width: "100%" }} />
						</Form.Item>
					) : null}
					<Form.Item label="备注" name="remark">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			{/* 日志弹窗 */}
			<TaskLogs item={logItem} onClose={() => setLogItem(undefined)} />
		</div>
	);
}

/** 任务日志（对应 Vue 版 task/components/logs.vue） */
function TaskLogs({ item, onClose }: { item?: TaskItem; onClose: () => void }) {
	const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });

	const load = (page = pagination.page) => {
		if (!item) return;
		setLoading(true);
		service.task.info
			.log({ page, size: pagination.size, taskId: item.id })
			.then((res: { list: Record<string, unknown>[]; pagination: { total: number } }) => {
				setLogs(res?.list || []);
				setPagination((p) => ({ ...p, page, total: res?.pagination?.total || 0 }));
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (item) load(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id]);

	return (
		<Modal open={!!item} title={item ? `日志 - ${item.name}` : "日志"} footer={null} width={800} onCancel={onClose}>
			<Table
				size="small"
				rowKey="id"
				loading={loading}
				dataSource={logs}
				pagination={{
					current: pagination.page,
					pageSize: pagination.size,
					total: pagination.total,
					onChange: load
				}}
				columns={[
					{ title: "状态", dataIndex: "status", width: 80, render: (v: number) => (v ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag>) },
					{ title: "详情", dataIndex: "detail", ellipsis: true },
					{ title: "耗时(ms)", dataIndex: "times", width: 100 },
					{ title: "时间", dataIndex: "createTime", width: 170 }
				]}
			/>
		</Modal>
	);
}

export { Button };
