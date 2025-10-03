import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import { createPinia } from 'pinia'
import "./assets/global.css";
import router from "./router";
import store from "./vuex/store.js";

// ✅ REMOVE THIS LINE - YOU HAVE DUPLICATE VUETIFY CONFIG
// import "./plugins/vuetify";

import { createVuetify } from 'vuetify'
import 'vuetify/styles' // ✅ ADD VUETIFY STYLES

// ✅ TREE-SHAKEN VUETIFY COMPONENTS (Add more as needed)
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
  VTextarea,
  VCheckbox,
  VRadio,
  VRadioGroup,
  VSwitch,
  VSlider,
  VRangeSlider,
  VDatePicker,
  VTimePicker,
  VAutocomplete,
  VCombobox,
  VFileInput,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText
} from 'vuetify/components'

import { Ripple } from 'vuetify/directives'

// ✅ FONTAWESOME OPTIMIZATION - SPECIFIC ICONS ONLY
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// ✅ IMPORT ONLY ICONS YOU ACTUALLY USE
import {
  faUser,
  faHome,
  faBook,
  faCalendar,
  faFilm,
  faPills,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faBars,
  faSignOutAlt,
  faSave,
  faCancel,
  faEye,
  faFilter,
  faSort,
  faCog,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

// ✅ ADD ONLY NEEDED ICONS TO LIBRARY
library.add(
  faUser,
  faHome,
  faBook,
  faCalendar,
  faFilm,
  faPills,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faBars,
  faSignOutAlt,
  faSave,
  faCancel,
  faEye,
  faFilter,
  faSort,
  faCog,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight
)

// ✅ OPTIMIZED VUETIFY CONFIG
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
    VTextarea,
    VCheckbox,
    VRadio,
    VRadioGroup,
    VSwitch,
    VSlider,
    VRangeSlider,
    VDatePicker,
    VTimePicker,
    VAutocomplete,
    VCombobox,
    VFileInput,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText
  },
  directives: {
    Ripple,
  },
  theme: {
    defaultTheme: 'light'
  },
  // ✅ FONTAWESOME ICONS (TREE-SHAKEN)
  icons: {
    defaultSet: 'fa',
    sets: {
      fa: {
        component: FontAwesomeIcon,
      },
    },
  },
})

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { loadFonts } from "./plugins/webfontloader";

// ✅ REMOVE THIS MASSIVE FONTAWESOME IMPORT - CAUSES R14!
// import '@fortawesome/fontawesome-free/css/all.css'

loadFonts();

// ✅ CREATE APP WITH MEMORY OPTIMIZATION
const app = createApp({
  extends: App,
  beforeCreate() {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const userData = JSON.parse(userString)
        this.$store.commit('SET_USER_DATA', userData)
      } catch (error) {
        console.warn('🚨 Invalid user data in localStorage, clearing...')
        localStorage.removeItem('user')
      }
    }
    
    // ✅ OPTIMIZED AXIOS INTERCEPTOR
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.code && !error.message.includes("401")) {
          return Promise.reject(error)
        }
        return Promise.reject(error)
      }
    )
  }
})

// ✅ CONFIGURE APP
app.use(router)
app.use(store)
app.use(createPinia())
app.use(vuetify)
app.component("v-select", vSelect)
app.component("font-awesome-icon", FontAwesomeIcon) // ✅ REGISTER FONTAWESOME COMPONENT

// ✅ OPTIMIZED MEMORY MONITORING
if (process.env.NODE_ENV === 'production') {
  // Store app reference for cleanup
  window.app = app
  
  // ✅ AGGRESSIVE MEMORY MONITORING FOR R14 PREVENTION
  setInterval(() => {
    if (performance.memory) {
      const memory = performance.memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      console.log(`💾 Memory: ${used}MB / ${total}MB`);
      
      // ✅ LOWER THRESHOLDS FOR R14 PREVENTION
      if (used > 50) { // 50MB warning (was 100MB)
        console.warn('🚨 Memory usage elevated:', used, 'MB');
        
        // ✅ FORCE CLEANUP AT 80MB (was 200MB)
        if (used > 80 && store) {
          console.warn('🚨 Critical memory - forcing cleanup');
          try {
            store.dispatch('forceCleanup');
            
            // ✅ FORCE GARBAGE COLLECTION
            if (window.gc) {
              window.gc();
            }
          } catch (error) {
            console.error('🚨 Cleanup failed:', error);
          }
        }
      }
    }
  }, 15000); // ✅ CHECK EVERY 15 SECONDS (was 30)
  
  // ✅ EMERGENCY MEMORY CLEANUP ON ROUTE CHANGES
  router.afterEach(() => {
    setTimeout(() => {
      if (performance.memory) {
        const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        if (used > 60) {
          console.warn('🧹 Post-route cleanup - memory:', used, 'MB');
          store.dispatch('clearLargeDatasets');
        }
      }
    }, 1000); // Cleanup 1 second after route change
  });
}

// ✅ MOUNT APP
app.mount("#app")