import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
// ❌ REMOVE PINIA - YOU'RE USING VUEX
// import { createPinia } from 'pinia'
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";

import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// ✅ MINIMAL VUETIFY COMPONENTS TO AVOID CRASHES
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
  VTabsWindowItem,
  VAlert,
  VChip,
  VProgressLinear,
  VMenu,
  VDivider,
  VToolbar,
  VToolbarTitle,
  VSpacer,
  VForm,
  VTextarea
} from 'vuetify/components'

import { Ripple } from 'vuetify/directives'

// ✅ SIMPLIFIED VUETIFY CONFIG
const vuetify = createVuetify({
  components: {
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
    VTabsWindowItem,
    VAlert,
    VChip,
    VProgressLinear,
    VMenu,
    VDivider,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    VForm,
    VTextarea
  },
  directives: {
    Ripple,
  },
  theme: {
    defaultTheme: 'light'
  },
  // ✅ USE MATERIAL DESIGN ICONS (NO FONTAWESOME FOR NOW)
  icons: {
    defaultSet: 'mdi',
  },
})

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// ✅ SAFE FONT LOADING
try {
  const { loadFonts } = require("./plugins/webfontloader");
  loadFonts();
} catch (error) {
  console.warn('Could not load fonts:', error.message);
}

// ✅ SIMPLE APP CREATION (NO COMPLEX BEFORECREATE)
const app = createApp(App);

// ✅ CONFIGURE APP (NO PINIA!)
app.use(router);
app.use(store); // ✅ ONLY VUEX, NO PINIA
app.use(vuetify);
app.component("v-select", vSelect);

// ✅ SAFE USER RESTORATION
try {
  const userString = localStorage.getItem('user');
  if (userString) {
    const userData = JSON.parse(userString);
    store.commit('SET_USER_DATA', userData);
  }
} catch (error) {
  console.warn('Could not restore user data:', error.message);
  localStorage.removeItem('user');
}

// ✅ BASIC AXIOS INTERCEPTOR
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// ✅ BASIC MEMORY MONITORING (ONLY IN PRODUCTION)
if (process.env.NODE_ENV === 'production') {
  window.app = app;
  
  // ✅ SIMPLE MEMORY CHECK (EVERY 30 SECONDS)
  setInterval(() => {
    if (performance.memory) {
      const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      console.log(`💾 Memory: ${used}MB`);
      
      if (used > 80) {
        console.warn('🚨 High memory usage:', used, 'MB');
      }
    }
  }, 30000);
}

// ✅ MOUNT APP
app.mount("#app");