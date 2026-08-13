/**
 * 登录页（对应 Vue 版 base/pages/login/index.vue）
 * 契约来源：cool-admin-nest AGENTS.md 3.1/3.2
 * 流程：验证码 → 登录 → setToken → 拉取 person + permmenu → 跳首页
 */
import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { App, Button, Form, Input } from "antd";
import { service } from "@/cool/service";
import { useUserStore } from "@/cool/store/user";
import { useMenuStore } from "@/cool/store/menu";
import { useAppStore } from "@/cool/store/app";
import { storage } from "@/cool/utils/storage";
import PicCaptcha, { type PicCaptchaRef } from "./pic-captcha";
import "./login.scss";

interface LoginForm {
	username: string;
	password: string;
	verifyCode: string;
}

export default function LoginPage() {
	const navigate = useNavigate();
	const { message, modal } = App.useApp();
	const { t } = useTranslation();
	const picRef = useRef<PicCaptchaRef>(null);
	const [saving, setSaving] = useState(false);
	const [captchaId, setCaptchaId] = useState("");

	const [form] = Form.useForm<LoginForm>();

	// 已登录且 token 未过期 → 回首页（对齐 Vue 守卫）
	if (useUserStore.getState().token && !storage.isExpired("token")) {
		return <Navigate to="/" replace />;
	}

	// 登录
	const toLogin = async () => {
		const { username, password, verifyCode } = form.getFieldsValue();

		if (!username) {
			message.error(t("login.usernameRequired"));
			return;
		}

		if (!password) {
			message.error(t("login.passwordRequired"));
			return;
		}

		if (!verifyCode) {
			message.error(t("login.captchaRequired"));
			return;
		}

		setSaving(true);

		try {
			// 登录
			const token = await service.base.open.login({ username, password, captchaId, verifyCode });
			useUserStore.getState().setToken(token);

			// token 事件：获取用户信息 + 菜单权限（对应 Vue app.events.hasToken）
			await Promise.all([useUserStore.getState().get(), useMenuStore.getState().get()]);

			// 记住用户名
			storage.set("username", username);

			// 跳转首页
			navigate("/");
		} catch (err) {
			// 刷新验证码
			picRef.current?.refresh();
			form.setFieldValue("verifyCode", "");

			modal.error({ title: t("common.tip"), content: (err as Error).message });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="page-login">
			<div className="page-login__bg">
				<img src="/bg.svg" alt="" />
			</div>

			<div className="page-login__box">
				<div className="page-login__logo">
					<div className="page-login__logo-icon">
						<img src="/logo.png" alt="Logo" />
					</div>
					<span>{useAppStore.getState().name}</span>
				</div>

				<p className="page-login__desc">{t("login.title")}</p>

				<Form form={form} layout="vertical" disabled={saving} className="page-login__form" initialValues={{ username: storage.get("username") || "" }}>
					<Form.Item label={t("login.username")} name="username">
						<Input placeholder={t("login.usernamePlaceholder")} maxLength={20} size="large" />
					</Form.Item>

					<Form.Item label={t("login.password")} name="password">
						<Input.Password placeholder={t("login.passwordPlaceholder")} maxLength={20} size="large" autoComplete="new-password" />
					</Form.Item>

					<Form.Item label={t("login.captcha")} name="verifyCode">
						<div className="page-login__captcha">
							<Input
								placeholder={t("login.captchaPlaceholder")}
								maxLength={4}
								size="large"
								onPressEnter={toLogin}
							/>
							<PicCaptcha ref={picRef} captchaId={captchaId} onChange={setCaptchaId} />
						</div>
					</Form.Item>

					<div className="page-login__op">
						<Button type="primary" size="large" block loading={saving} onClick={toLogin}>
							{t("login.login")}
						</Button>
					</div>
				</Form>
			</div>

			<a href="https://cool-js.com" className="page-login__copyright">
				Copyright © COOL
			</a>
		</div>
	);
}
