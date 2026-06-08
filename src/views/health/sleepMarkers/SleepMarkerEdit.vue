<template>
  <div class="page-wrapper">
    <div class="health-marker-edit-container">
      <div class="panel panel-header">
        <h2>
          <i class="fas fa-edit"></i>
          Edit Health Marker Result
        </h2>

        <div class="navigation-flex">
          <router-link :to="{ name: 'HealthMarkers' }" class="nav-link-button">View All Results</router-link>
          <router-link :to="{ name: 'HealthMarkersByCategory' }" class="nav-link-button">View by Category</router-link>
          <router-link :to="{ name: 'HealthMarkerCreate' }" class="nav-link-button">Add New Result</router-link>
        </div>
      </div>

      <div v-if="isLoading" class="panel panel-loading">
        <p>Loading health marker data...</p>
      </div>

      <div v-else-if="loadError" class="panel panel-error">
        <p>{{ loadError }}</p>
        <div class="text-center mt-4">
          <BaseButton variant="secondary" @click="loadHealthMarker">Retry Loading</BaseButton>
        </div>
      </div>

      <div v-else-if="healthMarker.id" class="panel panel-form">
        <form @submit.prevent="onSubmit" id="form-container">
              
              <BaseSelect
                label="Health Marker"
                :items="markerOptions"
                v-model="healthMarker.marker_name"
                :include-empty-option="true"
                empty-option-label="Select marker"
                :error="!isMarkerNameValid && hasAttemptedSubmit ? 'Please select a health marker' : ''"
              />

              <div v-if="selectedMarkerInfo" class="marker-info-card mb-4">
                <div class="marker-info">
                  <div class="marker-header">
                    <h4>{{ selectedMarkerInfo.label }}</h4>
                  </div>

                  <div class="marker-details">
                    <span class="pill pill-primary">{{ selectedMarkerInfo.category }}</span>
                    <span class="pill pill-secondary">{{ selectedMarkerInfo.unit }}</span>
                  </div>

                  <p><strong>Normal Range:</strong> {{ selectedMarkerInfo.normalRange }}</p>
                  <p><strong>Description:</strong> {{ selectedMarkerInfo.description }}</p>
                  <p><strong>Test Frequency:</strong> {{ selectedMarkerInfo.testFrequency }}</p>
                </div>
              </div>

              <BaseTextField
                label="Test Date"
                v-model="healthMarker.marker_date"
                type="date"
                :error="!isMarkerDateValid && hasAttemptedSubmit ? 'Please enter marker date' : ''"
              />

              <BaseTextField
                :label="`Test Result ${selectedMarkerInfo ? '(' + selectedMarkerInfo.unit + ')' : ''}`"
                v-model="healthMarker.marker_result"
                type="number"
                step="0.01"
                :error="!isMarkerResultValid && hasAttemptedSubmit ? 'Please enter marker result' : ''"
              />

              <BaseTextField
                label="Lab Name (Optional)"
                v-model="healthMarker.lab_name"
              />

              <BaseTextField
                label="Doctor Name (Optional)"
                v-model="healthMarker.doctor_name"
              />

              <div v-if="resultStatus" class="status-alert mb-4" :class="`status-${resultStatus.type}`">
                <strong>{{ resultStatus.title }}</strong>
                <p>{{ resultStatus.message }}</p>
              </div>

              <div class="form-field mb-4">
                <label class="form-label">Notes (Optional)</label>
                <textarea
                  v-model="healthMarker.notes"
                  rows="3"
                  class="form-textarea"
                  placeholder="Additional notes about the test, conditions, medications, etc..."
                ></textarea>
              </div>

              <div class="metadata-card mb-4">
                <h4 class="mb-2">Record Information</h4>
                <div class="metadata-grid">
                  <div>
                    <strong>Created by:</strong> {{ healthMarker.created_by || 'Unknown' }}
                  </div>
                  <div>
                    <strong>Record ID:</strong> {{ healthMarker.id }}
                  </div>
                  <div v-if="healthMarker.created_at">
                    <strong>Created:</strong> {{ formatDate(healthMarker.created_at) }}
                  </div>
                  <div v-if="healthMarker.updated_at">
                    <strong>Last Updated:</strong> {{ formatDate(healthMarker.updated_at) }}
                  </div>
                </div>
              </div>

              <div class="action-buttons">
                <BaseButton
                  type="submit" 
                  :loading="isSubmitting"
                  :disabled="!isFormValid || !hasChanges"
                  variant="primary"
                >
                  Save Changes
                </BaseButton>

                <BaseButton
                  @click="resetForm"
                  :disabled="isSubmitting"
                  variant="secondary"
                >
                  Reset
                </BaseButton>

                <BaseButton
                  @click="confirmDelete"
                  :disabled="isSubmitting"
                  variant="danger"
                >
                  Delete
                </BaseButton>
              </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/oobs/HealthMarkerEdit.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { 
  getHealthMarkerOptions, 
  getResultStatus, 
  getHealthMarkerByName 
} from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// ✅ COMPOSITION API SETUP
const store = useStore();
const _router = useRouter();
const route = useRoute();

