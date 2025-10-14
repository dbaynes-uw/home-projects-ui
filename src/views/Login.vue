<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/Login.vue -->
<template>
  <v-card class="mx-auto mt-5" max-width="500">
    <v-card-title class="pb-0">
      <h1>Home Projects</h1>
      <h3>Log In</h3>
    </v-card-title>
    
    <v-card-subtitle v-if="statusMessage">
      <h2 style="color: red">
        {{ statusMessage }}
      </h2>
    </v-card-subtitle>
    
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-container id="form-container">
          <v-text-field
            label="Email"
            v-model="state.email"
            type="email"
            name="email"
            placeholder="user@example.com"
            :error="showValidationErrors && v$.email.$error"
            :error-messages="showValidationErrors && v$.email.$error ? v$.email.$errors[0].$message : ''"
            @blur="v$.email.$touch"
          />
          
  <v-text-field
    label="Password (Minimum 8 characters)"
    v-model="state.password"
    :type="showPassword ? 'text' : 'password'"
    name="password"
    variant="outlined"
    :error="showValidationErrors && v$.password.$error"
    :error-messages="showValidationErrors && v$.password.$error ? v$.password.$errors[0].$message : ''"
    @blur="v$.password.$touch"
  >
    <!-- ✅ USE DIRECT FONTAWESOME ICON (NO V-ICON WRAPPER) -->
    <template v-slot:append-inner>
      <i 
        :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
        class="password-eye-icon"
        @click="showPassword = !showPassword"
        role="button"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        tabindex="0"
        @keydown.enter="showPassword = !showPassword"
        @keydown.space.prevent="showPassword = !showPassword"
        :title="showPassword ? 'Hide password' : 'Show password'"
      />
    </template>
  </v-text-field>
          
          <span>
            {{ state.password.length }} characters used.
          </span>
          
          <small v-if="!canUseVuelidate" class="text-warning">
            ⚠️ Advanced validation disabled (memory optimization)
          </small>
          
          <br/>
          <v-btn 
            type="submit" 
            block 
            class="mt-2" 
            :disabled="!isValid || loading"
            :loading="loading"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            Submit
          </v-btn>
        </v-container>
      </v-form>
      
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
        Don't have an account? 
        <router-link to="/register">Register</router-link>
        <br />
        Forgot or Need Password Reset?  
        <router-link to="/forgot_password">Forgot or Reset Password</router-link>
        <p class="mt-2">T: dl..@.. t...t... P: dl..@.. sen...H...P</p>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useFormValidation, validators } from '@/composables/useValidation'

export default {
  setup() {
    console.log('🔍 Login.vue setup() running...')
    
    const router = useRouter()
    const store = useStore()
    
    // ✅ REACTIVE FORM DATA
    const state = reactive({
      email: '',
      password: ''
    })
    
    // ✅ VALIDATION RULES
    const rules = computed(() => ({
      email: { 
        required: validators.required, 
        email: validators.email,
        validFormat: (value) => {
          if (!value) return true;
          const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return strictEmailRegex.test(value) || 'Please enter a valid email address (e.g., user@example.com)';
        }
      },
      password: {
        required: validators.required,
        minLength: validators.minLength(8)
      }
    }))
    
    // ✅ USE SIMPLE VALIDATION
    const { v$, isValid, getFieldError, validate, canUseVuelidate } = useFormValidation(state, rules)
    
    const showPassword = ref(false)
    const message = ref('')
    const error = ref(false)
    const loading = ref(false)
    const showValidationErrors = ref(false)
    
    const statusMessage = computed(() => store.state.message || '')

    return {
      state,
      v$,
      isValid,
      getFieldError,
      validate,
      canUseVuelidate,
      showPassword,
      message,
      error,
      loading,
      showValidationErrors,
      statusMessage,
      router,
      store
    }
  },

  mounted() {
    console.log('✅ Login.vue mounted successfully!')
  },

  methods: {
    // ✅ PROPER COMPONENT LOGIN METHOD
    async login() {
      this.showValidationErrors = true
      this.loading = true
      this.message = ''
      
      // ✅ EXTRA EMAIL VALIDATION
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.state.email)) {
        this.message = 'Please enter a valid email address (e.g., user@example.com)';
        this.error = true;
        this.loading = false;
        return;
      }
      
      const isFormValid = await this.validate()
      if (!isFormValid) {
        this.message = 'Please fix the errors above'
        this.error = true
        this.loading = false;
        return
      }

      try {
        console.log('🔍 Login.vue: Calling store login action with:', {
          email: this.state.email,
          password: '[HIDDEN]'
        });
        
        // ✅ CALL THE STORE LOGIN ACTION
        const result = await this.store.dispatch('login', {
          email: this.state.email.trim().toLowerCase(),
          password: this.state.password
        })
        
        console.log('✅ Login.vue: Store login returned:', result);
        console.log('✅ Login.vue: User in store after login:', this.store.state.user);
        
        this.message = 'Login successful! Redirecting...'
        this.error = false
        
        setTimeout(() => {
          this.router.push({ name: 'About' })
        }, 1500)
        
      } catch (err) {
        console.error('❌ Login.vue: Login failed:', err);
        this.message = err.message || 'Login failed. Please try again.'
        this.error = true
      } finally {
        this.loading = false
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

.text-warning {
  color: #ff9800;
}

#form-container {
  max-width: 400px;
  margin: 0 auto;
}


</style>