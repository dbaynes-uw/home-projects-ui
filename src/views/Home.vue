<template>
  <div class="home">
    <h1>Welcome to the App</h1>
    <h2 class="error-message" v-if="!this.$store.state.errors == ''">{{ this.$store.state.errors }} <a href="mailto:dlbaynes@gmail.com">David Baynes</a></h2>
    <h2 v-else>{{ this.$store.message }}</h2>
    <div>
      <h2>Once registered you'll need to<br/>
        <router-link to="/login">
          Sign In Here
        </router-link>
      </h2>
    </div>
  </div>
</template>

<script>
import { authComputed } from '../vuex/helpers.js'
//import { Register } from '@/views/Register.vue'

export default {
  name: "Home",
  // eslint-disable-next-line vue/require-prop-type-constructor
  props: ['message'],
  //components: {
  //  Register
  //},
  //data () {
  //  return {
  //    message: ''
  //  }
  //},
  computed: {
    ...authComputed
  },
}
</script>
<style>
.error-message {
  color: red;
  font-weight: bold;
}
</style>