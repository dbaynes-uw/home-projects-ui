/**
 * useAuth — Composition API composable for all authentication concerns.
 *
 * Usage in any <script setup> component:
 *   import { useAuth } from '@/composables/useAuth'
 *   const { user, isLoggedIn, userName, login, logout, register } = useAuth()
 */

import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { canAccessRoute } from '@/services/routeGroups'

export function useAuth() {
  const store  = useStore()
  const router = useRouter()

  // ── Reactive state ────────────────────────────────────────────────────
  const user          = computed(() => store.state.user)
  const token         = computed(() => store.state.token)
  const isLoggedIn    = computed(() => !!store.state.loggedIn && !!store.state.token)
  const isAdmin       = computed(() => store.state.role === 'admin')
  const isApproved    = computed(() => store.state.approved === true)
  const allowedRoutes = computed(() => store.state.allowedRoutes ?? [])

  /** Returns true if the current user can visit the given route name. */
  function canAccess(routeName) {
    if (isAdmin.value) return true
    return canAccessRoute(routeName, allowedRoutes.value)
  }

  // Friendly display name derived from email
  const userName = computed(() => {
    if (!user.value?.email) return 'Guest'
    return user.value.email
      .split('@')[0]
      .split(/[._-]/)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ')
  })

  // Token expiry as human-readable string
  const tokenExpiry = computed(() => {
    if (!user.value?.expires_in) return 'Unknown'
    const hours = Math.floor(user.value.expires_in / 3600)
    const days  = Math.floor(hours / 24)
    if (days > 0)  return `${days} day${days !== 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`
    return 'Soon'
  })

  // ── Actions ───────────────────────────────────────────────────────────

  /**
   * Login with email + password.
   * Redirects to About on success.
   * Returns { success, error } so callers can react.
   */
  async function login(email, password) {
    try {
      const result = await store.dispatch('login', { email, password })
      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 100)) // let state settle
        router.push({ name: 'About' })
        return { success: true }
      }
      return { success: false, error: 'Login failed' }
    } catch (err) {
      return { success: false, error: err.message ?? 'Login failed' }
    }
  }

  /**
   * Register a new account.
   * Does NOT auto-login — redirects to Login with a success flag.
   * Returns { success, error }.
   */
  async function register(payload) {
    try {
      await store.dispatch('register', payload)
      router.push({ name: 'Login' })
      return { success: true }
    } catch (err) {
      const messages = err.response?.data?.errors ?? ['Registration failed. Please try again.']
      return { success: false, errors: messages }
    }
  }

  /**
   * Logout — clears Vuex state and redirects to Login.
   */
  async function logout() {
    try {
      await store.dispatch('logout')
    } catch {
      // Clear locally even if API call fails
      store.commit('LOGOUT')
    } finally {
      router.push({ name: 'Login' })
    }
  }

  /**
   * requireAuth — call this in a component's setup() or onMounted()
   * to guard a page that needs authentication.
   * The router guard handles most cases, but this is useful for
   * components that load data conditionally.
   */
  function requireAuth(redirectTo = 'Login') {
    if (!isLoggedIn.value) {
      router.push({ name: redirectTo })
      return false
    }
    return true
  }

  return {
    // state
    user,
    token,
    isLoggedIn,
    isAdmin,
    isApproved,
    allowedRoutes,
    userName,
    tokenExpiry,
    // actions
    login,
    logout,
    register,
    requireAuth,
    canAccess,
  }
}
