<template>
  <hr :class="['base-divider', $attrs.class]" v-bind="dividerAttrs" />
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()

const dividerAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<style scoped>
.base-divider {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 1rem 0;
}
</style>
