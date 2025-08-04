<script setup>
</script>
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
        <div class="menu-base"><!--style="width: 8rem; height: 3.1rem;"--> <!--style="background-color: #41b88352; height: 10%;"-->
          <!--v-menu open-on-hover id="menu-dropdown-div" :link="links" offset-y -->
          <v-menu :link="links" offset-y >          
            <template v-slot:activator="{ props }">
              <v-select
                v-model="menu"
                :items="links"
                v-bind="props"
                variant="plain"
                class="menu-dropdown"
              >
                <template v-slot:prepend-inner>
                  <v-icon v-if="isMobile">mdi-menu</v-icon>
                  <span v-else>&nbsp;Menu</span>
                </template>
              </v-select>
            </template>
            <v-list>
              <v-card
                flat
                width="10rem"
                height="10rem"
                :style="{
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  top: '0px',
                }"
               /> 
              <v-list-item
                v-for="(link) in links"
                :key="`${link.label}-header-link`"
              >
                <v-list-item-title>
                  <router-link class="menu-visited-color" :to="{ name: `${link.label}` }">
                  {{ link.title }}
                </router-link>
                </v-list-item-title>
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
            <router-link :to="{ name: `${link.label}` }">
              {{ link.title }}
            </router-link>
          </button>
          <p class="footer-info" style="margin-top: 0.75rem">{{ this.onlineStatus == true ? "Online" : "Offline" }}</p>      
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
    ...authComputed
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
        },
        {
          label: "BookList",
          url: "/books",
          title: "Books",
        },
        {
          label: "EventList",
          url: "/",
          title: "Events",
        },
        {
          label: "FilmList",
          url: "/",
          title: "Films",
        },
        {
          label: "Gardens",
          url: "/gardens",
          title: "Gardens",
        },
        {
          label: "GolfList",
          url: "/golfs",
          title: "Golf",
        },
        {
          label: "MedList",
          url: "/meds",
          title: "Meds",
        },
        //{
        //  label: "ProductLocationList",
        //  url: "/products",
        //  title: "location_list",
        //},
        {
          label: "ProductsByLocations",
          url: "/products",
          title: "Shopping",
        },
        {
          label: "TrailList",
          url: "/trails",
          title: "Trails",
        },
        {
          label: "TravelList",
          url: "/travels",
          title: "Travels",
        },
        {
          label: "Login",
          url: "/login",
          title: "SignOut",
        },
      ],
      menu: "Menu",
    };
  },
}
</script>
<style scoped>
.menu-dropdown {
  font-size: 1.1rem;
  font-weight: bold;
  min-width: 120px;
  padding: 0.5rem 1rem;
}

@media (max-width: 600px) {
  .menu-dropdown {
    font-size: 1.3rem;
    min-width: 160px;
    padding: 0.75rem 1.25rem;
    background: #fff;
    color: #333;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }
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
  .footer-info {
    margin-top: 0.75rem !important;
  }
</style>