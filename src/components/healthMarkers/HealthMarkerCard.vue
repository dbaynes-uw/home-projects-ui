<template>
  <BaseCard class="health-marker-card" :class="statusBorderClass" hover clickable @click="editHealthMarker">
    <div class="card-header">
      <div class="marker-title">
        <i :class="`fas ${markerIcon}`" class="marker-icon"></i>
        <div class="title-text">
          <h3>{{ markerInfo?.label || healthMarker.marker_name }}</h3>
          <span class="category-badge" :class="categoryBadgeClass">
            {{ markerInfo?.category || 'Other' }}
          </span>
        </div>
      </div>
      <div class="actions">
        <button class="action-btn edit-btn" @click.stop="editHealthMarker" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <!-- ✅ RESULT BANNER -->
      <div class="result-banner" :class="statusColorClass">
        <div class="result-content">
          <i class="fas fa-chart-line"></i>
          <div class="result-info">
            <span class="result-label">Test Result</span>
            <span class="result-value">{{ healthMarker.marker_result }} {{ markerInfo?.unit || '' }}</span>
          </div>
        </div>
      </div>

      <!-- ✅ STATUS SECTION -->
      <div class="status-section" :class="statusColorClass">
        <div class="status-content">
          <i :class="`fas ${statusIconClass}`"></i>
          <div class="status-info">
            <span class="status-label">{{ resultStatus?.title || 'Result' }}</span>
            <span class="status-message">{{ resultStatus?.message || 'No status available' }}</span>
          </div>
        </div>
      </div>

      <!-- ✅ INFO ROW -->
      <div class="info-row">
        <div class="info-item">
          <i class="fas fa-calendar-day"></i>
          <span class="info-label">Test Date</span>
          <span class="info-value">{{ formattedDate }}</span>
        </div>
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <span class="info-label">Recorded</span>
          <span class="info-value">{{ daysAgo }}</span>
        </div>
      </div>

      <!-- ✅ RANGES SECTION -->
      <div v-if="markerInfo" class="ranges-section">
        <div class="ranges-header">
          <i class="fas fa-ruler-horizontal"></i>
          <span>Reference Ranges</span>
        </div>
        <div class="ranges-content">
          <div class="range-item normal">
            <i class="fas fa-check-circle"></i>
            <span><strong>Normal:</strong> {{ markerInfo.normalRange }}</span>
          </div>
          <div v-if="markerInfo.highRange" class="range-item high">
            <i class="fas fa-arrow-up"></i>
            <span><strong>High:</strong> {{ markerInfo.highRange }}</span>
          </div>
          <div v-if="markerInfo.lowRange" class="range-item low">
            <i class="fas fa-arrow-down"></i>
            <span><strong>Low:</strong> {{ markerInfo.lowRange }}</span>
          </div>
        </div>
      </div>

      <!-- ✅ LAB & DOCTOR INFO -->
      <div class="metadata-row">
        <div v-if="healthMarker.lab_name" class="metadata-item">
          <i class="fas fa-flask"></i>
          <span class="metadata-label">Lab:</span>
          <span class="metadata-value">{{ healthMarker.lab_name }}</span>
        </div>
        <div v-if="healthMarker.doctor_name" class="metadata-item">
          <i class="fas fa-user-md"></i>
          <span class="metadata-label">Doctor:</span>
          <span class="metadata-value">{{ healthMarker.doctor_name }}</span>
        </div>
      </div>

      <!-- ✅ NOTES SECTION -->
      <div v-if="healthMarker.notes" class="notes-section">
        <div class="notes-header">
          <i class="fas fa-sticky-note"></i>
          <span>Notes</span>
        </div>
        <div class="notes-content">
          <p>{{ healthMarker.notes }}</p>
        </div>
      </div>

      <!-- ✅ ADDITIONAL INFO -->
      <div v-if="markerInfo" class="info-section">
        <div class="info-text">
          <i class="fas fa-info-circle"></i>
          <span>{{ markerInfo.description }}</span>
        </div>
        <div class="info-text">
          <i class="fas fa-calendar-check"></i>
          <span><strong>Test Frequency:</strong> {{ markerInfo.testFrequency }}</span>
        </div>
      </div>

      <!-- ✅ FOOTER -->
      <div class="card-footer">
        <span class="created-by">
          <i class="fas fa-user"></i>
          {{ healthMarker.created_by || 'DLB' }}
        </span>
        <button class="footer-btn" @click.stop="editHealthMarker">
          <i class="fas fa-pencil-alt"></i>
          Edit
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseCard from '@/components/ui/BaseCard.vue';
import { getHealthMarkerByName, getResultStatus } from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

