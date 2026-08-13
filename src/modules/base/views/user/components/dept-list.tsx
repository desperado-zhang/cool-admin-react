/**
 * 组织架构（对应 Vue 版 user/components/dept-list.vue）
 * - 部门树 + 右键菜单（新增/编辑/删除/新增成员）
 * - 点击节点 → 过滤右侧用户列表（departmentIds 含子孙）
 * - 拖动排序（保存调 department/order）
 */
import { useEffect, useState } from "react";
import { App, Dropdown, Tree } from "antd";
import { ReloadOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { service, asService } from "@/cool/service";
import { deepTree, flatTree } from "@/cool/utils/tree";
import { useFormDialog } from "@/cool/crud/useFormDialog";
import { usePermission } from "@/cool/hooks/usePermission";
import "./dept-list.scss";

interface Dept {
	id: number;
	name: string;
	parentId: number | null;
	parentName?: string;
	orderNum?: number;
	children?: Dept[];
}

interface DeptListProps {
	onSelect: (item: Dept, ids: number[]) => void;
	onUserAdd: (item: Dept) => void;
}

export default function DeptList({ onSelect, onUserAdd }: DeptListProps) {
	const { message, modal } = App.useApp();
	const { has } = usePermission();
	const perm = service.base.sys.department.permission;

	const [list, setList] = useState<Dept[]>([]);
	const [selectedId, setSelectedId] = useState<number>();
	const [isDrag, setIsDrag] = useState(false);
	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
	const { open, holder } = useFormDialog();

	const refresh = async () => {
		setIsDrag(false);

		const res = await service.base.sys.department.list().catch((err: Error) => {
			message.error(err.message);
			return [];
		});

		const tree = deepTree(res as never) as never as Dept[];
		setList(tree);

		// 异步数据需受控展开全部
		const ids: React.Key[] = [];
		const collect = (arr: Dept[]) => {
			for (const e of arr) {
				ids.push(e.id as React.Key);
				if (e.children?.length) collect(e.children);
			}
		};
		collect(tree);
		setExpandedKeys(ids);

		if (!selectedId && res?.length) {
			rowClick(res[0] as Dept);
		}
	};

	/** 点击节点 → 过滤用户 */
	function rowClick(item?: Dept) {
		const node = item || list[0];
		if (!node) return;

		const ids = node.children ? flatTree(node.children as never).map((e) => e.id) : [];
		ids.unshift(node.id);

		setSelectedId(node.id);
		onSelect(node, ids);
	}

	/** 编辑部门（新增/编辑） */
	function rowEdit(item: Dept) {
		const method = item.id ? "update" : "add";

		open({
			title: "编辑部门",
			width: 550,
			form: { ...item },
			items: [
				{ label: "部门名称", prop: "name", required: true, component: { name: "el-input" } },
				{ label: "上级部门", prop: "parentName", component: { name: "el-input", props: { disabled: true } } },
				{ label: "排序", prop: "orderNum", component: { name: "el-input-number", props: { min: 0, max: 100 } } }
			],
			onSubmit: async (data, { done, close }) => {
				try {
					const deptService = asService(service.base.sys.department);
					await deptService[method as "add" | "update"]({
						id: item.id,
						parentId: item.parentId,
						name: data.name,
						orderNum: data.orderNum
					});
					message.success(`新增部门 “${data.name}” 成功`);
					close();
					refresh();
				} catch (err) {
					message.error((err as Error).message);
					done();
				}
			}
		});
	}

	/** 删除部门 */
	function rowDel(item: Dept) {
		const del = (deleteUser: boolean) =>
			service.base.sys.department
				.delete({ ids: [item.id], deleteUser })
				.then(() => {
					if (selectedId === item.id) {
						rowClick();
					}

					if (deleteUser) {
						message.success("删除成功");
					} else {
						modal.confirm({
							title: "删除成功",
							content: `“${item.name}” 部门的用户已成功转移到 “${item.parentName}” 部门。`
						});
					}
				})
				.finally(refresh);

		modal.confirm({
			title: "提示",
			content: `此操作将会删除 “${item.name}” 部门的所有用户，是否确认？`,
			okText: "直接删除",
			okType: "danger",
			cancelText: "保留用户",
			onOk: () => del(true),
			onCancel: () => del(false)
		});
	}

	/** 保存排序 */
	function treeOrder() {
		modal.confirm({
			title: "提示",
			content: "部门架构已发生改变，是否保存？",
			onOk: async () => {
				const ids: { id: number; parentId: number | null; orderNum: number }[] = [];

				const deep = (arr: Dept[], pid: number | null) => {
					for (const e of arr) {
						e.parentId = pid;
						ids.push({ id: e.id, parentId: e.parentId, orderNum: ids.length });
						if (e.children?.length) deep(e.children, e.id);
					}
				};

				deep(list, null);

				try {
					await service.base.sys.department.order(ids);
					message.success("更新排序成功");
				} catch (err) {
					message.error((err as Error).message);
				}

				refresh();
			}
		});
	}

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="dept-tree">
			<div className="dept-tree__header">
				<span>组织架构</span>
				<div className="dept-tree__op">
					{isDrag ? (
						<div className="dept-tree__btns">
							<div className="dept-tree__item" onClick={treeOrder} title="保存排序">
								✓
							</div>
							<div className="dept-tree__item" onClick={refresh} title="取消">
								✕
							</div>
						</div>
					) : (
						<>
							<div className="dept-tree__item" onClick={refresh} title="刷新">
								<ReloadOutlined />
							</div>
							<div className="dept-tree__item" onClick={() => setIsDrag(true)} title="拖动排序">
								<SortAscendingOutlined />
							</div>
						</>
					)}
				</div>
			</div>

			<div className="dept-tree__container">
				<Tree
					blockNode
					treeData={list as never}
					fieldNames={{ title: "name", key: "id", children: "children" }}
					expandedKeys={expandedKeys}
					onExpand={(keys) => setExpandedKeys(keys)}
					draggable={isDrag}
					selectedKeys={selectedId ? [selectedId] : []}
					onSelect={(_keys, { node }) => rowClick(node as never)}
					titleRender={(node) => {
						const item = node as unknown as Dept;

						return (
							<Dropdown
								trigger={["contextMenu"]}
								menu={{
									items: [
										{
											key: "add",
											label: "新增",
											hidden: !has(perm.add),
											onClick: () =>
												rowEdit({
													id: 0,
													name: "",
													parentName: item.name || "",
													parentId: item.id
												})
										},
										{
											key: "edit",
											label: "编辑",
											hidden: !has(perm.update),
											onClick: () => rowEdit(item)
										},
										{
											key: "del",
											label: "删除",
											danger: true,
											hidden: !item.parentId || !has(perm.delete),
											onClick: () => rowDel(item)
										},
										{
											key: "addUser",
											label: "新增成员",
											hidden: !has(perm.add),
											onClick: () => onUserAdd(item)
										}
									].filter((e) => !e.hidden)
								}}
							>
								<span className={`dept-tree__node-label ${selectedId === item.id ? "is-active" : ""}`}>
									{item.name}
								</span>
							</Dropdown>
						);
					}}
					onDrop={(info) => {
						const dropKey = info.node.key as number;
						const dragKey = info.dragNode.key as number;

						const loop = (data: Dept[], key: number, callback: (item: Dept, index: number, arr: Dept[]) => void) => {
							for (let i = 0; i < data.length; i++) {
								if (data[i].id === key) {
									callback(data[i], i, data);
									return;
								}
								if (data[i].children) loop(data[i].children!, key, callback);
							}
						};

						const data = [...list];
						let dragObj: Dept | undefined;
						loop(data, dragKey, (item, index, arr) => {
							arr.splice(index, 1);
							dragObj = item;
						});

						if (!info.dropToGap) {
							loop(data, dropKey, (item) => {
								item.children = item.children || [];
								item.children.unshift(dragObj!);
							});
						} else {
							let ar: Dept[] = [];
							let i = 0;
							loop(data, dropKey, (_item, index, arr) => {
								ar = arr;
								i = index;
							});
							if (info.dropPosition === -1) {
								ar.splice(i, 0, dragObj!);
							} else {
								ar.splice(i + 1, 0, dragObj!);
							}
						}

						setList(data);
					}}
				/>
			</div>

			{holder}
		</div>
	);
}
