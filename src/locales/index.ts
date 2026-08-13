/**
 * i18n（i18next + react-i18next）
 * - 语言持久化 localStorage 'locale'（对齐 Vue 版 config.i18n）
 * - AntD locale 联动（App.tsx 读取 useI18nStore）
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { create } from "zustand";
import zhCN from "./zh-CN";
import enUS from "./en-US";

export type Locale = "zh-CN" | "en-US";

export const languages: { label: string; value: Locale }[] = [
	{ label: "中文", value: "zh-CN" },
	{ label: "English", value: "en-US" }
];

/** 初始语言（对齐 Vue：storage.get('locale')） */
const initLocale: Locale = (() => {
	try {
		const v = JSON.parse(localStorage.getItem("locale") || "null");
		return v === "en-US" ? "en-US" : "zh-CN";
	} catch {
		return "zh-CN";
	}
})();

i18n.use(initReactI18next).init({
	resources: {
		"zh-CN": { translation: zhCN },
		"en-US": { translation: enUS }
	},
	lng: initLocale,
	fallbackLng: "zh-CN",
	interpolation: { escapeValue: false }
});

interface I18nState {
	locale: Locale;
	setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>()((set) => ({
	locale: initLocale,
	setLocale(locale) {
		i18n.changeLanguage(locale);
		localStorage.setItem("locale", JSON.stringify(locale));
		set({ locale });
	}
}));

export default i18n;
