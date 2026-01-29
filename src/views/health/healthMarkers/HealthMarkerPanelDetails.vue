<template>
  <div class="panel-details-wrapper">
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
            <router-link :to="{ name: 'HealthMarkers' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-folder-open icon-health"></i>
              {{ panel?.panel_name || 'Panel Details' }}
            </span>
          </h1>
        </div>

        <!-- ✅ PANEL INFO SECTION -->
        <div v-if="!isLoading && panel" class="panel-info-card">
          <div class="panel-info-header">
            <div class="info-left">
              <h2 class="panel-name">{{ panel.panel_name }}</h2>
              <div class="panel-meta">
                <span class="meta-item">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(panel.test_date) }}
                </span>
                <span v-if="panel.lab_name" class="meta-item">
                  <i class="fas fa-hospital"></i>
                  {{ panel.lab_name }}
                </span>
                <span v-if="panel.doctor_name" class="meta-item">
                  <i class="fas fa-user-md"></i>
                  {{ panel.doctor_name }}
                </span>
              </div>
            </div>
            <div class="info-right">
              <button class="btn btn-primary" @click="handleEdit">
                <i class="fas fa-edit"></i>
                Edit Panel
              </button>
              <button class="btn btn-danger" @click="handleDelete">
                <i class="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>

          <!-- Status Summary -->
          <div v-if="panel.status_summary" class="status-summary-section">
            <h3>Status Summary</h3>
            <div class="status-grid">
              <div class="status-item">
                <i class="fas fa-vials"></i>
                <span class="status-value">{{ panel.status_summary.total }}</span>
                <span class="status-label">Total Markers</span>
              </div>
              <div v-if="panel.status_summary.normal > 0" class="status-item status-normal">
                <i class="fas fa-check-circle"></i>
                <span class="status-value">{{ panel.status_summary.normal }}</span>
                <span class="status-label">Normal</span>
              </div>
              <div v-if="panel.status_summary.borderline > 0" class="status-item status-borderline">
                <i class="fas fa-exclamation-triangle"></i>
                <span class="status-value">{{ panel.status_summary.borderline }}</span>
                <span class="status-label">Borderline</span>
              </div>
              <div v-if="panel.status_summary.high > 0" class="status-item status-high">
                <i class="fas fa-arrow-up"></i>
                <span class="status-value">{{ panel.status_summary.high }}</span>
                <span class="status-label">High</span>
              </div>
              <div v-if="panel.status_summary.low > 0" class="status-item status-low">
                <i class="fas fa-arrow-down"></i>
                <span class="status-value">{{ panel.status_summary.low }}</span>
                <span class="status-label">Low</span>
              </div>
              <div v-if="panel.status_summary.critical > 0" class="status-item status-critical">
                <i class="fas fa-exclamation-circle"></i>
                <span class="status-value">{{ panel.status_summary.critical }}</span>
                <span class="status-label">Critical</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="panel.notes" class="notes-section">
            <h3><i class="fas fa-sticky-note"></i> Notes</h3>
            <p class="notes-text">{{ panel.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ MARKERS IN PANEL -->
    <div class="content-wrapper">
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading panel details...</p>
      </div>

      <div v-else-if="panel && panel.health_markers">
        <div class="section-header">
          <h2>
            <i class="fas fa-vials"></i>
            Markers in this Panel ({{ panel.health_markers.length }})
          </h2>
        </div>

        <div v-if="panel.health_markers.length > 0" class="cards-grid">
          <HealthMarkerCard
            v-for="marker in panel.health_markers"
            :key="marker.id"
            :healthMarker="marker"
            @edit="editMarker"
            @delete="deleteMarker"
          />
        </div>

        <div v-else class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No Markers in Panel</h3>
          <p>Add markers to this panel from the edit page</p>
          <button class="btn btn-primary" @click="handleEdit">
            <i class="fas fa-edit"></i>
            Edit Panel
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HealthMarkerCard from '@/components/health/healthMarkers/HealthMarkerCard.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import EventService from '@/services/EventService';

const router = useRouter();
const route = useRoute();

const panel = ref(null);
const isLoading = ref(true);
const confirmDialogue = ref(null);

function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function handleEdit() {
  router.push({ 
    name: 'HealthMarkerPanelEdit', 
    params: { id: route.params.id } 
  });
}

async function handleDelete() {
  if (!confirmDialogue.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Delete Panel",
    message: `Are you sure you want to delete "${panel.value.panel_name}"? The markers will not be deleted, only ungrouped.`,
    okButton: "Delete Panel",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await EventService.deleteHealthMarkerPanel({ id: route.params.id });
    
    await confirmDialogue.value.show({
      title: "Panel Deleted",
      message: "Panel has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });

    router.push({ name: 'HealthMarkers' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete panel. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

function editMarker(marker) {
  router.push({ 
    name: 'HealthMarkerEdit', 
    params: { id: marker.id } 
  });
}

async function deleteMarker(marker) {
  if (!confirmDialogue.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Remove from Panel",
    message: `Remove "${marker.marker_name}" from this panel? (The marker will not be deleted)`,
    okButton: "Remove",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    // Update marker to remove panel association
    await EventService.putHealthMarker({
      id: marker.id,
      health_marker_panel_id: null
    });

    // Refresh panel data
    await fetchPanel();
    
    await confirmDialogue.value.show({
      title: "Marker Removed",
      message: "Marker has been removed from the panel.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Remove marker error:', error);
    
    await confirmDialogue.value.show({
      title: "Remove Failed",
      message: "Failed to remove marker from panel. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

async function fetchPanel() {
  isLoading.value = true;
  try {
    const response = await EventService.getHealthMarkerPanel(route.params.id);
    panel.value = response.data;
  } catch (error) {
    console.error('❌ Fetch panel error:', error);
    alert('Failed to load panel. Please try again.');
    router.push({ name: 'HealthMarkers' });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchPanel();
});
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.panel-details-wrapper {
  width: 100%;
  min-height: 100vh;
}

.page-wrapper {
  padding-bottom: 2rem;
}

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

.panel-info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.panel-info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.info-left {
  flex: 1;
}

.panel-name {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.panel-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
}

.meta-item i {
  color: #667eea;
}

.info-right {
  display: flex;
  gap: 0.5rem;
}

.status-summary-section {
  margin-bottom: 2rem;
}

.status-summary-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.status-item i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.status-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.status-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-normal { background: #d1fae5; }
.status-normal i { color: #065f46; }
.status-normal .status-value { color: #065f46; }

.status-borderline { background: #fef3c7; }
.status-borderline i { color: #92400e; }
.status-borderline .status-value { color: #92400e; }

.status-high { background: #fee2e2; }
.status-high i { color: #991b1b; }
.status-high .status-value { color: #991b1b; }

.status-low { background: #dbeafe; }
.status-low i { color: #1e40af; }
.status-low .status-value { color: #1e40af; }

.status-critical { background: #fee2e2; }
.status-critical i { color: #991b1b; }
.status-critical .status-value { color: #991b1b; }

.notes-section {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
}

.notes-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notes-section h3 i {
  color: #667eea;
}

.notes-text {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-header h2 i {
  color: #667eea;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #667eea;
}

@media (max-width: 768px) {
  .panel-info-header {
    flex-direction: column;
  }

  .info-right {
    width: 100%;
    flex-direction: column;
  }

  .info-right .btn {
    width: 100%;
  }

  .panel-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
