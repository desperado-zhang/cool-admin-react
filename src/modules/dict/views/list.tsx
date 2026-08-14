/**
 * 字典管理（对应 Vue 版 dict/views/list.vue）
 * - 左侧：字典类型列表（可增改）
 * - 右侧：字典数据树形表格（typeId 过滤）
 */
import { useEffect, useState } from "react";
import { App, Button, Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { service, asService } from "@/cool/service";
import { useDictStore } from "@/cool/store/dict";
import {
	AddBtn,
	CoolCrudProvider,
	CoolDialog,
	CoolTable,
	Flex1,
	MultiDeleteBtn,
	RefreshBtn,
	SearchKey,
	Toolbar,
	useCoolCrud,
	type ColumnConfig,
	type FormItem
} from "@/cool/crud";
import { useFormDialog } from "@/cool/crud/useFormDialog";
import "./list.scss";

interface DictType {
	id: number;
	key: string;
	name: string;
}

export default function DictList() {
	const [types, setTypes] = useState<DictType[]>([]);
	const [selected, setSelected] = useState<DictType>();
	const { message } = App.useApp();
	const typeDialog = useFormDialog();

	const crud = useCoolCrud({
		service: asService(service.dict.info),
		onRefresh: async (params, { render }) => {
			const res = await service.dict.info.list(params);
			render(res as never);
			// 刷新字典缓存
			if (selected?.key) {
				useDictStore.getState().refresh([selected.key]);
			}
		}
	});

	/** 类型列表 */
	const refreshTypes = async () => {
		try {
			const res = await service.dict.type.list();
			setTypes(res as never);
			if (!selected && res?.length) {
				const first = res[0] as DictType;
				setSelected(first);
				crud.refresh({ typeId: first.id, page: 1, order: "orderNum", sort: "desc" });
			}
		} catch (err) {
			message.error((err as Error).message);
		}
	};

	useEffect(() => {
		refreshTypes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** 新增/编辑类型 */
	const editType = (item?: DictType) => {
		typeDialog.open({
			title: "字典类型",
			width: 500,
			form: item ? { ...item } : {},
			items: [
				{ label: "名称", prop: "name", required: true, component: { name: "el-input", props: { maxLength: 20 } } },
				{ label: "Key", prop: "key", required: true, component: { name: "el-input", props: { maxLength: 20 } } }
			],
			onSubmit: async (data: Record<string, unknown>, { done, close }: { done: () => void; close: () => void }) => {
				try {
					await (asService(service.dict.type) as unknown as Record<string, (d: unknown) => Promise<unknown>>)[item?.id ? "update" : "add"]({
						id: item?.id,
						...data
					});
					message.success("保存成功");
					close();
					refreshTypes();
				} catch (err) {
					message.error((err as Error).message);
					done();
				}
			}
		});
	};

	const columns: ColumnConfig[] = [
		{ type: "selection", width: 60 },
		{ label: "名称", prop: "name", align: "left", minWidth: 200 },
		{ label: "ID", prop: "id", minWidth: 120 },
		{ label: "值", prop: "value", minWidth: 200, showOverflowTooltip: true },
		{ label: "备注", prop: "remark", showOverflowTooltip: true, minWidth: 170 },
		{ label: "创建时间", prop: "createTime", sortable: "custom", minWidth: 170 },
		{ label: "更新时间", prop: "updateTime", sortable: "custom", minWidth: 170 },
		{ label: "排序", prop: "orderNum", sortable: "desc", width: 100 },
		{ type: "op", width: 250, buttons: ["slot-add", "edit", "delete"] }
	];

	const items: FormItem[] = [
		{
			prop: "parentId",
			label: "上级节点",
			component: {
				name: "el-tree-select",
				props: { treeDefaultExpandAll: true, allowClear: true }
			}
		},
		{ label: "名称", prop: "name", required: true, component: { name: "el-input" } },
		{ label: "值", prop: "value", component: { name: "slot-value" } },
		{ label: "排序", prop: "orderNum", value: 1, component: { name: "el-input-number", props: { min: 1 } } },
		{ label: "备注", prop: "remark", component: { name: "el-input", props: { type: "textarea", rows: 4 } } }
	];

	return (
		<CoolCrudProvider crud={crud}>
			<div className="dict-list">
				<div className="dict-list__left">
					<div className="dict-list__header">
						<span>类型</span>
						<Button type="text" size="small" icon={<PlusOutlined />} onClick={() => editType()} />
					</div>
					<div className="dict-list__types">
						{types.map((t) => (
							<div
								key={t.id}
								className={`dict-list__type ${selected?.id === t.id ? "is-active" : ""}`}
								onClick={() => {
									setSelected(t);
									crud.refresh({ typeId: t.id, page: 1, order: "orderNum", sort: "desc" });
								}}
							>
								<span>
									{t.name} - {t.key}
								</span>
								<Button
									type="text"
									size="small"
									onClick={(e) => {
										e.stopPropagation();
										editType(t);
									}}
								>
									编辑
								</Button>
							</div>
						))}
					</div>
				</div>

				<div className="dict-list__right">
					<div className="cl-crud">
						<Toolbar>
							<RefreshBtn />
							<AddBtn />
							<MultiDeleteBtn />
							<Flex1 />
							<SearchKey placeholder="搜索名称" />
						</Toolbar>

						<CoolTable
							columns={columns}
							slots={{
								"slot-add": (row) => (
									<Button
										type="link"
										size="small"
										style={{ color: "#52c41a" }}
										onClick={() => crud.rowAppend({ parentId: row.id, orderNum: 1 })}
									>
										新增
									</Button>
								)
							}}
						/>

						<CoolDialog
							dialog={{ width: 600 }}
							items={items}
							slots={{
								value: ({ value, onChange }) => (
									<div>
										<Input.TextArea
											rows={4}
											placeholder="请填写值"
											value={value as string}
											onChange={(e) => onChange?.(e.target.value)}
										/>
									</div>
								)
							}}
							onSubmit={(data, { next }) => {
								next({
									...data,
									typeId: selected?.id
								});
							}}
						/>
					</div>
				</div>
			</div>

			{typeDialog.holder}
		</CoolCrudProvider>
	);
}

export { Tag };
