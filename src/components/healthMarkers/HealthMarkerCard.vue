<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/healthMarkers/HealthMarkerCard.vue -->
<template>
  <v-card 
    class="health-marker-card" 
    :class="statusClass"
    elevation="3"
    @dblclick="$emit('dblclick', healthMarker)"
  >
    <!-- ✅ CARD HEADER -->
    <v-card-title class="card-header">
      <div class="marker-title">
        <v-icon 
          :icon="markerInfo?.icon || 'mdi-heart-pulse'" 
          size="large" 
          :color="statusColor"
          class="marker-icon"
        />
        <div class="title-text">
          <h3>{{ markerInfo?.label || healthMarker.marker_name }}</h3>
          <v-chip 
            size="small" 
            :color="categoryColor" 
            class="category-chip"
          >
            {{ markerInfo?.category || 'Other' }}
          </v-chip>
        </div>
      </div>
      
      <div class="actions">
        <v-btn
          icon
          size="small"
          variant="text"
          @click="editHealthMarker"
          title="Edit Health Marker"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <!-- ✅ RESULT SECTION -->
    <v-card-text class="result-section">
      <div class="result-display">
        <div class="result-value">
          <span class="value">{{ healthMarker.marker_result }}</span>
          <span class="unit">{{ markerInfo?.unit || '' }}</span>
        </div>
        
        <div class="result-status">
          <v-alert
            :type="resultStatus?.type || 'info'"
            density="compact"
            variant="tonal"
            class="status-alert"
          >
            <template v-slot:prepend>
              <v-icon :icon="statusIcon" />
            </template>
            <strong>{{ resultStatus?.title || 'Result' }}</strong>
          </v-alert>
        </div>
      </div>

      <!-- ✅ DATE SECTION -->
      <div class="date-section">
        <div class="result-date">
          <v-icon icon="mdi-calendar" size="small" class="mr-1" />
          <span class="date-label">Test Date:</span>
          <span class="date-value">{{ formatDate(healthMarker.marker_date) }}</span>
        </div>
        
        <div v-if="daysAgo" class="days-ago">
          <v-icon icon="mdi-clock-outline" size="small" class="mr-1" />
          <span class="days-text">{{ daysAgo }}</span>
        </div>
      </div>

      <!-- ✅ REFERENCE RANGES -->
      <div v-if="markerInfo" class="reference-section">
        <h4 class="reference-title">
          <v-icon icon="mdi-chart-box-outline" size="small" class="mr-1" />
          Reference Ranges
        </h4>
        
        <div class="ranges">
          <div v-if="markerInfo.normalRange" class="range-item normal">
            <v-icon icon="mdi-check-circle" size="small" color="success" />
            <span><strong>Normal:</strong> {{ markerInfo.normalRange }}</span>
          </div>
          
          <div v-if="markerInfo.prediabetesRange" class="range-item warning">
            <v-icon icon="mdi-alert-circle" size="small" color="warning" />
            <span><strong>Prediabetes:</strong> {{ markerInfo.prediabetesRange }}</span>
          </div>
          
          <div v-if="markerInfo.diabetesRange" class="range-item danger">
            <v-icon icon="mdi-close-circle" size="small" color="error" />
            <span><strong>Diabetes:</strong> {{ markerInfo.diabetesRange }}</span>
          </div>
          
          <div v-if="markerInfo.borderlineRange" class="range-item warning">
            <v-icon icon="mdi-alert-circle" size="small" color="warning" />
            <span><strong>Borderline:</strong> {{ markerInfo.borderlineRange }}</span>
          </div>
          
          <div v-if="markerInfo.highRange" class="range-item danger">
            <v-icon icon="mdi-trending-up" size="small" color="error" />
            <span><strong>High:</strong> {{ markerInfo.highRange }}</span>
          </div>
          
          <div v-if="markerInfo.lowRange" class="range-item danger">
            <v-icon icon="mdi-trending-down" size="small" color="error" />
            <span><strong>Low:</strong> {{ markerInfo.lowRange }}</span>
          </div>
        </div>
      </div>
      <div class="lab-name">
        <v-icon icon="mdi-flask" size="small" class="mr-1" />
        <span class="item-label">Lab Name:</span>
        <span class="item-value">{{ healthMarker.lab_name }}</span>
      </div>
      <div class="doctor-name">
        <v-icon icon="mdi-doctor" size="small" class="mr-1" />
        <span class="item-label">Doctor Name:</span>
        <span class="item-value">{{ healthMarker.doctor_name }}</span>
      </div>
      <!-- ✅ NOTES SECTION -->
      <div v-if="healthMarker.notes" class="notes-section">
        <h4 class="notes-title">
          <v-icon icon="mdi-note-text" size="small" class="mr-1" />
          Notes
        </h4>
        <p class="notes-text">{{ healthMarker.notes }}</p>
      </div>

      <!-- ✅ ADDITIONAL INFO -->
      <div v-if="markerInfo" class="info-section">
        <div class="info-item">
          <v-icon icon="mdi-information" size="small" class="mr-1" />
          <span class="info-text">{{ markerInfo.description }}</span>
        </div>
        
        <div class="info-item">
          <v-icon icon="mdi-clock-check" size="small" class="mr-1" />
          <span class="info-text"><strong>Test Frequency:</strong> {{ markerInfo.testFrequency }}</span>
        </div>
      </div>
    </v-card-text>

    <!-- ✅ CARD FOOTER -->
    <v-card-actions class="card-footer">
      <v-chip size="small" variant="outlined" class="created-chip">
        <v-icon icon="mdi-account" size="small" class="mr-1" />
        {{ healthMarker.created_by || 'DLB' }}
      </v-chip>
      
      <v-spacer />
      
      <v-btn
        size="small"
        variant="outlined"
        @click="editHealthMarker"
        prepend-icon="mdi-pencil"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getHealthMarkerByName, getResultStatus } from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

