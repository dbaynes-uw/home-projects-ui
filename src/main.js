import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import { createPinia } from 'pinia'
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";
import "./plugins/vuetify";
import vuetify from "./plugins/vuetify";
//import { VuelidatePlugin } from '@vuelidate/core'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { loadFonts } from "./plugins/webfontloader";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";

loadFonts();

createApp({
  extends: App,
  beforeCreate() {
    const userString = localStorage.getItem('user')
    if (userString) {
      const userData = JSON.parse(userString)
      this.$store.commit('SET_USER_DATA', userData)
    }
    axios.interceptors.response.use(
      response => response,
      error => {
        //if (error.response.status === 401) {
        //this.$store.dispatch('logout')
        //}
        //return Promise.reject(error)
        //router.back(error)
        if (error.code){
          if (!error.message.includes("401")) {
            return Promise.reject(error)
            //!this.$router.push({ name: "About", query: {success: error.message} });
          }       
        }
      }
    )
  }
}).use(router)
  .use(store)
  .use(createPinia())
  .use(vuetify)
  .use("v-select", vSelect)
  .mount("#app")

