<template>
  <button 
    :class="['base-btn', `base-btn-${variant}`, `base-btn-${size}`, { 'base-btn-block': block }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <i v-if="icon && !loading" :class="`mdi mdi-${icon}`"></i>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: inherit;
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.base-btn-small {
  padding: 6px 12px;
  font-size: 14px;
}

.base-btn-medium {
  padding: 10px 20px;
  font-size: 16px;
}

.base-btn-large {
  padding: 14px 28px;
  font-size: 18px;
}

/* Block */
.base-btn-block {
  width: 100%;
}

/* Primary */
.base-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.base-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.base-btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Secondary */
.base-btn-secondary {
  background: #6c757d;
  color: white;
}

.base-btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Success */
.base-btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.base-btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
}

/* Danger */
.base-btn-danger {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.base-btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(235, 51, 73, 0.4);
}

/* Warning */
.base-btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.base-btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

/* Ghost */
.base-btn-ghost {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.base-btn-ghost:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

/* Loading Spinner */
.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.base-btn i {
  font-size: 1.2em;
}
</style>