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
      <div class="page-container">
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
                <div v-if="isNewPanel && currentMarkers.length" class="marker-association-note">
                  <i class="fas fa-vial"></i>
                  <span>Marker: {{ currentMarkers[0].marker_name }}</span>
                </div>
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
                      <div class="marker-name-block">
                        <span class="marker-name">{{ marker.marker_name }}</span>
                        <span
                          v-if="getMarkerDefinitionByName(marker.marker_name)?.description"
                          class="marker-definition-description"
                        >
                          {{ getMarkerDefinitionByName(marker.marker_name).description }}
                        </span>
                      </div>
                      <input
                        v-model="marker.marker_result"
                        type="text"
                        class="form-input inline-input"
                        placeholder="Result"
                        @input="syncMarkerStatus(marker)"
                      />
                      <input
                        v-model="marker.unit"
                        type="text"
                        class="form-input inline-unit"
                        placeholder="Unit"
                      />
                      <span :class="['marker-status', getStatusClass(getMarkerStatus(marker))]">
                        {{ getMarkerStatus(marker) }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn btn-sm btn-danger marker-remove-button"
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

              <!-- Add Custom Marker -->
              <div class="custom-marker-box">
                <h3>Quick Add Marker to This Panel</h3>
                <div class="custom-marker-form">
                  <div class="custom-field">
                    <label class="form-label">Marker</label>
                    <select
                      v-model="newCustomMarker.marker_name"
                      class="form-input"
                    >
                      <option value="">Select a marker</option>
                      <option
                        v-for="option in quickAddMarkerOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.title }}
                      </option>
                    </select>
                  </div>

                  <div v-if="newCustomMarker.marker_name === 'Other'" class="custom-field">
                    <label class="form-label">Select a known marker</label>
                    <select
                      v-model="newCustomMarker.custom_marker_choice"
                      class="form-input"
                    >
                      <option value="">Select a known marker</option>
                      <option
                        v-for="option in allKnownMarkerOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.title }}
                      </option>
                    </select>
                  </div>

                  <div v-if="newCustomMarker.marker_name === 'Other' && newCustomMarker.custom_marker_choice === 'Other'" class="custom-field">
                    <label class="form-label">Add new marker name</label>
                    <input
                      v-model="newCustomMarker.custom_name"
                      type="text"
                      class="form-input"
                      placeholder="e.g., Ferritin, Vitamin K, HbA1c"
                    />
                  </div>

                  <div class="custom-field small">
                    <label class="form-label">Result</label>
                    <input
                      v-model="newCustomMarker.marker_result"
                      type="text"
                      class="form-input"
                      :placeholder="quickAddResultPlaceholder"
                    />
                    <small v-if="isQuickAddBloodPressure" class="form-text">
                      BP format: 120/80 (68 bpm). Normal: 60 to 100 bpm
                    </small>
                  </div>

                  <div class="custom-field small">
                    <label class="form-label">Unit</label>
                    <input
                      v-model="newCustomMarker.unit"
                      type="text"
                      class="form-input"
                      placeholder="mg/dL, %, mm Hg"
                    />
                  </div>

                  <button
                    type="button"
                    class="btn btn-sm btn-success"
                    @click="addCustomMarker"
                    :disabled="!getCustomMarkerName() || !newCustomMarker.marker_result"
                  >
                    <i class="fas fa-plus"></i>
                    Add Marker
                  </button>
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
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import EventService from '@/services/EventService';
import { useMarkerDefinitionStore } from '@/stores/health/MarkerDefinitionStore';
import {
  getResultStatus,
  getHealthMarkerOptions,
  getHealthMarkerByName
} from '@/services/health-marker-constants';

const router = useRouter();
const route = useRoute();
const markerDefinitionStore = useMarkerDefinitionStore();

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
const allPanels = ref([]);
const newCustomMarker = ref({
  marker_name: '',
  custom_marker_choice: '',
  custom_name: '',
  marker_result: '',
  unit: ''
});

function normalizeMarkerName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function getMarkerDefinitionByName(name) {
  const normalizedName = normalizeMarkerName(name);
  if (!normalizedName) return undefined;

  return markerDefinitionStore.allDefinitions.find(definition => {
    return [definition.name, definition.label]
      .some(value => normalizeMarkerName(value) === normalizedName);
  }) || getHealthMarkerByName(name);
}

function normalizePanelNameForMatching(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const withoutTrailingDate = raw
    .replace(/\s*\(?\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\)?\s*$/i, ' ')
    .replace(/\s*\(?\d{4}[/-]\d{1,2}[/-]\d{1,2}\)?\s*$/i, ' ')
    .trim();

  return withoutTrailingDate
    .toLowerCase()
    .replace(/[_]+/g, ' ')
    .replace(/[()]/g, ' ')
    .replace(/[-/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSameNameMarkerNames() {
  const baseName = normalizePanelNameForMatching(formData.value.panel_name);
  if (!baseName) return [];

  const nameMap = new Map();

  (currentMarkers.value || []).forEach(marker => {
    const rawName = marker && marker.marker_name ? marker.marker_name.trim() : '';
    if (!rawName) return;
    const key = normalizeMarkerName(rawName);
    if (!nameMap.has(key)) {
      nameMap.set(key, rawName);
    }
  });

  (allPanels.value || []).forEach(panel => {
    const panelName = panel && panel.panel_name ? panel.panel_name : '';
    if (!panelName) return;
    if (normalizePanelNameForMatching(panelName) !== baseName) return;

    const markers = Array.isArray(panel.health_markers) ? panel.health_markers : [];
    markers.forEach(marker => {
      const rawName = marker && marker.marker_name ? marker.marker_name.trim() : '';
      if (!rawName) return;
      const key = normalizeMarkerName(rawName);
      if (!nameMap.has(key)) {
        nameMap.set(key, rawName);
      }
    });
  });

  return [...nameMap.values()].sort((a, b) => a.localeCompare(b));
}

const allKnownMarkerOptions = computed(() => {
  const uniqueNames = new Map();

  getSameNameMarkerNames().forEach(name => uniqueNames.set(normalizeMarkerName(name), name));

  getHealthMarkerOptions().forEach(option => {
    const value = option?.value || '';
    if (!value) return;
    uniqueNames.set(normalizeMarkerName(value), value);
  });

  markerDefinitionStore.allDefinitions.forEach(definition => {
    const name = definition && (definition.name || definition.label)
      ? String(definition.name || definition.label).trim()
      : '';
    if (!name) return;
    uniqueNames.set(normalizeMarkerName(name), name);
  });

  (availableMarkers.value || []).forEach(marker => {
    const name = marker && marker.marker_name ? marker.marker_name.trim() : '';
    if (!name) return;
    uniqueNames.set(normalizeMarkerName(name), name);
  });

  (allPanels.value || []).forEach(panel => {
    const markers = Array.isArray(panel?.health_markers) ? panel.health_markers : [];
    markers.forEach(marker => {
      const name = marker && marker.marker_name ? marker.marker_name.trim() : '';
      if (!name) return;
      uniqueNames.set(normalizeMarkerName(name), name);
    });
  });

  return [
    ...[...uniqueNames.values()].sort((a, b) => a.localeCompare(b)).map(name => ({ value: name, title: name })),
    { value: 'Other', title: 'Other (custom)' }
  ];
});

const quickAddMarkerOptions = computed(() => {
  const currentFamilyMarkers = getSameNameMarkerNames();

  return [
    ...currentFamilyMarkers
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ value: name, title: name })),
    { value: 'Other', title: 'Other (custom)' }
  ];
});

const quickAddSelectedMarkerName = computed(() => {
  if (!newCustomMarker.value.marker_name) return '';
  if (newCustomMarker.value.marker_name !== 'Other') {
    return String(newCustomMarker.value.marker_name || '').trim();
  }
  if (newCustomMarker.value.custom_marker_choice && newCustomMarker.value.custom_marker_choice !== 'Other') {
    return String(newCustomMarker.value.custom_marker_choice || '').trim();
  }
  if (newCustomMarker.value.custom_marker_choice === 'Other') {
    return String(newCustomMarker.value.custom_name || '').trim();
  }
  return '';
});

function getRouteMarkerPreset() {
  const markerName = typeof route.query.marker_name === 'string' ? route.query.marker_name.trim() : '';
  if (!markerName) return null;

  return {
    marker_name: markerName,
    panel_name: '',
    marker_date: typeof route.query.marker_date === 'string' ? route.query.marker_date : '',
    marker_result: typeof route.query.marker_result === 'string' ? route.query.marker_result : '',
    unit: typeof route.query.unit === 'string' ? route.query.unit : '',
    lab_name: typeof route.query.lab_name === 'string' ? route.query.lab_name : '',
    doctor_name: typeof route.query.doctor_name === 'string' ? route.query.doctor_name : '',
    notes: typeof route.query.notes === 'string' ? route.query.notes : '',
    status: typeof route.query.status === 'string' ? route.query.status : ''
  };
}

const isQuickAddBloodPressure = computed(() => {
  const text = normalizeMarkerName(quickAddSelectedMarkerName.value);
  return text.includes('blood pressure') || text.includes('systolic') || text.includes('diastolic');
});

const quickAddResultPlaceholder = computed(() => {
  if (isQuickAddBloodPressure.value) {
    return 'e.g., 120/80 (68 bpm). Normal = 60 to 100 bpm';
  }
  return 'e.g., 125 or 120/80';
});

function getCustomMarkerName() {
  if (!newCustomMarker.value.marker_name) return '';
  if (newCustomMarker.value.marker_name === 'Other') {
    if (newCustomMarker.value.custom_marker_choice === 'Other') {
      return (newCustomMarker.value.custom_name || '').trim();
    }
    if (newCustomMarker.value.custom_marker_choice) {
      return String(newCustomMarker.value.custom_marker_choice).trim();
    }
    return '';
  }
  return newCustomMarker.value.marker_name.trim();
}

watch(
  () => newCustomMarker.value.marker_name,
  (nextName) => {
    if (!nextName || nextName === 'Other') {
      if (nextName === 'Other') {
        newCustomMarker.value.custom_marker_choice = newCustomMarker.value.custom_marker_choice || '';
        newCustomMarker.value.custom_name = newCustomMarker.value.custom_name || '';
      }
      return;
    }
    const selected = getMarkerDefinitionByName(nextName);
    if (selected?.unit && !newCustomMarker.value.unit) {
      newCustomMarker.value.unit = selected.unit;
    }
  }
);

function getMarkerStatus(marker) {
  if (!marker) return 'Unknown';
  if (!marker.marker_name || !marker.marker_result) return 'Unknown';

  try {
    const markerDefinition = getMarkerDefinitionByName(marker.marker_name);
    const resultStatus = getResultStatus(markerDefinition || marker.marker_name, marker.marker_result);
    return resultStatus?.title || marker.status || 'Unknown';
  } catch (error) {
    return marker.status || 'Unknown';
  }
}

function syncMarkerStatus(marker) {
  if (!marker) return;
  const markerDefinition = getMarkerDefinitionByName(marker.marker_name);
  const resultStatus = getResultStatus(markerDefinition || marker.marker_name, marker.marker_result);
  marker.status = resultStatus?.title || marker.status || 'Unknown';
}

function getStatusClass(status) {
  if (!status) return 'status-unknown';
  const lower = String(status).toLowerCase();
  if (lower === 'normal') return 'status-normal';
  if (lower.includes('borderline') || lower.includes('elevated')) return 'status-borderline';
  if (lower.includes('stage 1 high') || lower.includes('stage 2 high') || lower === 'high' || lower === 'low') return 'status-warning';
  if (lower.includes('crisis') || lower.includes('critical')) return 'status-critical';
  return 'status-unknown';
}

async function addCustomMarker() {
  const chosenMarkerName = getCustomMarkerName();

  if (!chosenMarkerName || !newCustomMarker.value.marker_result) {
    alert('Please choose a marker and enter a result before adding it to the panel.');
    return;
  }

  const alreadyExists = (currentMarkers.value || []).some(marker => {
    return marker && marker.marker_name && normalizeMarkerName(marker.marker_name) === normalizeMarkerName(chosenMarkerName);
  });

  if (alreadyExists) {
    alert(`${chosenMarkerName} is already in this panel.`);
    return;
  }

  try {
    const selectedMarker = getMarkerDefinitionByName(chosenMarkerName);
    const status = getResultStatus(selectedMarker || chosenMarkerName, newCustomMarker.value.marker_result)?.title || 'Unknown';
    const payload = {
      marker_name: chosenMarkerName,
      marker_date: formData.value.test_date,
      marker_result: newCustomMarker.value.marker_result,
      unit: newCustomMarker.value.unit || selectedMarker?.unit || '',
      lab_name: formData.value.lab_name || '',
      doctor_name: formData.value.doctor_name || '',
      notes: formData.value.notes || '',
      marker_facts: selectedMarker?.description || '',
      health_marker_panel_id: route.params.id,
      status
    };

    const response = await EventService.postHealthMarker(payload);
    const createdMarker = response.data || payload;
    currentMarkers.value.push({
      ...createdMarker,
      marker_name: createdMarker.marker_name || chosenMarkerName,
      marker_result: createdMarker.marker_result || newCustomMarker.value.marker_result,
      unit: createdMarker.unit || newCustomMarker.value.unit || selectedMarker?.unit || '',
      status: createdMarker.status || status,
      lab_name: createdMarker.lab_name || formData.value.lab_name || '',
      doctor_name: createdMarker.doctor_name || formData.value.doctor_name || '',
      marker_facts: createdMarker.marker_facts || selectedMarker?.description || '',
      health_marker_panel_id: route.params.id
    });

    newCustomMarker.value = { marker_name: '', custom_marker_choice: '', custom_name: '', marker_result: '', unit: '' };
  } catch (error) {
    console.error('❌ Add custom marker error:', error);
    alert('Failed to create unique panel marker.');
  }
}

async function addMarker(marker) {
  try {
    await EventService.putHealthMarker({
      id: marker.id,
      health_marker_panel_id: route.params.id,
      marker_date: formData.value.test_date,
      marker_result: marker.marker_result || '',
      unit: marker.unit || '',
      status: marker.status || 'Unknown'
    });

    // Move marker from available to current
    availableMarkers.value = availableMarkers.value.filter(m => m.id !== marker.id);
    currentMarkers.value.push({ ...marker, marker_date: formData.value.test_date });
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
      health_marker_panel_id: null,
      marker_date: marker.marker_date || formData.value.test_date,
      marker_result: marker.marker_result || '',
      unit: marker.unit || '',
      status: marker.status || 'Unknown'
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
      const createdPanelId = response.data?.id;

      for (const marker of currentMarkers.value) {
        if (!marker || !marker.marker_name) continue;

        if (marker.id) {
          await EventService.putHealthMarker({
            id: marker.id,
            marker_name: marker.marker_name,
            marker_date: formData.value.test_date,
            marker_result: marker.marker_result || '',
            unit: marker.unit || '',
            status: getMarkerStatus(marker),
            health_marker_panel_id: createdPanelId || null
          });
        } else {
          await EventService.postHealthMarker({
            marker_name: marker.marker_name,
            marker_date: marker.marker_date || formData.value.test_date,
            marker_result: marker.marker_result || '',
            unit: marker.unit || '',
            lab_name: marker.lab_name || formData.value.lab_name || '',
            doctor_name: marker.doctor_name || formData.value.doctor_name || '',
            notes: marker.notes || formData.value.notes || '',
            status: marker.status || getMarkerStatus(marker),
            health_marker_panel_id: createdPanelId || null
          });
        }
      }
      
      await confirmDialogue.value.show({
        title: "Panel Created",
        message: "Panel has been created successfully.",
        okButton: "OK",
        cancelButton: null
      });

      router.push({ 
        name: 'HealthMarkerPanelDetails', 
        params: { id: createdPanelId } 
      });
    } else {
      for (const marker of currentMarkers.value) {
        if (!marker || !marker.id) continue;
        await EventService.putHealthMarker({
          id: marker.id,
          marker_name: marker.marker_name,
          marker_date: formData.value.test_date,
          marker_result: marker.marker_result || '',
          unit: marker.unit || '',
          status: getMarkerStatus(marker),
          health_marker_panel_id: route.params.id || null
        });
      }

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
    const routeMarkerPreset = getRouteMarkerPreset();

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
      const defaultDate = today.toISOString().split('T')[0];
      formData.value.test_date = routeMarkerPreset?.marker_date || defaultDate;

      if (routeMarkerPreset) {
        formData.value.panel_name = '';
        formData.value.lab_name = routeMarkerPreset.lab_name || '';
        formData.value.doctor_name = routeMarkerPreset.doctor_name || '';
        formData.value.notes = routeMarkerPreset.notes || '';

        currentMarkers.value = [{
          id: null,
          marker_name: routeMarkerPreset.marker_name,
          marker_date: routeMarkerPreset.marker_date || defaultDate,
          marker_result: routeMarkerPreset.marker_result || '',
          unit: routeMarkerPreset.unit || '',
          lab_name: routeMarkerPreset.lab_name || '',
          doctor_name: routeMarkerPreset.doctor_name || '',
          notes: routeMarkerPreset.notes || '',
          status: routeMarkerPreset.status || 'Unknown',
          health_marker_panel_id: null
        }];
      } else {
        currentMarkers.value = [];
      }
    }

    const panelsResponse = await EventService.getHealthMarkerPanels();
    allPanels.value = panelsResponse.data || [];

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
  markerDefinitionStore.fetchDefinitions();
  fetchData();
});
</script>

