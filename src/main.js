import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./theme.css";
import "./style.css";
import "virtual:uno.css";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
