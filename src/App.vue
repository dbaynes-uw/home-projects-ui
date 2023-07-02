<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-app>
    <v-app-bar color="teal-darken-2">
      <v-toolbar-title>Home Project Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="`${link.label}-header-link`"
        text
        rounded
      >
        <router-link :to="{ name: `${link.label}` }">
          {{ link.title }}
        </router-link>
      </v-btn>
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
        <v-btn
          v-for="link in links"
          :key="`${link.label}-footer-link`"
          color="white"
          text
          rounded
          class="my-2"
        >
          <router-link :to="{ name: `${link.label}` }">
            {{ link.title }}
          </router-link>
        </v-btn>
        <!--v-flex primary lighten-2 py-4 text-center white--text xs12>
          {{ new Date().getFullYear() }} — <strong>Vuetify Dashboard</strong>
        </v-flex-->
      </v-layout>
    </v-footer>
  </v-app>
</template>
<script>
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
export default {
  name: "App",
  components: {
    ConfirmDialogue,
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
          url: "/events",
          title: "Events",
        },
        {
          label: "BookList",
          url: "/books",
          title: "Books",
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
          title: "Login",
        },
      ],
    };
  },
};
</script>
