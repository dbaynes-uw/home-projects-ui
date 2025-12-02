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
  max-height: 400px;
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

/* ✅ FOOTER CONTAINER */
/* ✅ FOOTER CONTAINER - FIXED HEIGHT */
.footer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0; /* ✅ REDUCED PADDING */
  min-height: auto; /* ✅ NO MIN HEIGHT */
  max-height: 80px; /* ✅ MAXIMUM HEIGHT LIMIT */
}
/* ✅ SMART FOOTER - SMOOTH TRANSITIONS */
.smart-footer {
  height: 50px !important;
  min-height: 50px !important;
  max-height: 50px !important;
  padding: 0 !important;
  overflow: hidden;
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

/* ✅ FOOTER NAVIGATION */
.footer-nav {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 0; /* ✅ REDUCED FROM 8px */
  min-height: auto; /* ✅ NO MIN HEIGHT */
}

.footer-status {
  text-align: center;
  padding-top: 4px; /* ✅ REDUCED FROM 8px */
  padding-bottom: 4px; /* ✅ ADD BOTTOM PADDING */
}

/* ✅ FOOTER NAVIGATION BUTTONS - COMPACT */
.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px; /* ✅ REDUCED FROM 8px */
  border-radius: 6px; /* ✅ SMALLER RADIUS */
  transition: all 0.3s ease;
  flex: 1;
  min-width: 0;
  max-width: calc(100% / 11);
  height: auto; /* ✅ AUTO HEIGHT */
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px); /* ✅ REDUCED FROM -2px */
}

.footer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 32px; /* ✅ REDUCED FROM 48px */
  max-height: 36px; /* ✅ ADD MAX HEIGHT */
  padding: 2px; /* ✅ REDUCED FROM 4px */
}

.mobile-footer {
  min-height: 40px !important; /* ✅ REDUCED FROM 60px */
  max-height: 44px !important; /* ✅ ADD MAX HEIGHT */
}

/* ✅ FOOTER ICONS - SMALLER */
.footer-icon {
  color: white !important;
  font-size: 14px; /* ✅ REDUCED FROM 16px */
  transition: all 0.3s ease;
}

.mobile-footer-icon {
  font-size: 12px !important; /* ✅ REDUCED FROM 14px */
  margin-bottom: 2px; /* ✅ REDUCED FROM 4px */
}

.footer-text {
  color: white;
  font-size: 9px; /* ✅ REDUCED FROM 10px */
  font-weight: 500;
  text-align: center;
  line-height: 1.1; /* ✅ TIGHTER LINE HEIGHT */
  margin: 0; /* ✅ NO MARGIN */
}

.footer-info {
  color: white;
  margin: 0;
  font-size: 11px; /* ✅ REDUCED FROM 12px */
  font-weight: 500;
  line-height: 1; /* ✅ TIGHT LINE HEIGHT */
}

/* ✅ MOBILE RESPONSIVE - EVEN MORE COMPACT */
@media (max-width: 768px) {
  .smart-footer {
    height: 50px !important;        /* ✅ INCREASED FROM 45px */
    min-height: 50px !important;
    max-height: 50px !important;
  }
  
  .footer-nav {
    padding: 3px 2px;              /* ✅ SLIGHTLY MORE PADDING */
  }
  
  .nav-button {
    height: 44px;                  /* ✅ INCREASED FROM 38px */
    max-height: 44px;
    padding: 3px 1px;              /* ✅ BETTER SPACING */
  }
  
  .footer-link {
    height: 40px;                  /* ✅ INCREASED FROM 34px */
    max-height: 40px;
    padding: 2px 1px;              /* ✅ BETTER INTERNAL SPACING */
  }
  
  .footer-icon {
    font-size: 15px !important;    /* ✅ SLIGHTLY LARGER ICONS */
    margin-bottom: 2px;            /* ✅ BETTER ICON SPACING */
  }
  
  .footer-text {
    font-size: 9px !important;     /* ✅ INCREASED FROM 8px */
    line-height: 1.1;              /* ✅ BETTER LINE HEIGHT */
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  .smart-footer {
    height: 48px !important;       /* ✅ INCREASED FROM 40px */
    min-height: 48px !important;
    max-height: 48px !important;
  }
  
  .footer-nav {
    padding: 2px 1px;              /* ✅ MINIMAL BUT PRESENT PADDING */
  }
  
  .nav-button {
    height: 42px;                  /* ✅ INCREASED FROM 34px */
    max-height: 42px;
    padding: 2px 0.5px;            /* ✅ MINIMAL PADDING */
  }
  
  .footer-link {
    height: 38px;                  /* ✅ INCREASED FROM 30px */
    max-height: 38px;
    padding: 1px;
  }
  
  .footer-icon {
    font-size: 14px !important;    /* ✅ GOOD SIZE FOR SMALL SCREENS */
    margin-bottom: 1px;
  }
  
  .footer-text {
    font-size: 8.5px !important;   /* ✅ SLIGHTLY LARGER */
    line-height: 1.2;              /* ✅ BETTER READABILITY */
  }
}

@media (max-width: 360px) {
  .footer-container {
    max-height: 55px; /* ✅ SUPER COMPACT */
  }
  
  .nav-button {
    flex: 0 1 calc(33.333% - 4px);
    padding: 1px;
  }
  
  .footer-text {
    font-size: 6px;
  }
  
  .mobile-footer-icon {
    font-size: 9px !important;
  }
  
  .footer-link {
    min-height: 20px;
    max-height: 24px;
  }
}

/* ✅ BETTER RESPONSIVE GRID FOR FOOTER BUTTONS */
.footer-nav {
  display: grid;                  /* ✅ USE GRID INSTEAD OF FLEX */
  grid-template-columns: repeat(11, 1fr);  /* ✅ 11 EQUAL COLUMNS */
  gap: 1px;                       /* ✅ TINY GAP BETWEEN BUTTONS */
  width: 100%;
  height: 100%;
  align-items: stretch;
  padding-left: 1rem;
  box-sizing: border-box;
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;                   /* ✅ ALLOW SHRINKING */
  width: 100%;
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* ✅ HOVER EFFECTS ONLY ON DESKTOP */
@media (min-width: 769px) {
  .footer-nav {
    display: flex;                /* ✅ FLEX ON DESKTOP */
    justify-content: space-around;
    gap: 0;
  }
  
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  .nav-button:hover .footer-icon {
    transform: scale(1.1);
    color: #ffeb3b !important;
  }
  
  .footer-icon {
    font-size: 16px;
  }
  
  .footer-text {
    font-size: 9px;
  }
}
/* ✅ ENSURE FOOTER DOESN'T INTERFERE WITH CONTENT */
.v-footer {
  height: auto !important;
  min-height: auto !important;
  flex: 0 0 auto !important; /* ✅ DON'T GROW */
}

/* ✅ MAIN CONTENT ADJUSTMENT - NO PADDING SINCE FOOTER IS SMART */
.v-main {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

/* ✅ REMOVE VUETIFY APP PADDING */
.v-application {
  padding-bottom: 0 !important;
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
/* ✅ DESKTOP SPECIFIC */
@media (min-width: 769px) {
  .footer-link {
    min-height: 48px;
  }
  
  .footer-icon {
    font-size: 18px !important;
  }
  
  .nav-button:hover .footer-icon {
    transform: scale(1.1);
    color: #ffeb3b !important; /* Yellow on hover */
  }
}
</style>