import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import { createPinia } from 'pinia'
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";
import "./plugins/vuetify";
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
// ✅ IMPORT ONLY COMPONENTS YOU USE
import {
  VApp,
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VIcon,
  VTextField,
  VSelect,
  VDataTable,
  VDialog,
  VList,
  VListItem,
  VAppBar,
  VNavigationDrawer,
  VTabs,
  VTab,
  VTabsWindow,
  VTabsWindowItem
} from 'vuetify/components'

// ✅ IMPORT ONLY DIRECTIVES YOU USE
import { Ripple } from 'vuetify/directives'

// ✅ MINIMAL VUETIFY CONFIG
const vuetify = createVuetify({
  components: {
    aliases,
    fa,
    VApp,
    VMain,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VIcon,
    VTextField,
    VSelect,
    VDataTable,
    VDialog,
    VList,
    VListItem,
    VAppBar,
    VNavigationDrawer,
    VTabs,
    VTab,
    VTabsWindow,
    VTabsWindowItem
  },
  directives: {
    Ripple,
  },
  theme: {
    defaultTheme: 'light'
  }
})
//import { VuelidatePlugin } from '@vuelidate/core'

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { loadFonts } from "./plugins/webfontloader";
//import "material-design-icons-iconfont/dist/material-design-icons.css";
import '@fortawesome/fontawesome-free/css/all.css'

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
  .component("v-select", vSelect)
  .mount("#app")

if (process.env.NODE_ENV === 'production') {
  // Monitor memory usage
  setInterval(() => {
    if (performance.memory) {
      const memory = performance.memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      console.log(`💾 Memory: ${used}MB / ${total}MB`);
      
      // Warn if using too much memory
      if (used > 100) { // 100MB warning
        console.warn('🚨 High memory usage detected:', used, 'MB');
        
        // Auto-cleanup if memory is too high
        if (used > 200 && window.app?.$store) { // 200MB critical
          console.warn('🚨 Critical memory - forcing cleanup');
          window.app.$store.dispatch('forceCleanup');
        }
      }
    }
  }, 30000); // Check every 30 seconds
}
