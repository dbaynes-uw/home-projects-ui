<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/ForgotPassword.vue -->
<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Forgot or Reset Password</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="handleSubmitForgotPassword">
      <v-container id="form-container">
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          :error="emailError !== ''"
          :error-messages="emailError"
        />
        <br/>
        <v-btn 
          type="submit" 
          block 
          class="mt-2" 
          :disabled="!isFormValid"
          @click="handleSubmitForgotPassword"
        >
          Submit
        </v-btn>
      </v-container>
    </v-form>
    <p v-if="message" :class="messageClass">{{ message }}</p>
  </v-card-text>   
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const email = ref('')
    const message = ref('')
    const error = ref(null)

    // ✅ SIMPLE EMAIL VALIDATION (NO VUELIDATE)
    const emailError = computed(() => {
      if (!email.value) {
        return 'Email is required'
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.value)) {
        return 'Please enter a valid email address'
      }
      return ''
    })

    const isFormValid = computed(() => {
      return email.value && emailError.value === ''
    })

    const messageClass = computed(() => {
      return error.value ? 'error-message' : 'success-message'
    })

    return {
      email,
      message,
      error,
      emailError,
      isFormValid,
      messageClass
    }
  },

  methods: {
    handleSubmitForgotPassword() {
      // ✅ VALIDATE BEFORE SUBMIT
      if (!this.isFormValid) {
        this.message = 'Please fix the errors above'
        this.error = true
        return
      }

      this.$store
        .dispatch('forgotPassword', {
          email: this.email,
        })
        .then(() => {
          this.message = 'Password reset email sent successfully!'
          this.error = false
          setTimeout(() => {
            this.$router.push({ name: 'Login' })
          }, 2000)
        })
        .catch(err => {
          this.message = err.response?.data?.error || 'An error occurred'
          this.error = true
        })
    },

    submitSuccessful() {
      this.message = 'Email with password reset instructions has been sent.'
      this.error = false
      this.email = ''
    },

    submitFailed(error) {
      this.error = true
      this.message = (error.response && error.response.data && error.response.data.error) || 'An error occurred'
    }
  }
}
</script>

<style scoped>
.error-message {
  color: #f44336;
  font-weight: bold;
}

.success-message {
  color: #4caf50;
  font-weight: bold;
}

@import '../assets/authorization.scss';
</style>