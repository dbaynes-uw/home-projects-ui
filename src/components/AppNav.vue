<script setup>
</script>
<template>
  <div class="text-center">
    <v-select
      v-model="link"
      :items="links"
      label="Home Projects"
    ></v-select>
    <v-menu :link="link">
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          dark
          v-bind="props"
        >
          Dropdown
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(link) in links"
          :key="`${link.label}-header-link`"
        >
          <v-list-item-title>
            <router-link :to="{ name: `${link.label}` }">
            {{ link.title }}
          </router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
</script>
<script>
//import { RouterLink, useLink } from 'vue-router';
//import axios from 'axios'jj
//import { authComputed } from './vuex/helpers.js'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import AppNav from "@/components/AppNav.vue";

export default {

  components: {
    ConfirmDialogue,
    AppNav,
  },
  computed: {
    //...authComputed
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
          label: "GolfList",
          url: "/golfs",
          title: "Golfs",
        },
        {
          label: "MedList",
          url: "/meds",
          title: "Meds",
        },
        {
          label: "ProductLocationList",
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

<!--style lang="scss" scoped>
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
