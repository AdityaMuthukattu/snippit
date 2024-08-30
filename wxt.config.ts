import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs"],
    action: {},
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    web_accessible_resources: [
      {
        resources: ["wizard.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
  vite: () => ({
    plugins: [react()],
    // server: {
    //     proxy: {
    //       '/api': {
    //         target: 'http://localhost:11434',
    //         changeOrigin: true,
    //         rewrite: (path) => path.replace(/^\/api/, ''),
    //       },
    //     },
    //   },
  }),
});
