<template>
  <div class="action-button-wrapper">
    <v-btn
      class="action-button"
      :class="{ 'active-state': isShowingActive }"
      @click="toggleEventsStatus"
      variant="elevated"
      size="default"
      block
      :prepend-icon="getStatusIcon()"
      density="default"
    >
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
  position: relative; 
  left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 250px;
  height: 56px;
}
/* ✅ FORCE FILTER BUTTON ALIGNMENT */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end; /* ✅ ALIGN TO BOTTOM */
}

.filter-button-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end; /* ✅ PUSH TO BOTTOM */
}

/* ✅ ENSURE ALL FILTER COMPONENTS HAVE SAME STRUCTURE */
.filters-grid > * {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ✅ FORCE CONSISTENT HEIGHTS */
.filters-grid .action-button-wrapper,
.filters-grid .dropdown-wrapper,
.filters-grid > div {
  min-height: 76px; /* ✅ LABEL + BUTTON HEIGHT */
  max-height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.action-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 15.8rem !important;
  max-width: 150px;
  height: auto; /* ✅ LET IT SIZE NATURALLY */
}

.action-label {
  color: #1a1a1a !important;
  font-weight: 800 !important;
  font-size: 12px !important; /* ✅ MATCH OTHER LABELS */
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

/* ✅ MATCH THE EXACT SIZING OF OTHER FILTER BUTTONS */
.action-button {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  height: 48px !important; /* ✅ SAME AS OTHER DROPDOWNS */
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  border: none !important;
  width: 100% !important;
  min-height: 48px !important; /* ✅ PREVENT EXPANSION */
  max-height: 48px !important; /* ✅ PREVENT EXPANSION */
}

.action-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

/* ✅ BUTTON CONTENT SIZING TO MATCH DROPDOWNS */
.action-button :deep(.v-btn__content) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important; /* ✅ MATCH DROPDOWN TEXT SIZE */
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 16px !important; /* ✅ MATCH DROPDOWN PADDING */
}

.action-button :deep(.v-icon) {
  color: black !important;
  font-size: 18px !important; /* ✅ MATCH DROPDOWN ICON SIZE */
  margin-right: 8px !important;
}

/* ✅ INACTIVE STATE - PURPLE GRADIENT */
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
  color: #16c0b0 !important;
  transform: translateY(-1px);
}

.action-button-wrapper:has(.action-button:not(.active-state)):hover .action-label {
  color: #667eea !important;
}

/* ✅ ANIMATED SHINE EFFECT */
.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
  z-index: 1;
  pointer-events: none;
  border-radius: 12px;
}

.action-button:hover::before {
  left: 100%;
}

/* ✅ OVERRIDE ANY VUETIFY DEFAULT PADDING/MARGIN */
.action-button :deep(.v-btn__prepend) {
  margin-inline-end: 8px !important;
  margin-inline-start: 0 !important;
}

.action-button :deep(.v-btn__append) {
  margin-inline-start: 8px !important;
  margin-inline-end: 0 !important;
}

/* ✅ ENSURE NO EXTRA SPACING */
.action-button :deep(.v-btn__overlay) {
  border-radius: 12px !important;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .action-button-wrapper {
    max-width: 100%;
  }
  
  .action-label {
    font-size: 11px !important;
  }
  
  .action-button {
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
  }
  
  .action-button :deep(.v-btn__content) {
    font-size: 1.25rem !important;
  }
  
  .action-button :deep(.v-icon) {
    font-size: 16px !important;
  }
}

@media (max-width: 480px) {
  .action-button {
    height: 40px !important;
    min-height: 40px !important;
    max-height: 40px !important;
  }
  
  .action-button :deep(.v-btn__content) {
    font-size: 1.25rem !important;
  }
  
  .action-button :deep(.v-icon) {
    font-size: 15px !important;
  }
}
</style>