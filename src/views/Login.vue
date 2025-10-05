<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/Login.vue -->
<template>
  <v-card class="mx-auto mt-5" max-width="500">
    <v-card-title class="pb-0">
      <h1>Home Projects</h1>
      <h3>Log In</h3>
    </v-card-title>
    
    <!-- ✅ MOVE THIS INSIDE THE CARD -->
    <v-card-subtitle v-if="statusMessage">
      <h2 style="color: red">
        {{ statusMessage }}
      </h2>
    </v-card-subtitle>
    
    <!-- ✅ CARD-TEXT IS NOW INSIDE THE CARD -->
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
    
    <!-- ✅ ACTIONS SECTION INSIDE THE CARD -->
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

<!-- Keep your existing script and style sections -->
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

    console.log('🔍 Router:', router)
    console.log('🔍 Store:', store)
    
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

  beforeMount() {
    console.log('🔍 Login.vue beforeMount()')
  },
  
  mounted() {
    console.log('✅ Login.vue mounted successfully!')
    console.log('✅ Component data:', this.$data)
  },

  methods: {
    async login() {
      this.showValidationErrors = true
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.state.email)) {
        this.message = 'Please enter a valid email address (e.g., user@example.com)';
        this.error = true;
        return;
      }
      
      const isFormValid = await this.validate()
      if (!isFormValid) {
        this.message = 'Please fix the errors above'
        this.error = true
        return
      }

      try {
        console.log('🔍 Login attempt with:', {
          email: this.state.email,
          password: '[HIDDEN]'
        });
        
        const result = await this.store.dispatch('login', {
          email: this.state.email.trim().toLowerCase(),
          password: this.state.password
        })
        
        console.log('✅ Login successful:', result);
        console.log('✅ User in store:', this.store.state.user);
        
        this.message = 'Login successful!'
        this.error = false
        
        setTimeout(() => {
          this.router.push({ name: 'About' })
        }, 1000)
        
      } catch (err) {
        console.error('❌ Login failed:', err);
        this.message = err.message || 'Login failed. Please try again.'
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