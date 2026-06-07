<template>
  <div class="register-wrap">
    <div class="register-card">
      <h1>Create Account</h1>

      <div v-if="successMsg" class="success-alert mb-4" role="status">
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label for="reg-name">Name</label>
          <input v-model="name" id="reg-name" type="text" required autocomplete="name" />
        </div>
        <div class="field">
          <label for="reg-username">Username</label>
          <input v-model="username" id="reg-username" type="text" required autocomplete="username" />
        </div>
        <div class="field">
          <label for="reg-email">Email</label>
          <input v-model="email" id="reg-email" type="email" required autocomplete="email" />
        </div>
        <div class="field">
          <label for="reg-password">Password</label>
          <input v-model="password" id="reg-password" type="password" required autocomplete="new-password" />
        </div>

        <ul v-if="errors" class="reg-errors">
          <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
        </ul>

        <button type="submit" :disabled="loading" class="reg-btn">
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>

      <p class="reg-login-link">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store   = useStore()
const router  = useRouter()

const name       = ref('')
const username   = ref('')
const email      = ref('')
const password   = ref('')
const errors     = ref(null)
const loading    = ref(false)
const successMsg = ref('')

async function handleRegister() {
  errors.value     = null
  successMsg.value = ''
  loading.value    = true

  try {
    await store.dispatch('register', {
      name:     name.value,
      username: username.value,
      email:    email.value,
      password: password.value,
    })

    successMsg.value = 'Account created! Redirecting to login…'
    setTimeout(() => router.push({ name: 'Login' }), 1200)
  } catch (err) {
    errors.value = err.response?.data?.errors ?? ['Registration failed. Please try again.']
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
}
.register-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.success-alert {
  background: #e8f8ef;
  color: #0f5132;
  border: 1px solid #b8e5cb;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
}
h1 { text-align: center; margin-bottom: 1.5rem; font-size: 1.6rem; color: #333; }
.field { display: flex; flex-direction: column; margin-bottom: 1rem; }
.field label { font-size: 0.85rem; font-weight: 600; color: #555; margin-bottom: 0.3rem; }
.field input {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  transition: border-color 0.15s;
}
.field input:focus { outline: none; border-color: #7c4dff; }
.reg-btn {
  width: 100%;
  padding: 0.65rem;
  background: #7c4dff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.15s;
}
.reg-btn:hover:not(:disabled) { background: #651fff; }
.reg-btn:disabled { opacity: 0.6; cursor: default; }
.reg-errors { color: #c62828; font-size: 0.85rem; padding-left: 1.2rem; margin: 0.5rem 0; }
.reg-login-link { text-align: center; margin-top: 1.2rem; font-size: 0.9rem; color: #666; }
.reg-login-link a { color: #7c4dff; font-weight: 600; text-decoration: none; }
.reg-login-link a:hover { text-decoration: underline; }
</style>
