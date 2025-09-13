<template>
  <div class="due-by-wrapper">
    <v-select
      v-model="internalValue"
      :items="dueByOptions"
      item-title="title"
      item-value="value"
      variant="outlined"
      hide-details
      density="comfortable"
      class="custom-styled-select"
      @update:model-value="handleChange"
      clearable
      placeholder="By Due Date"
    >
      <!-- ✅ FIXED SELECTION SLOT - SHOWS ACTUAL SELECTED ITEM -->
      <template v-slot:selection="{ item }">
        <span class="selection-text">Due in {{ item.title }}</span>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// ✅ DEFINE PROPS AND EMITS
const props = defineProps({
  selectedDueByValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['events-due-by', 'clear-due-by']);

// ✅ REACTIVE STATE
const internalValue = ref(props.selectedDueByValue);

// ✅ OPTIONS DATA
const dueByOptions = [
  { title: '7 days', value: '7' },
  { title: '10 days', value: '10' },
  { title: '14 days', value: '14' },
  { title: '21 days', value: '21' },
  { title: '30 days', value: '30' },
  { title: '60 days', value: '60' },
  { title: '90 days', value: '90' },
  { title: '120 days', value: '120' },
  { title: '180 days', value: '180' },
  { title: '360 days', value: '360' }
];

// ✅ ENHANCED HANDLE CHANGES WITH MORE LOGGING
function handleChange(newValue) {
  console.log('📅 Due By handleChange called with:', newValue);
  console.log('📅 Type of newValue:', typeof newValue);
  console.log('📅 Previous internalValue:', internalValue.value);
  
  internalValue.value = newValue;
  
  if (newValue && newValue !== '' && newValue !== null) {
    console.log('✅ Emitting events-due-by with value:', newValue);
    emit('events-due-by', newValue);
  } else {
    console.log('🗑️ Emitting clear-due-by');
    emit('clear-due-by');
  }
}

// ✅ WATCH FOR PROP CHANGES
watch(() => props.selectedDueByValue, (newVal) => {
  console.log('👁️ Prop selectedDueByValue changed to:', newVal);
  internalValue.value = newVal;
});

// ✅ WATCH INTERNAL VALUE CHANGES
watch(internalValue, (newVal, oldVal) => {
  console.log('🔄 internalValue changed from:', oldVal, 'to:', newVal);
});
</script>

<style scoped>
.due-by-wrapper {
  position: relative;
  top: 0.5rem;
  left: 2.5rem !important;
  width: 100%;
  max-width: 15.8rem !important;
  height: 48px;
}

/* ✅ REMOVE THIS HARDCODED STYLING */
/* #due-by-label {
  margin-left: 1rem;
} */

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