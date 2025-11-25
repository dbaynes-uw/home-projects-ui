<template>
  <div 
    :class="['base-card', { 'base-card-hover': hover, 'base-card-clickable': clickable }]"
    @click="handleClick"
  >
    <div v-if="$slots.header" class="base-card-header">
      <slot name="header"></slot>
    </div>
    
    <div class="base-card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hover: {
    type: Boolean,
    default: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

function handleClick(event) {
  if (props.clickable) {
    emit('click', event);
  }
}
</script>

<style scoped>
.base-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.base-card-hover:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.base-card-clickable {
  cursor: pointer;
}

.base-card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.base-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.base-card-body {
  padding: 24px;
}

.base-card-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}
</style>