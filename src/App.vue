<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/App.vue -->
<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="nav">
    <!-- ✅ LOGIN PAGE LAYOUT -->
    <v-app v-if="this.$route.name == 'Login' || this.$route.name == 'Register' || this.$route.name == 'ForgotPassword' || this.$route.name == 'PasswordReset'">
      <v-app-bar color="teal-darken-2">
        <v-toolbar-title>
          <router-link to="/" style="color: white; text-decoration: none;">
            Home Projects
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <p style="color: white;">{{ this.onlineStatus ? "Online" : "Offline" }}</p>
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>

    <!-- ✅ HOME PAGE SIMPLE LAYOUT -->
    <v-app v-else-if="this.$route.name == 'home'">
      <v-app-bar color="teal-darken-2">
        <v-toolbar-title>Home Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <p style="color: white;">{{ this.onlineStatus ? "Online" : "Offline" }}</p>
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>

    <!-- ✅ MAIN APP LAYOUT WITH NAVIGATION -->
    <v-app v-else>
      <!-- ✅ TOP HEADER WITH DROPDOWN MENU -->
      <v-app-bar color="teal-darken-2">
        <!-- ✅ DROPDOWN MENU BUTTON -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn 
              v-bind="props" 
              class="menu-dropdown" 
              variant="elevated"
              :icon="isMobile"
            >
              <i v-if="isMobile" class="fas fa-bars menu-icon"></i>
              <span v-else class="menu-text">Menu</span>
            </v-btn>
          </template>
          
          <!-- ✅ DROPDOWN MENU ITEMS -->
          <v-list class="navigation-menu">
            <v-list-item
              v-for="link in links"
              :key="`${link.label}-header-link`"
              @click="navigateToPage(link)"
              class="nav-menu-item"
              :class="{ 'mobile-nav-item': isMobile }"
            >
              <!-- ✅ DESKTOP: ICON WITH TOOLTIP -->
              <template v-if="!isMobile">
                <v-tooltip location="right" :text="link.title">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props" class="nav-item-content">
                      <i :class="link.icon" class="dropdown-icon"></i>
                    </div>
                  </template>
                </v-tooltip>
              </template>

              <!-- ✅ MOBILE: ICON + TEXT -->
              <template v-else>
                <div class="nav-item-content mobile-content">
                  <i :class="link.icon" class="dropdown-icon mobile-icon"></i>
                  <span class="mobile-nav-text">{{ link.title }}</span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- ✅ APP TITLE -->
        <v-toolbar-title class="app-title">
          <router-link to="/about" class="title-link">
            Home Projects
          </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- ✅ ONLINE STATUS -->
        <p class="online-status">{{ this.onlineStatus ? "Online" : "Offline" }}</p>
      </v-app-bar>

      <!-- ✅ MAIN CONTENT AREA -->
      <v-main>
        <router-view></router-view>
      </v-main>

      <!-- ✅ BOTTOM FOOTER NAVIGATION -->
      <!-- ✅ SIMPLIFIED FOOTER -->
      <v-footer 
        color="teal-darken-2" 
        app 
        class="smart-footer"
        :class="{ 'footer-visible': showFooter, 'footer-hidden': !showFooter }"
      >
        <div class="footer-nav">
          <button
            v-for="link in links"
            :key="`${link.label}-footer-link`"
            class="nav-button"
            @click="navigateToPage(link)"
            :title="link.title"
          >
            <div class="footer-link">
              <i :class="link.icon" class="footer-icon"></i>
              <span v-if="isMobile" class="footer-text">{{ link.title }}</span>
            </div>
          </button>
        </div>
      </v-footer>
    </v-app>
  </div>
</template>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/App.vue -->
<script>
import { authComputed } from './vuex/helpers.js'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

// ✅ ONLY IMPORT COMPONENTS YOU ACTUALLY USE
import {
  VApp,
  VAppBar,
  VMain,
  VFooter,
  VToolbarTitle,
  VSpacer,
  VMenu,
  VBtn,
  VList,
  VListItem,
  VTooltip
} from 'vuetify/components'

