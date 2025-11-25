<template>
  <div class="hours-minutes-input">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-row">
      <div class="input-group">
        <input
          v-model.number="localHours"
          type="number"
          min="0"
          max="23"
          class="input-field hours-input"
          placeholder="0"
          @input="updateValue"
        />
        <span class="input-suffix">h</span>
      </div>
      
      <span class="separator">:</span>
      
      <div class="input-group">
        <input
          v-model.number="localMinutes"
          type="number"
          min="0"
          max="59"
          class="input-field minutes-input"
          placeholder="00"
          @input="updateValue"
        />
        <span class="input-suffix">m</span>
      </div>
    </div>
    
    <span v-if="hint" class="input-hint">{{ hint }}</span>
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],  // ✅ Accept both String and Number
    default: '0m'
  },
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const localHours = ref(0);
const localMinutes = ref(0);

// ✅ Parse BOTH "1h 30m" format AND decimal numbers (6 or 6.5)
function parseValue(value) {
  if (!value) return { hours: 0, minutes: 0 };
  
  // If it's a number (decimal hours like 6 or 6.5)
  if (typeof value === 'number') {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return { hours, minutes };
  }
  
  // If it's a string, try parsing as "1h 30m" format
  if (typeof value === 'string') {
    let hours = 0;
    let minutes = 0;
    
    const hourMatch = value.match(/(\d+)h/);
    const minuteMatch = value.match(/(\d+)m/);
    
    if (hourMatch) hours = parseInt(hourMatch[1]);
    if (minuteMatch) minutes = parseInt(minuteMatch[1]);
    
    // If no match, try parsing as a plain decimal string "6" or "6.5"
    if (hours === 0 && minutes === 0 && /^\d+\.?\d*$/.test(value)) {
      const decimal = parseFloat(value);
      hours = Math.floor(decimal);
      minutes = Math.round((decimal - hours) * 60);
    }
    
    return { hours, minutes };
  }
  
  return { hours: 0, minutes: 0 };
}

// Convert hours and minutes to "1h 30m" format
function formatValue(hours, minutes) {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  
  if (h === 0 && m === 0) return '0m';
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  const { hours, minutes } = parseValue(newValue);
  localHours.value = hours;
  localMinutes.value = minutes;
}, { immediate: true });

// Update parent when input changes
function updateValue() {
  const formatted = formatValue(localHours.value, localMinutes.value);
  emit('update:modelValue', formatted);
}
</script>

<style scoped>
.hours-minutes-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-group {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 12px;
  transition: all 0.2s;
  flex: 1;
}

.input-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field {
  border: none;
  outline: none;
  padding: 12px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  width: 100%;
  text-align: center;
}

.input-field::placeholder {
  color: #ccc;
}

/* Hide number input spinners */
.input-field::-webkit-inner-spin-button,
.input-field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-field[type=number] {
  -moz-appearance: textfield;
}

.input-suffix {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  margin-left: 4px;
}

.separator {
  font-size: 24px;
  font-weight: 700;
  color: #999;
}

.input-hint {
  font-size: 12px;
  color: #666;
}

.input-error {
  font-size: 12px;
  color: #f44336;
  font-weight: 600;
}
</style>