<template>
  <div class="action-button-wrapper">
    <v-btn
      class="action-button"
      id="button-as-link"
      :class="{ 'active-state': isShowingActive }"
      @click="toggleEventsStatus"
      variant="elevated"
      block
    >
      <v-icon start size="large">{{ getStatusIcon() }}</v-icon>
      {{ getStatusLabel() }}
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// ✅ RECEIVE PROPS FROM PARENT
const props = defineProps({
  showActiveEvents: {
    type: Boolean,
    default: true // ✅ CHANGED TO START WITH ACTIVE
  }
});

// ✅ EMIT TO PARENT
const emit = defineEmits(['toggle-status']);

// ✅ USE COMPUTED TO SYNC WITH PARENT
const isShowingActive = computed(() => props.showActiveEvents);

// ✅ FIXED TOGGLE FUNCTION
function toggleEventsStatus() {
  const newActiveState = !props.showActiveEvents; // ✅ TOGGLE BASED ON PROPS
  
  console.log('🔄 Toggling from', props.showActiveEvents, 'to', newActiveState);
  
  // Call appropriate store action with status parameter
  if (newActiveState) {
    // Switch to Active Events
    console.log('📡 Dispatching eventsStatus with "active"');
    store.dispatch('eventsStatus', 'active');
    store.commit('SET_EVENTS_REQUEST', 'Active');
    console.log('✅ Switched to Active Events');
  } else {
    // Switch to Inactive Events
    console.log('📡 Dispatching eventsStatus with "inactive"');
    store.dispatch('eventsStatus', 'inactive');
    store.commit('SET_EVENTS_REQUEST', 'Inactive');
    console.log('✅ Switched to Inactive Events');
  }
  
  // ✅ EMIT NEW STATE TO PARENT
  emit('toggle-status', newActiveState);
  
  // ✅ DEBUG - CHECK STORE STATE AFTER DISPATCH
  setTimeout(() => {
    console.log('📊 Store events after dispatch:', store.getters.events?.length || 0);
    console.log('📊 Store state:', store.state.eventsRequest);
  }, 1000);
}

// ✅ DYNAMIC LABEL BASED ON PROPS
function getStatusLabel() {
  return isShowingActive.value ? 'Showing Active' : 'Showing Inactive';
}

// ✅ DYNAMIC ICON BASED ON PROPS  
function getStatusIcon() {
  return isShowingActive.value ? 'mdi-play-circle' : 'mdi-pause-circle';
}
</script>
<style scoped>
.action-button-wrapper {
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

/* ✅ ACTIVE STATE - GREEN GRADIENT (DEFAULT) */
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

/* ✅ ACTIVE STATE TEXT (DEFAULT) */
.action-button :deep(.v-btn__content) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 20px !important;
  text-transform: none !important;
}

.action-button :deep(.v-icon) {
  color: black !important;
}

/* ✅ INACTIVE STATE - PURPLE GRADIENT (WHEN TOGGLED) */
.action-button:not(.active-state) {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

.action-button:not(.active-state):hover {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

/* ✅ INACTIVE STATE TEXT */
.action-button:not(.active-state) :deep(.v-btn__content) {
  color: white !important;
}

.action-button:not(.active-state) :deep(.v-icon) {
  color: white !important;
}

/* ✅ HOVER LABEL EFFECTS */
.action-button-wrapper:hover .action-label {
  color: #16c0b0 !important; /* Default to active color */
  transform: translateY(-1px);
}

.action-button-wrapper:has(.action-button:not(.active-state)):hover .action-label {
  color: #667eea !important; /* Inactive state color */
}

</style>