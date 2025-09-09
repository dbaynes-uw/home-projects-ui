<template>
  <div class="location-wrapper">
    <div class="custom-location-button" :class="{ 'has-selection': internalValue }" @click="openMenu">
      <v-icon class="location-icon">mdi-map-marker-outline</v-icon>
      <span class="location-text">
        {{ internalValue || 'Filter by Location' }}
      </span>
      <v-icon class="dropdown-arrow">mdi-chevron-down</v-icon>
    </div>
    
    <!-- ✅ HIDDEN V-SELECT FOR FUNCTIONALITY -->
    <v-select
      v-model="internalValue"
      :items="locationOptions"
      item-title="title"
      item-value="value"
      variant="outlined"
      hide-details
      density="default"
      class="hidden-select"
      @update:model-value="handleChange"
      ref="selectRef"
      :menu-props="{ attach: true }"
      clearable
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedLocationValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:selectedLocationValue']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedLocationValue);
const locationOptions = ref([]);

// ✅ COMPUTED PROPERTIES
const events = computed(() => store.state.events || []);
const selectRef = ref(null);

// ✅ OPEN MENU FUNCTION
function openMenu() {
  if (selectRef.value) {
    selectRef.value.focus();
    selectRef.value.activateMenu();
  }
}
// ✅ GET UNIQUE LOCATIONS FROM EVENTS
function getUniqueLocations() {
  if (!events.value || events.value.length === 0) return [];
  
  const locations = events.value
    .map(event => event.location)
    .filter(location => location && location.trim() !== '')
    .filter((location, index, array) => array.indexOf(location) === index)
    .sort();
  
  return locations.map(location => ({
    title: location,
    value: location
  }));
}

// ✅ SIMPLIFIED - NO EVENTSERVICE CALLS
function handleChange(newValue) {
  internalValue.value = newValue;
  
  // Just emit to parent - let parent handle all filtering
  emit('update:selectedLocationValue', newValue);
  
  // ✅ OPTIONAL: Just update request type for tracking (no service call)
  if (newValue) {
    store.commit('SET_EVENTS_REQUEST', 'Location');
  } else {
    store.commit('SET_EVENTS_REQUEST', '');
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  locationOptions.value = getUniqueLocations();
});

// ✅ WATCH FOR EVENTS CHANGES
watch(events, () => {
  locationOptions.value = getUniqueLocations();
}, { deep: true });
</script>

<style scoped>
/* ✅ CUSTOM BUTTON STYLING */
.custom-location-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  position: relative;
  left: 2rem;
  overflow: hidden;
}

.custom-location-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4);
}

/* ✅ SELECTED STATE */
.custom-location-button.has-selection {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.custom-location-button.has-selection:hover {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* ✅ TEXT AND ICON STYLING */
.location-icon {
  color: black !important;
  font-size: 18px !important;
  margin-right: 8px !important;
}

.location-text {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  flex: 1;
  text-align: center;
}

.dropdown-arrow {
  color: black !important;
  font-size: 16px !important;
  margin-left: 8px !important;
}

/* ✅ SELECTED STATE COLORS */
.custom-location-button.has-selection .location-icon,
.custom-location-button.has-selection .location-text,
.custom-location-button.has-selection .dropdown-arrow {
  color: white !important;
}

/* ✅ HIDE THE ACTUAL SELECT */
.hidden-select {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

/* ✅ ANIMATED SHINE EFFECT */
.custom-location-button::before {
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
}

.custom-location-button:hover::before {
  left: 100%;
}
.location-wrapper {
  position: relative;
  top: 0.5rem;
  width: 100%;
  max-width: 250px;
  height: 48px; /* ✅ FORCE CONSISTENT HEIGHT */
  display: flex;
  align-items: center;
}

/* ✅ MATCH OTHER DROPDOWN STYLING */
:deep(.location-select .v-field) {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  border: none !important;
  height: 48px !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
}

:deep(.location-select .v-field:hover) {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

/* ✅ SELECTION STATE */
:deep(.location-select.has-selection .v-field) {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

:deep(.location-select.has-selection .v-field:hover) {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

/* ✅ TEXT STYLING */
:deep(.location-select .v-field__input) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  text-align: center !important;
  padding: 0 16px !important;
}

:deep(.location-select.has-selection .v-field__input) {
  color: white !important;
}

/* ✅ REMOVE OUTLINE */
:deep(.location-select .v-field__outline) {
  display: none !important;
}

/* ✅ DROPDOWN ARROW */
:deep(.location-select .v-field__append-inner) {
  color: black !important;
}

:deep(.location-select.has-selection .v-field__append-inner) {
  color: white !important;
}

/* ✅ ICON STYLING */
:deep(.location-select .v-field__prepend-inner) {
  margin-right: 8px !important;
}

:deep(.location-select .v-field__prepend-inner .v-icon) {
  color: black !important;
}

:deep(.location-select.has-selection .v-field__prepend-inner .v-icon) {
  color: white !important;
}

</style>