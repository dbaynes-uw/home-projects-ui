<template>
  <span :class="['base-chip', `base-chip-${variant}`]">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'info', 'warning', 'danger', 'neutral'].includes(value)
  }
});
</script>

<style scoped>
.base-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  line-height: 1.2;
  border: 1px solid transparent;
}

.base-chip-primary {
  background: #e8f1ff;
  color: #0d6efd;
  border-color: #b7d1ff;
}

.base-chip-success {
  background: #e7f8ef;
  color: #198754;
  border-color: #b8e5cb;
}

.base-chip-info {
  background: #e7f5ff;
  color: #0a58ca;
  border-color: #b7e0ff;
}

.base-chip-warning {
  background: #fff7e6;
  color: #b56a00;
  border-color: #ffe3b5;
}

.base-chip-danger {
  background: #fdeaea;
  color: #b42318;
  border-color: #f7c2bd;
}

.base-chip-neutral {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}
</style>
