<template>
  <div 
    class="health-marker-card"
    @dblclick="handleDoubleClick"
  >
    <!-- ✅ CARD HEADER -->
    <div class="card-header">
      <div class="header-left">
        <h3 class="marker-name">
          <i class="fas fa-vial icon-health"></i>
          {{ healthMarker.marker_name }}
        </h3>
        <p class="marker-date">
          <i class="fas fa-calendar-alt"></i>
          {{ formatDate(healthMarker.marker_date) }}
        </p>
      </div>
      
      <div class="header-right">
        <span :class="['status-badge', getStatusClass(healthMarker.status)]">
          {{ healthMarker.status || 'Unknown' }}
        </span>
      </div>
    </div>
    <!-- ✅ CARD BODY -->
    <div class="card-body">
      <!-- Value & Unit -->
      <div class="metric-row">   
        <div class="metric-item">
          <span class="metric-label">
            <i class="fas fa-tachometer-alt"></i>
            Test Result
          </span>
          <span class="metric-value">
            {{ healthMarker.marker_result }}
            <span class="metric-unit">{{ healthMarker.unit }}</span>
          </span>
        </div>
        <div class="metric-item">
          <span class="metric-label">
            <i class="fas fa-tachometer-alt"></i>
            Normal Values
          </span>
          <span class="metric-value">
            {{ healthMarker.normal_range_low }} - {{ healthMarker.normal_range_high }}
            <span class="metric-unit">{{ healthMarker.unit }}</span>
          </span>
        </div>    
        <!-- NOT YET IN PLACEReference Range -->
        <div v-if="healthMarker.reference_range" class="metric-item">
          <span class="metric-label">
            <i class="fas fa-arrows-alt-h"></i>
            Range
          </span>
          <span class="metric-value-secondary">
            {{ healthMarker.reference_range }}
          </span>
        </div>
      </div>

      <!-- Lab Name -->
      <div v-if="healthMarker.lab_name" class="info-row">
        <i class="fas fa-hospital"></i>
        <span>{{ healthMarker.lab_name }}</span>
      </div>
      <!-- Marker Facts -->
      <div v-if="healthMarker.marker_facts" class="notes-section">
        <label class="notes-label">
          <i class="fas fa-info-circle"></i>
          Marker Facts
        </label>
        <p class="notes-text">{{ truncateNotes(healthMarker.marker_facts) }}</p>
      </div>
      <!-- Notes Preview -->
      <div v-if="healthMarker.notes" class="notes-section">
        <label class="notes-label">
          <i class="fas fa-sticky-note"></i>
          Notes
        </label>
        <p class="notes-text">{{ truncateNotes(healthMarker.notes) }}</p>
      </div>
    </div>

    <!-- ✅ CARD FOOTER -->
    <div class="card-footer">
      <button
        @click.stop="$emit('edit', healthMarker)"
        class="btn btn-sm btn-primary"
        title="Edit Marker"
      >
        <i class="fas fa-edit"></i>
      </button>
      
      <button
        @click.stop="$emit('delete', healthMarker)"
        class="btn btn-sm btn-danger"
        title="Delete Marker"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- ✅ DOUBLE-CLICK HINT -->
    <div class="card-hint">
      <i class="fas fa-hand-pointer"></i>
      Double-click to view details
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// ✅ ROUTER
const router = useRouter();

// ✅ PROPS
const props = defineProps({
  healthMarker: {
    type: Object,
    required: true
  }
});

// ✅ EMITS
defineEmits(['edit', 'delete']);

// ✅ METHODS
// ✅ ADDED THIS METHOD
function handleDoubleClick() {
  router.push({ 
    name: 'HealthMarkerDetails', 
    params: { id: props.healthMarker.id } 
  });
}
function formatDate(dateString) {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.log('Date formatting error:', error);
    return dateString;
  }
}

function getStatusClass(status) {
  console.log('Getting status class for status:', status);
  if (!status) return 'badge-secondary';
  
  const lower = status.toLowerCase();
  if (lower === 'normal') return 'badge-success';
  if (lower.includes('borderline')) return 'badge-warning';
  if (lower === 'high' || lower === 'low' ) return 'badge-warning';
  if (lower === 'critical') return 'badge-danger';
  return 'badge-info';
}

function truncateNotes(notes) {
  if (!notes) return '';
  if (notes.length <= 100) return notes;
  return notes.substring(0, 100) + '...';
}
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-card {
  position: relative;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #667eea; /* Health purple accent */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.health-marker-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

/* Card header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  gap: 1rem;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.marker-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.marker-date {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-right {
  flex-shrink: 0;
}

/* Card body */
.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Metrics row */
.metric-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.metric-unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: #9ca3af;
  margin-left: 0.25rem;
}

.metric-value-secondary {
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
}

/* Info row */
.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
}

.info-row i {
  color: #667eea;
}

/* Notes section */
.notes-section {
  margin-top: 1rem;
}

.notes-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notes-label i {
  font-size: 1rem;
}

.notes-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  padding: 0.75rem;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
  margin: 0;
  line-height: 1.5;
}

/* Notes preview (deprecated - replaced by notes-section) */
.notes-preview {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  padding: 0.75rem;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
}

.notes-preview i {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Card footer */
.card-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
}

.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Card hint */
.card-hint {
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.health-marker-card:hover .card-hint {
  opacity: 1;
}

/* Responsive */
@media (max-width: 640px) {
  .metric-row {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .header-right {
    align-self: flex-start;
  }
  
  .metric-value {
    font-size: 1.25rem;
  }
}
</style>