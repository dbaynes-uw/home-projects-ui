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
              <!-- DROPDOWN MENU -->
              <v-btn v-bind="props" class="menu-dropdown" variant="plain">
                <i v-if="isMobile" class="fas fa-bars" style="color: #8b0000 !important;"></i>
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
                <template v-if="!isMobile">
                  <v-tooltip location="top" :text="link.title">
                    <template v-slot:activator="{ props }">
                      <i
                        v-bind="props"
                        :key="`${link.label}-header-link`"
                        :class="link.icon"
                        class="footer-icon"
                        style="color: #8b0000 !important; font-size: 14px; position: relative; top: 0rem;left: .05rem;"
                      ></i>
                    </template>
                  </v-tooltip>
                </template>

                <!-- MOBILE FOOTER -->
                <template v-else>
                  <i
                    :class="link.icon"
                    class="footer-icon"
                    style="color: #8b0000 !important; font-size: 14px;"
                  ></i>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
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
        <!-- ✅ DESKTOP: ICON-ONLY WITH HOVER TOOLTIP -->
        <template v-if="!isMobile">
          <v-tooltip location="top" :text="link.title">
            <template v-slot:activator="{ props }">
              <v-icon 
                v-bind="props"
                :icon="link.icon" 
                size="small" 
                class="footer-icon"
                style="color: #8b0000 !important;
                  position: relative;
                  left: .05rem;"
              />
          <!--span class="mobile-footer-text">{{ link.title }}</~span-->

            </template>
          </v-tooltip>
        </template>
      
        <!-- ✅ MOBILE: ICON + TEXT (NO TOOLTIP NEEDED) -->
        <template v-else>
          <v-icon 
            :icon="link.icon" 
            size="small" 
            class="footer-icon"
            style="color: #8b0000 ;
              position: relative;
              left: .05rem;"
          />
        </template>
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
      links: [
        {
          label: "About",
          url: "/about",
          title: "About",
          icon: "fas fa-info-circle" // ℹ️ Info icon
        },
        {
          label: "BookList",
          url: "/books", 
          title: "Books",
          icon: "fas fa-book-open" // 📖 Open book
        },
        {
          label: "EventList",
          url: "/",
          title: "Events", 
          icon: "fas fa-calendar-check" // 📅 Calendar with check
        },
        {
          label: "FilmList",
          url: "/",
          title: "Films",
          icon: "fas fa-film" // 🎬 Film icon
        },
        {
          label: "Gardens",
          url: "/gardens",
          title: "Gardens",
          icon: "fas fa-seedling" // 🌱 Plant/garden icon
        },
        {
          label: "GolfList", 
          url: "/golfs",
          title: "Golf",
          icon: "fas fa-golf-ball" // ⛳ Golf ball
        },
        {
          label: "MedList",
          url: "/meds", 
          title: "Meds",
          icon: "fas fa-pills" // 💊 Pills
        },
        {
          label: "ProductsByLocations",
          url: "/products",
          title: "Shopping",
          icon: "fas fa-shopping-cart" // 🛒 Shopping cart
        },
        {
          label: "TrailList",
          url: "/trails",
          title: "Trails", 
          icon: "fas fa-hiking" // 🥾 Hiking
        },
        {
          label: "TravelList",
          url: "/travels",
          title: "Travels",
          icon: "fas fa-plane" // ✈️ Airplane
        },
        {
          label: "Login",
          url: "/login", 
          title: "SignOut",
          icon: "fas fa-sign-out-alt" // 🚪 Logout
        },
      ],
    };
  },
}
</script>
<style scoped>
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
#content-margin {
  margin-top: 4rem;
} 
/* Changes Here */
.nav-button {
  cursor: pointer;
  font-weight: bold;
}
/* ✅ DROPDOWN MENU STYLING */
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
  color: blue !important;
  margin-left: 2rem;
  margin-bottom: 2px;
}

.footer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 8px 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 0; /* ✅ ALLOW SHRINKING */
}

.footer-link:hover {
  background-color: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.nav-button {
  cursor: pointer;
  font-weight: bold;
  flex: 1; /* ✅ EQUAL DISTRIBUTION */
  min-width: 0; /* ✅ ALLOW SHRINKING */
}

/* ✅ DESKTOP: SHOW TOOLTIPS ON HOVER */
@media (min-width: 601px) {
  .footer-link {
    padding: 12px 8px;
    min-height: 48px;
  }
  
  .footer-icon {
    color: blue !important;
    font-size: 16px !important;
    margin-left: 1rem;
  }
  
  .nav-button {
    max-width: calc(100% / 11); /* ✅ EQUAL WIDTH FOR 11 ITEMS */
  }
}

/* ✅ MOBILE: SHOW ICON + TEXT, WRAP TO MULTIPLE ROWS */
.mobile-nav-item {
  padding: 16px 20px !important;
  text-align: left !important;
  justify-content: flex-start !important;
}

.mobile-nav-text {
  color: #333 !important;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  text-align: left;
}

.mobile-nav-item:hover .mobile-nav-text {
  color: #8b0000 !important; /* Red text on hover */
}

/* ✅ ADJUST MOBILE NAVIGATION MENU WIDTH */
@media (max-width: 600px) {
  .navigation-menu {
    min-width: 180px; /* Wider for text */
  }
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
  
  /* ✅ MOBILE FOOTER LAYOUT */
  .v-layout {
    flex-wrap: wrap !important;
    justify-content: space-around !important;
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
  
  .nav-button {
    flex: 0 1 calc(20% - 0.5rem); /* ✅ 5 ITEMS PER ROW */
    margin: 0.25rem 0;
    max-width: none;
  }
  
  .footer-link {
    padding: 10px 2px;
    min-height: 60px;
    font-size: 10px;
  }
  
  .footer-icon {
    font-size: 14px !important;
    margin-left: 1rem;
    margin-bottom: 4px;
  }
  
  .footer-info {
    flex-basis: 100%; /* ✅ FORCE TO NEW ROW */
    text-align: center;
    margin-top: 1rem !important;
    font-size: 12px;
  }
}

/* ✅ VERY SMALL MOBILE SCREENS */
@media (max-width: 480px) {
  .nav-button {
    flex: 0 1 calc(25% - 0.5rem); /* ✅ 4 ITEMS PER ROW */
  }
  
  .footer-link {
    font-size: 9px;
    min-height: 56px;
  }
  
  .footer-icon {
    font-size: 12px !important;
    margin-left: 1rem;

  }
}

/* ✅ EXTRA SMALL SCREENS */
@media (max-width: 360px) {
  .nav-button {
    flex: 0 1 calc(33.333% - 0.5rem); /* ✅ 3 ITEMS PER ROW */
  }
  
  .footer-link {
    font-size: 8px;
    min-height: 52px;
  }
  
  .footer-icon {
    font-size: 10px !important;
    margin-left: 1rem;
  }
}
</style>