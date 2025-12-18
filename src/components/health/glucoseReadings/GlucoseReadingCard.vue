<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/health/glucoseReadings/GlucoseReadingCard.vue -->

<template>
  <div v-if="glucoseReading" class="glucose-reading-card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-left">
        <i class="fas fa-tint glucose-icon"></i>
        <div>
          <h3>{{ formatDate(glucoseReading.reading_date) }}</h3>
          <span class="time-badge">{{ formatTime(glucoseReading.reading_date) }}</span>
        </div>
      </div>
      <div class="glucose-value-large" :class="getGlucoseClass(glucoseReading.reading || glucoseReading.glucose_value)">
        {{ glucoseReading.reading || glucoseReading.glucose_value }}
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
            <span class="value">{{ glucoseReading.reading_type || 'Not specified' }}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-pills"></i>
          <div>
            <span class="label">Medication Taken</span>
            <span class="value">
              <span v-if="glucoseReading.medication_taken" class="badge badge-success">
                <i class="fas fa-check"></i> Yes
              </span>
              <span v-else class="badge badge-secondary">
                <i class="fas fa-times"></i> No
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Insulin Section -->
    <div class="card-section">
      <h4><i class="fas fa-syringe"></i> Insulin Information</h4>
      <div v-if="glucoseReading.insulin_units || glucoseReading.insulin_type" class="info-grid">
        <div class="info-item">
          <i class="fas fa-syringe"></i>
          <div>
            <span class="label">Units</span>
            <span class="value">{{ glucoseReading.insulin_units || '-' }}</span>
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
      <p v-else class="no-data">No insulin information recorded</p>
    </div>

    <!-- Nutrition Section -->
    <div class="card-section">
      <h4><i class="fas fa-bread-slice"></i> Nutrition</h4>
      <div v-if="glucoseReading.carbs_consumed" class="info-grid">
        <div class="info-item">
          <i class="fas fa-bread-slice"></i>
          <div>
            <span class="label">Carbs Consumed</span>
            <span class="value">{{ glucoseReading.carbs_consumed }}g</span>
          </div>
        </div>
      </div>
      <p v-else class="no-data">No nutrition information recorded</p>
    </div>

    <!-- Notes Section -->
    <div class="card-section">
      <h4><i class="fas fa-sticky-note"></i> Notes</h4>
      <p v-if="glucoseReading.notes" class="notes-text">{{ glucoseReading.notes }}</p>
      <p v-else class="no-data">No notes added</p>
    </div>

    <!-- Metadata Section -->
    <div class="card-section metadata">
      <div class="metadata-grid">
        <div class="metadata-item">
          <i class="fas fa-calendar-plus"></i>
          <div>
            <span class="label">Created</span>
            <span class="value">{{ formatDateTime(glucoseReading.created_at) }}</span>
          </div>
        </div>
        <div class="metadata-item" v-if="glucoseReading.updated_at !== glucoseReading.created_at">
          <i class="fas fa-calendar-check"></i>
          <div>
            <span class="label">Last Updated</span>
            <span class="value">{{ formatDateTime(glucoseReading.updated_at) }}</span>
          </div>
        </div>
        <div class="metadata-item" v-if="glucoseReading.status">
          <i class="fas fa-flag"></i>
          <div>
            <span class="label">Status</span>
            <span class="value status-badge" :class="getStatusClass(glucoseReading.status)">
              {{ glucoseReading.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading/Empty state -->
  <div v-else class="glucose-reading-card loading">
    <p>Loading reading details...</p>
  </div>
</template>

<script setup>
defineProps({
  glucoseReading: {
    type: Object,
    required: true,
    default: () => null
  }
});

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

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getGlucoseClass(value) {
  const v = parseFloat(value);
  if (v < 70) return 'glucose-low';
  if (v < 100) return 'glucose-good';
  if (v <= 140) return 'glucose-elevated';
  return 'glucose-high';
}

function getStatusClass(status) {
  if (!status) return '';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('normal')) return 'status-normal';
  if (statusLower.includes('prediabetes')) return 'status-warning';
  if (statusLower.includes('diabetes')) return 'status-danger';
  return '';
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

.glucose-reading-card.loading {
  padding: 40px;
  text-align: center;
  color: #718096;
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

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-secondary {
  background: #e2e8f0;
  color: #718096;
}

.notes-text {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
  white-space: pre-wrap;
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.no-data {
  margin: 0;
  color: #a0aec0;
  font-style: italic;
  font-size: 14px;
}

/* Metadata Section */
.card-section.metadata {
  background: #f7fafc;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metadata-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.metadata-item i {
  color: #a0aec0;
  font-size: 14px;
  margin-top: 2px;
}

.metadata-item .label {
  display: block;
  font-size: 11px;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.metadata-item .value {
  display: block;
  font-size: 13px;
  color: #718096;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-normal {
  background: #d4edda;
  color: #155724;
}

.status-warning {
  background: #fff3cd;
  color: #856404;
}

.status-danger {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .info-grid,
  .metadata-grid {
    grid-template-columns: 1fr;
  }
}
</style>