<!-- filepath: src/components/sleepMarkers/SleepMarkerCard.vue -->
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
        <div class="time-item">
          <i class="fas fa-clock"></i>
          <span class="time-label">Time in Bed</span>
          <span class="time-value">{{ marker.time_in_bed }}</span>
        </div>    
        <div class="time-item">
          <i class="fas fa-moon"></i>
          <span class="time-label">Time Asleep</span>
          <span class="time-value">{{ marker.time_asleep }}</span>
        </div>        
      </div>

      <!-- ✅ FASTING GLUCOSE BANNER with dynamic color -->
      <div v-if="marker.am_fasting_glucose_value" class="glucose-banner" :class="glucoseColorClass">
        <div class="glucose-content">
          <i class="fas fa-tint"></i>
          <div class="glucose-info">
            <span class="glucose-label">Morning Fasting Glucose</span>
            <span class="glucose-value">{{ marker.am_fasting_glucose_value }} mg/dL</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
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

      <!-- ✅ DREAMS SECTION -->
      <div v-if="marker.had_dreams" class="dreams-section">
        <div class="dreams-header">
          <i class="fas fa-cloud"></i>
          <span>Dreams Recorded</span>
        </div>
        <div v-if="marker.dream_notes" class="dreams-notes">
          <p>{{ marker.dream_notes }}</p>
        </div>
        <div v-else class="dreams-indicator">
          <span>Dreams occurred (no notes)</span>
        </div>
      </div>

      <!-- ✅ SLEEP NOTES SECTION -->
      <div v-if="marker.sleep_notes" class="sleep-notes-section">
        <div class="notes-header">
          <i class="fas fa-sticky-note"></i>
          <span>Noted</span>
        </div>
        <div class="notes-content">
          <p>{{ marker.sleep_notes }}</p>
        </div>
      </div>

      <!-- ✅ OOB SECTION -->
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

// ✅ FIXED: Parse date as local, not UTC
const formattedDate = computed(() => {
  if (!props.marker.sleep_date) return '';
  
  // Parse YYYY-MM-DD as local date (not UTC)
  const [year, month, day] = props.marker.sleep_date.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
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

// ✅ Dynamic glucose color based on value
const glucoseColorClass = computed(() => {
  const value = parseFloat(props.marker.am_fasting_glucose_value);
  
  if (value < 100) {
    return 'glucose-good'; // Green
  } else if (value >= 100 && value <= 125) {
    return 'glucose-warning'; // Yellow
  } else {
    return 'glucose-high'; // Red
  }
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

/* ✅ GLUCOSE BANNER BASE STYLING */
.glucose-banner {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.glucose-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.glucose-content i {
  font-size: 28px;
}

.glucose-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.glucose-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.glucose-value {
  font-size: 24px;
  font-weight: 700;
}

/* ✅ GLUCOSE COLOR VARIANTS */
/* Good: < 100 mg/dL (Green) */
.glucose-good {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
  border-color: rgba(34, 197, 94, 0.3);
}

.glucose-good .glucose-content i {
  color: #16a34a;
}

.glucose-good .glucose-label {
  color: #166534;
}

.glucose-good .glucose-value {
  color: #16a34a;
}

/* Warning: 100-125 mg/dL (Yellow) */
.glucose-warning {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.1) 100%);
  border-color: rgba(234, 179, 8, 0.3);
}

.glucose-warning .glucose-content i {
  color: #ca8a04;
}

.glucose-warning .glucose-label {
  color: #854d0e;
}

.glucose-warning .glucose-value {
  color: #ca8a04;
}

/* High: > 125 mg/dL (Red) */
.glucose-high {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-color: rgba(239, 68, 68, 0.3);
}

.glucose-high .glucose-content i {
  color: #dc2626;
}

.glucose-high .glucose-label {
  color: #991b1b;
}

.glucose-high .glucose-value {
  color: #dc2626;
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

/* ✅ DREAMS SECTION STYLING */
.dreams-section {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(147, 197, 253, 0.15) 0%, rgba(196, 181, 253, 0.15) 100%);
  border-radius: 8px;
  border: 1px solid rgba(147, 197, 253, 0.3);
}

.dreams-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 8px;
  font-size: 14px;
}

.dreams-header i {
  font-size: 16px;
}

.dreams-notes p {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

.dreams-indicator {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

/* ✅ SLEEP NOTES SECTION STYLING */
.sleep-notes-section {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
  border-radius: 8px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 8px;
  font-size: 14px;
}

.notes-header i {
  font-size: 16px;
}

.notes-content p {
  margin: 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* ✅ OOB SECTION STYLING */
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