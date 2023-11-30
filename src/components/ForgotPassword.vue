<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Forgot or Reset Password</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="handleSubmitForgot">
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
        <br/>
        <v-btn type="submit" block class="mt-2" @click="handleSubmit">Submit</v-btn>

      </v-container>
    </v-form>
      <p>{{ message }}</p>
  </v-card-text>   
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators';
import { reactive, computed } from 'vue';
export default {
  setup () {
    const state = reactive({
      email: '',
    })
    const rules = computed(() => {
      return {
        email: { required, email},
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
      user: {
        email: '',
      },
      error: null,
      message: '',
      urlMinLength: 8,
    }
  },
  methods: {
    handleSubmitForgot () {
      this.$store
      .dispatch('forgotPassword', {
        email: this.state.email,
      })
      .then(() => {
        //this.$router.push({ name: 'dashboard' })
        this.$router.push({ name: 'Login' })
      })
      .catch(err => {
        console.log("Error: ", err.response.data.error)
        this.message = err.response.data.error
        this.error = err.response.data.error
      })
    },
    //async handleSubmit () {
    //  console.log("Forgot PW!!!");
    //  this.v$.$validate()
    //  console.log("V$: ", this.v$)
    //  console.log("V$.$error: ", this.v$.$error)
    //  if (!this.v$.$error) {
    //    this.$store
    //      .dispatch('forgot', {
    //        email: this.state.email,
    //      })
    //      .then(() => {
    //        //this.$router.push({ name: 'dashboard' })
    //        this.$router.push({ name: 'Login' })
    //      })
    //      .catch(err => {
    //        console.log("Error: ", err.response.data.error)
    //        this.message = err.response.data.error
    //        this.error = err.response.data.error
    //      })
    //    }
    //},
    //!!submit () {
    //!!  this.$http.plain.post('/password_resets', { email: this.email })
    //!!    .then(() => this.submitSuccessful())
    //!!    .catch(error => this.submitFailed(error))
    //!!},
    submitSuccessful () {
      this.notice = 'Email with password reset instructions had been sent.'
      this.error = ''
      this.email = ''
    },
    submitFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
    }
  }
}
</script>
<style>
/*@import '../assets/styles/global.css';*/

@import '../assets/authorization.scss';
</style>
