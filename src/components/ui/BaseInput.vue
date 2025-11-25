<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">
      {{ label }}
      <span v-if="required" class="base-input-required">*</span>
    </label>
    
    <div class="base-input-container">
      <i v-if="prependIcon" :class="`mdi mdi-${prependIcon} base-input-icon-prepend`"></i>
      
      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :class="['base-input', { 'has-prepend': prependIcon, 'has-append': appendIcon, 'has-error': error }]"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <i v-if="appendIcon" :class="`mdi mdi-${appendIcon} base-input-icon-append`"></i>
    </div>
    
    <div v-if="error" class="base-input-error">
      <i class="mdi mdi-alert-circle"></i>
      {{ error }}
    </div>
    
    <div v-else-if="hint" class="base-input-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  prependIcon: {
    type: String,
    default: null
  },
  appendIcon: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
.base-input-wrapper {
  margin-bottom: 20px;
}

.base-input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.base-input-required {
  color: #f45c43;
  margin-left: 4px;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
}

.base-input.has-prepend {
  padding-left: 44px;
}

.base-input.has-append {
  padding-right: 44px;
}

.base-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.base-input:hover:not(:disabled):not(:focus) {
  border-color: #b0b0b0;
}

.base-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.base-input.has-error {
  border-color: #f45c43;
}

.base-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 92, 67, 0.1);
}

.base-input-icon-prepend,
.base-input-icon-append {
  position: absolute;
  color: #999;
  font-size: 20px;
  pointer-events: none;
}

.base-input-icon-prepend {
  left: 14px;
}

.base-input-icon-append {
  right: 14px;
}

.base-input:focus ~ .base-input-icon-prepend,
.base-input:focus ~ .base-input-icon-append {
  color: #667eea;
}

.base-input-error {
  margin-top: 6px;
  font-size: 13px;
  color: #f45c43;
  display: flex;
  align-items: center;
  gap: 4px;
}

.base-input-hint {
  margin-top: 6px;
  font-size: 13px;
  color: #999;
}
</style>