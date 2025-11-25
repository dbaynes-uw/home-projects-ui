<template>
  <v-card class="sleep-card" elevation="3">
    <v-card-title class="card-header">
      <div class="date-section">
        <i class="fas fa-calendar-day"></i>
        <span class="date-text">{{ formattedDate }}</span>
      </div>
      <v-chip
        :color="qualityColor"
        size="small"
        class="quality-chip"
      >
        <i class="fas fa-star"></i>
        {{ marker.sleep_quality }}/10
      </v-chip>
    </v-card-title>

    <v-card-text class="card-content">
      <!-- Sleep Duration -->
      <div class="info-row">
        <i class="fas fa-moon info-icon"></i>
        <span class="info-label">Total Sleep:</span>
        <span class="info-value">{{ marker.total_sleep_hours }}h</span>
      </div>

      <!-- Sleep Times -->
      <div class="info-row">
        <i class="fas fa-clock info-icon"></i>
        <span class="info-label">Sleep Time:</span>
        <span class="info-value">{{ marker.bed_time }} - {{ marker.wake_time }}</span>
      </div>

      <!-- Sleep Stages -->
      <div class="sleep-stages">
        <div class="stage-item" v-if="marker.deep_sleep">
          <span class="stage-label">Deep:</span>
          <span class="stage-value">{{ marker.deep_sleep }}h</span>
        </div>
        <div class="stage-item" v-if="marker.rem_sleep">
          <span class="stage-label">REM:</span>
          <span class="stage-value">{{ marker.rem_sleep }}h</span>
        </div>
        <div class="stage-item" v-if="marker.core_sleep">
          <span class="stage-label">Core:</span>
          <span class="stage-value">{{ marker.core_sleep }}h</span>
        </div>
      </div>

      <!-- Awakenings -->
      <div class="info-row" v-if="marker.awakenings">
        <i class="fas fa-eye info-icon"></i>
        <span class="info-label">Awakenings:</span>
        <span class="info-value">{{ marker.awakenings }}</span>
      </div>
    </v-card-text>

    <v-card-actions class="card-actions">
      <v-btn
        size="small"
        color="info"
        variant="text"
        @click="$emit('edit', marker)"
      >
        <i class="fas fa-edit"></i>
        Edit
      </v-btn>
      <v-btn
        size="small"
        color="error"
        variant="text"
        @click="$emit('delete', marker)"
      >
        <i class="fas fa-trash"></i>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  marker: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const formattedDate = computed(() => {
  return dayjs(props.marker.sleep_date).format('MMM DD, YYYY');
});

const qualityColor = computed(() => {
  const quality = parseFloat(props.marker.sleep_quality);
  if (quality >= 8) return 'success';
  if (quality >= 6) return 'warning';
  return 'error';
});
</script>

<style scoped>
.sleep-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sleep-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.date-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-text {
  font-weight: 600;
  font-size: 1rem;
}

.quality-chip {
  font-weight: 700;
}

.card-content {
  flex: 1;
  padding: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.info-icon {
  color: #667eea;
  width: 20px;
}

.info-label {
  font-weight: 600;
  color: #666;
  flex: 1;
}

.info-value {
  font-weight: 700;
  color: #333;
}

.sleep-stages {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.stage-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stage-label {
  opacity: 0.9;
  margin-right: 0.25rem;
}

.stage-value {
  font-weight: 700;
}

.card-actions {
  border-top: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>