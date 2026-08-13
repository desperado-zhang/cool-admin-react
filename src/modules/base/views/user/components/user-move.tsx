/**
 * 用户转移（对应 Vue 版 user/components/user-move.vue）
 * 通过 ref.open(ids) 打开；选择部门 → 确认 → service.base.sys.user.move
 */
import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { App } from "antd";
import { service } from "@/cool/service";
import { useFormDialog } from "@/cool/crud/useFormDialog";
import "@/modules/base/components/dept/select";

export interface UserMoveRef {
	open: (ids: number[], onSuccess?: () => void) => void;
}

const UserMove = forwardRef<UserMoveRef>((_, ref) => {
	const { message, modal } = App.useApp();
	const { t } = useTranslation();
	const { open, holder } = useFormDialog();

	useImperativeHandle(
		ref,
		() => ({
			open(ids, onSuccess) {
				open({
					title: t("permission.departmentTransfer"),
					width: 500,
					items: [{ label: t("permission.selectDepartment"), prop: "departmentId", component: { name: "cl-dept-select" } }],
					onSubmit: async (data, { done, close }) => {
						if (!data.departmentId) {
							message.warning(t("permission.selectDepartmentFirst"));
							done();
							return;
						}

						modal.confirm({
							title: t("common.tip"),
							content: t("permission.transferConfirm"),
							onOk: async () => {
								try {
									await service.base.sys.user.move({
										...data,
										userIds: ids
									});
									message.success(t("permission.transferSuccess"));
									onSuccess?.();
									close();
								} catch (err) {
									message.error((err as Error).message);
								}
							}
						});

						done();
					}
				});
			}
		}),
		[open, message, modal]
	);

	return holder;
});

export default UserMove;
