import { createApp } from "vue";
//import Vue from "vue";
import App from "./App.vue";
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";
import "./plugins/vuetify";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
loadFonts();

createApp(App).use(router).use(store).use(vuetify).mount("#app");
//Vue.config.productionTip = false

//new Vue({
//  router,
//  store,
//  vuetify,

