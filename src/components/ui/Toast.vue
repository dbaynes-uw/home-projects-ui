<template>
  <div class="toast-wrapper" aria-live="polite" aria-atomic="true">
    <transition-group name="toast" tag="div">
      <div
        v-for="note in notifications"
        :key="note.id"
        class="toast"
        :class="note.type"
      >
        <div class="toast-body">
          <span class="toast-message">{{ note.message }}</span>
          <button class="toast-close" @click="remove(note.id)">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const notifications = computed(() => store.state.notifications || [])

function remove(id) {
  store.commit('REMOVE_NOTIFICATION', id)
}
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}
.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.toast-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
.toast {
  pointer-events: auto;
  min-width: 240px;
  max-width: 420px;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(2,6,23,0.2);
  color: #082032;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-left: 6px solid #34d399; /* default green */
}
.toast.success { border-left-color: #34d399; background: #ecfdf5; }
.toast.error { border-left-color: #f87171; background: #fff1f2; }
.toast.info { border-left-color: #60a5fa; background: #eff6ff; }
.toast-warning { border-left-color: #f59e0b; background: #fffbeb; }
.toast-body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}
.toast-message { flex: 1; font-size: 0.95rem; color: #0f172a; }
.toast-close {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  color: #374151;
  padding: 0 4px;
}
</style>