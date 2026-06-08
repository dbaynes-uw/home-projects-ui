<template>
  <div :class="['base-select', $attrs.class]" v-bind="containerAttrs">
    <label v-if="label" :for="id" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>

    <select
      :id="id"
      :value="selectedValue"
      :required="required"
      :disabled="disabled"
      :multiple="multiple"
      :aria-invalid="Boolean(error)"
      class="base-select__input"
      @change="handleChange"
    >
      <option v-if="includeEmptyOption" value="">
        {{ emptyOptionLabel }}
      </option>
      <template v-if="$slots.default">
        <slot />
      </template>
      <template v-else>
        <option
          v-for="opt in normalizedItems"
          :key="`opt-${String(opt.value)}`"
          :value="String(opt.value)"
        >
          {{ opt.title }}
        </option>
      </template>
    </select>

    <div v-if="hint" class="base-select__hint">{{ hint }}</div>
    <div v-if="error" class="base-select__error">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null],
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  id: {
    type: String,
    default: undefined,
  },
  label: {
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
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  includeEmptyOption: {
    type: Boolean,
    default: false,
  },
  emptyOptionLabel: {
    type: String,
    default: 'Select an option',
  },
  valueType: {
    type: String,
    default: 'string',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const containerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const normalizedItems = computed(() => {
  return props.items.map((item) => {
    if (item && typeof item === 'object') {
      return {
        value: 'value' in item ? item.value : item.title,
        title: 'title' in item ? item.title : String(item.value ?? item),
      }
    }
    return { value: item, title: String(item) }
  })
})

const selectedValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.map((item) => String(item))
  }
  return props.modelValue == null ? '' : String(props.modelValue)
})

function handleChange(event) {
  const target = event.target
  let value

  if (props.multiple) {
    value = Array.from(target.selectedOptions).map((option) => option.value)
  } else {
    const rawValue = target.value
    if (rawValue === '') {
      value = null
    } else {
      value = props.valueType === 'number' ? Number(rawValue) : rawValue
    }
  }

  emit('update:modelValue', value)
  emit('change', event)
}
</script>

<style scoped>
.base-select {
  margin-bottom: 0.9rem;
}

.base-select__label {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.base-select__required {
  color: #b42318;
  margin-left: 0.2rem;
}

.base-select__input {
  width: 100%;
  min-height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  padding: 0 0.75rem;
  background: #fff;
  font: inherit;
}

.base-select__input:focus {
  outline: none;
  border-color: #1976d2;
}

.base-select__hint {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.base-select__error {
  font-size: 0.8rem;
  color: #b42318;
  margin-top: 0.25rem;
}
</style>
