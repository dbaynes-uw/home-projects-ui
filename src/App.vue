<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="nav">
    <v-app v-if="this.$route.name == 'home'">
      <v-app-bar color="teal-darken-2">
        <p>&nbsp; &nbsp;{{ this.onlineStatus == true ? "Online" : "Offline" }}&nbsp;</p>
      </v-app-bar>
      <span id="content-margin">
        <router-view></router-view>
      </span>
    </v-app>
    <v-app v-else-if="this.$route.name == 'Login'">
      <v-app-bar color="teal-darken-2">
        <p>&nbsp; &nbsp;{{ this.onlineStatus == true ? "Online" : "Offline" }}&nbsp;</p>
      </v-app-bar>
      <span id="content-margin">
        <router-view></router-view>
      </span>
    </v-app>
    <!-- Good stuff Starts Here -->
    <v-app v-else>
      <div class="header-base">
        <div class="menu-base">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="menu-dropdown" variant="plain">
                <v-icon v-if="isMobile" style="color: #8b0000 !important;">mdi-menu</v-icon>
                <span v-else class="menu-text" style="font-weight: bold !important;">&nbsp;Menu</span>
              </v-btn>
            </template>
            <v-list class="navigation-menu">
              <v-list-item
                v-for="link in links"
                :key="`${link.label}-header-link`"
                @click="$router.push({ name: link.label })"
                class="nav-menu-item"
              >
                <!-- ✅ MOBILE-FRIENDLY TOOLTIP APPROACH -->
                <v-tooltip 
                  :location="isMobile ? 'left' : 'right'" 
                  :text="link.title"
                  :open-on-hover="!isMobile"
                  :open-on-click="isMobile"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon 
                      v-bind="props"
                      :icon="link.icon" 
                      class="dropdown-icon"
                      style="color: #8b0000 !important; text-align: center;"
                    />
                  </template>
                </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <h1 class="heading-aligned">&nbsp;
        <router-link id="h1-link" :to="{ name: 'EventList' }">Home Projects</router-link>
      </h1>
      </div>
      <span>
        <router-view></router-view>
      </span>
      <v-footer
        color="teal-darken-2"
        padless
        style="display: flex; flex: 0 0 auto !important; top: 2rem"
      >
        <v-layout justify-center wrap>
          <button
            v-for="link in links"
            :key="`${link.label}-footer-link`"
            class="nav-button"
            text
            rounded
          >
            <router-link :to="{ name: `${link.label}` }" class="footer-link">
              <!-- ✅ MOBILE-FRIENDLY FOOTER TOOLTIPS -->
              <v-tooltip 
                :location="isMobile ? 'top' : 'top'" 
                :text="link.title"
                :open-on-hover="!isMobile"
                :open-on-click="isMobile"
              >
                <template v-slot:activator="{ props }">
                  <v-icon 
                    v-bind="props"
                    :icon="link.icon" 
                    size="small" 
                    class="footer-icon"
                    style="color: #8b0000 !important; text-align: center; margin-left: 1rem;"
                  />
                </template>
              </v-tooltip>          
            <!--span class="footer-text">{{ link.title }}</span-->
            </router-link>
          </button>
          <p class="footer-info" style="margin-top: 0.75rem">
            {{ this.onlineStatus == true ? "Online" : "Offline" }}
          </p>      
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { authComputed } from './vuex/helpers.js'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  components: {
    ConfirmDialogue,
  },
  computed: {
    ...authComputed,
    isMobile() {
      return window.innerWidth <= 600;
    },
  },
  methods: {
    logout () {
      this.$store.dispatch('logout');
    }
  },
