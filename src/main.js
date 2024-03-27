import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./theme.css";
import "./style.css";
import "virtual:uno.css";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
