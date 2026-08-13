/**
 * 云空间（对应 Vue 版 space/views/list.vue + space-inner，简化版）
 * - 左侧分类树（space.type）+ 右侧文件网格 + 上传/删除
 */
import { useEffect, useState } from "react";
import { App, Button, Empty, Image, Modal, Pagination, Popconfirm, Upload } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { service } from "@/cool/service";
import "./list.scss";

interface SpaceType {
	id: number;
	name: string;
	parentId: number | null;
	children?: SpaceType[];
}

interface SpaceFile {
	id: number;
	name: string;
	url: string;
	classifyId?: number;
}

export default function SpaceList() {
	const { message } = App.useApp();
	const [types, setTypes] = useState<SpaceType[]>([]);
	const [selected, setSelected] = useState<SpaceType>();
	const [files, setFiles] = useState<SpaceFile[]>([]);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
	const [preview, setPreview] = useState<string>();
	const [selIds, setSelIds] = useState<number[]>([]);

	const refreshTypes = async () => {
		const res = await service.space.type.list().catch((err: Error) => {
			message.error(err.message);
			return [];
		});
		setTypes(res as unknown as SpaceType[]);
		if (!selected && (res as unknown as SpaceType[])?.length) {
			setSelected((res as unknown as SpaceType[])[0]);
		}
	};

	const refreshFiles = async (page = pagination.page) => {
		setLoading(true);
		try {
			const res = await service.space.info.page({ page, size: pagination.size, classifyId: selected?.id });
			setFiles((res?.list || []) as unknown as SpaceFile[]);
			setPagination((p) => ({ ...p, page, total: res?.pagination?.total || 0 }));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshTypes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selected) refreshFiles(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected?.id]);

	const remove = async () => {
		try {
			await service.space.info.delete({ ids: selIds });
			message.success("删除成功");
			setSelIds([]);
			refreshFiles();
		} catch (err) {
			message.error((err as Error).message);
		}
	};

	return (
		<div className="space-list">
			<div className="space-list__left">
				<div className="space-list__header">分类</div>
				{types.map((t) => (
					<div
						key={t.id}
						className={`space-list__type ${selected?.id === t.id ? "is-active" : ""}`}
						onClick={() => setSelected(t)}
					>
						{t.name}
					</div>
				))}
			</div>

			<div className="space-list__right">
				<div className="space-list__toolbar">
					<Button icon={<UploadOutlined />} type="primary" onClick={() => message.info("请使用下方上传")}>
						点击上传
					</Button>
					<Upload
						action="/admin/base/comm/upload"
						name="file"
						multiple
						showUploadList={false}
						headers={{ Authorization: localStorage.getItem("token")?.replace(/^"|"$/g, "") || "" }}
						onChange={(info) => {
							if (info.file.status === "done") {
								message.success("上传成功");
								refreshFiles();
							}
						}}
					>
						<Button>上传文件</Button>
					</Upload>
					<Popconfirm title="确定删除选中文件？" onConfirm={remove}>
						<Button danger disabled={!selIds.length}>
							删除选中文件
						</Button>
					</Popconfirm>
				</div>

				<div className="space-list__files">
					{files.map((f) => (
						<div
							key={f.id}
							className={`space-list__file ${selIds.includes(f.id) ? "is-selected" : ""}`}
							onClick={() => {
								setSelIds((ids) => (ids.includes(f.id) ? ids.filter((i) => i !== f.id) : [...ids, f.id]));
							}}
						>
							{/\.(png|jpe?g|gif|webp|svg)$/i.test(f.url || "") ? (
								<Image src={f.url} height={90} preview={false} />
							) : (
								<div className="space-list__file-icon">
									<UploadOutlined />
								</div>
							)}
							<p className="space-list__file-name" title={f.name}>
								{f.name}
							</p>
							<span
								className="space-list__file-preview"
								onClick={(e) => {
									e.stopPropagation();
									setPreview(f.url);
								}}
							>
								<EyeOutlined />
							</span>
						</div>
					))}
					{!loading && !files.length ? (
						<div className="space-list__empty">
							<Empty description="将文件拖到此处，或点击按钮上传" />
						</div>
					) : null}
				</div>

				<div className="space-list__footer">
					<Pagination
						current={pagination.page}
						pageSize={pagination.size}
						total={pagination.total}
						showTotal={(total) => `共 ${total} 条`}
						onChange={(page) => refreshFiles(page)}
					/>
				</div>
			</div>

			<Modal open={!!preview} footer={null} width={800} onCancel={() => setPreview(undefined)}>
				{preview && /\.(png|jpe?g|gif|webp|svg)$/i.test(preview) ? (
					<Image src={preview} style={{ width: "100%" }} />
				) : (
					<a href={preview} target="_blank" rel="noreferrer">
						{preview}
					</a>
				)}
			</Modal>
		</div>
	);
}


