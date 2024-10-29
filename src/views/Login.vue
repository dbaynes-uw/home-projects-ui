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
  <p>T: dl..@.. t...t... P: dl..@.. sen...H...P</p>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength} from '@vuelidate/validators';
import { reactive, computed } from 'vue';
import { ref } from 'vue';
const successMessage = ref('')
export default {
  mounted() {
    this.$store.dispatch('logout');
    if (this.$route.query.success) {
      successMessage.value = this.$route.query.success;
      this.statusMessage = successMessage.value
      console.log("StatusMessage: ", this.statusMessage )
    }
  },
  setup () {
    const state = reactive({
      email: '',
      password: '',
    })
    const rules = computed(() => {
      return {
        email: { required, email},
        password: { required, minLength: minLength(8) },
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
      statusMessage: '',
    }
  },

  buttonLabel() {
    return (this.showPassword) ? "Hide" : "Show";
  },

  methods: {
    async login () {
      this.v$.$validate()
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
            console.log("Login this.v$.$error: ", this.v$.$error)
            console.log("Login err: ", err)
            this.$router.push({ name: "Login", query: {success: "Invalid Login Credentials - also make sure that API has started."} });
            location.reload()
            //this.message = err.response.data.error
            //?this.error = err.response.data.error
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
