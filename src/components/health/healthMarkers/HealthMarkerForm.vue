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
                <label for="marker_name" class="form-label" :class="{ required: isEditable }">
                  <i class="fas fa-tag"></i>
                  <u>Health Marker</u>
                </label>
                <select
                  v-if="isEditable"
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
                </select>
                <div v-else class="form-control-static">
                  {{ selectedMarkerInfo?.label || form.marker_name }}
                </div>
                <small v-if="selectedMarkerInfo && isEditable" class="form-text">
                  {{ selectedMarkerInfo.description }}
                </small>
              </div>

              <!-- Test Date (editable or display) -->
              <div class="form-group">
                <label for="marker_date" class="form-label" :class="{ required: isEditable }">
                  <i class="fas fa-calendar-alt"></i>
                  <u>Test Date</u>  
                </label>
                <input
                  v-if="isEditable"
                  id="marker_date"
                  v-model="form.marker_date"
                  type="date"
                  class="form-control"
                  required
                />
                <div v-else class="form-control-static">
                  {{ formatDate(form.marker_date) }}
                </div>
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
                <label for="marker_result" class="form-label" :class="{ required: isEditable }">
                  <i class="fas fa-tachometer-alt"></i>
                  Result Value
                </label>
                <input
                  v-if="isEditable"
                  id="marker_result"
                  v-model="form.marker_result"
                  type="text"
                  class="form-control"
                  placeholder="Enter test result"
                  required
                  @input="calculateStatus"
                />
                <div v-else class="form-control-static result-display">
                  <span class="result-value">{{ form.marker_result }}</span>
                  <span v-if="form.unit" class="result-unit">{{ form.unit }}</span>
                </div>
              </div>

              <!-- Unit -->
              <div class="form-group">
                <label for="unit" class="form-label">
                  <i class="fas fa-ruler"></i>
                  Unit
                </label>
                <input
                  v-if="isEditable"
                  id="unit"
                  v-model="form.unit"
                  type="text"
                  class="form-control"
                  :placeholder="selectedMarkerInfo?.unit || 'e.g., mg/dL, %, mIU/L'"
                />
                <div v-else class="form-control-static">
                  {{ form.unit || '-' }}
                </div>
                <small v-if="selectedMarkerInfo?.unit && isEditable" class="form-text">
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

            <!-- ✅ MARKER DESCRIPTION (VIEW MODE ONLY) -->
            <div v-if="mode === 'view' && selectedMarkerInfo?.description" class="info-box">
              <div class="info-box-header">
                <i class="fas fa-info-circle"></i>
                <h4>About {{ selectedMarkerInfo.label }}</h4>
              </div>
              <p>{{ selectedMarkerInfo.description }}</p>
              <div v-if="selectedMarkerInfo.testFrequency" class="info-box-footer">
                <i class="fas fa-calendar-check"></i>
                <span>Recommended frequency: {{ selectedMarkerInfo.testFrequency }}</span>
              </div>
            </div>

            <div class="form-row">
              <!-- Normal Range Low -->
              <div class="form-group">
                <label for="normal_range_low" class="form-label">
                  <i class="fas fa-arrow-down"></i>
                  Normal Range (Low)
                </label>
                <input
                  v-if="isEditable"
                  id="normal_range_low"
                  v-model="form.normal_range_low"
                  type="text"
                  class="form-control"
                  placeholder="Lower bound"
                />
                <div v-else class="form-control-static">
                  {{ form.normal_range_low || '-' }}
                </div>
              </div>

              <!-- Normal Range High -->
              <div class="form-group">
                <label for="normal_range_high" class="form-label">
                  <i class="fas fa-arrow-up"></i>
                  Normal Range (High)
                </label>
                <input
                  v-if="isEditable"
                  id="normal_range_high"
                  v-model="form.normal_range_high"
                  type="text"
                  class="form-control"
                  placeholder="Upper bound"
                />
                <div v-else class="form-control-static">
                  {{ form.normal_range_high || '-' }}
                </div>
              </div>
            </div>

            <!-- Status (Auto-filled but editable or display) -->
            <div class="form-group">
              <label for="status" class="form-label">
                <i class="fas fa-info-circle"></i>
                Status
              </label>
              <input
                v-if="isEditable"
                id="status"
                v-model="form.status"
                type="text"
                class="form-control"
                placeholder="e.g., Normal, High, Low"
              />
              <div v-else class="form-control-static">
                <span :class="['badge', 'badge-lg', getStatusBadgeClass()]">
                  {{ form.status || 'Unknown' }}
                </span>
              </div>
              <small v-if="isEditable" class="form-text">
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
                  v-if="isEditable"
                  id="lab_name"
                  v-model="form.lab_name"
                  type="text"
                  class="form-control"
                  placeholder="e.g., Quest Diagnostics"
                />
                <div v-else class="form-control-static">
                  {{ form.lab_name || '-' }}
                </div>
              </div>

              <!-- Doctor Name -->
              <div class="form-group">
                <label for="doctor_name" class="form-label">
                  <i class="fas fa-user-md"></i>
                  Doctor Name
                </label>
                <input
                  v-if="isEditable"
                  id="doctor_name"
                  v-model="form.doctor_name"
                  type="text"
                  class="form-control"
                  placeholder="e.g., Dr. Smith"
                />
                <div v-else class="form-control-static">
                  {{ form.doctor_name || '-' }}
                </div>
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
                v-if="isEditable"
                id="marker_facts"
                v-model="form.marker_facts"
                class="form-control"
                rows="3"
                placeholder="Educational information about this marker..."
              ></textarea>
              <div v-else-if="form.marker_facts" class="form-control-static facts-display">
                {{ form.marker_facts }}
              </div>
              <div v-else class="form-control-static text-muted">
                No marker facts recorded
              </div>
              <small v-if="isEditable" class="form-text">
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
                v-if="isEditable"
                id="notes"
                v-model="form.notes"
                class="form-control"
                rows="4"
                placeholder="Your personal notes about this test..."
              ></textarea>
              <div v-else-if="form.notes" class="form-control-static notes-display">
                {{ form.notes }}
              </div>
              <div v-else class="form-control-static text-muted">
                No personal notes recorded
              </div>
              <small v-if="isEditable" class="form-text">
                Your personal observations or notes about this specific test
              </small>
            </div>
          </div>

          <!-- ✅ METADATA (VIEW MODE ONLY) -->
          <div v-if="mode === 'view' && (healthMarker?.created_at || healthMarker?.updated_at)" class="form-section">
            <h3 class="section-title">
              <i class="fas fa-clock"></i>
              Record Information
            </h3>
            <div class="metadata-grid">
              <div v-if="healthMarker.created_at" class="metadata-item">
                <i class="fas fa-plus-circle"></i>
                <span>Created: {{ formatDateTime(healthMarker.created_at) }}</span>
              </div>
              <div v-if="healthMarker.updated_at" class="metadata-item">
                <i class="fas fa-sync"></i>
                <span>Updated: {{ formatDateTime(healthMarker.updated_at) }}</span>
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
            <!-- EDIT/CREATE MODE BUTTONS -->
            <template v-if="isEditable">
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
            </template>

            <!-- VIEW MODE BUTTONS -->
            <template v-else>
              <router-link
                :to="{ name: 'HealthMarkerEdit', params: { id: healthMarker.id } }"
                class="btn btn-primary btn-lg"
              >
                <i class="fas fa-edit"></i>
                Edit Marker
              </router-link>

              <button
                type="button"
                class="btn btn-danger btn-lg"
                @click="$emit('delete', healthMarker)"
              >
                <i class="fas fa-trash"></i>
                Delete Marker
              </button>

              <router-link
                :to="{ name: 'HealthMarkers' }"
                class="btn btn-secondary btn-lg"
              >
                <i class="fas fa-arrow-left"></i>
                Back to List
              </router-link>
            </template>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { HEALTH_MARKERS, getHealthMarkerByName, getResultStatus } from '@/services/health-marker-constants';

