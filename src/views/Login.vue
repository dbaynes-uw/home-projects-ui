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
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength} from '@vuelidate/validators';
import { reactive, computed } from 'vue';
export default {
  mounted() {
    console.log("Login!")
    this.$store.dispatch('logout');
  },
  setup () {
    const state = reactive({
      email: '',
      password: '',
    })
    const rules = computed(() => {
      return {
        email: { required, email},
        password: { required, minLength: minLength(8) }
      } 
    })
    const v$ = useVuelidate(rules, state)
    return {
      state,
      v$,
    }
  },
  data () {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: null,
      message: '',
      isFormValid: true,
      urlMinLength: 8,
    }
  },

  buttonLabel() {
    return (this.showPassword) ? "Hide" : "Show";
  },

  methods: {
    async login () {
      this.v$.$validate()
      console.log("V$: ", this.v$)
      console.log("V$.$error: ", this.v$.$error)
      if (!this.v$.$error) {
        this.$store
          .dispatch('login', {
            email: this.state.email,
            password: this.state.password
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
}
</script>
<style>
/*@import '../assets/styles/global.css';*/

@import '../assets/authorization.scss';
</style>
