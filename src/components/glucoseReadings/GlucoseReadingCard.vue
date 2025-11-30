<template>
  <BaseCard class="glucose-reading-card" hover clickable @click="goToEdit">
    <div class="card-header">
      <div class="date-badge">
        <i class="fas fa-calendar-day"></i>
        {{ formattedDate }}
      </div>
      <div class="actions">
        <button class="action-btn edit-btn" @click.stop="goToEdit" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" @click.stop="deleteGlucoseReading" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- Glucose Reading Banner -->
      <div class="glucose-banner" :class="glucoseColorClass">
        <div class="glucose-content">
          <i class="fas fa-tint"></i>
          <div class="glucose-info">
            <span class="glucose-label">Glucose Reading</span>
            <span class="glucose-value">{{ glucose_reading.reading }} {{ glucose_reading.reading_unit }}</span>
          </div>
        </div>
      </div>

      <!-- Status Section -->
      <div class="status-section" :class="glucoseColorClass">
        <div class="status-content">
          <i class="fas fa-info-circle"></i>
          <div class="status-info">
            <strong>Status:</strong>
            <span v-if="glucose_reading.reading < 100">Normal - Optimal glucose level</span>
            <span v-else-if="glucose_reading.reading >= 100 && glucose_reading.reading <= 125">Prediabetes - Elevated glucose</span>
            <span v-else>Diabetes - High glucose level</span>
          </div>
        </div>
      </div>

      <!-- Info Row -->
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">Type</span>
          <span class="info-value">{{ glucose_reading.reading_type }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Time</span>
          <span class="info-value">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- Notes Section -->
      <div v-if="glucose_reading.notes" class="notes-section">
        <div class="notes-header">
          <i class="fas fa-sticky-note"></i>
          <span>Notes</span>
        </div>
        <div class="notes-content">
          <p>{{ glucose_reading.notes }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/ui/BaseCard.vue';

const props = defineProps({
  glucose_reading: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete']);
const router = useRouter();

const formattedDate = computed(() => {
  if (!props.glucose_reading.reading_date) return '';
  const date = new Date(props.glucose_reading.reading_date);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
});

const formattedTime = computed(() => {
  if (!props.glucose_reading.reading_date) return '';
  const date = new Date(props.glucose_reading.reading_date);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
});

const glucoseColorClass = computed(() => {
  const value = parseFloat(props.glucose_reading.reading);
  if (value < 100) return 'glucose-good';
  if (value >= 100 && value <= 125) return 'glucose-warning';
  return 'glucose-high';
});

const goToEdit = () => {
  router.push({
    name: 'GlucoseReadingEdit',
    params: { id: props.glucose_reading.id }
  });
};

const deleteGlucoseReading = () => {
  if (confirm('Are you sure you want to delete this glucose reading?')) {
    emit('delete', props.glucose_reading.id);
  }
};
</script>

<style scoped>
/* ✅ All shared styles now come from card-components.css */
/* Only component-specific overrides remain here */

.glucose-reading-card {
  /* Inherits from BaseCard + card-components.css */
}

/* ✅ No other styles needed - everything is centralized! */
</style>