// ✅ PROPS
const props = defineProps({
  healthMarker: {
    type: Object,
    required: true
  }
});

// ✅ EMITS
const emit = defineEmits(['dblclick']);

// ✅ ROUTER
const router = useRouter();

// ✅ COMPUTED PROPERTIES
const markerInfo = computed(() => {
  return getHealthMarkerByName(props.healthMarker.marker_name);
});

const resultStatus = computed(() => {
  if (!props.healthMarker.marker_name || !props.healthMarker.marker_result) return null;
  return getResultStatus(props.healthMarker.marker_name, props.healthMarker.marker_result);
});

const statusClass = computed(() => {
  if (!resultStatus.value) return '';
  
  return {
    'status-success': resultStatus.value.type === 'success',
    'status-warning': resultStatus.value.type === 'warning',
    'status-error': resultStatus.value.type === 'error',
    'status-info': resultStatus.value.type === 'info'
  };
});

const statusColor = computed(() => {
  if (!resultStatus.value) return 'primary';
  
  switch (resultStatus.value.type) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case 'info':
    default: return 'info';
  }
});

const statusIcon = computed(() => {
  if (!resultStatus.value) return 'mdi-information-circle';
  
  switch (resultStatus.value.type) {
    case 'success': return 'mdi-check-circle';
    case 'warning': return 'mdi-alert-circle';
    case 'error': return 'mdi-close-circle';
    case 'info':
    default: return 'mdi-information-circle';
  }
});

const categoryColor = computed(() => {
  if (!markerInfo.value) return 'default';
  
  switch (markerInfo.value.category) {
    case 'Diabetes': return 'error';
    case 'Thyroid': return 'warning';
    case 'Lipids': return 'info';
    case 'Vitamins': return 'success';
    case 'Heart': return 'deep-purple';
    case 'General': return 'blue-grey';
    default: return 'default';
  }
});

const daysAgo = computed(() => {
  if (!props.healthMarker.marker_date) return '';
  
  const resultDate = new Date(props.healthMarker.marker_date);
  const today = new Date();
  const diffTime = today - resultDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
});

// ✅ METHODS
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  return DateFormatService.formatDatejs(dateString);
};

const editHealthMarker = () => {
  router.push({ name: 'HealthMarkerEdit', params: { id: props.healthMarker.id } });
};
</script>

<style scoped>
/* ✅ CARD BASE STYLES */
.health-marker-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  border-left: 4px solid #e0e0e0;
  cursor: pointer;
}

.health-marker-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

/* ✅ STATUS BORDER COLORS */
.status-success {
  border-left-color: #4caf50 !important;
}

.status-warning {
  border-left-color: #ff9800 !important;
}

.status-error {
  border-left-color: #f44336 !important;
}

.status-info {
  border-left-color: #2196f3 !important;
}

/* ✅ HEADER STYLES */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1rem 0.5rem 1rem !important;
}

.marker-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.marker-icon {
  margin-top: 0.25rem;
}

.title-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.category-chip {
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

/* ✅ RESULT SECTION */
.result-section {
  padding: 0.5rem 1rem 1rem 1rem !important;
}

.result-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.unit {
  font-size: 1rem;
  font-weight: 500;
  color: #666;
}

.result-status {
  flex: 1;
  max-width: 200px;
}

.status-alert {
  margin: 0 !important;
}

/* ✅ DATE SECTION */
.date-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.result-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.item-label {
  font-weight: 500;
  color: #666;
}
.item-value {
  position: relative;
  left: .5rem;
  font-weight: 600;
  font-size: 1rem;
  color: #666;
}
.date-label {
  font-weight: 500;
  color: #666;
}

.date-value {
  font-weight: 600;
  color: #2c3e50;
}

.days-ago {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-style: italic;
}

/* ✅ REFERENCE RANGES */
.reference-section {
  margin-bottom: 1rem;
}

.reference-title {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.ranges {
  display: grid;
  gap: 0.5rem;
}

.range-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.range-item.normal {
  background: rgba(76, 175, 80, 0.1);
}

.range-item.warning {
  background: rgba(255, 152, 0, 0.1);
}

.range-item.danger {
  background: rgba(244, 67, 54, 0.1);
}

/* ✅ NOTES SECTION */
.notes-section {
  margin-bottom: 1rem;
}

.notes-title {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.notes-text {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-style: italic;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

/* ✅ INFO SECTION */
.info-section {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.info-text {
  line-height: 1.4;
}

/* ✅ FOOTER STYLES */
.card-footer {
  padding: 0.5rem 1rem 1rem 1rem !important;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid #e0e0e0;
}

.created-chip {
  color: #666 !important;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .marker-title {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .result-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .result-status {
    max-width: 100%;
    width: 100%;
  }
  
  .date-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions {
    align-self: flex-end;
  }
  
  .ranges {
    grid-template-columns: 1fr;
  }
}
</style>