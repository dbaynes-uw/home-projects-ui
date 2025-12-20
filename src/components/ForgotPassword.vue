<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/ForgotPassword.vue -->
<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>
        <!-- ✅ ADD ICON -->
        <i class="fas fa-key"></i>
        Forgot or Reset Password
      </h3>
    </v-card-title>
    
    <v-card-text>
      <!-- ✅ FIXED: ONLY ONE SUBMIT TRIGGER -->
      <v-form @submit.prevent="handleSubmitForgotPassword">
        <v-container id="form-container">
          <v-text-field
            label="Email"
            v-model="email"
            type="email"
            name="email"
            placeholder="example@email.com"
            autocomplete="username"
            prepend-inner-icon="fas fa-envelope"
            :error="emailError !== ''"
            :error-messages="emailError"
            required
          />
          
          <v-btn 
            type="submit" 
            block 
            class="mt-4" 
            :disabled="!isFormValid"
            :loading="isSubmitting"
            color="primary"
            size="large"
          >
            <!-- ✅ REMOVED @click - ONLY USE type="submit" -->
            <i class="fas fa-paper-plane"></i>
            Send Reset Email
          </v-btn>
        </v-container>
      </v-form>
      
      <!-- ✅ ENHANCED MESSAGE DISPLAY -->
      <v-alert
        v-if="message"
        :type="error ? 'error' : 'success'"
        :icon="error ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"
        class="mt-4"
        variant="tonal"
      >
        {{ message }}
      </v-alert>
      
      <!-- ✅ BACK TO LOGIN LINK -->
      <div class="text-center mt-4">
        <router-link :to="{ name: 'Login' }" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Back to Login
        </router-link>
      </div>
    </v-card-text>
  </v-card>  
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const email = ref('')
    const message = ref('')
    const error = ref(null)
    const isSubmitting = ref(false) // ✅ ADD LOADING STATE

    // ✅ EMAIL VALIDATION
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
      return email.value && emailError.value === '' && !isSubmitting.value
    })

    return {
      email,
      message,
      error,
      emailError,
      isFormValid,
      isSubmitting
    }
  },

  methods: {
    async handleSubmitForgotPassword() {
      // ✅ PREVENT MULTIPLE SUBMISSIONS
      if (this.isSubmitting || !this.isFormValid) {
        return
      }

      this.isSubmitting = true
      this.message = ''
      this.error = null

      try {
        console.log('🔑 Sending password reset for:', this.email)
        
        await this.$store.dispatch('forgotPassword', {
          email: this.email,
        })
        
        console.log('✅ Password reset email sent successfully')
        this.message = 'Password reset email sent successfully! Check your inbox.'
        this.error = false
        
        // ✅ REDIRECT AFTER DELAY
        setTimeout(() => {
          this.$router.push({ name: 'Login' })
        }, 3000)
        
      } catch (err) {
        console.error('❌ Password reset failed:', err)
        this.message = err.response?.data?.error || 'Failed to send reset email. Please try again.'
        this.error = true
      } finally {
        this.isSubmitting = false
      }
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

.back-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  text-decoration: underline;
  transform: translateX(-2px);
}

.back-link i {
  font-size: 0.9em;
}

/* ✅ FORM ENHANCEMENTS */
#form-container {
  padding: 1rem 0;
}

.v-btn[type="submit"] {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.v-btn[type="submit"] i {
  margin-right: 0.5rem;
}

@import '../assets/authorization.css';
</style>