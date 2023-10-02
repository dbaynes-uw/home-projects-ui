<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Log In</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="login">
      <v-container id="form-container">
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@email.com"
        />
        <v-text-field
          label="Password"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          hint="At least 8 characters"
          @click:append="showPassword = !showPassword"
        />

        <v-btn type="submit" block class="mt-2" @click="login">Submit</v-btn>

      </v-container>
    </v-form>
      <p>{{ message }}</p>
  </v-card-text>

      <router-link to="/register">
        Don't have an account? Register.
      </router-link>
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
      showPassword: false,
      error: null,
      message: '',
      isFormValid: true,
    }
  },
  buttonLabel() {
    return (this.showPassword) ? "Hide" : "Show";
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
        .catch(err => {
          console.log("Login Error: ", err.response.data.error)
          this.message = err.response.data.error
          this.error = err.response.data.error
        })
    }
  }
}
</script>
<style>
/*@import '../assets/styles/global.css';*/

@import '../assets/authorization.scss';
</style>
