<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/ui/StatCard.vue -->

<template>
  <div class="stat-card" :class="`stat-card-${color}`">
    <div class="stat-icon">
      <i :class="`fas fa-${icon}`"></i>
    </div>
    <div class="stat-content">
      <div class="stat-value">
        {{ value }}
        <span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
      </div>
      <div class="stat-label">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple', 'blue', 'green', 'orange', 'red', 'teal'].includes(value)
  },
  suffix: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-card-purple .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-blue .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card-green .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card-orange .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card-red .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card-teal .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-suffix {
  font-size: 14px;
  font-weight: 400;
  color: #718096;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.stat-unit {
  font-size: 11px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }
}
</style>