// ✅ REACTIVE STATE
const isLoading = ref(true);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const hasAttemptedSubmit = ref(false);
const isMarkerNameValid = ref(true);
const isMarkerDateValid = ref(true);
const isMarkerResultValid = ref(true);
const loadError = ref('');

// ✅ FORM DATA - FIXED FIELD NAMES TO MATCH API
const healthMarker = ref({
  id: '',
  marker_name: '',
  marker_date: '',        // ✅ CHANGED FROM marker_date
  marker_result: '',      // ✅ CHANGED FROM marker_result
  lab_name: '',
  doctor_name: '',
  notes: '',
  created_by: '',
  created_at: '',
  updated_at: ''
});

// ✅ ORIGINAL DATA FOR COMPARISON
const originalHealthMarker = ref({});

// ✅ COMPUTED PROPERTIES

const healthMarkerOptions = computed(() => getHealthMarkerOptions());
const markerOptions = computed(() => {
  return healthMarkerOptions.value.map(item => ({
    value: item?.value || item?.title || item?.label || '',
    title: item?.title || item?.label || item?.value || ''
  }))
})

const selectedMarkerInfo = computed(() => {
  if (!healthMarker.value.marker_name) return null;
  return getHealthMarkerByName(healthMarker.value.marker_name);
});

const resultStatus = computed(() => {
  if (!selectedMarkerInfo.value || !healthMarker.value.marker_result) return null;
  return getResultStatus(healthMarker.value.marker_name, healthMarker.value.marker_result);
});

const isFormValid = computed(() => {
  return isMarkerNameValid.value && isMarkerDateValid.value && isMarkerResultValid.value;
});

const hasChanges = computed(() => {
  return JSON.stringify(healthMarker.value) !== JSON.stringify(originalHealthMarker.value);
});

// ✅ VALIDATION RULES - FIXED FIELD NAMES
const requiredMarkerName = (value) => {
  if (value && value.trim()) {
    isMarkerNameValid.value = true;
    return true;
  } else {
    isMarkerNameValid.value = false;
    return 'Please select a health marker';
  }
};

const requiredMarkerDate = (value) => {
  if (value && value.trim()) {
    const markerDate = new Date(value);
    const today = new Date();
    
    if (markerDate > today) {
      isMarkerDateValid.value = false;
      return 'Marker date cannot be in the future';
    }

    isMarkerDateValid.value = true;
    return true;
  } else {
    isMarkerDateValid.value = false;
    return 'Please enter marker date';
  }
};

const requiredMarkerResult = (value) => {
  if (value && value.toString().trim()) {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      isMarkerResultValid.value = false;
      return 'Please enter a valid number';
    }
    
    if (numValue < 0) {
      isMarkerResultValid.value = false;
      return 'Marker result cannot be negative';
    }

    isMarkerResultValid.value = true;
    return true;
  } else {
    isMarkerResultValid.value = false;
    return 'Please enter marker result';
  }
};

