/**
 * 顶栏（对应 Vue 版 main/components/topbar.vue）
 * - 折叠开关 + 面包屑 + 用户下拉（个人中心 / 退出登录）
 */
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App, Avatar, Breadcrumb, Dropdown } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAppStore } from "@/cool/store/app";
import { useUserStore } from "@/cool/store/user";
import { useMenuStore, type FormattedMenu } from "@/cool/store/menu";
import { service } from "@/cool/service";

export default function Topbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const { modal } = App.useApp();

	const isFold = useAppStore((s) => s.isFold);
	const fold = useAppStore((s) => s.fold);
	const userInfo = useUserStore((s) => s.userInfo);
	const group = useMenuStore((s) => s.group);

	// 面包屑：当前路径的树链（对齐 Vue route-nav）
	const breadcrumb = useMemo(() => {
		const path = location.pathname;

		const deep = (item: FormattedMenu): FormattedMenu[] | false => {
			if (path === "/") return false;
			if (item.path === path) return [item];
			if (item.children?.length) {
				for (const child of item.children) {
					const ret = deep(child);
					if (ret) return [item, ...ret];
				}
			}
			return false;
		};

		for (const item of group) {
			const ret = deep(item);
			if (ret) return ret;
		}

		return path === "/my/info" ? [{ name: "个人中心", meta: { label: "个人中心" } } as FormattedMenu] : [];
	}, [location.pathname, group]);

	// 退出登录
	const onExit = () => {
		modal.confirm({
			title: "提示",
			content: "确定退出登录吗？",
			okType: "danger",
			onOk: async () => {
				await service.base.comm.logout();
				useUserStore.getState().logout();
			}
		});
	};

	return (
		<div className="app-topbar">
			<div className="app-topbar__fold" onClick={() => fold()}>
				{isFold ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			</div>

			<Breadcrumb
				className="app-topbar__nav"
				items={breadcrumb.map((e) => ({ title: <span>{e.meta.label}</span> }))}
			/>

			<div className="app-topbar__flex" />

			{userInfo ? (
				<Dropdown
					menu={{
						items: [
							{
								key: "my",
								label: "个人中心",
								onClick: () => navigate("/my/info")
							},
							{
								key: "exit",
								danger: true,
								label: "退出登录",
								onClick: onExit
							}
						]
					}}
				>
					<div className="app-topbar__user">
						<span>{userInfo.nickName || userInfo.name || userInfo.username}</span>
						<Avatar size={26} src={userInfo.headImg} />
					</div>
				</Dropdown>
			) : null}
		</div>
	);
}
