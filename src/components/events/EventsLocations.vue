<template>
  <div class="locations-wrapper">
    <v-select
      v-model="internalValue"
      :items="locationOptions"
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
        <span class="selection-text">Locations: {{ item.title }}</span>
      </template>
    </v-select>
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

// ✅ LOCATION OPTIONS - SAME AS YOUR WORKING VERSION BUT AS ARRAY
const locationOptions = [
  'All Locations',
  'Home', 
  'Birch Bay',
  'Seattle'
];
// ✅ ENHANCED HANDLE CHANGES WITH MORE LOGGING
function handleChange(newValue) {
  console.log('📅 Due By handleChange called with:', newValue);
  console.log('📅 Type of newValue:', typeof newValue);
  console.log('📅 Previous internalValue:', internalValue.value);
  
  internalValue.value = newValue;
  
  if (newValue && newValue !== '' && newValue !== null) {
    console.log('✅ Emitting events-location with value:', newValue);
    emit('events-location', newValue);
  } else {
    console.log('🗑️ Emitting clear-location');
    emit('clear-location');
  }
}

// ✅ WATCH FOR PROP CHANGES
watch(() => props.selectedLocationValue, (newVal) => {
  console.log('👁️ Prop selectedLocationValue changed to:', newVal);
  internalValue.value = newVal;
});

// ✅ WATCH INTERNAL VALUE CHANGES
watch(internalValue, (newVal, oldVal) => {
  console.log('🔄 internalValue changed from:', oldVal, 'to:', newVal);
});
</script>

<style scoped>
.locations-wrapper {
  position: relative;
  top: 0.5rem;
  left: 2.5rem;
  width: 100%;
  max-width: 15.8rem !important;
  height: 48px;
}

/* ✅ REMOVE THIS HARDCODED STYLING */
/* #locations-label {
  margin-left: 1rem;
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
  .locations-wrapper {
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