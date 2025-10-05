<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/Login.vue -->
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
          :error="showValidationErrors && v$.email.$error"
          :error-messages="showValidationErrors && v$.email.$error ? v$.email.$errors[0].$message : ''"
          @blur="v$.email.$touch"
        />
        
        <v-text-field
          label="Password (Minimum 8 characters)"
          v-model="state.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          :error="showValidationErrors && v$.password.$error"
          :error-messages="showValidationErrors && v$.password.$error ? v$.password.$errors[0].$message : ''"
          @click:append="showPassword = !showPassword"
          @blur="v$.password.$touch"
        />
        
        <span>
          {{ state.password.length }} characters used.
        </span>
        
        <!-- ✅ MEMORY STATUS INDICATOR -->
        <small v-if="!canUseVuelidate" class="text-warning">
          ⚠️ Advanced validation disabled (memory optimization)
        </small>
        
        <br/>
        <v-btn 
          type="submit" 
          block 
          class="mt-2" 
          :disabled="!isValid"
          @click="login"
        >
          Submit
        </v-btn>
      </v-container>
    </v-form>
    <p v-if="message" :class="messageClass">{{ message }}</p>
  </v-card-text>
  
  <div class="text-center pa-4">
    Don't have an account? 
    <router-link to="/register">Register</router-link>
    <br />
    Forgot or Need Password Reset?  
    <router-link to="/forgot_password">Forgot or Reset Password</router-link>
    <p>T: dl..@.. t...t... P: dl..@.. sen...H...P</p>
  </div>
</template>

<!-- Keep your existing script -->
<script>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useFormValidation, validators } from '@/composables/useValidation'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    
    // ✅ REACTIVE FORM DATA
    const state = reactive({
      email: '',
      password: ''
    })
    
    // ✅ VALIDATION RULES (SIMPLE VERSION)
    const rules = computed(() => ({
      email: { 
        required: validators.required, 
        email: validators.email 
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
    const error = ref(null)
    const showValidationErrors = ref(false)
    
    const statusMessage = computed(() => store.state.message || '')
    
    const messageClass = computed(() => {
      return error.value ? 'error-message' : 'success-message'
    })

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
      showValidationErrors,
      statusMessage,
      messageClass,
      router,
      store
    }
  },

  methods: {
    async login() {
      this.showValidationErrors = true
      
      // ✅ TRIGGER VALIDATION
      const isFormValid = await this.validate()
      
      if (!isFormValid) {
        this.message = 'Please fix the errors above'
        this.error = true
        return
      }

      try {
        await this.store.dispatch('login', {
          email: this.state.email,
          password: this.state.password
        })
        
        this.message = 'Login successful!'
        this.error = false
        
        setTimeout(() => {
          this.router.push({ name: 'About' })
        }, 1000)
        
      } catch (err) {
        console.error('Login error:', err)
        this.message = err.response?.data?.error || 'Login failed. Please try again.'
        this.error = true
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