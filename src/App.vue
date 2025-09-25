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
                :class="{ 'mobile-nav-item': isMobile }"
              >
                <!-- ✅ DESKTOP: ICON-ONLY WITH HOVER TOOLTIP -->
                <template v-if="!isMobile">
                  <v-tooltip location="right" :text="link.title">
                    <template v-slot:activator="{ props }">
                      <v-icon 
                        v-bind="props"
                        :icon="link.icon" 
                        class="dropdown-icon"
                        style="color: #8b0000 !important; text-align: center;"
                      />
                    </template>
                  </v-tooltip>
                </template>

                <!-- ✅ MOBILE: ICON + TITLE (NO TOOLTIP NEEDED) -->
                <template v-else>
                  <div class="mobile-nav-content">
                    <v-icon 
                      :icon="link.icon" 
                      class="dropdown-icon mobile-icon"
                      style="color: #8b0000 !important;"
                    />
                    <span class="mobile-nav-title">{{ link.title }}</span>
                  </div>
                </template>
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
          class="mobile-footer"
        >
          <v-layout justify-center wrap class="footer-layout">
            <div 
              v-for="link in links"
              :key="`${link.label}-footer-link`"
              class="footer-nav-item"
            >
              <router-link :to="{ name: `${link.label}` }" class="footer-link">
                <!-- ✅ DESKTOP: ICON-ONLY WITH HOVER TOOLTIP -->
                <template v-if="!isMobile">
                  <v-tooltip location="top" :text="link.title">
                    <template v-slot:activator="{ props }">
                      <v-icon 
                        v-bind="props"
                        :icon="link.icon" 
                        size="small"
                        class="footer-icon"
                      />
                    </template>
                  </v-tooltip>
                </template>
              
                <!-- ✅ MOBILE: ICON + TITLE -->
                <template v-else>
                  <div class="mobile-footer-content">
                    <v-icon 
                      :icon="link.icon" 
                      size="small"
                      class="footer-icon mobile-footer-icon"
                    />
                    <span class="mobile-footer-title">{{ link.title }}</span>
                  </div>
                </template>
              </router-link>
            </div>
          
            <!-- ✅ ONLINE STATUS -->
            <div class="footer-status">
              <p class="footer-info">
                {{ this.onlineStatus == true ? "Online" : "Offline" }}
              </p>
            </div>
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
/* ===== MENU DROPDOWN STYLING ===== */
.menu-dropdown {
  background-color: #d3d3d3 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  font-size: 1.1rem;
  font-weight: bold;
  min-width: 120px;
  padding: 0.5rem 1rem;
  color: #333 !important;
  border-radius: 8px;
  border: none !important;
}

.menu-dropdown .v-btn__overlay,
.menu-dropdown .v-btn__underlay {
  background: transparent !important;
}

/* ===== NAVIGATION MENU STYLING ===== */
.navigation-menu {
  min-width: 120px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* ===== DESKTOP NAV ITEMS (ICON-ONLY) ===== */
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
  cursor: pointer;
}

.nav-menu-item:hover {
  background-color: rgba(139, 0, 0, 0.1) !important;
  transform: scale(1.1);
}

/* ===== MOBILE NAV ITEMS (ICON + TEXT) ===== */
.mobile-nav-item {
  padding: 16px 20px !important;
  text-align: left !important;
  justify-content: flex-start !important;
}

.mobile-nav-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.mobile-icon {
  flex-shrink: 0;
  font-size: 20px !important;
}

.mobile-nav-title {
  color: #333 !important;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 20px !important;
  transition: all 0.3s ease;
}

.nav-menu-item:hover .dropdown-icon {
  transform: scale(1.2);
  filter: brightness(1.2);
}

/* ===== HEADER LAYOUT ===== */
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

/* ===== FOOTER STYLING ===== */
.mobile-footer {
  padding: 1rem !important;
}

.footer-layout {
  justify-content: center !important;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0 1rem; /* ✅ BALANCED PADDING */
}

.footer-nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.footer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  padding: 8px 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 48px;
}

.footer-link:hover {
  background-color: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.footer-icon {
  color: #8b0000 !important;
  margin-bottom: 2px;
}

/* ===== MOBILE FOOTER CONTENT ===== */
.mobile-footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mobile-footer-icon {
  color: #8b0000 !important;
}

.mobile-footer-title {
  color: white !important;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.footer-status {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
  flex-basis: 100%;
}

.footer-info {
  margin: 0 !important;
  color: white;
  font-size: 12px;
  text-align: center;
}

/* ===== CONTENT LAYOUT ===== */
#content-margin {
  margin-top: 4rem;
}

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

/* ===== RESPONSIVE BREAKPOINTS ===== */
@media (max-width: 600px) {
  .menu-dropdown {
    background-color: #bdbdbd !important;
    font-size: 1.3rem;
    min-width: 160px;
    padding: 0.75rem 1.25rem;
  }
  
  .navigation-menu {
    min-width: 220px;
  }
  
  .dropdown-icon {
    font-size: 24px !important;
  }
  
  .mobile-footer {
    padding: 1rem 0.5rem !important;
  }
  
  .footer-layout {
    flex-wrap: wrap;
    justify-content: space-around !important;
    gap: 0.25rem;
    padding: 0 0.5rem;
  }
  
  .footer-nav-item {
    flex: 0 1 calc(20% - 0.5rem);
    margin: 0.25rem 0;
  }
  
  .footer-link {
    padding: 8px 2px;
    min-height: 56px;
  }
  
  .mobile-footer-title {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .footer-nav-item {
    flex: 0 1 calc(25% - 0.5rem);
  }
  
  .mobile-footer-title {
    font-size: 8px;
  }
}

@media (max-width: 360px) {
  .footer-nav-item {
    flex: 0 1 calc(33.333% - 0.5rem);
  }
  
  .mobile-footer-title {
    font-size: 7px;
  }
}
</style>
<!-- @@@@ -->
<!-- @@@@  -->