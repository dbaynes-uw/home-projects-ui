<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h1>Home Projects</h1>
      <h3>Log In</h3>
    </v-card-title>
  </v-card>
  <span v-if="statusMessage">
      <h2 style="color: red">
        {{ statusMessage }}
      </h2>
    </span>
  <v-card-text>
    <v-form @submit.prevent="login">
      <v-container id="form-container">
        <v-text-field
          label="Email"
          v-model="state.email"
          type="email"
          name="email"
          placeholder="example@email.com"
        />
        <span v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </span>
        <v-text-field
          label="Password (Mininum 8 characters)"
          v-model="state.password"
          :append-icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          @click:append="showPassword = !showPassword"
        />
        <!--hint="Required minimum of 8 characters"-->
        <span>
          {{ state.password.length }} characters used.
        </span>
        <span v-if="v$.password.$error">
          {{ v$.password.$errors[0].$message }}
        </span>
        <br/>
        <v-btn type="submit" block class="mt-2" @click="login">Submit</v-btn>
      </v-container>
    </v-form>
      <p>{{ message }}</p>
  </v-card-text>
  Don't have an account? 
  <router-link to="/register">
    Register
  </router-link>
  <br />
  Forgot or Need Password Reset?  
  <router-link to="/forgot_password">
    Forgot or Reset Password
  </router-link>
  <p>T: dl..@.. t...t... P: dl..@.. sen...H...P</p>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {}
    }
  },
  
  computed: {
    isFormValid() {
      return this.email && this.password && Object.keys(this.errors).length === 0
    }
  },
  
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.email)) {
        this.errors.email = 'Invalid email format'
      } else {
        delete this.errors.email
      }
    },
    
    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Password is required'
      } else if (this.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      } else {
        delete this.errors.password
      }
    }
  }
}
</script>

<style scoped></style>