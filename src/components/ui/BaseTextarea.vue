<template>
  <div :class="['base-textarea', $attrs.class]" v-bind="containerAttrs">
    <label v-if="label" :for="id" class="base-textarea__label">
      {{ label }}
      <span v-if="required" class="base-textarea__required">*</span>
    </label>

    <div class="base-textarea__shell">
      <span v-if="$slots['prepend-inner']" class="base-textarea__slot base-textarea__slot--prepend">
        <slot name="prepend-inner" />
      </span>

      <textarea
        :id="id"
        v-model="inputValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        :aria-invalid="Boolean(error || errorMessages)"
        class="base-textarea__input"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keyup="emit('keyup', $event)"
        @keydown="emit('keydown', $event)"
      />

      <span v-if="$slots['append-inner']" class="base-textarea__slot base-textarea__slot--append">
        <slot name="append-inner" />
      </span>
    </div>

    <div v-if="showError" class="base-textarea__error">
      {{ errorText }}
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
  rows: {
    type: [String, Number],
    default: 4,
  },
  error: {
    type: [Boolean, String],
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keyup', 'keydown'])

const containerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value),
})

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
</script>

<style scoped>
.base-textarea {
  margin-bottom: 0.9rem;
}

.base-textarea__label {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.base-textarea__required {
  color: #b42318;
  margin-left: 0.2rem;
}

.base-textarea__shell {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
}

.base-textarea__input {
  flex: 1;
  width: 100%;
  min-height: 120px;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  background: #fff;
  font: inherit;
  resize: vertical;
}

.base-textarea__input:focus {
  outline: none;
  border-color: #1976d2;
}

.base-textarea__slot {
  display: inline-flex;
  align-items: flex-start;
  padding-top: 0.5rem;
}

.base-textarea__error {
  color: #b42318;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
