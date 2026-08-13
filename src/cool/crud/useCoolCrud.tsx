/**
 * CRUD 核心（对应 Vue 版 useCrud/cl-crud 上下文）
 * - 状态：列表/分页/搜索参数/选择/弹窗
 * - 动作：refresh / rowAppend / rowEdit / rowDelete / submit
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { App } from "antd";
import type { BaseService } from "../service/base";

export interface CoolCrud {
	service: BaseService;
	/** 列表加载中 */
	loading: boolean;
	list: Record<string, unknown>[];
	pagination: { page: number; size: number; total: number };
	/** 搜索参数（含 order/sort） */
	params: Record<string, unknown>;
	selection: Record<string, unknown>[];
	setSelection: (s: Record<string, unknown>[]) => void;
	upsert: { open: boolean; mode: "add" | "edit"; form: Record<string, unknown> };

	/** 刷新列表（extra 合并进 params 并持久化） */
	refresh: (extra?: Record<string, unknown>) => Promise<void>;
	/** 自定义渲染列表（对应 Vue onRefresh 的 render，如菜单页用 list 树） */
	render: (data: Record<string, unknown>[], total?: number) => void;
	/** 分页变化 */
	onPageChange: (page: number, size: number) => void;
	/** 新增（带默认值） */
	rowAppend: (data?: Record<string, unknown>) => void;
	/** 编辑 */
	rowEdit: (row: Record<string, unknown>) => void;
	/** 批量删除 */
	rowDelete: (ids: number[]) => Promise<boolean>;
	/** 提交表单（add/update） */
	submit: (data: Record<string, unknown>) => Promise<boolean>;
	close: () => void;
}

const CoolCrudContext = createContext<CoolCrud | null>(null);

export function useCoolCrudContext() {
	const crud = useContext(CoolCrudContext);
	if (!crud) {
		throw new Error("useCoolCrudContext 必须在 <CoolCrudProvider> 内使用");
	}
	return crud;
}

export interface CoolCrudOptions {
	service: BaseService;
	autoRefresh?: boolean;
	/** 自定义刷新（对应 Vue useCrud 的 onRefresh；默认走 page 接口） */
	onRefresh?: (params: Record<string, unknown>, ctx: { render: (data: Record<string, unknown>[], total?: number) => void }) => void | Promise<void>;
}

export function useCoolCrud(options: CoolCrudOptions): CoolCrud {
	const { message, modal } = App.useApp();
	const service = options.service;

	const [loading, setLoading] = useState(false);
	const [list, setList] = useState<Record<string, unknown>[]>([]);
	const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
	const [params, setParams] = useState<Record<string, unknown>>({});
	const [selection, setSelection] = useState<Record<string, unknown>[]>([]);
	const [upsert, setUpsert] = useState<CoolCrud["upsert"]>({ open: false, mode: "add", form: {} });

	// 最新状态引用（避免闭包过期）
	const stateRef = useRef({ pagination, params });
	stateRef.current = { pagination, params };

	const refresh = useCallback(
		async (extra?: Record<string, unknown>) => {
			const merged = extra ? { ...stateRef.current.params, ...extra } : stateRef.current.params;
			// page/size 由分页状态控制，不进入持久参数
			delete merged.page;
			delete merged.size;
			if (extra) setParams(merged);

			const { page, size } = stateRef.current.pagination;

			// 自定义刷新（如菜单页用 list 树）
			if (options.onRefresh) {
				setLoading(true);
				try {
					await options.onRefresh(merged, { render });
				} finally {
					setLoading(false);
				}
				return;
			}

			setLoading(true);
			try {
				const data = await service.page({ page, size, ...merged });
				setList(data?.list || []);
				setPagination((p) => ({ ...p, total: data?.pagination?.total || 0 }));
			} catch (err) {
				message.error((err as Error).message);
			} finally {
				setLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[service, message, options.onRefresh]
	);

	const onPageChange = useCallback(
		(page: number, size: number) => {
			setPagination((p) => ({ ...p, page, size }));
			// 用新的分页立即拉取
			const { params } = stateRef.current;
			setLoading(true);
			service
				.page({ page, size, ...params })
				.then((data) => {
					setList(data?.list || []);
					setPagination((p) => ({ ...p, total: data?.pagination?.total || 0 }));
				})
				.catch((err) => message.error((err as Error).message))
				.finally(() => setLoading(false));
		},
		[service, message]
	);

	const render = useCallback((data: Record<string, unknown>[], total?: number) => {
		setList(data || []);
		setPagination((p) => ({ ...p, total: total ?? (data || []).length }));
	}, []);

	const rowAppend = useCallback((data?: Record<string, unknown>) => {
		setUpsert({ open: true, mode: "add", form: data || {} });
	}, []);

	const rowEdit = useCallback((row: Record<string, unknown>) => {
		setUpsert({ open: true, mode: "edit", form: { ...row } });
	}, []);

	const rowDelete = useCallback(
		(ids: number[]) =>
			new Promise<boolean>((resolve) => {
				modal.confirm({
					title: "提示",
					content: "确定删除所选数据吗？",
					okType: "danger",
					onOk: async () => {
						try {
							await service.delete({ ids });
							message.success("删除成功");
							await refresh();
							resolve(true);
						} catch (err) {
							message.error((err as Error).message);
							resolve(false);
						}
					},
					onCancel: () => resolve(false)
				});
			}),
		[service, modal, message, refresh]
	);

	const submit = useCallback(
		async (data: Record<string, unknown>) => {
			try {
				if (upsert.mode === "add") {
					await service.add(data);
					message.success("添加成功");
				} else {
					await service.update(data);
					message.success("更新成功");
				}
				setUpsert((u) => ({ ...u, open: false }));
				await refresh();
				return true;
			} catch (err) {
				message.error((err as Error).message);
				return false;
			}
		},
		[service, message, refresh, upsert.mode]
	);

	const close = useCallback(() => {
		setUpsert((u) => ({ ...u, open: false }));
	}, []);

	// 挂载自动加载（对齐 cl-crud）
	useEffect(() => {
		if (options.autoRefresh !== false) {
			refresh();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		service,
		loading,
		list,
		pagination,
		params,
		selection,
		setSelection,
		upsert,
		refresh,
		render,
		onPageChange,
		rowAppend,
		rowEdit,
		rowDelete,
		submit,
		close
	};
}

export function CoolCrudProvider({ crud, children }: { crud: CoolCrud; children: React.ReactNode }) {
	return <CoolCrudContext.Provider value={crud}>{children}</CoolCrudContext.Provider>;
}
