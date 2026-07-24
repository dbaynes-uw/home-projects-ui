<template>
  <div :class="['base-text-field', $attrs.class]" v-bind="containerAttrs">
    <label v-if="label" :for="id" class="base-text-field__label">
      {{ label }}
      <span v-if="required" class="base-text-field__required">*</span>
    </label>

    <div class="base-text-field__shell">
      <span v-if="$slots['prepend-inner']" class="base-text-field__slot base-text-field__slot--prepend">
        <slot name="prepend-inner" />
      </span>

      <span v-if="prependIcon" class="base-text-field__icon base-text-field__icon--prepend">
        <i :class="prependIconClasses"></i>
      </span>

      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :min="min"
        :max="max"
        :step="step"
        :inputmode="inputmode"
        :pattern="pattern"
        :aria-invalid="Boolean(error || errorMessages)"
        class="base-text-field__input"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keyup="emit('keyup', $event)"
        @keydown="emit('keydown', $event)"
      />

      <button
        v-if="clearable && hasValue"
        type="button"
        class="base-text-field__clear"
        @click="clearValue"
      >
        <slot name="clear-icon">
          <i :class="clearIconClasses"></i>
        </slot>
      </button>

      <span v-if="$slots['append-inner']" class="base-text-field__slot base-text-field__slot--append">
        <slot name="append-inner" />
      </span>

      <span v-if="appendIcon" class="base-text-field__icon base-text-field__icon--append">
        <i :class="appendIconClasses"></i>
      </span>
    </div>

    <div v-if="showError" class="base-text-field__error">
      {{ errorText }}
    </div>

    <div v-else-if="hint" class="base-text-field__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: '',
  },
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: [String, Number],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
  min: {
    type: [String, Number],
    default: undefined,
  },
  max: {
    type: [String, Number],
    default: undefined,
  },
  step: {
    type: [String, Number],
    default: undefined,
  },
  inputmode: {
    type: String,
    default: undefined,
  },
  pattern: {
    type: String,
    default: undefined,
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  clearIcon: {
    type: String,
    default: 'mdi-close',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keyup', 'keydown', 'click:clear'])

const containerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value),
})

const hasValue = computed(() => String(props.modelValue ?? '').length > 0)
const prependIconClasses = computed(() => normalizeIconClasses(props.prependIcon))
const appendIconClasses = computed(() => normalizeIconClasses(props.appendIcon))
const clearIconClasses = computed(() => normalizeIconClasses(props.clearIcon))
const errorText = computed(() => {
  if (Array.isArray(props.errorMessages)) {
    return props.errorMessages[0] || ''
  }
  if (props.errorMessages) {
    return String(props.errorMessages)
  }
  return typeof props.error === 'string' ? props.error : ''
})
const showError = computed(() => Boolean(props.error) || Boolean(errorText.value))

function clearValue() {
  emit('update:modelValue', '')
  emit('click:clear')
}

function normalizeIconClasses(value) {
  const iconValue = String(value ?? '').trim()
  if (!iconValue) return ''
  if (iconValue.includes(' ')) return iconValue
  if (iconValue.startsWith('mdi-')) return `mdi ${iconValue}`
  return `mdi mdi-${iconValue}`
}
</script>

<style scoped>
.base-text-field {
  margin-bottom: 0.9rem;
}

.base-text-field__label {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.base-text-field__required {
  color: #b42318;
  margin-left: 0.2rem;
}

.base-text-field__shell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.base-text-field__input {
  flex: 1;
  width: 100%;
  min-height: 40px;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  background: #fff;
  font: inherit;
}

.base-text-field__input:focus {
  outline: none;
  border-color: #1976d2;
}

.base-text-field__slot {
  display: inline-flex;
  align-items: center;
}

.base-text-field__icon {
  display: inline-flex;
  align-items: center;
  color: #64748b;
}

.base-text-field__clear {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #64748b;
}

.base-text-field__error {
  color: #b42318;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.base-text-field__hint {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
