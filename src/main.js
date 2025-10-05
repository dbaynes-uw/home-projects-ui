import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";

// ✅ FIXED VUETIFY IMPORTS
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// ✅ IMPORT SPECIFIC COMPONENTS
import { 
  VCard, 
  VCardTitle, 
  VCardText, 
  VCardSubtitle,
  VCardActions,
  VForm, 
  VContainer, 
  VTextField, 
  VBtn 
} from 'vuetify/components'

const vuetify = createVuetify({
  components: {
    VCard,
    VCardTitle, 
    VCardText,
    VCardSubtitle,
    VCardActions,
    VForm,
    VContainer,
    VTextField,
    VBtn
  },
  directives,
})

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// ✅ CREATE APP
const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);
app.component("v-select", vSelect);

// ✅ BASIC USER RESTORATION
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

// ✅ BASIC AXIOS SETUP
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized');
    }
    return Promise.reject(error);
  }
);

app.mount("#app");