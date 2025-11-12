<template>
  <div class="due-by-wrapper">
    <select
      v-model="internalValue"
      @change="handleNativeChange"
      class="native-select"
    >
      <option value="">By Due Date</option>
      <option value="all">All Due Items</option>
      <option value="7">Next 7 days</option>
      <option value="14">Next 14 days</option>
      <option value="30">Next 30 days</option>
      <option value="60">Next 60 days</option>
      <option value="90">Next 90 days</option>
      <option value="120">Next 120 days</option>
      <option value="180">Next 180 days</option>
      <option value="360">Next 360 days</option>
    </select>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedDueByValue: {
    type: [String, Number],
    default: ''
  }
});

const selectRef = ref(null);
function handleNativeChange(event) {
  const newValue = event.target.value;
  handleChange(newValue);
}
function handleDropdownClick() {
  nextTick(() => {
    // Check if menu exists after click
    const menus = document.querySelectorAll('.v-menu');
    const overlays = document.querySelectorAll('.v-overlay__content');
  });
}
const emit = defineEmits(['events-due-by', 'clear-due-by']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedDueByValue);

onMounted(() => {
  const vuetifyStyles = document.querySelector('style[data-vite-dev-id*="vuetify"]') || 
                       document.querySelector('link[href*="vuetify"]');
});
// ✅ ENHANCED HANDLE CHANGES WITH MORE LOGGING
function handleChange(newValue) {
  internalValue.value = newValue;
  
  if (newValue && newValue !== '' && newValue !== null) {
    emit('events-due-by', newValue);
  } else {
    emit('clear-due-by');
  }
}

</script>

<style scoped>
/*.due-by-wrapper {
  position: relative;
  top: 0.5rem;
  left: 2.5rem !important;
  width: 100%;
  max-width: 15.8rem !important;
  height: 48px;
}
*/
.due-by-wrapper {
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
/* ✅ STYLE THE V-SELECT TO LOOK LIKE YOUR CUSTOM BUTTON */
:deep(.custom-styled-select .v-field) {
  background: linear-gradient(to right, #16c0b0, #84cf6a) !important;
  border-radius: 12px !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(22, 192, 176, 0.3) !important;
  transition: all 0.3s ease !important;
  height: 48px !important;
  min-height: 48px !important;
}

:deep(.custom-styled-select .v-field:hover) {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4) !important;
}

/* ✅ SELECTED STATE - PURPLE GRADIENT */
:deep(.custom-styled-select.v-field--dirty .v-field) {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

:deep(.custom-styled-select.v-field--dirty .v-field:hover) {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}

/* ✅ FIELD CONTENT STYLING */
:deep(.custom-styled-select .v-field__field) {
  padding: 0 16px !important;
  display: flex !important;
  align-items: center !important;
  height: 48px !important;
}

:deep(.custom-styled-select .v-field__input) {
  font-size: 1.25rem !important;
  font-weight: 800 !important;
  color: black !important;
  text-align: center !important;
  padding: 0 !important;
  min-height: auto !important;
}

/* ✅ SELECTED STATE TEXT COLOR */
:deep(.custom-styled-select.v-field--dirty .v-field__input) {
  color: white !important;
}

/* ✅ REMOVE UNUSED PREPEND ICON STYLES */
/* :deep(.custom-styled-select .prepend-icon) {
  color: black !important;
  font-size: 18px !important;
  margin-right: 8px !important;
}

:deep(.custom-styled-select.v-field--dirty .prepend-icon) {
  color: white !important;
} */
/* ✅ FIX CLEAR ICON POSITION - ADD THIS */
:deep(.custom-styled-select .v-field__clearable) {
  margin-right: 4px !important; /* ✅ MOVE CLOSER TO DROPDOWN ARROW */
  margin-left: auto !important; /* ✅ PUSH TO RIGHT SIDE */
}

:deep(.custom-styled-select .v-field__append-inner) {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important; /* ✅ SMALL GAP BETWEEN CLEAR AND DROPDOWN */
}

/* ✅ STYLE THE CLEAR ICON */
:deep(.custom-styled-select .v-field__clearable .v-icon) {
  position: relative !important;
  left: .5rem !important; /* ✅ ADJUST POSITION */
  color: black !important;
  font-size: 18px !important;
  opacity: 0.7 !important;
  transition: all 0.3s ease !important;
}

:deep(.custom-styled-select .v-field__clearable:hover .v-icon) {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}

/* ✅ SELECTED STATE CLEAR ICON */
:deep(.custom-styled-select.v-field--dirty .v-field__clearable .v-icon) {
  color: white !important;
}

/* ✅ ADJUST FIELD PADDING TO ACCOMMODATE ICONS */
:deep(.custom-styled-select .v-field__field) {
  padding: 0 12px 0 16px !important; /* ✅ LESS RIGHT PADDING */
}

/* ✅ ENSURE PROPER ICON ALIGNMENT */
:deep(.custom-styled-select .v-field__append-inner .v-icon) {
  color: black !important;
  font-size: 16px !important;
  flex-shrink: 0 !important;
}

:deep(.custom-styled-select.v-field--dirty .v-field__append-inner .v-icon) {
  color: white !important;
}

/* ✅ DROPDOWN ARROW */
:deep(.custom-styled-select .v-field__append-inner .v-icon) {
  color: black !important;
  font-size: 16px !important;
}

:deep(.custom-styled-select.v-field--dirty .v-field__append-inner .v-icon) {
  color: white !important;
}

/* ✅ PLACEHOLDER STYLING */
:deep(.custom-styled-select .v-field__input input::placeholder) {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  text-align: center !important;
}

/* ✅ SELECTION CONTENT - ENSURE LINEAR LAYOUT */
.selection-content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  flex-direction: row !important;
}

.selection-icon {
  color: inherit !important;
  font-size: 18px !important;
  margin-right: 8px !important;
  flex-shrink: 0 !important;
}

.selection-text {
  color: inherit !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  flex: 1 !important;
  text-align: center !important;
  white-space: nowrap !important;
}

/* ✅ REMOVE VUETIFY OUTLINE */
:deep(.custom-styled-select .v-field__outline) {
  display: none !important;
}

/* ✅ SHINE EFFECT */
:deep(.custom-styled-select .v-field::before) {
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

:deep(.custom-styled-select .v-field:hover::before) {
  left: 100%;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .due-by-wrapper {
    max-width: 100%;
  }
  
  :deep(.custom-styled-select .v-field__input) {
    font-size: 1.25rem !important;
  }
  
  .selection-text {
    font-size: 1.25rem !important;
  }
}
</style>