export default {
  components: {
    ConfirmDialogue,
    // ✅ ONLY REGISTER COMPONENTS YOU USE
    VApp,
    VAppBar,
    VMain,
    VFooter,
    VToolbarTitle,
    VSpacer,
    VMenu,
    VBtn,
    VList,
    VListItem,
    VTooltip
    // ❌ REMOVED: VBtnToggle (not used)
    // ❌ REMOVED: VProgressCircular (not used)
  },
  
  computed: {
    ...authComputed,
    isMobile() {
      return window.innerWidth <= 768;
    },
    isAuthPage() {
      const authPages = ['Login', 'Register', 'ForgotPassword', 'PasswordReset'];
      return authPages.includes(this.$route.name);
    },
    
    isHomePage() {
      return this.$route.name === 'home';
    }
  },
  
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    
    // ✅ UNIFIED NAVIGATION METHOD
    navigateToPage(link) {
      if (link.label === 'Login') {
        // Special handling for logout
        this.logout();
      } else {
        this.$router.push({ name: link.label });
      }
    },

    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    handleScroll() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // ✅ CALCULATE HOW CLOSE TO BOTTOM (within 100px)
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // ✅ SHOW FOOTER WHEN NEAR BOTTOM OR AT TOP
      this.showFooter = distanceFromBottom <= 100 || scrollTop <= 50;
      
      // ✅ DEBUG (remove in production)
      // console.log('📏 Scroll:', { windowHeight, documentHeight, scrollTop, distanceFromBottom, showFooter: this.showFooter });
    }    
  },
  
  data() {
    return {
      onlineStatus: navigator.onLine,
      windowWidth: window.innerWidth,
      showFooter: false,
      links: [
        {
            label: "About",
            url: "/about",
          title: "About",
          icon: "fas fa-info-circle"
        },
        {
          label: "BookList",
          url: "/books", 
          title: "Books",
          icon: "fas fa-book-open"
        },
        {
          label: "EventList",
          url: "/",
          title: "Events", 
          icon: "fas fa-calendar-check"
        },
        {
          label: "FilmList",
          url: "/films",
          title: "Films",
          icon: "fas fa-film"
        },
        {
          label: "Gardens",
          url: "/gardens",
          title: "Gardens",
          icon: "fas fa-seedling"
        },
        {
          label: "GolfList", 
          url: "/golfs",
          title: "Golf",
          icon: "fas fa-golf-ball-tee"  // ✅ CORRECT FONTAWESOME ICON
        },
        {
          label: "HealthDashboard",
          url: "/health_dashboard", 
          title: "Health Dashboard",
          icon: "fas fa-pills"
        },
        {
          label: "ProductsByLocations",
          url: "/products",
          title: "Shopping",
          icon: "fas fa-shopping-cart"
        },
        {
          label: "TrailList",
          url: "/trails",
          title: "Trails", 
          icon: "fas fa-hiking"
        },
        {
          label: "TravelList",
          url: "/travels",
          title: "Travels",
          icon: "fas fa-plane"
        },
        {
          label: "Login",
          url: "/login", 
          title: "Sign Out",
          icon: "fas fa-sign-out-alt"
        },
      ],
    };
  },

  mounted() {
    // ✅ LISTEN FOR WINDOW RESIZE
    window.addEventListener('resize', () => {
      this.$forceUpdate(); // Force re-render on resize
    });
    
    // ✅ LISTEN FOR SCROLL EVENTS
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // ✅ LISTEN FOR ONLINE/OFFLINE STATUS
    window.addEventListener('online', () => {
      this.onlineStatus = true;
    });
    
    window.addEventListener('offline', () => {
      this.onlineStatus = false;
    });
  },
  
  beforeUnmount() {
    // ✅ CLEANUP EVENT LISTENERS
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
/* ✅ APP TITLE STYLING */
.app-title {
  margin-left: 1rem;
}

.title-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.2rem;
}

.title-link:hover {
  text-decoration: underline;
}

.online-status {
  color: white;
  font-size: 0.9rem;
  margin: 0;
}

/* ✅ MENU DROPDOWN BUTTON */
.menu-dropdown {
  background-color: #ffffff !important;
  color: #333 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  border-radius: 8px;
  margin-right: 1rem;
}

.menu-icon {
  color: #8b0000 !important;
  font-size: 20px;
}

.menu-text {
  color: #333 !important;
  font-weight: bold;
  font-size: 14px;
}

/* ✅ DROPDOWN NAVIGATION MENU */
.navigation-menu {
  min-width: 160px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-height: 420px;
  overflow-y: auto;
}

