<template>
  <i :class="iconClasses" v-bind="iconAttrs"></i>
</template>

<script setup>
import { computed, useAttrs, useSlots } from 'vue'

const attrs = useAttrs()
const slots = useSlots()

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
})

const iconText = computed(() => {
  if (props.icon) return props.icon
  const slotContent = slots.default?.()[0]?.children
  return typeof slotContent === 'string' ? slotContent.trim() : ''
})

const iconClasses = computed(() => {
  const value = iconText.value || ''
  const normalized = value.startsWith('mdi-') ? value : `mdi-${value}`
  return ['mdi', normalized, attrs.class].filter(Boolean)
})

const iconAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>
