<template>
  <div class="home">
    <h1>Welcome to the App!</h1>
    <h2 class="error-message" v-if="!this.$store.state.errors == ''">{{ this.$store.state.errors }}</h2>
    <div> <!---- v-if="!loggedIn"-->
      To use this app you'll need to
      <router-link to="/login">
        <h2>Sign In</h2>
      </router-link>
      <!--or
      <router-link-- to="/register">
        Register
      </router-link-->
    </div>
  </div>
</template>

<script>
import { authComputed } from '../vuex/helpers.js'
export default {
  name: "Home",
  props: ["message"],
  computed: {
    ...authComputed
  }
  
}
</script>
<style>
.error-message {
  color: red;
  font-weight: bold;
}
</style>