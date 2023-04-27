<template>
  <v-app>
    <v-app-bar color="teal-darken-2">
      <v-toolbar-title>Vuetify Dashboard</v-toolbar-title>
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
        <v-flex primary lighten-2 py-4 text-center white--text xs12>
          {{ new Date().getFullYear() }} — <strong>Vuetify Dashboard</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
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

<!--template>
  <nav id="center-nav">
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'EventList' }">Events</router-link> |
    <router-link :to="{ name: 'TrailList' }">Trails</router-link> |
    <router-link :to="{ name: 'BookList' }">Books</router-link> |
    <router-link :to="{ name: 'TravelList' }">Travels</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f0;
}
body {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  line-height: 1.6;
  background: #e8f7f0;
}
.container {
  max-width: 1100px;
  margin: auto;
  overflow: auto;
  padding: 0 2rem;
}
nav {
  padding: 30px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}
#center-nav {
  font-size: 1.5rem;
  padding: 10px;
  text-align: center;
}
.p-align-left {
  text-align: left;
  padding-top: 0em;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.ul-left {
  text-align: left;
  padding-inline-start: 1rem;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.event-link {
  border: 1px solid #ccc;
  background: #41b883;
  padding: 1rem;
  padding-top: 0em;
  border-radius: 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
}
i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #fff;
  cursor: pointer;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.complete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #35495e;
}
.incomplete-box {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #41b882;
}
.is-complete {
  background: #35495e;
  color: #fff;
}
.text-style {
  font-family: "Franklin Gothic Medium", Arial, sans-serif;
  font-size: 1.15rem;
}
#select-box {
  height: 2rem;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* this is for Firefox */
/*input[type='"number"'] {
  -moz-appearance: textfield;
}*/
@media (max-width: 500px) {
  .events {
    grid-template.columns: 1fr;
  }
}
</style-->
