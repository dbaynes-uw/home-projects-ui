<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/Login.vue -->

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    
    console.log('🔍 Login: Starting login process...')
    
    const result = await store.dispatch('login', {
      email: email.value,
      password: password.value
    })
    
    console.log('✅ Login: Dispatch returned:', result)
    
    // ✅ CHECK STATE AFTER LOGIN
    console.log('🔍 Login: Checking store state...')
    console.log('Store state:', {
      loggedIn: store.state.loggedIn,
      hasUser: !!store.state.user,
      hasToken: !!store.state.token,
      token: store.state.token?.substring(0, 20) + '...'
    })
    
    // ✅ CHECK LOCALSTORAGE AFTER LOGIN
    console.log('🔍 Login: Checking localStorage...')
    const vuexState = localStorage.getItem('vuex')
    if (vuexState) {
      const parsed = JSON.parse(vuexState)
      console.log('localStorage vuex:', {
        loggedIn: parsed.loggedIn,
        hasUser: !!parsed.user,
        hasToken: !!parsed.token || !!parsed.user?.token,
        token: (parsed.token || parsed.user?.token)?.substring(0, 20) + '...'
      })
    }
    
    const userState = localStorage.getItem('user')
    if (userState) {
      const parsed = JSON.parse(userState)
      console.log('localStorage user:', {
        hasToken: !!parsed.token,
        token: parsed.token?.substring(0, 20) + '...'
      })
    }
    
    if (result.success) {
      console.log('✅ Login successful! Redirecting to About...')
      
      // ✅ WAIT A TICK FOR STATE TO SETTLE
      await new Promise(resolve => setTimeout(resolve, 100))
      
      router.push({ name: 'About' })
    }
  } catch (err) {
    console.error('❌ Login failed:', err)
    error.value = err.message
  }
}

</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Enter your password" 
            required 
          />
        </div>
        
        <button type="submit" class="btn-primary">Login</button>
        
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
      
      <div class="links">
        <router-link to="/forgot-password">Forgot Password?</router-link>
        <router-link to="/register">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin: 0 0 30px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  text-align: center;
}

.links {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.links a {
  color: #667eea;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>