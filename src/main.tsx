import { createRoot } from "react-dom/client";
import { createEps } from "./cool/service";
import App from "./App";
import "./index.css";

// EPS 服务层绑定（构建期注入的 virtual:eps）
createEps();

createRoot(document.getElementById("app")!).render(<App />);
