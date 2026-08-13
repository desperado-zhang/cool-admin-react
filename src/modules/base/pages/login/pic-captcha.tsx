/**
 * 图片验证码（对应 Vue 版 login/components/pic-captcha.vue）
 * - 挂载即刷新；点击刷新；支持 svg / base64 两种返回
 */
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { App, Spin } from "antd";
import { service } from "@/cool/service";

export interface PicCaptchaRef {
	refresh: () => Promise<void>;
}

interface PicCaptchaProps {
	captchaId: string;
	onChange: (captchaId: string) => void;
}

const PicCaptcha = forwardRef<PicCaptchaRef, PicCaptchaProps>(({ onChange }, ref) => {
	const { modal } = App.useApp();
	const [svg, setSvg] = useState("");
	const [base64, setBase64] = useState("");
	const [loading, setLoading] = useState(true);

	const refresh = async () => {
		setSvg("");
		setBase64("");
		setLoading(true);

		try {
			const { captchaId, data } = await service.base.open.captcha({
				height: 45,
				width: 150,
				color: "#2c3142"
			});

			if (data) {
				if (data.includes(";base64,")) {
					setBase64(data);
				} else {
					setSvg(data);
				}
				onChange(captchaId);
			} else {
				modal.error({ title: "提示", content: "验证码获取失败" });
			}
		} catch (err) {
			modal.error({ title: "提示", content: (err as Error).message });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useImperativeHandle(ref, () => ({ refresh }));

	return (
		<div className="pic-captcha" onClick={refresh} title="点击刷新">
			{svg ? <div className="pic-captcha__svg" dangerouslySetInnerHTML={{ __html: svg }} /> : null}
			{base64 ? <img className="pic-captcha__base64" src={base64} alt="验证码" /> : null}
			{loading ? <Spin size="small" /> : null}
		</div>
	);
});

export default PicCaptcha;
