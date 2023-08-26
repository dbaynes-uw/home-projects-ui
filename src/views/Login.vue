<template>
  <div>
    <form @submit.prevent="login">
      <label for="email">
        Email:
      </label>
      <input v-model="email" type="email" name="email" value>

      <label for="password">
        Password:
      </label>
      <input v-model="password" type="password" name="password" value>

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
          this.$router.push({ name: 'About' })
        })
        .catch(err => {
          console.log("Login Error: ", err.response.data.error)
          this.error = err.response.data.error
        })
    }
  }
}
</script>
<style lang="scss">
@import '../assets/authorization.scss';
</style>
