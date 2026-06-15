<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/PasswordReset.vue -->
<template>
  <section class="reset-card mx-auto mt-5" style="max-width: 500px;">
    <header class="reset-header pb-0">
      <h1>
        <!-- ✅ ADD TITLE ICON -->
        <i class="fas fa-key"></i>
        Home Projects
      </h1>
      <h3>Reset Your Password</h3>
    </header>
    
    <div class="reset-body">
      <!-- ✅ SHOW TOKEN STATUS -->
      <div v-if="!isValidToken" class="mb-4">
        <BaseAlert variant="danger">
          <i class="fas fa-exclamation-triangle"></i>
          Invalid or expired reset link. Please request a new password reset.
        </BaseAlert>
        <BaseButton @click="$router.push('/forgot_password')" variant="primary" block class="mt-3">
          <i class="fas fa-redo"></i>
          Request New Reset Link
        </BaseButton>
      </div>
      
      <!-- ✅ PASSWORD RESET FORM -->
      <div v-else>
        <p class="mb-4 text-center">
          Enter your new password below:
        </p>
        
        <BaseForm @submit.prevent="resetPassword">
          <div class="reset-form-container">
            <!-- ✅ FIXED NEW PASSWORD FIELD -->
            <BaseTextField
              label="New Password (Minimum 8 characters)"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              :error="!!passwordError"
              :error-messages="passwordError"
              @blur="validatePassword"
              placeholder="Enter new password"
              autocomplete="new-password"
              prepend-inner-icon="fas fa-lock"
            >
              <!-- ✅ FIXED APPEND SLOT -->
              <template v-slot:append-inner>
                <button
                  @click="showNewPassword = !showNewPassword"
                  type="button"
                  class="password-toggle"
                >
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </template>
            </BaseTextField>
            
            <!-- ✅ FIXED CONFIRM PASSWORD FIELD -->
            <BaseTextField
              label="Confirm New Password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              :error="!!confirmError"
              :error-messages="confirmError"
              @blur="validateConfirm"
              placeholder="Confirm new password"
              autocomplete="new-password"
              prepend-inner-icon="fas fa-lock"
            >
              <!-- ✅ FIXED APPEND SLOT -->
              <template v-slot:append-inner>
                <button
                  @click="showConfirmPassword = !showConfirmPassword"
                  type="button"
                  class="password-toggle"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </template>
            </BaseTextField>
            
            <!-- ✅ PASSWORD STRENGTH INDICATOR -->
            <div class="mb-3">
              <div class="d-flex justify-space-between align-center">
                <small>Password length: {{ newPassword.length }} characters</small>
                <small v-if="newPassword.length > 0" :class="passwordStrengthTextClass">
                  {{ passwordStrengthText }}
                </small>
              </div>
              <div v-if="newPassword.length > 0" class="password-strength mt-1">
                <div 
                  :class="passwordStrengthClass" 
                  class="strength-bar"
                  :style="{ width: passwordStrengthPercentage + '%' }"
                ></div>
              </div>
            </div>
            
            <BaseButton 
              type="submit" 
              class="mt-4" 
              :block="true"
              :disabled="!isFormValid || loading"
              :loading="loading"
              variant="primary"
              size="large"
            >
              <i class="fas fa-key"></i>
              Reset Password
            </BaseButton>
          </div>
        </BaseForm>
      </div>
      
      <!-- ✅ STATUS MESSAGE -->
      <BaseAlert 
        v-if="message" 
        :variant="error ? 'danger' : 'success'" 
        class="mt-4"
      >
        <i :class="error ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"></i>
        {{ message }}
      </BaseAlert>
    </div>
    
    <footer class="reset-footer justify-center">
      <div class="text-center">
        <i class="fas fa-arrow-left"></i>
        Remember your password? 
        <router-link to="/login">Back to Login</router-link>
      </div>
    </footer>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getApiUrl, API_ENDPOINTS } from '@/utils/apiConfig'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: {
    BaseAlert,
    BaseButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const token = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    const passwordError = ref('')
    const confirmError = ref('')
    const message = ref('')
    const error = ref(false)
    const loading = ref(false)
    const isValidToken = ref(true)
    const apiUrl = ref('')
    
    // ✅ GET TOKEN FROM URL
    onMounted(() => {
      token.value = route.params.token
      console.log('🔍 Password reset token:', token.value)
      
      apiUrl.value = getApiUrl(API_ENDPOINTS.PASSWORD_RESET);
      console.log('🔍 Password reset API URL:', apiUrl.value);
  
      if (!token.value) {
        isValidToken.value = false
        message.value = 'No reset token provided'
        error.value = true
      }
    })
    
    const validatePassword = () => {
      if (!newPassword.value) {
        passwordError.value = 'Password is required'
      } else if (newPassword.value.length < 8) {
        passwordError.value = 'Password must be at least 8 characters'
      } else if (newPassword.value.length > 50) {
        passwordError.value = 'Password must be less than 50 characters'
      } else {
        passwordError.value = ''
      }
    }
    
    const validateConfirm = () => {
      if (!confirmPassword.value) {
        confirmError.value = 'Please confirm your password'
      } else if (newPassword.value !== confirmPassword.value) {
        confirmError.value = 'Passwords do not match'
      } else {
        confirmError.value = ''
      }
    }
    
    // ✅ PASSWORD STRENGTH CALCULATION
    const passwordStrength = computed(() => {
      const pwd = newPassword.value
      let score = 0
      
      if (pwd.length >= 8) score += 1
      if (pwd.length >= 12) score += 1
      if (/[A-Z]/.test(pwd)) score += 1
      if (/[a-z]/.test(pwd)) score += 1
      if (/[0-9]/.test(pwd)) score += 1
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1
      
      return score
    })
    
    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value
      if (strength <= 2) return 'strength-weak'
      if (strength <= 4) return 'strength-medium'
      return 'strength-strong'
    })
    
    const passwordStrengthPercentage = computed(() => {
      return Math.min((passwordStrength.value / 6) * 100, 100)
    })
    
    // ✅ ENHANCED PASSWORD STRENGTH TEXT
    const passwordStrengthText = computed(() => {
      const strength = passwordStrength.value
      if (strength <= 2) return 'Weak'
      if (strength <= 4) return 'Medium'
      return 'Strong'
    })
    
    const passwordStrengthTextClass = computed(() => {
      const strength = passwordStrength.value
      if (strength <= 2) return 'text-error'
      if (strength <= 4) return 'text-warning'
      return 'text-success'
    })
    
    const isFormValid = computed(() => {
      return newPassword.value.length >= 8 && 
             newPassword.value === confirmPassword.value && 
             !passwordError.value && 
             !confirmError.value
    })
    
    // ✅ PASSWORD RESET FUNCTION
    const resetPassword = async () => {
      validatePassword()
      validateConfirm()
      
      if (!isFormValid.value) {
        message.value = 'Please fix the errors above'
        error.value = true
        return
      }
      
      loading.value = true
      message.value = ''
      
      try {
        console.log('🔍 Resetting password with token:', token.value)
        console.log('🔍 Using API URL:', apiUrl.value + token.value)
        
        const response = await fetch(`${apiUrl.value}${token.value}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            password: newPassword.value,
            password_confirmation: confirmPassword.value
          })
        })
        
        const result = await response.json()
        console.log('✅ Password reset result:', result)
        
        if (response.ok) {
          message.value = 'Password reset successful! Redirecting to login...'
          error.value = false
          
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          throw new Error(result.error || result.message || 'Password reset failed')
        }
        
      } catch (err) {
        console.error('❌ Password reset failed:', err)
        
        if (err.message.includes('404') || err.message.includes('Invalid')) {
          message.value = 'Invalid or expired reset token'
          isValidToken.value = false
        } else {
          message.value = err.message || 'Password reset failed. Please try again.'
        }
        error.value = true
      } finally {
        loading.value = false
      }
    }
    
    return {
      token,
      newPassword,
      confirmPassword,
      showNewPassword,
      showConfirmPassword,
      passwordError,
      confirmError,
      message,
      error,
      loading,
      isValidToken,
      isFormValid,
      passwordStrength,
      passwordStrengthClass,
      passwordStrengthPercentage,
      passwordStrengthText,
      passwordStrengthTextClass,
      validatePassword,
      validateConfirm,
      apiUrl,
      resetPassword
    }
  }
}
</script>

<style scoped>
/* ✅ PASSWORD TOGGLE BUTTON STYLING */
.password-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  min-width: auto !important;
  width: 32px !important;
  height: 32px !important;
  margin: 0 !important;
}

.password-toggle i {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  font-size: 16px;
  transition: color 0.3s ease;
}

.password-toggle:hover i {
  color: rgb(var(--v-theme-primary)) !important;
}

.reset-form-container {
  width: 100%;
}

.reset-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.reset-header {
  padding: 1rem 1.25rem 0.5rem;
}

.reset-body {
  padding: 0.5rem 1.25rem 1rem;
}

.reset-footer {
  padding: 0.75rem 1.25rem 1rem;
  display: flex;
  justify-content: center;
}

/* ✅ PASSWORD STRENGTH STYLING */
.password-strength {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-weak {
  background-color: #f44336;
}

.strength-medium {
  background-color: #ff9800;
}

.strength-strong {
  background-color: #4caf50;
}

/* ✅ TEXT COLORS FOR STRENGTH */
.text-error {
  color: #f44336 !important;
  font-weight: 500;
}

.text-warning {
  color: #ff9800 !important;
  font-weight: 500;
}

.text-success {
  color: #4caf50 !important;
  font-weight: 500;
}

/* ✅ ICON STYLING */
.reset-header i {
  color: rgb(var(--v-theme-primary));
  margin-right: 0.5rem;
}

.v-btn i {
  margin-right: 0.5rem;
}

.v-alert i {
  margin-right: 0.5rem;
}

.reset-footer i {
  margin-right: 0.3rem;
  font-size: 0.9em;
}

/* ✅ PREPEND ICON STYLING */
.v-text-field .v-input__prepend-inner i {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}
</style>