import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";
import "./css/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ContextMenu);

router.isReady().then(() => {
  app.mount("#app");
});