<style scoped>
@import '@/assets/styles/health/health-shared.css';

.panel-edit-wrapper {
  width: 100%;
  min-height: 100vh;
}

.panel-edit-wrapper .page-container {
  width: min(1000px, calc(100% - 2rem));
  max-width: none;
  margin-left: auto;
  margin-right: auto;
}

.page-wrapper {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 2rem;
}

.panel-edit-wrapper .page-wrapper.gradient-health {
  background: linear-gradient(135deg, #00695c 0%, #00796b 55%, #00897b 100%);
  min-height: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.panel-edit-wrapper .page-header {
  margin-bottom: 0;
}

.panel-edit-wrapper .page-header h1 {
  font-size: 1.25rem;
  line-height: 1.35;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  font-size: 1rem;
  opacity: 0.6;
  margin: 0 0.25rem;
}

.content-wrapper {
  padding: 2rem 0;
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

.marker-association-note {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
}

.marker-association-note i {
  color: #667eea;
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
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
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
    flex-wrap: wrap;
  }

  .marker-remove-button {
    align-self: center;
    width: .5rem;
  }
  .marker-status {
    font-weight: bold;
  }
  .marker-name-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    flex: 1 1 auto;
  }

  .marker-definition-description {
    display: block;
    width: fit-content;
    max-width: 100%;
    color: #6b7280;
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .inline-input,
  .inline-unit {
    max-width: 120px;
    min-width: 90px;
    padding: 0.5rem 0.65rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
  }

  .inline-unit {
    max-width: 90px;
  }

  .marker-name {
    font-weight: 600;
    color: #1f2937;
    flex-shrink: 0;
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
  justify-content: center;
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
