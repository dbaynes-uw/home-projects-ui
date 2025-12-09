<template>
  <div class="locations-wrapper">
    <select
      v-model="internalValue"
      @change="handleNativeChange"
      class="native-select"
    >
      <option value="">By Location</option>
      <option value="all">All Locations</option>
      <option value="Home">Home</option>
      <option value="Birch Bay">Birch Bay</option>
      <option value="Seattle">Seattle</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedLocationValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['events-location', 'clear-location']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedLocationValue);

// ✅ NATIVE SELECT HANDLER
function handleNativeChange(event) {
  const newValue = event.target.value;
  handleChange(newValue);
}

// ✅ ENHANCED HANDLE CHANGES WITH LOGGING
function handleChange(newValue) {
  
  internalValue.value = newValue;
  
  if (newValue && newValue !== '' && newValue !== null) {
    emit('events-location', newValue);
  } else {
    emit('clear-location');
  }
}

// ✅ WATCH PROPS
watch(() => props.selectedLocationValue, (newVal) => {
  internalValue.value = newVal;
});
</script>
<style scoped>
.locations-wrapper {
  position: relative;
  width: 200px;
  height: 48px;
}
/* ✅ REMOVE THIS HARDCODED STYLING */
/* #due-by-label {
  margin-left: 1rem;
} */
.native-select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: linear-gradient(to right, #16c0b0, #84cf6a);
  color: black;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.native-select:hover {
  background: linear-gradient(to right, #14a89a, #72b558);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4);
}

.native-select:focus {
  outline: none;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.native-select option {
  background: white;
  color: black;
  font-weight: 600;
  padding: 8px;
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