// ✅ PROPS
const props = defineProps({
  healthMarker: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['view', 'create', 'edit'].includes(value)
  }
});

// ✅ EMITS
const emit = defineEmits(['submit', 'cancel', 'delete']);

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
  doctor_name: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');

// ✅ COMPUTED
const isEditable = computed(() => props.mode === 'create' || props.mode === 'edit');

const availableMarkers = computed(() => HEALTH_MARKERS);

const selectedMarkerInfo = computed(() => {
  if (!form.value.marker_name) return null;
  return getHealthMarkerByName(form.value.marker_name);
});

const intelligentStatus = computed(() => {
  if (!form.value.marker_name || !form.value.marker_result) return null;
  return getResultStatus(form.value.marker_name, form.value.marker_result);
});

// ✅ METHODS
function getTitleIcon() {
  if (props.mode === 'view') return 'fas fa-eye';
  if (props.mode === 'edit') return 'fas fa-edit';
  return 'fas fa-plus-circle';
}

function getTitle() {
  if (props.mode === 'view') return 'Health Marker Details';
  if (props.mode === 'edit') return 'Edit Health Marker';
  return 'New Health Marker';
}

function onMarkerChange() {
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
  }
  
  // Recalculate status
  calculateStatus();
}

function calculateStatus() {
  if (!form.value.marker_name || !form.value.marker_result) {
    form.value.status = '';
    return;
  }

  const status = getResultStatus(form.value.marker_name, form.value.marker_result);
  if (status) {
    form.value.status = status.title;
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

function getStatusBadgeClass() {
  if (!form.value.status) return 'badge-secondary';
  
  const lower = form.value.status.toLowerCase();
  if (lower.includes('normal') || lower.includes('optimal')) return 'badge-success';
  if (lower.includes('high') || lower.includes('low') || lower.includes('elevated')) return 'badge-warning';
  if (lower.includes('critical') || lower.includes('danger')) return 'badge-danger';
  return 'badge-info';
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
    return dateString;
  }
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  
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

async function handleSubmit() {
  if (isSubmitting.value || props.mode === 'view') return;

  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    // Prepare form data
    const formData = {
      marker_name: form.value.marker_name,
      marker_date: form.value.marker_date,
      marker_result: form.value.marker_result,
      unit: form.value.unit || null,
      normal_range_low: form.value.normal_range_low || null,
      normal_range_high: form.value.normal_range_high || null,
      status: form.value.status || null,
      marker_facts: form.value.marker_facts || null,
      notes: form.value.notes || null,
      lab_name: form.value.lab_name || null,
      doctor_name: form.value.doctor_name || null
    };

    // Emit to parent
    await emit('submit', formData);
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

function initializeForm() {
  if (props.healthMarker) {
    // Edit/View mode - populate form with existing data
    form.value = {
      marker_name: props.healthMarker.marker_name || '',
      marker_date: props.healthMarker.marker_date || '',
      marker_result: props.healthMarker.marker_result || '',
      unit: props.healthMarker.unit || '',
      normal_range_low: props.healthMarker.normal_range_low || '',
      normal_range_high: props.healthMarker.normal_range_high || '',
      status: props.healthMarker.status || '',
      marker_facts: props.healthMarker.marker_facts || '',
      notes: props.healthMarker.notes || '',
      lab_name: props.healthMarker.lab_name || '',
      doctor_name: props.healthMarker.doctor_name || ''
    };
  } else if (props.mode === 'create') {
    // Create mode - set default date to today
    const today = new Date().toISOString().split('T')[0];
    form.value.marker_date = today;
  }
}

// ✅ WATCHERS
watch(() => props.healthMarker, () => {
  initializeForm();
}, { immediate: true, deep: true });

// ✅ LIFECYCLE
onMounted(() => {
  initializeForm();
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

/* Static display for view mode */
.form-control-static {
  padding: 0.75rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  min-height: 42px;
  display: flex;
  align-items: center;
}

.form-control-static.text-muted {
  color: #9ca3af;
  font-style: italic;
}

.result-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.result-unit {
  font-size: 1rem;
  font-weight: 500;
  color: #9ca3af;
}

.facts-display,
.notes-display {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  white-space: pre-wrap;
  line-height: 1.6;
}

.form-text {
  font-size: 0.8125rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Status display */
.status-display {
  display: flex;
  align-items: flex-start;
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

/* Info box */
.info-box {
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1.5rem;
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

/* Metadata grid */
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.metadata-item i {
  color: #667eea;
  font-size: 1.25rem;
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

  .metadata-grid {
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