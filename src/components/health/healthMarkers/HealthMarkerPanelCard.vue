<template>
  <div 
    class="panel-card"
    :class="{ 'needs-attention': panel.needs_attention }"
    @click="toggleExpanded"
  >
    <!-- ✅ PANEL HEADER -->
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-name">
          <i class="fas fa-clipboard-list icon-health"></i>
          {{ panel.panel_name }}
        </h3>
        <p class="panel-date">
          <i class="fas fa-calendar-alt"></i>
          {{ formatDate(panel.test_date) }}
        </p>
      </div>
      
      <div class="header-right">
        <button 
          class="expand-btn"
          @click.stop="toggleExpanded"
          :title="isExpanded ? 'Collapse' : 'Expand'"
        >
          <i :class="['fas', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>
      </div>
    </div>

    <!-- ✅ PANEL SUMMARY -->
    <div class="panel-summary">
      <div class="summary-item">
        <i class="fas fa-vials"></i>
        <span class="summary-label">{{ panel.marker_count }} marker{{ panel.marker_count !== 1 ? 's' : '' }}</span>
      </div>
      
      <div v-if="panel.status_summary" class="status-summary">
        <span v-if="panel.status_summary.normal > 0" class="status-count status-normal">
          <i class="fas fa-check-circle"></i>
          {{ panel.status_summary.normal }} Normal
        </span>
        <span v-if="panel.status_summary.borderline > 0" class="status-count status-borderline">
          <i class="fas fa-exclamation-triangle"></i>
          {{ panel.status_summary.borderline }} Borderline
        </span>
        <span v-if="panel.status_summary.high > 0" class="status-count status-high">
          <i class="fas fa-arrow-up"></i>
          {{ panel.status_summary.high }} High
        </span>
        <span v-if="panel.status_summary.low > 0" class="status-count status-low">
          <i class="fas fa-arrow-down"></i>
          {{ panel.status_summary.low }} Low
        </span>
        <span v-if="panel.status_summary.critical > 0" class="status-count status-critical">
          <i class="fas fa-exclamation-circle"></i>
          {{ panel.status_summary.critical }} Critical
        </span>
      </div>
    </div>

    <!-- ✅ LAB & DOCTOR INFO -->
    <div class="panel-info">
      <div v-if="panel.lab_name" class="info-item">
        <i class="fas fa-hospital"></i>
        <span>{{ panel.lab_name }}</span>
      </div>
      <div v-if="panel.doctor_name" class="info-item">
        <i class="fas fa-user-md"></i>
        <span>Dr. {{ panel.doctor_name }}</span>
      </div>
    </div>

    <!-- ✅ EXPANDED CONTENT (Markers in Panel) -->
    <transition name="expand">
      <div v-if="isExpanded" class="panel-expanded">
        <div class="markers-list">
          <div 
            v-for="marker in panelMarkers" 
            :key="marker.id"
            class="marker-item"
          >
            <div class="marker-item-header">
              <span class="marker-name">
                <i class="fas fa-vial"></i>
                {{ marker.marker_name }}
              </span>
              <span :class="['marker-status', getStatusClass(marker.status)]">
                {{ marker.status || 'Unknown' }}
              </span>
            </div>
            <div class="marker-item-body">
              <span class="marker-result">
                {{ marker.marker_result }} {{ marker.unit }}
              </span>
              <span v-if="marker.normal_range_low && marker.normal_range_high" class="marker-range">
                Normal: {{ marker.normal_range_low }} - {{ marker.normal_range_high }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="panel-actions">
          <button
            @click.stop="viewFullPanel"
            class="btn btn-sm btn-info"
            title="View Full Panel"
          >
            <i class="fas fa-eye"></i>
            View Details
          </button>
          <button
            @click.stop="$emit('edit', panel)"
            class="btn btn-sm btn-primary"
            title="Edit Panel"
          >
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button
            @click.stop="$emit('delete', panel)"
            class="btn btn-sm btn-danger"
            title="Delete Panel"
          >
            <i class="fas fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </transition>

    <!-- ✅ COLLAPSED FOOTER (when not expanded) -->
    <div v-if="!isExpanded" class="panel-footer">
      <button 
        @click.stop="viewFullPanel"
        class="btn btn-link"
      >
        <i class="fas fa-arrow-right"></i>
        View Panel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EventService from '@/services/EventService';

const router = useRouter();

// ✅ PROPS
const props = defineProps({
  panel: {
    type: Object,
    required: true
  }
});

// ✅ EMITS
defineEmits(['edit', 'delete']);

// ✅ STATE
const isExpanded = ref(false);
const panelMarkers = ref([]);
const loading = ref(false);

// ✅ METHODS
function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
  
  // Fetch full panel details when expanded
  if (isExpanded.value && panelMarkers.value.length === 0) {
    fetchPanelDetails();
  }
}

async function fetchPanelDetails() {
  loading.value = true;
  try {
    const response = await EventService.getHealthMarkerPanel(props.panel.id);
    panelMarkers.value = response.data.health_markers || [];
  } catch (error) {
    console.error('Error fetching panel details:', error);
  } finally {
    loading.value = false;
  }
}

function viewFullPanel() {
  router.push({ 
    name: 'HealthMarkerPanelDetails', 
    params: { id: props.panel.id } 
  });
}

function getStatusClass(status) {
  if (!status) return 'badge-secondary';
  
  const lower = status.toLowerCase();
  if (lower.includes('borderline')) return 'badge-warning';
  if (lower === 'normal') return 'badge-success';
  if (lower === 'high' || lower === 'low') return 'badge-warning';
  if (lower === 'critical') return 'badge-danger';
  return 'badge-info';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
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
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   PANEL CARD STYLES
   ======================================== */

.panel-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid #667eea;
}

.panel-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.panel-card.needs-attention {
  border-left-color: #f59e0b;
  background: linear-gradient(to right, #fff9e6 0%, white 10%);
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.header-left {
  flex: 1;
}

.panel-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-name i {
  color: #667eea;
  font-size: 1.5rem;
}

.panel-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-date i {
  color: #9ca3af;
}

.expand-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.expand-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

/* Panel Summary */
.panel-summary {
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.summary-item i {
  color: #667eea;
}

.summary-label {
  font-weight: 600;
}

.status-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.status-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-normal {
  background: #d1fae5;
  color: #065f46;
}

.status-borderline {
  background: #fef3c7;
  color: #92400e;
}

.status-high,
.status-low {
  background: #fed7aa;
  color: #9a3412;
}

.status-critical {
  background: #fee2e2;
  color: #991b1b;
}

/* Panel Info */
.panel-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.info-item i {
  color: #9ca3af;
}

/* Expanded Content */
.panel-expanded {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.markers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.marker-item {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.marker-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.marker-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.marker-name i {
  color: #667eea;
  font-size: 0.75rem;
}

.marker-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.marker-item-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #4b5563;
}

.marker-result {
  font-weight: 700;
  color: #667eea;
}

.marker-range {
  font-size: 0.75rem;
  color: #9ca3af;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Panel Footer */
.panel-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-link:hover {
  background: #f3f4f6;
  color: #5568d3;
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .panel-card {
    padding: 1rem;
  }
  
  .panel-name {
    font-size: 1.1rem;
  }
  
  .status-summary {
    gap: 0.5rem;
  }
  
  .panel-actions {
    flex-direction: column;
  }
  
  .panel-actions .btn {
    width: 100%;
  }
}
</style>
