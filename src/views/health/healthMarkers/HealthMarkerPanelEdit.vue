<template>
  <div class="panel-edit-wrapper">
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
              <i class="fas fa-edit icon-health"></i>
              {{ isNewPanel ? 'Create Panel' : 'Edit Panel' }}
            </span>
          </h1>
        </div>
      </div>
    </div>

    <!-- ✅ FORM CONTENT -->
    <div class="content-wrapper">
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading panel...</p>
      </div>

      <div v-else class="form-container">
        <form @submit.prevent="handleSubmit">
          <!-- Panel Information Section -->
          <div class="form-section">
            <h2 class="section-title">
              <i class="fas fa-info-circle"></i>
              Panel Information
            </h2>

            <div class="form-grid">
              <div class="form-group full-width">
                <label for="panel_name" class="form-label">Panel Name *</label>
                <input
                  id="panel_name"
                  v-model="formData.panel_name"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Lipid Panel, Thyroid Panel"
                  required
                />
              </div>

              <div class="form-group">
                <label for="test_date" class="form-label">Test Date *</label>
                <input
                  id="test_date"
                  v-model="formData.test_date"
                  type="date"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="lab_name" class="form-label">Lab Name</label>
                <input
                  id="lab_name"
                  v-model="formData.lab_name"
                  type="text"
                  class="form-input"
                  placeholder="e.g., LabCorp, Quest"
                />
              </div>

              <div class="form-group">
                <label for="doctor_name" class="form-label">Doctor Name</label>
                <input
                  id="doctor_name"
                  v-model="formData.doctor_name"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Dr. Smith"
                />
              </div>

              <div class="form-group full-width">
                <label for="notes" class="form-label">Notes</label>
                <textarea
                  id="notes"
                  v-model="formData.notes"
                  class="form-textarea"
                  rows="4"
                  placeholder="Any additional notes about this panel..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Manage Markers Section (Edit Only) -->
          <div v-if="!isNewPanel" class="form-section">
            <h2 class="section-title">
              <i class="fas fa-vials"></i>
              Manage Markers
            </h2>

            <div class="markers-management">
              <!-- Current Markers in Panel -->
              <div class="current-markers">
                <h3>Markers in Panel ({{ currentMarkers.length }})</h3>
                <div v-if="currentMarkers.length > 0" class="marker-list">
                  <div
                    v-for="marker in currentMarkers"
                    :key="marker.id"
                    class="marker-item"
                  >
                    <div class="marker-info">
                      <i class="fas fa-vial"></i>
                      <span class="marker-name">{{ marker.marker_name }}</span>
                      <span class="marker-result">{{ marker.marker_result }} {{ marker.unit }}</span>
                      <span :class="['marker-status', getStatusClass(marker.status)]">
                        {{ marker.status || 'Unknown' }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn btn-sm btn-danger"
                      @click="removeMarker(marker)"
                      title="Remove from panel"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div v-else class="empty-markers">
                  <i class="fas fa-inbox"></i>
                  <p>No markers in this panel yet</p>
                </div>
              </div>

              <!-- Available Standalone Markers -->
              <div class="available-markers">
                <h3>Available Standalone Markers ({{ availableMarkers.length }})</h3>
                <div v-if="availableMarkers.length > 0" class="marker-list">
                  <div
                    v-for="marker in availableMarkers"
                    :key="marker.id"
                    class="marker-item"
                  >
                    <div class="marker-info">
                      <i class="fas fa-vial"></i>
                      <span class="marker-name">{{ marker.marker_name }}</span>
                      <span class="marker-result">{{ marker.marker_result }} {{ marker.unit }}</span>
                      <span :class="['marker-status', getStatusClass(marker.status)]">
                        {{ marker.status || 'Unknown' }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn btn-sm btn-success"
                      @click="addMarker(marker)"
                      title="Add to panel"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div v-else class="empty-markers">
                  <i class="fas fa-inbox"></i>
                  <p>No standalone markers available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
            >
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSaving"
            >
              <i :class="['fas', isSaving ? 'fa-spinner fa-spin' : 'fa-save']"></i>
              {{ isSaving ? 'Saving...' : (isNewPanel ? 'Create Panel' : 'Save Changes') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import EventService from '@/services/EventService';

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const isSaving = ref(false);
const confirmDialogue = ref(null);

const isNewPanel = computed(() => !route.params.id);

const formData = ref({
  panel_name: '',
  test_date: '',
  lab_name: '',
  doctor_name: '',
  notes: ''
});

const currentMarkers = ref([]);
const availableMarkers = ref([]);

function getStatusClass(status) {
  if (!status) return 'status-unknown';
  const lower = status.toLowerCase();
  if (lower === 'normal') return 'status-normal';
  if (lower.includes('borderline')) return 'status-borderline';
  if (lower === 'high' || lower === 'low') return 'status-warning';
  if (lower === 'critical') return 'status-critical';
  return 'status-unknown';
}

async function addMarker(marker) {
  try {
    await EventService.putHealthMarker({
      id: marker.id,
      health_marker_panel_id: route.params.id
    });

    // Move marker from available to current
    availableMarkers.value = availableMarkers.value.filter(m => m.id !== marker.id);
    currentMarkers.value.push(marker);
  } catch (error) {
    console.error('❌ Add marker error:', error);
    alert('Failed to add marker to panel');
  }
}

async function removeMarker(marker) {
  const ok = await confirmDialogue.value.show({
    title: "Remove Marker",
    message: `Remove "${marker.marker_name}" from this panel?`,
    okButton: "Remove",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await EventService.putHealthMarker({
      id: marker.id,
      health_marker_panel_id: null
    });

    // Move marker from current to available
    currentMarkers.value = currentMarkers.value.filter(m => m.id !== marker.id);
    availableMarkers.value.push(marker);
  } catch (error) {
    console.error('❌ Remove marker error:', error);
    alert('Failed to remove marker from panel');
  }
}

async function handleSubmit() {
  isSaving.value = true;

  try {
    const panelData = {
      health_marker_panel: formData.value
    };

    if (isNewPanel.value) {
      const response = await EventService.postHealthMarkerPanel(panelData);
      
      await confirmDialogue.value.show({
        title: "Panel Created",
        message: "Panel has been created successfully.",
        okButton: "OK",
        cancelButton: null
      });

      router.push({ 
        name: 'HealthMarkerPanelDetails', 
        params: { id: response.data.id } 
      });
    } else {
      await EventService.putHealthMarkerPanel({
        id: route.params.id,
        ...formData.value
      });

      await confirmDialogue.value.show({
        title: "Panel Updated",
        message: "Panel has been updated successfully.",
        okButton: "OK",
        cancelButton: null
      });

      router.push({ 
        name: 'HealthMarkerPanelDetails', 
        params: { id: route.params.id } 
      });
    }
  } catch (error) {
    console.error('❌ Save error:', error);
    const errorMessage = error.response?.data?.error || 'Failed to save panel. Please try again.';
    
    await confirmDialogue.value.show({
      title: "Save Failed",
      message: errorMessage,
      okButton: "OK",
      cancelButton: null
    });
  } finally {
    isSaving.value = false;
  }
}

function handleCancel() {
  if (isNewPanel.value) {
    router.push({ name: 'HealthMarkers' });
  } else {
    router.push({ 
      name: 'HealthMarkerPanelDetails', 
      params: { id: route.params.id } 
    });
  }
}

async function fetchData() {
  isLoading.value = true;

  try {
    if (!isNewPanel.value) {
      // Fetch panel data
      const panelResponse = await EventService.getHealthMarkerPanel(route.params.id);
      const panel = panelResponse.data;

      formData.value = {
        panel_name: panel.panel_name,
        test_date: panel.test_date,
        lab_name: panel.lab_name || '',
        doctor_name: panel.doctor_name || '',
        notes: panel.notes || ''
      };

      currentMarkers.value = panel.health_markers || [];
    } else {
      // Set default test date to today
      const today = new Date();
      formData.value.test_date = today.toISOString().split('T')[0];
    }

    // Fetch available standalone markers (not in any panel)
    const markersResponse = await EventService.getHealthMarkers();
    const allMarkers = markersResponse.data;
    
    // Filter out markers that are already in this panel or other panels
    availableMarkers.value = allMarkers.filter(marker => 
      !marker.health_marker_panel_id
    );
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    alert('Failed to load data. Please try again.');
    router.push({ name: 'HealthMarkers' });
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.panel-edit-wrapper {
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

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-title i {
  color: #667eea;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.markers-management {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.current-markers,
.available-markers {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.current-markers h3,
.available-markers h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.marker-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.marker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.marker-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.marker-info i {
  color: #667eea;
  flex-shrink: 0;
}

.marker-name {
  font-weight: 600;
  color: #1f2937;
  flex-shrink: 0;
}

.marker-result {
  color: #6b7280;
  font-size: 0.875rem;
}

.marker-status {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.status-normal {
  background: #d1fae5;
  color: #065f46;
}

.status-borderline,
.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-critical {
  background: #fee2e2;
  color: #991b1b;
}

.status-unknown {
  background: #e5e7eb;
  color: #6b7280;
}

.empty-markers {
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
}

.empty-markers i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
  opacity: 0.5;
}

.empty-markers p {
  margin: 0;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .markers-management {
    grid-template-columns: 1fr;
  }

  .marker-info {
    flex-wrap: wrap;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
