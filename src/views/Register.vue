<template>
  <div>
    <form @submit.prevent="register">
      <label for="name">
        Name:
      </label>
      <input v-model="name" type="text" name="name" id="login-field" value>
      <label for="username">
        User Name:
      </label>
      <input v-model="username" type="text" name="username" id="login-field" value>

      <label for="email">
        Email:
      </label>
      <input v-model="email" type="email" name="email" id="login-field" value>

      <label for="password">
        Password:
      </label>
      <input v-model="password" type="password" name="password" id="login-field" value>

      <button type="submit" name="button">
        Register
      </button>

      <ul>
        <li v-for="(error, index) in errors" :key="index">
          {{ error }}
        </li>
      </ul>

      <router-link to="/login">
        Already have an account? Login.
      </router-link>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      errors: null
    }
  },
  methods: {
    register () {
      this.$store
        .dispatch('register', {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push({ name: 'About' })
        })
        .catch(err => {
          this.errors = err.response.data.errors
        })
    }
  }
}
</script>

<style scoped>
</style>
