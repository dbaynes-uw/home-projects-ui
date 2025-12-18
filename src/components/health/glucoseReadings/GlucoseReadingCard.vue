<template>
  <div class="glucose-reading-card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-left">
        <i class="fas fa-tint glucose-icon"></i>
        <div>
          <h3>{{ formatDate(glucoseReading.reading_date) }}</h3>
          <span class="time-badge">{{ glucoseReading.reading_time }}</span>
        </div>
      </div>
      <div class="glucose-value-large" :class="getGlucoseClass(glucoseReading.glucose_value)">
        {{ glucoseReading.glucose_value }}
        <span class="unit">mg/dL</span>
      </div>
    </div>

    <!-- Reading Info -->
    <div class="card-section">
      <h4><i class="fas fa-info-circle"></i> Reading Details</h4>
      <div class="info-grid">
        <div class="info-item">
          <i class="fas fa-utensils"></i>
          <div>
            <span class="label">Reading Type</span>
            <span class="value">{{ glucoseReading.reading_type || '-' }}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-pills"></i>
          <div>
            <span class="label">Medication Taken</span>
            <span class="value">{{ glucoseReading.medication_taken ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Insulin Section -->
    <div v-if="glucoseReading.insulin_units" class="card-section">
      <h4><i class="fas fa-syringe"></i> Insulin</h4>
      <div class="info-grid">
        <div class="info-item">
          <i class="fas fa-syringe"></i>
          <div>
            <span class="label">Units</span>
            <span class="value">{{ glucoseReading.insulin_units }}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-tag"></i>
          <div>
            <span class="label">Type</span>
            <span class="value">{{ glucoseReading.insulin_type || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Carbs Section -->
    <div v-if="glucoseReading.carbs_consumed" class="card-section">
      <h4><i class="fas fa-bread-slice"></i> Nutrition</h4>
      <div class="info-grid">
        <div class="info-item">
          <i class="fas fa-bread-slice"></i>
          <div>
            <span class="label">Carbs</span>
            <span class="value">{{ glucoseReading.carbs_consumed }}g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Section -->
    <div v-if="glucoseReading.notes" class="card-section">
      <h4><i class="fas fa-sticky-note"></i> Notes</h4>
      <p class="notes-text">{{ glucoseReading.notes }}</p>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <button class="btn btn-secondary" @click="$emit('edit', glucoseReading)">
        <i class="fas fa-edit"></i>
        Edit
      </button>
      <button class="btn btn-danger" @click="$emit('delete', glucoseReading)">
        <i class="fas fa-trash"></i>
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  glucoseReading: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getGlucoseClass(value) {
  const v = parseFloat(value);
  if (v < 70) return 'glucose-low';
  if (v < 100) return 'glucose-good';
  if (v <= 140) return 'glucose-elevated';
  return 'glucose-high';
}
</script>

<style scoped>
@import '@/assets/styles/ui-components.css';

.glucose-reading-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.glucose-icon {
  font-size: 32px;
  opacity: 0.9;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.time-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 4px;
}

.glucose-value-large {
  font-size: 48px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.unit {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
}

.glucose-low {
  color: #ff6b6b;
}

.glucose-good {
  color: #51cf66;
}

.glucose-elevated {
  color: #ffd43b;
}

.glucose-high {
  color: #ff6b6b;
}

.card-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.card-section:last-of-type {
  border-bottom: none;
}

.card-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-item i {
  color: #667eea;
  font-size: 18px;
  margin-top: 4px;
}

.info-item .label {
  display: block;
  font-size: 12px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-item .value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.notes-text {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
  white-space: pre-wrap;
}

.card-actions {
  padding: 20px 24px;
  background: #f7fafc;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>