<template>
  <div :class="['base-spinner', `base-spinner-${size}`]" :aria-label="label" role="status"></div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  label: {
    type: String,
    default: 'Loading'
  }
});
</script>

<style scoped>
.base-spinner {
  border-radius: 50%;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  animation: base-spinner-spin 0.8s linear infinite;
}

.base-spinner-small {
  width: 1rem;
  height: 1rem;
}

.base-spinner-medium {
  width: 1.8rem;
  height: 1.8rem;
}

.base-spinner-large {
  width: 2.5rem;
  height: 2.5rem;
}

@keyframes base-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
