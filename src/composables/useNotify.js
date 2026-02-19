// Lightweight composable that delegates to the existing Vuex notify action
// Keeps Pinia stores decoupled from Vuex while reusing the shared toast system.
import store from '@/vuex/store'

export function notify(message = '', type = 'success', timeout = 4000) {
  return store.dispatch('notify', { message, type, timeout })
}
