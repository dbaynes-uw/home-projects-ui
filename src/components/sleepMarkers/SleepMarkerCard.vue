<template>
  <BaseCard class="sleep-marker-card" hover clickable @click="$emit('edit', marker)">
    <div class="card-header">
      <div class="date-badge">
        <i class="fas fa-calendar-day"></i>
        {{ formattedDate }}
      </div>
      <div class="actions">
        <button class="action-btn edit-btn" @click.stop="$emit('edit', marker)" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" @click.stop="$emit('delete', marker)" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Sleep Times -->
      <div class="time-row">
        <div class="time-item">
          <i class="fas fa-bed"></i>
          <span class="time-label">Bed Time</span>
          <span class="time-value">{{ marker.bed_time }}</span>
        </div>
        <div class="time-item">
          <i class="fas fa-sun"></i>
          <span class="time-label">Wake Time</span>
          <span class="time-value">{{ marker.wake_time }}</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-item">
          <i class="fas fa-moon stat-icon"></i>
          <span class="stat-value">{{ marker.total_sleep_hours }}h</span>
          <span class="stat-label">Total Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-star stat-icon"></i>
          <span class="stat-value">{{ marker.sleep_quality }}/10</span>
          <span class="stat-label">Quality</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ marker.awake_sleep }}</span>
          <span class="stat-label">Awake Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ marker.rem_sleep }}</span>
          <span class="stat-label">REM Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ marker.core_sleep }}</span>
          <span class="stat-label">Core Sleep</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain stat-icon"></i>
          <span class="stat-value">{{ marker.deep_sleep }}</span>
          <span class="stat-label">Deep Sleep</span>
        </div>        
        <div class="stat-item">
          <i class="fas fa-eye stat-icon"></i>
          <span class="stat-value">{{ marker.awakenings }}</span>
          <span class="stat-label">Awakenings</span>
        </div>
      </div>
      <div v-if="marker.had_oob" class="oob-details">
        <div class="oob-header">
          <i class="fas fa-ghost"></i>
          <span>OOB Experience</span>
        </div>
        <div class="oob-info">
          <div class="oob-duration">
            <strong>Duration:</strong> {{ oobDurationLabel }}
          </div>
          <div v-if="marker.oob_circumstances" class="oob-circumstances">
            <strong>Details:</strong>
            <p>{{ marker.oob_circumstances }}</p>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/ui/BaseCard.vue';

const props = defineProps({
  marker: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const formattedDate = computed(() => {
  const date = new Date(props.marker.sleep_date);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
});

// ✅ Format OOB duration for display
const oobDurationLabel = computed(() => {
  const durations = {
    'short': 'Short (< 1 min)',
    'medium': 'Medium (1-2 mins)',
    'long': 'Long (> 2 mins)'
  };
  return durations[props.marker.oob_duration] || props.marker.oob_duration;
});
</script>
<style scoped>
.sleep-marker-card {
  background: white;
  transition: all 0.3s ease;
}

.sleep-marker-card:hover {
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: #667eea;
}

.date-badge i {
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 14px;
}

.edit-btn {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.edit-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.delete-btn:hover {
  background: #f44336;
  color: white;
  transform: scale(1.1);
}

.card-body {
  padding: 20px;
}

.time-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.time-item i {
  font-size: 24px;
  color: #667eea;
  margin-bottom: 4px;
}

.time-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.time-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.2s;
}

.stat-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 24px;
  color: #667eea;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.oob-details {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.oob-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
  font-size: 14px;
}

.oob-header i {
  font-size: 16px;
}

.oob-info {
  font-size: 13px;
  color: #666;
}

.oob-duration {
  margin-bottom: 8px;
}

.oob-circumstances p {
  margin: 4px 0 0 0;
  line-height: 1.5;
  font-style: italic;
}
</style>