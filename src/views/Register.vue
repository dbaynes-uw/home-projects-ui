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
      <input v-model="email" type="email" name="email" id="login-field" value :rules="[requiredAdmin]">

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
  props: ["message"],
  data () {
    return {
      name: '',
      username: '',
      email: '',
      password: '',
      errors: null,
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
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          this.errors = err.response.data.errors
        })
    },
    requiredAdmin: function (value) {
      console.log("requiredAdmin: - this.isAdminValid: ", this.isAdminValid)
      console.log("VALUE: ", value)
      if (value == 'dlbaynes@gmail.com') {
          this.isAdminValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isAuthorValid = false
          return 'Please enter Admin';
      }
    },

  }
}
</script>

<style scoped>
</style>
