<template>
  <form :id="id" :class="['base-form', $attrs.class]" @submit.prevent="handleSubmit" v-bind="formAttrs">
    <slot />
  </form>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()
defineProps({
  id: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['submit'])

const formAttrs = computed(() => {
  const { class: _class, id: _id, ...rest } = attrs
  return rest
})

function handleSubmit(event) {
  emit('submit', event)
}
</script>

<style scoped>
.base-form {
  width: 100%;
}
</style>
