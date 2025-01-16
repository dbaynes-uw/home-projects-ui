<script setup>
</script>
<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="nav">
    <v-locale-provider rtl>
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
        <!--div-->
        <div style="height: 1.75rem;font-weight: bold; font-family: system-ui; background-color: #d3d3d338;">Home Projects</div>
        <div style="width:2rem;"> <!--style="background-color: #41b88352; height: 10%;"-->
          <!--v-menu open-on-hover id="menu-dropdown-div" :link="links" offset-y -->
          <v-menu :link="links" offset-y >          
            <template v-slot:activator="{ props }">
              <v-select
                v-model="menu"
                :items="links"
                v-bind="props"
                style="position: relative; left: 0.5rem;font-weight: bold; color: #000; font-family: system-ui"
              >                
              </v-select>
            </template>
            <v-list>
              <v-card
                flat
                width="100%"
                height="100%"
                :style="{
                  backgroundColor: 'transparent',
                  position: 'absolute', top: '0px',
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
    </v-locale-provider>
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
      console.log("APP.VUE Logout!")
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
          label: "GardenStart",
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
      menu: "|||",
    };
  },
}
</script>
<style scoped>
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