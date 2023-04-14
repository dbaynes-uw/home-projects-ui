import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App).use(store).use(router);
// treat all tags starting with 'ion-' as custom elements
app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith("ion-"); // (return true)
};
app.mount("#app");