// ✅ METHODS
// ✅ UPDATE THE loadHealthMarker FUNCTION:
const loadHealthMarker = async () => {
  console.log('🏥 Loading health marker data...');
  try {
    isLoading.value = true;
    loadError.value = '';
    
    const id = route.params.id;
    if (!id) {
      throw new Error('No health marker ID provided');
    }

    console.log('🔍 Loading health marker with ID:', id);
    console.log('🔍 ID type:', typeof id);
    
    // ✅ FIRST ENSURE ALL HEALTH MARKERS ARE LOADED
    await store.dispatch('fetchHealthMarkers');
    
    // ✅ FIND THE HEALTH MARKER IN THE STORE
    const allHealthMarkers = store.state.healthMarkers || [];
    console.log('📊 Total health markers in store:', allHealthMarkers.length);
    console.log('📋 Available IDs:', allHealthMarkers.map(m => ({ id: m.id, type: typeof m.id })));
    
    // ✅ TRY BOTH STRING AND NUMBER COMPARISON
    const foundMarker = allHealthMarkers.find(marker => 
      marker.id === id || marker.id === parseInt(id) || marker.id.toString() === id
    );
    
    if (foundMarker) {      
      // ✅ SET THE FORM DATA WITH ALL FIELDS
      healthMarker.value = {
        id: foundMarker.id,
        marker_name: foundMarker.marker_name || '',
        marker_date: foundMarker.marker_date || '',
        marker_result: foundMarker.marker_result || '',
        notes: foundMarker.notes || '',
        lab_name: foundMarker.lab_name || '',
        doctor_name: foundMarker.doctor_name || '',
        created_by: foundMarker.created_by || '',
        created_at: foundMarker.created_at || '',
        updated_at: foundMarker.updated_at || ''
      };
      
      originalHealthMarker.value = { ...healthMarker.value };
    } else {
      console.error('❌ Health marker not found in store');
      console.log('🔍 Searched for ID:', id, typeof id);
      console.log('🔍 Available markers:', allHealthMarkers.map(m => ({ id: m.id, name: m.marker_name })));
      throw new Error(`Health marker with ID ${id} not found`);
    }
    
  } catch (error) {
    console.error('❌ Error loading health marker:', error);
    loadError.value = error.message || 'Failed to load health marker';
  } finally {
    isLoading.value = false;
  }
};

const onMarkerChange = (markerName) => {
  console.log('🎯 Selected marker:', markerName);
  
  if (hasAttemptedSubmit.value) {
    requiredMarkerName(markerName);
  }
};

const onResultChange = (result) => {
  console.log('📊 Test result entered:', result);
  
  if (hasAttemptedSubmit.value) {
    requiredMarkerResult(result);
  }
};

