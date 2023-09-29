<template>
  <div>
    <form @submit.prevent="login">
      <label for="email">
        Email:
      </label>
      <input
        v-model="email"
        type="email"
        name="email"
        id="login-field"
        value
        placeholder="example@email.com"
      >
      <label for="password">
        Password:
      </label>
      <input v-model="password"
        type="password"
        name="password"
        id="login-field"
        value
        placeholder="password"
      >

      <button type="submit" name="button">
        Login
      </button>

      <p>{{ error }}</p>

      <router-link to="/register">
        Don't have an account? Register.
      </router-link>
    </form>
  </div>
</template>

<script>
export default {
  state: {
    token: "",
    errors: null,
  },
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    login () {
      console.log("Login.vue login!!!");
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          //this.$router.push({ name: 'dashboard' })
          this.$store.commit('SET_ERRORS', "")
          this.$router.push({ name: 'About' })
        })
        //.catch(err => {
        //  console.log("Login Error: ", err.response.data.error)
        //  this.error = err.response.data.error
        //})
    }
  }
}
</script>
<style>
/*@import '../assets/styles/global.css';*/

@import '../assets/authorization.scss';
</style>
