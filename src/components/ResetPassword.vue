<template>
    <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Reset Password</h3>
    </v-card-title>
  </v-card>
    <v-form @submit.prevent="resetPassword">
      <v-container id="form-container">
        <div class="alert alert-info" v-if="notice">{{ notice }}<router-link to="/login">Sign in</router-link></div>
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <v-text-field
          label="New Password"
          v-model="password"
          id="password"
          placeholder="New Password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        />
        <span>
          {{ password.length }} characters used.
        </span>
        <v-text-field
          label="Password Confirmation "
          v-model="password_confirmation"
          id="password_confirmation"
          placeholder="Password Confirmation"
          :append-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordConfirmation ? 'text' : 'password'"
          @click:append="showPasswordConfirmation = !showPasswordConfirmation"
        />
        <span>
          {{ password_confirmation.length }} characters used.
        </span>
        <v-btn type="submit" block class="mt-2" @click="login">Submit</v-btn>
        <br />
        <div class="div-center">
          <v-btn id="background-gray"><router-link to="/login">Sign in</router-link></v-btn>
        </div>
      </v-container>
    </v-form>
</template>
<script>
import axios from "axios";
export default {
  name: 'ResetPassword',
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macbook-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/password_resets/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/password_resets/";
    }
    this.api_url = work_url
    console.log("this.api_url: ", this.api_url)
  },
  data () {
    return {
      password: '',
      password_confirmation: '',
      showPassword: false,
      showPasswordConfirmation: false,
      isFormValid: false,
      error: '',
      notice: ''
    }
  },
  created () {
    this.checkPasswordToken()
  },
  buttonLabel() {
    this.showPassword ? "Hide" : "Show";
    this.showPasswordConfirmation ? "Hide" : "Show";
  },
  methods: {
    async resetPassword () {
      console.log("resetPassword!!!!!")
      this.checkValidations(this.password, this.password_confirmation)
      if (this.isFormValid) {
        return axios
          .patch(this.api_url + `${this.$route.params.token}`, { password: this.password, password_confirmation: this.password_confirmation })
          .then(response => this.resetSuccessful(response))
          .catch(error => this.resetFailed(error))
           //commit('SET_USER_DATA', data)
      } else {
        this.error = "Password and Confirmation Must be Equal"
      }
    },
    resetSuccessful (response) {
      console.log("Response Successful: ", response)
      this.notice = "Your password has been reset successfully. Sign in here with new password: "
      this.error = ''
      this.password = ''
      this.password_confirmation = ''
    },
    resetFailed (error) {
      console.log("error.response.data.error: ", error.response.data.error)
      console.log("error: ", error)
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong - Probably database error has occurred - Please Try Again'
      this.notice = ''

       //.catch((error) => {
       //  console.log(error);
       //  alert("Invalid Login Credentials or API problem - Please try again")
       //  //location.reload()
       //  //const message = error.response.request.statusText + '!';
       //  error = error.response.request.statusText + '!';
       //  console.log("Message to be sent: ", error)
       //  router.back(error)
       //});
    },
    async checkPasswordToken () {
      try {
        console.log("checkPasswordToken!!!!!")
        return await axios
          .get(`//localhost:3000/api/v1/password_resets/${this.$route.params.token}`);
      } catch(error) {
        console.log("ERROR Caught: ", error);
        this.resetFailed(error);
        this.$router.replace('/');
      }
    },
    checkValidations(password, password_confirmation) {
      console.log("checkValidations - PW: ", password)
      console.log("checkValidations - PW Conf: ", password_confirmation)

      if (password == password_confirmation) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },

  }
}
</script>
