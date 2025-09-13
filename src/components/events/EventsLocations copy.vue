<template>
  <div class="stealth-select-wrapper">
    <div class="stealth-label">Filter By Location</div>
    <v-select
      v-model="selectedLocationValue"
      :items="locationOptions"
      variant="outlined"
      hide-details
      density="comfortable"
      class="location-select"
      :class="{ 'has-selection': selectedLocationValue }"
      @update:model-value="eventsLocations"
      clearable
      placeholder="Filter by Location"
    >
      <template v-slot:prepend-inner>
        <v-icon>mdi-map-marker-outline</v-icon>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// ✅ REACTIVE STATE - USING YOUR WORKING LOGIC
const selectedLocationValue = ref('');

// ✅ LOCATION OPTIONS - SAME AS YOUR WORKING VERSION BUT AS ARRAY
const locationOptions = [
  'All Locations',
  'Home', 
  'Birch Bay',
  'Seattle'
];

// ✅ EVENTS LOCATIONS FUNCTION - SAME AS YOUR WORKING VERSION
function eventsLocations(newValue) {
  console.log('📍 Location selected:', newValue);
  
  // ✅ DISPATCH TO STORE - SAME AS YOUR WORKING VERSION
  store.dispatch('eventsLocations', { location: newValue });
  
  // Update local state
  selectedLocationValue.value = newValue;
}
</script>

<style scoped>
/* ✅ BEAUTIFUL FILTER COMPONENT STYLING */
.stealth-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 250px;
}

.stealth-label {
  color: #1a1a1a !important;
  font-weight: 800 !important;
  font-size: 15px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
}

.stealth-select-wrapper:hover .stealth-label {
  color: #16c0b0 !important;
  transform: translateY(-1px);
}

/* ✅ MATCH YOUR OTHER BEAUTIFUL DROPDOWNS */
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

/* ✅ SELECTION STATE - PURPLE GRADIENT */
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

/* ✅ PLACEHOLDER STYLING */
:deep(.location-select .v-field__input input::placeholder) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  text-align: center !important;
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

/* ✅ ANIMATED SHINE EFFECT */
:deep(.location-select .v-field::before) {
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

:deep(.location-select .v-field:hover::before) {
  left: 100%;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .stealth-select-wrapper {
    max-width: 100%;
  }
  
  .stealth-label {
    font-size: 12px !important;
  }
  
  :deep(.location-select .v-field__input) {
    font-size: 1.1rem !important;
  }
}

@media (max-width: 480px) {
  :deep(.location-select .v-field__input) {
    font-size: 1rem !important;
  }
}
</style>