data() {
  return {
    onlineStatus: navigator.onLine,
    links: [
      {
        label: "About",
        url: "/about",
        title: "About",
        icon: "mdi-information-outline" // ℹ️ Info icon
      },
      {
        label: "BookList",
        url: "/books", 
        title: "Books",
        icon: "mdi-book-open-page-variant" // 📖 Open book
      },
      {
        label: "EventList",
        url: "/",
        title: "Events", 
        icon: "mdi-calendar-check" // 📅 Calendar with check
      },
      {
        label: "FilmList",
        url: "/",
        title: "Films",
        icon: "mdi-movie-open" // 🎬 Film/movie icon
      },
      {
        label: "Gardens",
        url: "/gardens",
        title: "Gardens",
        icon: "mdi-flower" // 🌸 Flower/garden icon
      },
      {
        label: "GolfList", 
        url: "/golfs",
        title: "Golf",
        icon: "mdi-golf" // ⛳ Golf flag
      },
      {
        label: "MedList",
        url: "/meds", 
        title: "Meds",
        icon: "mdi-medical-bag" // 💊 Medical bag
      },
      {
        label: "ProductsByLocations",
        url: "/products",
        title: "Shopping",
        icon: "mdi-cart" // 🛒 Shopping cart
      },
      {
        label: "TrailList",
        url: "/trails",
        title: "Trails", 
        icon: "mdi-hiking" // 🥾 Hiking icon
      },
      {
        label: "TravelList",
        url: "/travels",
        title: "Travels",
        icon: "mdi-airplane" // ✈️ Airplane
      },
      {
        label: "Login",
        url: "/login", 
        title: "SignOut",
        icon: "mdi-logout" // 🚪 Logout icon
      },
    ],
    menu: "@Menu",
  };
},
}
</script>
<style scoped>

.menu-dropdown {
  background-color: #d3d3d3 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  font-size: 1.1rem;
  font-weight: bold;
  min-width: 120px;
  padding: 0.5rem 1rem;
  color: #333 !important; /* Original dark grey color */
  border-radius: 8px;
  border: none !important;
}
/* ✅ REMOVE OVERLAY/UNDERLAY BACKGROUND */
.menu-dropdown .v-btn__overlay,
.menu-dropdown .v-btn__underlay {
  background: transparent !important;
}

/* ✅ NAVIGATION MENU STYLING */
.navigation-menu {
  min-width: 120px; /* Smaller since just icons */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* ✅ ENHANCED HOVER EFFECTS FOR TOOLTIPS */
.nav-menu-item {
  padding: 12px;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
  text-align: center;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* Show it's clickable */
}

.nav-menu-item:hover {
  background-color: rgba(139, 0, 0, 0.1) !important;
  transform: scale(1.1);
}

.dropdown-icon {
  font-size: 20px !important;
  transition: all 0.3s ease;
}

.nav-menu-item:hover .dropdown-icon {
  transform: scale(1.2); /* Icon grows slightly on hover */
  filter: brightness(1.2); /* Icon gets slightly brighter */
}
/* ✅ FOOTER LINK STYLING (keep as-is since it's perfect) */
.footer-info {
  margin-top: 0.75rem !important;
}
.footer-icon {
  color: #8b0000 !important;
  margin-bottom: 2px;
}

/* ✅ OR ADD CONTAINER MARGIN IF NEEDED */
.footer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 0.5rem; /* ✅ BALANCED MARGIN ON CONTAINER */
}

.footer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.footer-link:hover {
  background-color: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 600px) {
  .menu-dropdown {
    background-color: #bdbdbd !important;
    font-size: 1.3rem;
    min-width: 160px;
    padding: 0.75rem 1.25rem;
  }
  
  .dropdown-icon {
    font-size: 24px !important;
  }
  
  .navigation-menu {
    min-width: 140px;
  }
  
  .nav-menu-item {
    padding: 16px;
  }
}

/* ✅ HEADER LAYOUT */
.header-base {
  display: flex;
  align-items: center;
  background-color: #00695c;
  padding: 1rem;
}

.menu-base {
  margin-right: 1rem;
}

.heading-aligned {
  color: white;
  margin: 0;
}

#h1-link {
  color: white;
  text-decoration: none;
}

#h1-link:hover {
  text-decoration: underline;
}

/* ✅ EXISTING STYLES */
#tool-bar-title {
  flex: .7;
  margin-inline-start: 2px;
  text-align: left;
  width: 10rem;
}

.nav-button {
  cursor: pointer;
  font-weight: bold;
}

#content-margin {
  margin-top: 4rem;
}
</style>