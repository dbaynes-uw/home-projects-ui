<template>
  <div class="action-button-wrapper">
    <v-btn
      class="action-button"
      @click="eventsPastDue($event)"
      variant="elevated"
      block
    >
      <i class="fas fa-exclamation-triangle"></i>
      Events Past Due
    </v-btn>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

function eventsPastDue() {
  store.dispatch('eventsPastDue');
  store.commit('SET_EVENTS_REQUEST', 'PastDue');
}
</script>

<style scoped>
.action-button-wrapper {
  position: relative; 
  left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 250px;
  height: 56px;
}

.action-label {
  color: #1a1a1a !important;
  font-weight: 800 !important;
  font-size: 15px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

.action-button :deep(.v-btn__content) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 20px !important;
  text-transform: none !important;
}

.action-button {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  border: none !important;
}

.action-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

.action-button-wrapper:hover .action-label {
  color: #16c0b0 !important;
  transform: translateY(-1px);
}
</style>