.nav-menu-item {
  padding: 12px 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  margin: 4px 8px;
}

.nav-menu-item:hover {
  background-color: rgba(139, 0, 0, 0.1) !important;
  transform: translateX(5px);
}

.nav-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.mobile-content {
  justify-content: flex-start !important;
  gap: 12px;
}

/* ✅ DROPDOWN ICONS */
.dropdown-icon {
  color: #8b0000 !important;
  font-size: 18px;
  transition: all 0.3s ease;
}

.mobile-icon {
  font-size: 20px !important;
}

.mobile-nav-text {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.nav-menu-item:hover .mobile-nav-text {
  color: #8b0000 !important;
}

/* ========================================
   SMART FOOTER - FIXED & RESPONSIVE
   ======================================== */

.smart-footer {
  height: 60px !important;
  min-height: 60px !important;
  max-height: 60px !important;
  padding: 0 !important;
  overflow: visible !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1005 !important;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out !important;
}

/* ✅ FOOTER VISIBILITY STATES */
.footer-visible {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.footer-hidden {
  transform: translateY(100%) !important;
  opacity: 0 !important;
}

/* ✅ FOOTER NAVIGATION - ALWAYS USE GRID FOR ALL 11 ITEMS */
.footer-nav {
  display: grid !important;
  grid-template-columns: repeat(11, 1fr) !important;
  gap: 2px !important;
  width: 100% !important;
  height: 100% !important;
  align-items: stretch !important;
  padding: 4px 4px !important;
  box-sizing: border-box !important;
}

/* ✅ NAVIGATION BUTTONS - FIT TO GRID */
.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px !important;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.footer-link {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  gap: 2px !important;
}

/* ✅ FOOTER ICONS */
.footer-icon {
  color: white !important;
  font-size: 16px !important;
  transition: all 0.2s ease;
  flex-shrink: 0 !important;
}

.footer-text {
  color: white !important;
  font-size: 8px !important;
  font-weight: 500 !important;
  text-align: center !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* ✅ DESKTOP HOVER EFFECTS */
@media (min-width: 769px) {
  .smart-footer {
    height: 70px !important;
    min-height: 70px !important;
    max-height: 70px !important;
  }

  .footer-nav {
    padding: 8px 16px !important;
    gap: 4px !important;
  }

  .nav-button {
    padding: 4px !important;
  }
  
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  .nav-button:hover .footer-icon {
    transform: scale(1.15);
    color: #ffeb3b !important;
  }
  
  .footer-icon {
    font-size: 20px !important;
  }
  
  .footer-text {
    font-size: 10px !important;
  }
}

/* ✅ TABLET */
@media (max-width: 768px) {
  .smart-footer {
    height: 55px !important;
    min-height: 55px !important;
    max-height: 55px !important;
  }
  
  .footer-nav {
    padding: 4px 8px !important;
    gap: 2px !important;
  }
  
  .footer-icon {
    font-size: 14px !important;
  }
  
  .footer-text {
    font-size: 7px !important;
  }
}

/* ✅ MOBILE */
@media (max-width: 480px) {
  .smart-footer {
    height: 50px !important;
    min-height: 50px !important;
    max-height: 50px !important;
  }
  
  .footer-nav {
    padding: 2px 4px !important;
    gap: 1px !important;
  }
  
  .nav-button {
    padding: 1px !important;
  }
  
  .footer-icon {
    font-size: 12px !important;
  }
  
  .footer-text {
    font-size: 6px !important;
  }
}

/* ✅ TINY SCREENS */
@media (max-width: 360px) {
  .smart-footer {
    height: 45px !important;
    min-height: 45px !important;
    max-height: 45px !important;
  }
  
  .footer-icon {
    font-size: 11px !important;
  }
  
  .footer-text {
    font-size: 5px !important;
  }
}

/* ✅ MAIN CONTENT PADDING (for fixed footer) */
.v-main {
  padding-bottom: 80px !important;
}

@media (max-width: 768px) {
  .v-main {
    padding-bottom: 70px !important;
  }
}

@media (max-width: 480px) {
  .v-main {
    padding-bottom: 60px !important;
  }
}

/* ✅ VUETIFY OVERRIDES */
.v-footer {
  height: auto !important;
  min-height: auto !important;
  flex: 0 0 auto !important;
}

.v-application {
  padding-bottom: 0 !important;
}
</style>