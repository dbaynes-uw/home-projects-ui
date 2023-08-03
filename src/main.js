import { createApp } from "vue";
//import Vue from "vue";
import App from "./App.vue";
import "./assets/global.css";
import router from "./router";
import store from "./store";
import "./plugins/vuetify";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
loadFonts();
/**
 * Load JWT from Local Storage on Refresh.
 */
let localAuthToken = localStorage.auth_token;
let cookieExists = localAuthToken !== "undefined" && localAuthToken !== null;
if (cookieExists) {
  const auth_token = localStorage.getItem("auth_token");
  const authTokenExists = auth_token !== "undefined" && auth_token !== null;
  if (authTokenExists) {
    store.dispatch("loginUserWithToken", { auth_token });
  }
}
createApp(App).use(router).use(store).use(vuetify).mount("#app");
