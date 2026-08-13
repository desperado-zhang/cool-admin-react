import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
// @ts-expect-error 纯 mjs 插件
import { coolEpsPlugin } from "./build/eps/plugin.mjs";

// https://vite.dev/config/
export default defineConfig({
	plugins: [coolEpsPlugin(), react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	server: {
		port: 9001,
		host: true,
		proxy: {
			"/admin": {
				target: process.env.VITE_PROXY_TARGET || "http://localhost:8001",
				changeOrigin: true
			}
		}
	},
	build: {
		chunkSizeWarningLimit: 2048,
		rollupOptions: {
			output: {
				manualChunks: {
					react: ["react", "react-dom", "react-router-dom"],
					antd: ["antd", "@ant-design/icons"],
					chart: ["echarts", "echarts-for-react"]
				}
			}
		}
	}
});
