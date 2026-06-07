<template>
  <div :class="['base-alert', `base-alert-${variant}`]" role="alert">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'danger'].includes(value)
  }
});
</script>

<style scoped>
.base-alert {
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.base-alert-success {
  background: #e8f8ef;
  color: #0f5132;
  border-color: #b8e5cb;
}

.base-alert-info {
  background: #e7f5ff;
  color: #055160;
  border-color: #b7e0ff;
}

.base-alert-warning {
  background: #fff7e6;
  color: #664d03;
  border-color: #ffe3b5;
}

.base-alert-danger {
  background: #fdeaea;
  color: #842029;
  border-color: #f7c2bd;
}
</style>
