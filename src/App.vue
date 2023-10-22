<script setup>
</script>
<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div id="nav">
    <v-app v-if="this.$route.name == 'home'">
      <v-app-bar color="teal-darken-2">
        <v-toolbar-title>Home Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <!--v-btn
          text
          rounded
        >
          <router-link :to="{ name: 'Login' }">
            Login
          </router-link>
        </!--v-btn-->
        <p>&nbsp; &nbsp; {{ this.onlineStatus == true ? "Online" : "Offline" }}&nbsp;</p>
      </v-app-bar>
      <v-content style="margin-top: 7rem">
        <router-view></router-view>
      </v-content>
    </v-app>
    <v-app v-else-if="this.$route.name == 'Login'">
      <v-app-bar color="teal-darken-2">
        <v-toolbar-title>Home Projects!!</v-toolbar-title>
        <v-spacer></v-spacer>
        <p>&nbsp; &nbsp; {{ this.onlineStatus == true ? "Online" : "Offline" }}&nbsp;</p>
      </v-app-bar>
      <v-content style="margin-top: 7rem">
        <router-view></router-view>
      </v-content>
    </v-app>
    <v-app v-else>
      <v-app-bar color="teal-darken-2">
        <v-toolbar-title>Home Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          v-for="link in links"
          :key="`${link.label}-header-link`"
          color="white"
          text
          rounded
          class="my-2"
        >
          <router-link :to="{ name: `${link.label}` }">
            {{ link.title }}
          </router-link>
        </v-btn>
        <button type="button" class="logoutButton" @click="logout">
          Exit
        </button>
        <p>{{ this.onlineStatus == true ? "Online" : "Offline" }}</p>
      </v-app-bar>
      <v-content style="margin-top: 7rem">
        <router-view></router-view>
      </v-content>
      <v-footer
        color="teal-darken-2"
        padless
        style="display: flex; flex: 0 0 auto !important; top: 2rem"
      >
        <v-layout justify-center wrap>
          <button
            v-for="link in links"
            :key="`${link.label}-footer-link`"
            class="logoutButton"
            text
            rounded
          >
            <router-link :to="{ name: `${link.label}` }">
              {{ link.title }}
            </router-link>
          </button>
          <button type="button" class="logoutButton" @click="logout">
            Exit
          </button>       
          <!--v-flex primary lighten-2 py-4 text-center white--text xs12>
            {{ new Date().getFullYear() }} — <strong>Vuetify Dashboard</strong>
          </v-flex-->
        </v-layout>
      </v-footer>
    </v-app>
  </div>
</template>
<script>
//import { RouterLink, useLink } from 'vue-router';
//import axios from 'axios'
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
          label: "EventList",
          url: "/",
          title: "Events",
        },
        {
          label: "BookList",
          url: "/books",
          title: "Books",
        },
        {
          label: "ProductList",
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
      ],
    };
  },
}
</script>

<!--
<style lang="scss" scoped>
#nav {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.2em 1em;
  background: linear-gradient(to right, #16c0b0, #84cf6a);
}

.nav-welcome {
  margin-left: auto;
  margin-right: 1rem;
  color: white;
}

a {
  font-weight: bold;
  color: #2c3e50;
  margin: auto 0.8em auto 0.4em;
  text-decoration: none;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
}

.router-link-exact-active {
  color: white;
  border-bottom: 2px solid #fff;
}

button,
.button {
  margin-left: auto;
  background: white;
  text-decoration: none;
  color: #2c3e50;

  &.router-link-active {
    color: #2c3e50;
  }
}

.logoutButton {
  cursor: pointer;
}

.nav-welcome + button {
  margin-left: 0;
}
</style>
-->
