<!-- src/views/PasswordReset.vue -->
<template>
  <v-card class="mx-auto mt-5" max-width="500">
    <v-card-title class="pb-0">
      <h1>Home Projects</h1>
      <h3>Reset Your Password</h3>
    </v-card-title>
    
    <v-card-text>
      <!-- ✅ SHOW TOKEN STATUS -->
      <div v-if="!isValidToken" class="mb-4">
        <v-alert type="error" variant="tonal">
          Invalid or expired reset link. Please request a new password reset.
        </v-alert>
        <v-btn @click="$router.push('/forgot_password')" color="primary" block class="mt-3">
          Request New Reset Link
        </v-btn>
      </div>
      
      <!-- ✅ PASSWORD RESET FORM -->
      <div v-else>
        <p class="mb-4 text-center">
          Enter your new password below:
        </p>
        
        <v-form @submit.prevent="resetPassword">
          <v-container>
            <v-text-field
              label="New Password (Minimum 8 characters)"
              v-model="newPassword"
              :append-icon="showNewPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              :type="showNewPassword ? 'text' : 'password'"
              :error="!!passwordError"
              :error-messages="passwordError"
              @click:append="showNewPassword = !showNewPassword"
              @blur="validatePassword"
              placeholder="Enter new password"
            />
            
            <v-text-field
              label="Confirm New Password"
              v-model="confirmPassword"
              :append-icon="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              :type="showConfirmPassword ? 'text' : 'password'"
              :error="!!confirmError"
              :error-messages="confirmError"
              @click:append="showConfirmPassword = !showConfirmPassword"
              @blur="validateConfirm"
              placeholder="Confirm new password"
            />
            
            <!-- ✅ PASSWORD STRENGTH INDICATOR -->
            <div class="mb-3">
              <small>Password length: {{ newPassword.length }} characters</small>
              <div v-if="newPassword.length > 0" class="password-strength mt-1">
                <div 
                  :class="passwordStrengthClass" 
                  class="strength-bar"
                  :style="{ width: passwordStrengthPercentage + '%' }"
                ></div>
              </div>
            </div>
            
            <v-btn 
              type="submit" 
              block 
              class="mt-4" 
              :disabled="!isFormValid || loading"
              :loading="loading"
              color="primary"
              size="large"
            >
              <i class="fas fa-key mr-2"></i>
              Reset Password
            </v-btn>
          </v-container>
        </v-form>
      </div>
      
      <!-- ✅ STATUS MESSAGE -->
      <v-alert 
        v-if="message" 
        :type="error ? 'error' : 'success'" 
        variant="tonal" 
        class="mt-4"
      >
        {{ message }}
      </v-alert>
    </v-card-text>
    
    <v-card-actions class="justify-center">
      <div class="text-center">
        Remember your password? 
        <router-link to="/login">Back to Login</router-link>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
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
    
    // ✅ GET TOKEN FROM URL
    onMounted(() => {
      token.value = route.params.token
      console.log('🔍 Password reset token:', token.value)
      
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
    
    const isFormValid = computed(() => {
      return newPassword.value.length >= 8 && 
             newPassword.value === confirmPassword.value && 
             !passwordError.value && 
             !confirmError.value
    })
    
    // ✅ PASSWORD RESET FUNCTION USING YOUR CODE
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
        
        // ✅ USING YOUR EXACT CODE STRUCTURE
        const response = await fetch(`http://localhost:3000/api/v1/password_resets/${token.value}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
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
          
          // ✅ REDIRECT TO LOGIN AFTER SUCCESS
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
      validatePassword,
      validateConfirm,
      resetPassword
    }
  }
}
</script>

<style scoped>
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
</style>