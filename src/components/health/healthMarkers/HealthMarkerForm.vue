<template>
  <div class="health-marker-form">
    <div class="card">
      <!-- ✅ CARD HEADER -->
      <div class="card-header">
        <h2 class="card-title">
          <i :class="getTitleIcon()" class="icon-health"></i>
          {{ getTitle() }}
        </h2>
      </div>

      <!-- ✅ CARD BODY -->
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- ✅ MARKER SELECTION -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-vial"></i>
              Marker Information
            </h3>

            <div class="form-row">
              <!-- Marker Name Dropdown (or display) -->
              <div class="form-group">
                <label for="marker_name" class="form-label required">
                  <i class="fas fa-tag"></i>
                  <u>Health Marker</u>
                </label>
                <select
                  v-if="!isCustomMarker"
                  id="marker_name"
                  v-model="form.marker_name"
                  class="form-control"
                  required
                  @change="onMarkerChange"
                >
                  <option value="">Select a health marker...</option>
                  <option
                    v-for="marker in availableMarkers"
                    :key="marker.name"
                    :value="marker.name"
                  >
                    {{ marker.label }}
                  </option>
                  <option value="__CUSTOM__">+ Custom Marker (Enter your own)</option>
                </select>
                <input
                  v-else
                  id="custom_marker_name"
                  v-model="customMarkerName"
                  type="text"
                  class="form-control"
                  placeholder="Enter custom marker name..."
                  required
                />
                <small v-if="selectedMarkerInfo && !isCustomMarker" class="form-text">
                  {{ selectedMarkerInfo.description }}
                </small>
                <small v-if="isCustomMarker" class="form-text">
                  <a href="#" @click.prevent="isCustomMarker = false; form.marker_name = ''; customMarkerName = ''" class="text-link">
                    ← Back to predefined markers
                  </a>
                </small>
              </div>

              <!-- Test Date -->
              <div class="form-group">
                <label for="marker_date" class="form-label required">
                  <i class="fas fa-calendar-alt"></i>
                  <u>Test Date</u>  
                </label>
                <input
                  id="marker_date"
                  v-model="form.marker_date"
                  type="date"
                  class="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <!-- ✅ TEST RESULTS -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-chart-line"></i>
              Test Results
            </h3>

            <div class="form-row">
              <!-- Marker Result -->
              <div class="form-group">
                <label for="marker_result" class="form-label required">
                  <i class="fas fa-tachometer-alt"></i>
                  Result Value
                </label>
                <input
                  id="marker_result"
                  v-model="form.marker_result"
                  type="text"
                  class="form-control"
                  :placeholder="resultValuePlaceholder"
                  required
                  @input="calculateStatus"
                />
                <small v-if="isBloodPressureMarker" class="form-text">
                  Format: 120/80. Optional pulse: 120/80 (68 bpm). Normal: 60 to 100 bpm
                </small>
              </div>

              <!-- Unit -->
              <div class="form-group">
                <label for="unit" class="form-label">
                  <i class="fas fa-ruler"></i>
                  Unit
                </label>
                <input
                  id="unit"
                  v-model="form.unit"
                  type="text"
                  class="form-control"
                  :placeholder="selectedMarkerInfo?.unit || 'e.g., mg/dL, %, mIU/L'"
                />
                <small v-if="selectedMarkerInfo?.unit" class="form-text">
                  Standard unit: {{ selectedMarkerInfo.unit }}
                </small>
              </div>
            </div>

            <!-- ✅ INTELLIGENT STATUS DISPLAY -->
            <div v-if="intelligentStatus" class="status-display" :class="`status-${intelligentStatus.type}`">
              <div class="status-icon">
                <i :class="getStatusIcon(intelligentStatus.type)"></i>
              </div>
              <div class="status-content">
                <strong>{{ intelligentStatus.title }}</strong>
                <p>{{ intelligentStatus.message }}</p>
                <div v-if="intelligentStatus.range" class="status-range">
                  <i class="fas fa-arrows-alt-h"></i>
                  Range: {{ intelligentStatus.range }}
                </div>
              </div>
            </div>

            <div v-if="!isBloodPressureMarker" class="form-row">
              <!-- Normal Range Low -->
              <div class="form-group">
                <label for="normal_range_low" class="form-label">
                  <i class="fas fa-arrow-down"></i>
                  Normal Range (Low)
                </label>
                <input
                  id="normal_range_low"
                  v-model="form.normal_range_low"
                  type="text"
                  class="form-control"
                  placeholder="Lower bound"
                />
              </div>

              <!-- Normal Range High -->
              <div class="form-group">
                <label for="normal_range_high" class="form-label">
                  <i class="fas fa-arrow-up"></i>
                  Normal Range (High)
                </label>
                <input
                  id="normal_range_high"
                  v-model="form.normal_range_high"
                  type="text"
                  class="form-control"
                  placeholder="Upper bound"
                />
              </div>
            </div>

            <!-- Status (Auto-filled but editable) -->
            <div class="form-group">
              <label for="status" class="form-label">
                <i class="fas fa-info-circle"></i>
                Status
              </label>
              <input
                id="status"
                v-model="form.status"
                type="text"
                class="form-control"
                placeholder="e.g., Normal, High, Low"
              />
              <small class="form-text">
                Auto-calculated based on result and ranges, but you can override
              </small>
            </div>
          </div>

          <!-- ✅ LABORATORY & PROVIDER -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-hospital"></i>
              Laboratory & Provider
            </h3>

            <div class="form-row">
              <!-- Lab Name -->
              <div class="form-group">
                <label for="lab_name" class="form-label">
                  <i class="fas fa-flask"></i>
                  Laboratory Name
                </label>
                <input
                  id="lab_name"
                  v-model="form.lab_name"
                  type="text"
                  class="form-control"
                  placeholder="e.g., Quest Diagnostics"
                />
              </div>

              <!-- Doctor Name -->
              <div class="form-group">
                <label for="doctor_name" class="form-label">
                  <i class="fas fa-user-md"></i>
                  Doctor Name
                </label>
                <input
                  id="doctor_name"
                  v-model="form.doctor_name"
                  type="text"
                  class="form-control"
                  placeholder="e.g., Dr. Smith"
                />
              </div>
            </div>
          </div>

          <!-- ✅ PANEL ASSOCIATION -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-layer-group"></i>
              Panel Association
            </h3>

            <div class="form-row">
              <!-- Panel Selection -->
              <div class="form-group full-width">
                <label for="health_marker_panel_id" class="form-label">
                  <i class="fas fa-folder"></i>
                  Health Marker Panel
                </label>
                <select
                  id="health_marker_panel_id"
                  v-model="form.health_marker_panel_id"
                  class="form-control"
                >
                  <option :value="null">None (Standalone Marker)</option>
                  <option
                    v-for="panel in panels"
                    :key="panel.id"
                    :value="panel.id"
                  >
                    {{ panel.panel_name }} - {{ formatDate(panel.test_date) }}
                  </option>
                </select>
                <small class="form-text">
                  Associate this marker with a panel, or leave as standalone
                </small>
              </div>
            </div>
          </div>

          <!-- ✅ NOTES & FACTS -->
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-sticky-note"></i>
              Additional Information
            </h3>

            <!-- Marker Facts -->
            <div class="form-group">
              <label for="marker_facts" class="form-label">
                <i class="fas fa-lightbulb"></i>
                Marker Facts
              </label>
              <textarea
                id="marker_facts"
                v-model="form.marker_facts"
                class="form-control"
                rows="3"
                placeholder="Educational information about this marker..."
              ></textarea>
              <small class="form-text">
                General information about what this marker measures
              </small>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label for="notes" class="form-label">
                <i class="fas fa-comment"></i>
                Personal Notes
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                class="form-control"
                rows="4"
                placeholder="Your personal notes about this test..."
              ></textarea>
              <small class="form-text">
                Your personal observations or notes about this specific test
              </small>
            </div>

            <!-- Trends Image -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-chart-line"></i>
                Trends Image
              </label>
              <input
                type="file"
                accept="image/png,image/gif"
                class="form-control"
                @change="handleTrendsImageChange"
              />
              <small class="form-text">
                Upload a PNG or GIF trends snapshot from your patient portal (max 3 MB)
              </small>
              <div v-if="form.trends_image" class="trends-image-preview">
                <img :src="form.trends_image" :alt="form.trends_image_filename || 'Trends image'" />
                <button type="button" class="btn btn-secondary btn-sm" @click="removeTrendsImage">
                  <i class="fas fa-trash"></i>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- ✅ ERROR MESSAGE -->
          <div v-if="errorMessage" class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <!-- ✅ FORM ACTIONS -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary btn-lg"
              :disabled="isSubmitting"
            >
              <i :class="isSubmitting ? 'fas fa-spinner fa-spin' : (mode === 'edit' ? 'fas fa-save' : 'fas fa-plus-circle')"></i>
              {{ isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update Marker' : 'Create Marker') }}
            </button>

            <button
              type="button"
              class="btn btn-secondary btn-lg"
              @click="handleCancel"
              :disabled="isSubmitting"
            >
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { getResultStatus } from '@/services/health-marker-constants';
import { useMarkerDefinitionStore } from '@/stores/health/MarkerDefinitionStore';
import EventService from '@/services/EventService';

// ✅ ROUTER & STORE
const markerDefinitionStore = useMarkerDefinitionStore();

// ✅ PROPS
const props = defineProps({
  healthMarker: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
});

// ✅ EMITS
const emit = defineEmits(['submit', 'cancel']);

// ✅ REFS
const form = ref({
  marker_name: '',
  marker_date: '',
  marker_result: '',
  unit: '',
  normal_range_low: '',
  normal_range_high: '',
  status: '',
  marker_facts: '',
  notes: '',
  lab_name: '',
  doctor_name: '',
  health_marker_panel_id: null,
  trends_image: '',
  trends_image_filename: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const panels = ref([]);
const isCustomMarker = ref(false);
const customMarkerName = ref('');

// ✅ COMPUTED
const availableMarkers = computed(() => markerDefinitionStore.allDefinitions);

const selectedMarkerInfo = computed(() => {
  if (!form.value.marker_name) return null;
  return markerDefinitionStore.getDefinitionByName(form.value.marker_name);
});

const isBloodPressureMarker = computed(() => {
  const markerName = String(form.value.marker_name || '').toLowerCase();
  const markerDef = selectedMarkerInfo.value;
  const defName = String(markerDef?.name || '').toLowerCase();
  const defLabel = String(markerDef?.label || '').toLowerCase();
  const combined = `${markerName} ${defName} ${defLabel}`;

  return (
    combined.includes('blood pressure') ||
    combined.includes('blood_pressure') ||
    combined.includes('systolic') ||
    combined.includes('diastolic')
  );
});

const intelligentStatus = computed(() => {
  if (!form.value.marker_name || !form.value.marker_result) return null;
  const markerDef = selectedMarkerInfo.value;
  if (!markerDef) return null;
  return getResultStatus(markerDef, form.value.marker_result);
});

const resultValuePlaceholder = computed(() => {
  if (isBloodPressureMarker.value) {
    return 'e.g., 120/80 (68 bpm). Normal = 60 to 100 bpm';
  }
  return 'Enter test result';
});

// ✅ METHODS
function getTitleIcon() {
  if (props.mode === 'edit') return 'fas fa-edit';
  return 'fas fa-plus-circle';
}

function getTitle() {
  if (props.mode === 'edit') return 'Edit Health Marker';
  return 'New Health Marker';
}

function onMarkerChange() {
  if (form.value.marker_name === '__CUSTOM__') {
    isCustomMarker.value = true;
    form.value.marker_name = '';
    customMarkerName.value = '';
    return;
  }
  
  const markerInfo = selectedMarkerInfo.value;
  if (markerInfo) {
    // Auto-fill unit if not already set
    if (!form.value.unit) {
      form.value.unit = markerInfo.unit || '';
    }
    // Auto-fill marker facts if not already set
    if (!form.value.marker_facts) {
      form.value.marker_facts = markerInfo.description || '';
    }
    // Auto-fill normal range if not already set
    if (!form.value.normal_range_low) {
      form.value.normal_range_low = markerInfo.normal_range_low || '';
    }
    if (!form.value.normal_range_high) {
      form.value.normal_range_high = markerInfo.normal_range_high || '';
    }
  }
  
  // Recalculate status
  calculateStatus();
}

function deriveStatusTitle() {
  if (!form.value.marker_name || !form.value.marker_result) return null;

  const markerDef = selectedMarkerInfo.value;
  if (!markerDef) return null;

  const status = getResultStatus(markerDef, form.value.marker_result);
  return status?.title || null;
}

function calculateStatus() {
  if (!form.value.marker_name || !form.value.marker_result) {
    form.value.status = '';
    return;
  }

  // Get the marker definition from the store (includes database definitions)
  const markerDef = selectedMarkerInfo.value;
  if (!markerDef) {
    console.warn('No marker definition found for:', form.value.marker_name);
    form.value.status = '';
    return;
  }

  const derivedTitle = deriveStatusTitle();
  if (derivedTitle) {
    form.value.status = derivedTitle;
  }
}

function getStatusIcon(type) {
  const iconMap = {
    'success': 'fas fa-check-circle',
    'warning': 'fas fa-exclamation-triangle',
    'error': 'fas fa-exclamation-circle',
    'info': 'fas fa-info-circle'
  };
  return iconMap[type] || 'fas fa-info-circle';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.log('Date format error:', error);
    return dateString;
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return;

  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    // Keep DB status in sync with the computed status card when status is blank.
    const derivedStatus = deriveStatusTitle();
    if (derivedStatus && (!form.value.status || form.value.status === 'Result Recorded')) {
      form.value.status = derivedStatus;
    }

    // Prepare form data
    const formData = {
      marker_name: isCustomMarker.value ? customMarkerName.value : form.value.marker_name,
      marker_date: form.value.marker_date,
      marker_result: form.value.marker_result,
      unit: form.value.unit || null,
      normal_range_low: isBloodPressureMarker.value ? null : (form.value.normal_range_low || null),
      normal_range_high: isBloodPressureMarker.value ? null : (form.value.normal_range_high || null),
      status: derivedStatus || form.value.status || null,
      marker_facts: form.value.marker_facts || null,
      notes: form.value.notes || null,
      lab_name: form.value.lab_name || null,
      doctor_name: form.value.doctor_name || null,
      health_marker_panel_id: form.value.health_marker_panel_id || null,
      trends_image: form.value.trends_image || null,
      trends_image_filename: form.value.trends_image_filename || null
    };

    // Emit to parent
    await emit('submit', formData);
    await syncMarkerDefinition(formData);
  } catch (error) {
    console.error('❌ Form submission error:', error);
    errorMessage.value = error.message || 'Failed to save health marker. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  emit('cancel');
}

const MAX_TRENDS_IMAGE_BYTES = 3 * 1024 * 1024;

function handleTrendsImageChange(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;

  if (file.size > MAX_TRENDS_IMAGE_BYTES) {
    alert('Trends image must be 3 MB or smaller.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.value.trends_image = reader.result;
    form.value.trends_image_filename = file.name;
  };
  reader.onerror = () => {
    alert('Failed to read the selected image. Please try again.');
  };
  reader.readAsDataURL(file);
}

function removeTrendsImage() {
  form.value.trends_image = '';
  form.value.trends_image_filename = '';
}

// Auto-create/fill a custom marker definition so status can be calculated going forward.
async function syncMarkerDefinition(payload) {
  const markerName = String(payload.marker_name || '').trim();
  if (!markerName) return;

  try {
    const existing = markerDefinitionStore.getDefinitionByName(markerName);
    if (existing?.is_global) return;

    const hasRangeData = Boolean(payload.normal_range_low || payload.normal_range_high || payload.unit || payload.marker_facts);

    if (!existing) {
      if (!hasRangeData) return;
      await markerDefinitionStore.createDefinition({
        name: markerName,
        label: markerName,
        unit: payload.unit || '',
        normal_range_low: payload.normal_range_low || '',
        normal_range_high: payload.normal_range_high || '',
        description: payload.marker_facts || '',
        category: 'Other',
        icon: 'mdi-test-tube'
      });
    } else if (hasRangeData) {
      const needsUpdate =
        (!existing.normal_range_low && payload.normal_range_low) ||
        (!existing.normal_range_high && payload.normal_range_high) ||
        (!existing.unit && payload.unit) ||
        (!existing.description && payload.marker_facts);

      if (needsUpdate) {
        await markerDefinitionStore.updateDefinition({
          id: existing.id,
          name: existing.name,
          label: existing.label,
          unit: existing.unit || payload.unit || '',
          normal_range_low: existing.normal_range_low || payload.normal_range_low || '',
          normal_range_high: existing.normal_range_high || payload.normal_range_high || '',
          borderline_range_low: existing.borderline_range_low || '',
          borderline_range_high: existing.borderline_range_high || '',
          description: existing.description || payload.marker_facts || '',
          test_frequency: existing.test_frequency || '',
          category: existing.category || 'Other',
          icon: existing.icon || 'mdi-test-tube'
        });
      }
    }

    await markerDefinitionStore.fetchDefinitions();
  } catch (error) {
    console.error('⚠️ Failed to sync marker definition:', error);
  }
}

function initializeForm() {
  if (props.healthMarker) {
    // Edit/View mode - populate form with existing data
    const markerName = props.healthMarker.marker_name || '';
    const isKnownMarker = markerDefinitionStore.getDefinitionByName(markerName) !== undefined;
    
    if (!isKnownMarker && markerName) {
      isCustomMarker.value = true;
      customMarkerName.value = markerName;
    }
    
    form.value = {
      marker_name: isKnownMarker ? markerName : '',
      marker_date: props.healthMarker.marker_date || '',
      marker_result: props.healthMarker.marker_result || '',
      unit: props.healthMarker.unit || '',
      normal_range_low: props.healthMarker.normal_range_low || '',
      normal_range_high: props.healthMarker.normal_range_high || '',
      status: props.healthMarker.status || '',
      marker_facts: props.healthMarker.marker_facts || '',
      notes: props.healthMarker.notes || '',
      lab_name: props.healthMarker.lab_name || '',
      doctor_name: props.healthMarker.doctor_name || '',
      health_marker_panel_id: props.healthMarker.health_marker_panel_id || null,
      trends_image: props.healthMarker.trends_image || '',
      trends_image_filename: props.healthMarker.trends_image_filename || ''
    };
  } else if (props.mode === 'create') {
    // Create mode - set default date to today
    const today = new Date().toISOString().split('T')[0];
    form.value.marker_date = today;
  }

  if (!form.value.status || form.value.status === 'Result Recorded') {
    const derivedStatus = deriveStatusTitle();
    if (derivedStatus) {
      form.value.status = derivedStatus;
    }
  }
}

async function fetchPanels() {
  try {
    const response = await EventService.getHealthMarkerPanels();
    panels.value = response.data || [];
  } catch (error) {
    console.error('Error fetching panels:', error);
    panels.value = [];
  }
}

// ✅ WATCHERS
watch(() => props.healthMarker, () => {
  initializeForm();
}, { immediate: true, deep: true });

watch(intelligentStatus, (status) => {
  if (!status || !status.title) return;
  if (!form.value.status || form.value.status === 'Result Recorded') {
    form.value.status = status.title;
  }
});

// ✅ LIFECYCLE
onMounted(() => {
  markerDefinitionStore.fetchDefinitions();
  initializeForm();
  fetchPanels();
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-form {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* Form sections */
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 1.5rem 0;
}

/* Form rows */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 1.25rem;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-label i {
  color: #667eea;
  font-size: 0.875rem;
}

.form-control {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

select.form-control {
  cursor: pointer;
}

.trends-image-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.trends-image-preview img {
  max-width: 160px;
  max-height: 120px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  object-fit: contain;
}

.form-text {
  font-size: 0.8125rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.text-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.text-link:hover {
  color: #5568d3;
  text-decoration: underline;
}

/* Status display */
.status-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border-left: 4px solid;
}

.status-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.status-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.status-content strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.status-content p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.status-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Status variants */
.status-success {
  background: #f0fdf4;
  border-color: #10b981;
}

.status-success .status-icon {
  background: #10b981;
  color: white;
}

.status-success strong {
  color: #065f46;
}

.status-success p {
  color: #047857;
}

.status-warning {
  background: #fffbeb;
  border-color: #f59e0b;
}

.status-warning .status-icon {
  background: #f59e0b;
  color: white;
}

.status-warning strong {
  color: #92400e;
}

.status-warning p {
  color: #b45309;
}

.status-error {
  background: #fef2f2;
  border-color: #ef4444;
}

.status-error .status-icon {
  background: #ef4444;
  color: white;
}

.status-error strong {
  color: #991b1b;
}

.status-error p {
  color: #dc2626;
}

.status-info {
  background: #eff6ff;
  border-color: #3b82f6;
}

.status-info .status-icon {
  background: #3b82f6;
  color: white;
}

.status-info strong {
  color: #1e3a8a;
}

.status-info p {
  color: #2563eb;
}

/* Alert */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-danger {
  background: #fef2f2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

.alert-danger i {
  color: #ef4444;
  font-size: 1.25rem;
}

/* Form actions */
.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn-lg {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .status-display {
    flex-direction: column;
    text-align: center;
  }

  .status-icon {
    margin: 0 auto;
  }
}
</style>