const props = defineProps({
  healthMarker: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['dblclick']);
const router = useRouter();

// ✅ COMPUTED PROPERTIES
const markerInfo = computed(() => {
  return getHealthMarkerByName(props.healthMarker.marker_name);
});

const resultStatus = computed(() => {
  if (!props.healthMarker.marker_name || !props.healthMarker.marker_result) return null;
  return getResultStatus(props.healthMarker.marker_name, props.healthMarker.marker_result);
});

const statusColorClass = computed(() => {
  if (!resultStatus.value) return 'status-info';
  
  switch (resultStatus.value.type) {
    case 'success': return 'status-success';
    case 'warning': return 'status-warning';
    case 'error': return 'status-error';
    default: return 'status-info';
  }
});

const statusBorderClass = computed(() => {
  if (!resultStatus.value) return 'border-info';
  
  switch (resultStatus.value.type) {
    case 'success': return 'border-success';
    case 'warning': return 'border-warning';
    case 'error': return 'border-error';
    default: return 'border-info';
  }
});

const statusIconClass = computed(() => {
  if (!resultStatus.value) return 'fa-info-circle';
  
  switch (resultStatus.value.type) {
    case 'success': return 'fa-check-circle';
    case 'warning': return 'fa-exclamation-triangle';
    case 'error': return 'fa-times-circle';
    default: return 'fa-info-circle';
  }
});

const categoryBadgeClass = computed(() => {
  if (!markerInfo.value) return 'badge-default';
  
  switch (markerInfo.value.category) {
    case 'Diabetes': return 'badge-error';
    case 'Thyroid': return 'badge-warning';
    case 'Lipids': return 'badge-info';
    case 'Vitamins': return 'badge-success';
    case 'Heart': return 'badge-purple';
    case 'General': return 'badge-blue-grey';
    default: return 'badge-default';
  }
});

const markerIcon = computed(() => {
  if (!markerInfo.value) return 'fa-heart-pulse';
  
  // Convert mdi icons to Font Awesome
  const iconMap = {
    'mdi-water': 'fa-tint',
    'mdi-food-apple': 'fa-apple-alt',
    'mdi-pill': 'fa-pills',
    'mdi-heart-pulse': 'fa-heartbeat',
    'mdi-weight': 'fa-weight',
    'mdi-bone': 'fa-bone',
    'mdi-chart-line': 'fa-chart-line',
    'mdi-sun-thermometer': 'fa-thermometer-half',
    'mdi-blood-bag': 'fa-tint',
    'mdi-alpha-a': 'fa-font',
    'mdi-water-percent': 'fa-tint',
    'mdi-fire': 'fa-fire',
    'mdi-atom': 'fa-atom',
    'mdi-flask': 'fa-flask',
    'mdi-leaf': 'fa-leaf'
  };
  
  return iconMap[markerInfo.value.icon] || 'fa-heartbeat';
});

const formattedDate = computed(() => {
  if (!props.healthMarker.marker_date) return 'No date';
  return DateFormatService.formatDatejs(props.healthMarker.marker_date);
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
const editHealthMarker = () => {
  router.push({ name: 'HealthMarkerEdit', params: { id: props.healthMarker.id } });
};
</script>

// ...template stays the same...

<style scoped>
/* ✅ HEALTH MARKER SPECIFIC STYLES ONLY */
.health-marker-card {
  background: white;
  border-left: 4px solid #e0e0e0;
}

/* ✅ RANGES SECTION (unique to health markers) */
.ranges-section {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.05) 0%, rgba(117, 117, 117, 0.05) 100%);
  border-radius: 8px;
  border: 1px solid rgba(158, 158, 158, 0.2);
}

.ranges-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #616161;
  margin-bottom: 12px;
  font-size: 14px;
}

.ranges-header i {
  font-size: 16px;
}

.ranges-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.range-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 8px;
  border-radius: 6px;
}

.range-item i {
  font-size: 14px;
}

.range-item.normal {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.range-item.high {
  background: rgba(239, 68, 68, 0.1);
  color: #c62828;
}

.range-item.low {
  background: rgba(33, 150, 243, 0.1);
  color: #1565c0;
}

/* ✅ INFO TEXT (unique to health markers) */
.info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.info-text i {
  font-size: 14px;
  color: #667eea;
}

/* All other styles now come from card-components.css! */
</style>