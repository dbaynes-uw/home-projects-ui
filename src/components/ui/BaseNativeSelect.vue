<template>
  <div class="base-native-select-wrapper">
    <label v-if="label" class="base-native-select-label">
      {{ label }}
      <span v-if="required" class="base-native-select-required">*</span>
    </label>

    <select
      :value="selectedValue"
      class="base-native-select"
      :disabled="disabled"
      @change="handleChange"
    >
      <option v-if="includeEmptyOption" value="">
        {{ emptyOptionLabel }}
      </option>
      <option
        v-for="opt in options"
        :key="`opt-${String(opt.value)}`"
        :value="String(opt.value)"
      >
        {{ opt.title }}
      </option>
    </select>

    <div v-if="hint" class="base-native-select-hint">{{ hint }}</div>
    <div v-if="error" class="base-native-select-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    default: () => []
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
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  includeEmptyOption: {
    type: Boolean,
    default: false
  },
  emptyOptionLabel: {
    type: String,
    default: 'Select an option'
  },
  valueType: {
    type: String,
    default: 'string'
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = computed(() => {
  return props.modelValue == null ? '' : String(props.modelValue)
})

function handleChange(event) {
  const rawValue = event.target.value
  if (rawValue === '') {
    emit('update:modelValue', null)
    return
  }

  emit('update:modelValue', props.valueType === 'number' ? Number(rawValue) : rawValue)
}
</script>

<style scoped>
.base-native-select-wrapper {
  margin-bottom: 0.5rem;
}

.base-native-select-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.35rem;
}

.base-native-select-required {
  color: #b42318;
  margin-left: 0.15rem;
}

.base-native-select {
  width: 100%;
  min-height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  padding: 0 10px;
  background: #fff;
  font-size: 0.95rem;
}

.base-native-select-hint {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.base-native-select-error {
  font-size: 0.8rem;
  color: #b42318;
  margin-top: 0.25rem;
}
</style>