const getStatusIcon = (type) => {
  switch (type) {
    case 'success': return 'mdi-check-circle';
    case 'warning': return 'mdi-alert-circle';
    case 'error': return 'mdi-close-circle';
    case 'info': 
    default: return 'mdi-information-circle';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return DateFormatService.formatDatejs(dateString);
};

const checkValidations = () => {
  const markerValid = requiredMarkerName(healthMarker.value.marker_name);
  const dateValid = requiredMarkerDate(healthMarker.value.marker_date);
  const resultValid = requiredMarkerResult(healthMarker.value.marker_result);

  return markerValid === true && dateValid === true && resultValid === true;
};

const resetForm = () => {
  healthMarker.value = { ...originalHealthMarker.value };
  hasAttemptedSubmit.value = false;
  isMarkerNameValid.value = true;
  isMarkerDateValid.value = true;
  isMarkerResultValid.value = true;
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    hasAttemptedSubmit.value = true;
    
    // ✅ VALIDATE FORM
    const isValid = checkValidations();
    
    if (!isValid) {
      console.warn('❌ Form validation failed');
      alert('Please correct required fields and resubmit');
      return;
    }

    // ✅ PREPARE UPDATE DATA
    const updateData = {
      ...healthMarker.value,
      updated_at: new Date().toISOString()
    };
    
    console.log('📊 Updating health marker:', updateData);
    
    // ✅ SUBMIT TO STORE
    const result = await store.dispatch('updateHealthMarker', updateData);    
    
    if (result !== false) {
      alert(`✅ Health marker ${updateData.marker_name} updated successfully`);
      
      // ✅ UPDATE ORIGINAL DATA
      originalHealthMarker.value = { ...updateData };
      
      // ✅ NAVIGATE TO HEALTH MARKER LIST
      await _router.push({ name: 'HealthMarkers' });
      
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error updating health marker - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error in onSubmit:', error);
    alert(`❌ Error updating health marker: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = () => {
  const shouldDelete = confirm(
    `Are you sure you want to delete this health marker record?\n\n` +
    `Marker: ${healthMarker.value.marker_name}\n` +
    `Result: ${healthMarker.value.marker_result}\n` +
    `Date: ${formatDate(healthMarker.value.marker_date)}\n\n` +
    `This action cannot be undone.`
  )

  if (shouldDelete) {
    deleteHealthMarker();
  }
};

const deleteHealthMarker = async () => {
  try {
    isDeleting.value = true;
    
    console.log('🗑️ Deleting health marker:', healthMarker.value.id);
    
    // ✅ DELETE FROM STORE
    const result = await store.dispatch('deleteHealthMarker', healthMarker.value.id);
    
    if (result !== false) {
      alert(`✅ Health marker ${healthMarker.value.marker_name} deleted successfully`);
      
      // ✅ NAVIGATE TO HEALTH MARKER LIST
      await _router.push({ name: 'HealthMarkers' });
      
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error deleting health marker - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error deleting health marker:', error);
    alert(`❌ Error deleting health marker: ${error.message}`);
  } finally {
    isDeleting.value = false;
  }
};

// ✅ SINGLE LIFECYCLE HOOK
onMounted(() => {
  loadHealthMarker();
});
</script>

<style scoped>
/* ✅ REUSE STYLES FROM CREATE COMPONENT */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.health-marker-edit-container {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
  margin: 0 auto;
}

.panel {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  background: #fff;
}

.panel-error {
  border-color: #d32f2f;
  background: #fdecec;
}

.panel-loading {
  text-align: center;
}

.panel-header h2 {
  margin-top: 0;
}

.navigation-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  min-width: 180px !important;
  height: 40px !important;
}

.nav-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 40px;
  border: 1px solid #888;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  background: #fff;
}

#form-container {
  text-align: left;
  width: 100% !important;
  padding: 1rem;
}

.icon-css {
  color: #1976d2 !important;
  top: -0.2rem;
}

.marker-info-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 1rem;
  background: #eef6ff;
}

.pill {
  display: inline-block;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  margin-right: 0.4rem;
}

.pill-primary {
  background: #dbeafe;
  color: #1d4ed8;
}

.pill-secondary {
  background: #ede9fe;
  color: #6d28d9;
}

.status-alert {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 0.75rem;
}

.status-success {
  background: #ecfdf3;
  border-color: #16a34a;
}

.status-warning {
  background: #fffbeb;
  border-color: #d97706;
}

.status-error {
  background: #fef2f2;
  border-color: #dc2626;
}

.status-info {
  background: #eff6ff;
  border-color: #2563eb;
}

.metadata-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}

.form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.form-textarea {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
}

/* ✅ MARKER INFO STYLES */
.marker-info {
  line-height: 1.5;
}

.marker-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.marker-header h4 {
  margin: 0;
  color: rgb(var(--v-theme-primary));
}

.marker-details {
  margin-bottom: 1rem;
}

.marker-info p {
  margin: 0.5rem 0;
}

/* ✅ METADATA GRID */
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.metadata-grid div {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  font-size: 0.875rem;
}

/* ✅ ACTION BUTTONS */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 1rem;
}

/* ✅ DEBUG GRID */
.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.debug-grid div {
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.875rem;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .health-marker-edit-container {
    padding: 0.5rem;
  }
  
  .marker-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .base-btn {
    width: 100%;
  }
  
  .metadata-grid {
    grid-template-columns: 1fr;
  }
  
  .debug-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  #form-container {
    padding: 0.5rem;
  }
  
  .marker-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>