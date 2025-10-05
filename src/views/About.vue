<template>
  <div>
    <h1>About Page</h1>
    
    <!-- ✅ DEBUG SECTION -->
    <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
      <h3>🔍 Debug Info:</h3>
      <p><strong>Store state exists:</strong> {{ !!$store.state }}</p>
      <p><strong>User exists:</strong> {{ !!$store.state.user }}</p>
      <p><strong>User value:</strong> {{ $store.state.user }}</p>
      <p><strong>localStorage user:</strong> {{ localStorageUser }}</p>
      <p><strong>Store state keys:</strong> {{ Object.keys($store.state) }}</p>
    </div>
    
    <!-- ✅ SAFE USER DISPLAY -->
    <div v-if="user && user.email">
      <h2>Welcome, {{ user.email }}!</h2>
      <p>You are successfully logged in.</p>
    </div>
    
    <div v-else>
      <h2>Not logged in</h2>
      <p>Please log in to see your profile.</p>
      <router-link to="/login">Go to Login</router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    const user = computed(() => {
      console.log('About.vue - Store user:', store.state.user)
      return store.state.user
    })
    
    const localStorageUser = computed(() => {
      try {
        const userString = localStorage.getItem('user')
        return userString ? JSON.parse(userString) : null
      } catch (error) {
        return 'Error parsing localStorage'
      }
    })
    
    return {
      user,
      localStorageUser
    }
  }
}
</script>