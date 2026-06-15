<template>
  <span :class="['garden-status-badge', badgeClass]">
    {{ normalizedStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
})

const normalizedStatus = computed(() => {
  const value = String(props.status || '').trim().toLowerCase()
  if (value === 'inactive') return 'Inactive'
  return 'Active'
})

const badgeClass = computed(() => {
  return normalizedStatus.value === 'Inactive' ? 'is-inactive' : 'is-active'
})
</script>

<style scoped>
.garden-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
}

.garden-status-badge.is-active {
  color: #166534;
  background: #dcfce7;
  border-color: #86efac;
}

.garden-status-badge.is-inactive {
  color: #7f1d1d;
  background: #fee2e2;
  border-color: #fca5a5;
}
</style>