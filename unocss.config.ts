// uno.config.ts
import { defineConfig, presetUno, presetIcons } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  shortcuts: {
    "bg-color": "bg-white dark:bg-gray-950",
    "bg-color-primary": "primary-bg dark:bg-gray-800",
  },
  rules: [
    ["primary-txt", { color: "var(--el-text-color-primary) !important" }],
    ["regular-txt", { color: "var(--el-text-color-regular) !important" }],
    ["secondary-txt", { color: "var(--el-text-color-secondary) !important" }],
    ["white-txt", { color: "var(--el-color-white) !important" }],
    ["active-txt", { color: "#000000 !important" }],
    ["grey-bg", { background: "var(--el-bg-color-page)" }],
    ["home-bg-padding", { padding: "24px 56px" }],
    ["bg-padding", { padding: "24px" }],
    [
      "danger-btn",
      {
        "background-color": "var(--el-color-danger) !important",
        "border-color": "var(--el-color-danger) !important",
      },
    ],
    ["h-content-page", { "min-height": "calc(100vh - 80px - 24px - 24px)" }],
    [
      /^h-content-page-([\.\d]+)$/,
      ([_, num]) => ({
        "min-height": `calc(100vh - 80px - 24px - 24px - ${num}px)`,
      }),
    ],
    [
      /^grid-col-auto-([\.\d]+)$/,
      ([_, num]) => ({
        "grid-template-columns": `repeat(auto-fit, minmax(${num}px, 1fr))`,
      }),
    ],
    [
      "skeleton-card",
      {
        width: "100%",
        padding: "24px",
        "box-shadow": "var(--el-box-shadow)",
        "border-radius": "8px",
        "background-color": "var(--el-fill-color)",
      },
    ],
    [
      "skeleton-animation",
      {
        background:
          "linear-gradient( 90deg, var(--el-fill-color) 25%, var(--el-fill-color-darker) 37%, var(--el-fill-color-darker) 63%)",
        "background-size": "400% 100%",
        animation: "skeleton-loading 1.4s ease infinite alternate",
      },
    ],
  ],
  theme: {
    colors: {
      primary: "var(--el-color-primary)",
      "primary-light-3": "var(--el-color-primary-light-3)",
      "primary-light-5": "var(--el-color-primary-light-5)",
      "primary-light-7": "var(--el-color-primary-light-7)",
      "primary-light-8": "var(--el-color-primary-light-8)",
      "primary-light-9": "var(--el-color-primary-light-9)",
      "primary-dark-2": "var(--el-color-primary-dark-2)",
    },
  },
});
