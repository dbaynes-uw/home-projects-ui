<template>
  <div class="due-by-wrapper">
    <div class="custom-due-by-button" :class="{ 'has-selection': internalValue }" @click="openMenu">
      <v-icon class="due-by-icon">mdi-clock-outline</v-icon>
      <span class="due-by-text">
        {{ getDisplayText() }}
      </span>
      <v-icon class="dropdown-arrow">mdi-chevron-down</v-icon>
    </div>
    
    <!-- ✅ HIDDEN V-SELECT FOR FUNCTIONALITY -->
    <v-select
      v-model="internalValue"
      :items="dueByOptions"
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
import { ref } from 'vue';

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

// ✅ REF FOR SELECT
const selectRef = ref(null);

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

// ✅ GET DISPLAY TEXT
function getDisplayText() {
  if (!internalValue.value) {
    return 'By Due Date';
  }
  
  const selectedOption = dueByOptions.find(option => option.value === internalValue.value);
  return selectedOption ? `Due in ${selectedOption.title}` : 'Filter by Due Date';
}

// ✅ OPEN MENU FUNCTION
function openMenu() {
  if (selectRef.value) {
    selectRef.value.focus();
    selectRef.value.activateMenu();
  }
}

// ✅ HANDLE CHANGES
function handleChange(newValue) {
  console.log('📅 Due By changed to:', newValue);
  internalValue.value = newValue;
  
  if (newValue && newValue !== '') {
    emit('events-due-by', newValue);
  } else {
    emit('clear-due-by');
  }
}
</script>

<style scoped>
.due-by-wrapper {
  position: relative;
  top: 0.5rem;
  width: 100%;
  max-width: 250px;
  height: 48px;
  display: flex;
  align-items: center;
}

/* ✅ CUSTOM BUTTON STYLING - DEFAULT GREEN GRADIENT */
.custom-due-by-button {
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
  overflow: hidden;
}

.custom-due-by-button:hover {
  background: linear-gradient(to right, #14a89a, #72b558) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 192, 176, 0.4);
}

/* ✅ SELECTED STATE - PURPLE GRADIENT */
.custom-due-by-button.has-selection {
  background: linear-gradient(to right, #667eea, #764ba2) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.custom-due-by-button.has-selection:hover {
  background: linear-gradient(to right, #5a6fd8, #6a42a0) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* ✅ TEXT AND ICON STYLING - DEFAULT STATE */
.due-by-icon {
  color: black !important;
  font-size: 18px !important;
  margin-right: 8px !important;
}

.due-by-text {
  color: black !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important; /* ✅ SAME AS LOCATION TEXT */
  flex: 1;
  text-align: center;
}

.dropdown-arrow {
  color: black !important;
  font-size: 16px !important;
  margin-left: 8px !important;
}

/* ✅ SELECTED STATE COLORS */
.custom-due-by-button.has-selection .due-by-icon,
.custom-due-by-button.has-selection .due-by-text,
.custom-due-by-button.has-selection .dropdown-arrow {
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
.custom-due-by-button::before {
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

.custom-due-by-button:hover::before {
  left: 100%;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .due-by-wrapper {
    max-width: 100%;
  }
  
  .custom-due-by-button {
    height: 44px !important;
  }
  
  .due-by-text {
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .custom-due-by-button {
    height: 40px !important;
  }
  
  .due-by-text {
    font-size: 0.9rem !important;
  }
}
</style>