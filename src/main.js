import { createApp } from "vue";
import { createPinia } from 'pinia';
import axios from "axios";
import App from "./App.vue";
import "./assets/global.css";
import './assets/styles/card-components.css';
import './assets/styles/table-components.css';
import './assets/styles/ui-components.css';
import router from "./router";
import store from "./vuex/store.js";

import BaseDivider from '@/components/ui/BaseDivider.vue'
import BaseForm from '@/components/ui/BaseForm.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextField from '@/components/ui/BaseTextField.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

const app = createApp(App)
const pinia = createPinia()

// ✅ DISABLE VUE DEVTOOLS IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  app.config.devtools = false;
  app.config.performance = false;
}

app.use(pinia);
app.use(router);
app.use(store);
app.component('BaseDivider', BaseDivider)
app.component('BaseForm', BaseForm)
app.component('BaseIcon', BaseIcon)
app.component('BaseSelect', BaseSelect)
app.component('BaseTextField', BaseTextField)
app.component('BaseTextarea', BaseTextarea)

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