<template>
  <div class="health-marker-details-wrapper">
    <!-- ✅ PAGE HEADER WITH GRADIENT -->
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <!-- ✅ BREADCRUMB -->
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'HealthMarkerList' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat icon-health"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-vial"></i>
              {{ markerInfo?.label || healthMarker?.marker_name || 'Details' }}
            </span>
          </h1>
        </div>

        <!-- ✅ LOADING STATE -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading marker details...
        </div>

        <!-- ✅ ERROR STATE -->
        <div v-else-if="!healthMarker" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Health Marker Not Found</h3>
          <p>The requested health marker could not be found.</p>
          <router-link :to="{ name: 'HealthMarkerList' }" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i>
            Back to List
          </router-link>
        </div>

        <!-- ✅ DETAILS CARD -->
        <div v-else class="details-card">
          <div class="card">
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-content">
                <h2 class="card-title">
                  <i class="fas fa-vial icon-health"></i>
                  {{ markerInfo?.label || healthMarker.marker_name }}
                </h2>
                <div class="header-badges">
                  <!-- Intelligent Status Badge -->
                  <span v-if="intelligentStatus" :class="['badge', 'badge-lg', getIntelligentStatusClass(intelligentStatus.type)]">
                    {{ intelligentStatus.title }}
                  </span>
                  <!-- Category Badge -->
                  <span v-if="markerInfo?.category" class="badge badge-lg badge-info">
                    {{ markerInfo.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <!-- Primary Metrics -->
              <div class="metrics-section">
                <!-- Marker Result -->
                <div class="metric-card metric-primary">
                  <div class="metric-icon">
                    <i class="fas fa-tachometer-alt"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Your Result</div>
                    <div class="metric-value">
                      {{ healthMarker.marker_result }}
                      <span v-if="healthMarker.unit || markerInfo?.unit" class="metric-unit">
                        {{ healthMarker.unit || markerInfo?.unit }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Intelligent Range Display -->
                <div v-if="intelligentStatus && intelligentStatus.range" class="metric-card metric-info">
                  <div class="metric-icon">
                    <i class="fas fa-arrows-alt-h"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">{{ intelligentStatus.title }} Range</div>
                    <div class="metric-value-secondary">
                      {{ intelligentStatus.range }}
                    </div>
                  </div>
                </div>
                
                <!-- Fallback to normal_range if no intelligent status -->
                <div v-else-if="healthMarker.normal_range_low || healthMarker.normal_range_high" class="metric-card metric-info">
                  <div class="metric-icon">
                    <i class="fas fa-arrows-alt-h"></i>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Normal Range</div>
                    <div class="metric-value-secondary">
                      <span v-if="healthMarker.normal_range_low">{{ healthMarker.normal_range_low }}</span>
                      <span v-if="healthMarker.normal_range_low && healthMarker.normal_range_high"> - </span>
                      <span v-if="healthMarker.normal_range_high">{{ healthMarker.normal_range_high }}</span>
                      <span v-if="healthMarker.unit" class="metric-unit">{{ healthMarker.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Intelligent Status Message -->
              <div v-if="intelligentStatus && intelligentStatus.message" class="alert-box" :class="`alert-${intelligentStatus.type}`">
                <i :class="getAlertIcon(intelligentStatus.type)"></i>
                <div class="alert-content">
                  <strong>{{ intelligentStatus.title }}</strong>
                  <p>{{ intelligentStatus.message }}</p>
                </div>
              </div>

              <!-- Marker Description -->
              <div v-if="markerInfo?.description" class="info-box">
                <div class="info-box-header">
                  <i class="fas fa-info-circle"></i>
                  <h4>About {{ markerInfo.label }}</h4>
                </div>
                <p>{{ markerInfo.description }}</p>
                <div v-if="markerInfo.testFrequency" class="info-box-footer">
                  <i class="fas fa-calendar-check"></i>
                  <span>Recommended frequency: {{ markerInfo.testFrequency }}</span>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="details-grid">
                <!-- Test Date -->
                <div class="detail-item">
                  <div class="detail-label">
                    <i class="fas fa-calendar-alt"></i>
                    Test Date
                  </div>
                  <div class="detail-value">
                    {{ formatDate(healthMarker.marker_date) }}
                  </div>
                </div>

                <!-- Lab Name -->
                <div v-if="healthMarker.lab_name" class="detail-item">
                  <div class="detail-label">
                    <i class="fas fa-hospital"></i>
                    Laboratory
                  </div>
                  <div class="detail-value">
                    {{ healthMarker.lab_name }}
                  </div>
                </div>

                <!-- Doctor Name -->
                <div v-if="healthMarker.doctor_name" class="detail-item">
                  <div class="detail-label">
                    <i class="fas fa-user-md"></i>
                    Doctor
                  </div>
                  <div class="detail-value">
                    {{ healthMarker.doctor_name }}
                  </div>
                </div>
              </div>

              <!-- Marker Facts Section -->
              <div v-if="healthMarker.marker_facts" class="facts-section">
                <div class="facts-header">
                  <i class="fas fa-lightbulb"></i>
                  <h3>Marker Facts</h3>
                </div>
                <div class="facts-content">
                  {{ healthMarker.marker_facts }}
                </div>
              </div>

              <!-- Notes Section -->
              <div v-if="healthMarker.notes" class="notes-section">
                <div class="notes-header">
                  <i class="fas fa-sticky-note"></i>
                  <h3>Notes</h3>
                </div>
                <div class="notes-content">
                  {{ healthMarker.notes }}
                </div>
              </div>

              <!-- Metadata -->
              <div class="metadata-section">
                <div v-if="healthMarker.created_at" class="metadata-item">
                  <i class="fas fa-clock"></i>
                  <span>Created: {{ formatDateTime(healthMarker.created_at) }}</span>
                </div>
                <div v-if="healthMarker.updated_at" class="metadata-item">
                  <i class="fas fa-sync"></i>
                  <span>Updated: {{ formatDateTime(healthMarker.updated_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="card-footer">
              <div class="footer-actions">
                <router-link
                  :to="{ name: 'HealthMarkerEdit', params: { id: healthMarker.id } }"
                  class="btn btn-primary"
                >
                  <i class="fas fa-edit"></i>
                  Edit Marker
                </router-link>
                
                <button
                  @click="handleDelete"
                  class="btn btn-danger"
                >
                  <i class="fas fa-trash"></i>
                  Delete Marker
                </button>
                
                <router-link
                  :to="{ name: 'HealthMarkerList' }"
                  class="btn btn-secondary"
                >
                  <i class="fas fa-arrow-left"></i>
                  Back to List
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/HealthMarkerStore';
import { getHealthMarkerByName, getResultStatus } from '@/services/health-marker-constants';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ ROUTER, ROUTE & STORE
const router = useRouter();
const route = useRoute();
const healthMarkerStore = useHealthMarkerStore();

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ COMPUTED
const healthMarker = computed(() => {
  const id = parseInt(route.params.id);
  return healthMarkerStore.allHealthMarkers.find(m => m.id === id);
});

const isLoading = computed(() => healthMarkerStore.isLoading);

// ✅ GET MARKER INFO FROM CONSTANTS
const markerInfo = computed(() => {
  if (!healthMarker.value) return null;
  return getHealthMarkerByName(healthMarker.value.marker_name);
});

// ✅ GET INTELLIGENT STATUS
const intelligentStatus = computed(() => {
  if (!healthMarker.value) return null;
  return getResultStatus(healthMarker.value.marker_name, healthMarker.value.marker_result);
});

// ✅ METHODS
function formatDate(dateString) {
  if (!dateString) return 'Unknown Date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function formatDateTime(dateString) {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

function getIntelligentStatusClass(type) {
  const typeMap = {
    'success': 'badge-success',
    'warning': 'badge-warning',
    'error': 'badge-danger',
    'info': 'badge-info'
  };
  return typeMap[type] || 'badge-secondary';
}

function getAlertIcon(type) {
  const iconMap = {
    'success': 'fas fa-check-circle',
    'warning': 'fas fa-exclamation-triangle',
    'error': 'fas fa-exclamation-circle',
    'info': 'fas fa-info-circle'
  };
  return iconMap[type] || 'fas fa-info-circle';
}

async function handleDelete() {
  if (!confirmDialogue.value || !healthMarker.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Delete Health Marker",
    message: `Are you sure you want to delete ${healthMarker.value.marker_name}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await healthMarkerStore.deleteHealthMarker(healthMarker.value.id);
    
    await confirmDialogue.value.show({
      title: "Marker Deleted",
      message: "Health marker has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    router.push({ name: 'HealthMarkerList' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete health marker. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  if (healthMarkerStore.allHealthMarkers.length === 0) {
    try {
      await healthMarkerStore.fetchHealthMarkers();
    } catch (error) {
      console.error('❌ Failed to load health markers:', error);
    }
  }
  
  if (!healthMarker.value) {
    console.warn('⚠️ Health marker not found:', route.params.id);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-details-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Page wrapper spacing */
.page-wrapper {
  padding-bottom: 120px;
}

/* Breadcrumb styling */
.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 1.5rem;
  opacity: 0.6;
  margin: 0 0.5rem;
}

/* Details card */
.details-card {
  max-width: 1100px;
  margin: 0 auto;
}

.details-card .card {
  border-left: 4px solid #667eea;
}

/* Card header content */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.header-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Metrics section */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid;
}

.metric-card.metric-primary {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  border-color: #667eea;
}

.metric-card.metric-info {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #10b981;
}

.metric-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.metric-primary .metric-icon {
  color: #667eea;
}

.metric-info .metric-icon {
  color: #10b981;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.metric-unit {
  font-size: 1rem;
  font-weight: 500;
  color: #9ca3af;
  margin-left: 0.5rem;
}

.metric-value-secondary {
  font-size: 1.25rem;
  font-weight: 600;
  color: #10b981;
}

/* Alert boxes for intelligent status */
.alert-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border-left: 4px solid;
}

.alert-box i {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert-success {
  background: #f0fdf4;
  border-color: #10b981;
}

.alert-success i {
  color: #10b981;
}

.alert-success strong {
  color: #065f46;
}

.alert-success p {
  color: #047857;
}

.alert-warning {
  background: #fffbeb;
  border-color: #f59e0b;
}

.alert-warning i {
  color: #f59e0b;
}

.alert-warning strong {
  color: #92400e;
}

.alert-warning p {
  color: #b45309;
}

.alert-error {
  background: #fef2f2;
  border-color: #ef4444;
}

.alert-error i {
  color: #ef4444;
}

.alert-error strong {
  color: #991b1b;
}

.alert-error p {
  color: #dc2626;
}

.alert-info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.alert-info i {
  color: #3b82f6;
}

.alert-info strong {
  color: #1e3a8a;
}

.alert-info p {
  color: #2563eb;
}

/* Info box for marker description */
.info-box {
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.info-box-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #667eea;
}

.info-box-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.info-box p {
  margin: 0 0 1rem 0;
  color: #4b5563;
  line-height: 1.6;
}

.info-box-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

.info-box-footer i {
  color: #667eea;
}

/* Details grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-label i {
  color: #667eea;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

/* Marker Facts section */
.facts-section {
  margin-bottom: 2rem;
}

.facts-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.facts-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.facts-content {
  padding: 1.25rem;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  color: #1e3a8a;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Notes section */
.notes-section {
  margin-bottom: 2rem;
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #f59e0b;
}

.notes-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.notes-content {
  padding: 1.25rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  color: #78350f;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Metadata section */
.metadata-section {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.metadata-item i {
  color: #9ca3af;
}

/* Footer actions */
.footer-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .details-card {
    max-width: 100%;
  }
  
  .metrics-section {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .footer-actions {
    flex-direction: column;
  }
  
  .footer-actions .btn {
    width: 100%;
  }
  
  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>