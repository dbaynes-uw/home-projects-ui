<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/ForgotPassword.vue -->
<template>
  <section class="forgot-card mx-auto mt-5">
    <header class="forgot-header pb-0">
      <h3>
        <!-- ✅ ADD ICON -->
        <i class="fas fa-key"></i>
        Forgot or Reset Password
      </h3>
    </header>
    
    <div class="forgot-body">
      <!-- ✅ FIXED: ONLY ONE SUBMIT TRIGGER -->
      <BaseForm @submit.prevent="handleSubmitForgotPassword">
        <div id="form-container" class="forgot-password-form-container">
          <BaseTextField
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
          
          <BaseButton
            type="submit" 
            :block="true"
            class="mt-4" 
            :disabled="!isFormValid"
            :loading="isSubmitting"
            size="large"
            variant="primary"
          >
            <!-- ✅ REMOVED @click - ONLY USE type="submit" -->
            <i class="fas fa-paper-plane"></i>
            Send Reset Email
          </BaseButton>
        </div>
      </BaseForm>
      
      <!-- ✅ ENHANCED MESSAGE DISPLAY -->
      <BaseAlert
        v-if="message"
        :variant="error ? 'danger' : 'success'"
        class="mt-4"
      >
        <i :class="error ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"></i>
        {{ message }}
      </BaseAlert>
      
      <!-- ✅ BACK TO LOGIN LINK -->
      <div class="text-center mt-4">
        <router-link :to="{ name: 'Login' }" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Back to Login
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import '../assets/authorization.css';
import { ref, computed } from 'vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: {
    BaseAlert,
    BaseButton
  },
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
.forgot-password-form-container {
  width: 100%;
}

.forgot-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.forgot-header {
  padding: 1rem 1.25rem 0.5rem;
}

.forgot-body {
  padding: 0.5rem 1.25rem 1rem;
}

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

.base-btn[type="submit"] {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.base-btn[type="submit"] i {
  margin-right: 0.5rem;
}

</style>