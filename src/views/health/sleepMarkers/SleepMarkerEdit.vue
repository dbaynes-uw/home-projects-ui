<template>
  <div class="page-wrapper">
    <div class="health-marker-edit-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-edit"></i>
            Edit Health Marker Result
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'HealthMarkerList' }"
              prepend-icon="fas fa-list"
              class="nav-button"
            >
              View All Results
            </v-btn>
            <v-btn
              variant="outlined"
              :to="{ name: 'HealthMarkersByCategory' }"
              prepend-icon="fas fa-chart-line"
              class="nav-button"
            >
              View by Category
            </v-btn>
            <v-btn
              variant="outlined"
              :to="{ name: 'HealthMarkerCreate' }"
              prepend-icon="fas fa-plus"
              class="nav-button"
            >
              Add New Result
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ LOADING STATE -->
      <v-card v-if="isLoading" class="mt-4">
        <v-card-text class="text-center">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4">Loading health marker data...</p>
        </v-card-text>
      </v-card>

      <!-- ✅ ERROR STATE -->
      <v-card v-else-if="loadError" class="mt-4" color="error" variant="tonal">
        <v-card-text>
          <v-alert type="error" :text="loadError" />
          <div class="text-center mt-4">
            <v-btn
              variant="outlined"
              @click="loadHealthMarker"
              prepend-icon="mdi-refresh"
            >
              Retry Loading
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN FORM CARD -->
      <v-card v-else-if="healthMarker.id" class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="onSubmit" ref="formRef">
            <v-container id="form-container">
              
              <!-- ✅ HEALTH MARKER SELECT -->
              <v-autocomplete
                label="Health Marker"
                :items="healthMarkerOptions"
                v-model="healthMarker.marker_name"
                :rules="[requiredMarkerName]"
                variant="outlined"
                class="mb-4"
                clearable
                :error="!isMarkerNameValid && hasAttemptedSubmit"
                @update:model-value="onMarkerChange"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-heart-pulse</v-icon>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :icon="item.raw.icon" class="mr-3" />
                    </template>
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.raw.subtitle }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <!-- ✅ SELECTED MARKER INFO CARD -->
              <v-card 
                v-if="selectedMarkerInfo" 
                variant="tonal" 
                color="info" 
                class="mb-4"
              >
                <v-card-text>
                  <div class="marker-info">
                    <div class="marker-header">
                      <v-icon :icon="selectedMarkerInfo.icon" size="large" class="mr-2" />
                      <h4>{{ selectedMarkerInfo.label }}</h4>
                    </div>
                    
                    <div class="marker-details">
                      <v-chip size="small" color="primary" class="mr-2 mb-2">
                        {{ selectedMarkerInfo.category }}
                      </v-chip>
                      <v-chip size="small" color="secondary" class="mr-2 mb-2">
                        {{ selectedMarkerInfo.unit }}
                      </v-chip>
                    </div>
                    
                    <p><strong>Normal Range:</strong> {{ selectedMarkerInfo.normalRange }}</p>
                    <p><strong>Description:</strong> {{ selectedMarkerInfo.description }}</p>
                    <p><strong>Test Frequency:</strong> {{ selectedMarkerInfo.testFrequency }}</p>
                  </div>
                </v-card-text>
              </v-card>

              <!-- ✅ MARKER DATE -->
              <v-text-field 
                label="Test Date"
                v-model="healthMarker.marker_date"
                type="date"
                :rules="[requiredMarkerDate]"
                variant="outlined"
                class="mb-4"
                :error="!isMarkerDateValid && hasAttemptedSubmit"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-calendar</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ TEST RESULT -->
              <v-text-field 
                :label="`Test Result ${selectedMarkerInfo ? '(' + selectedMarkerInfo.unit + ')' : ''}`"
                v-model="healthMarker.marker_result"
                type="number"
                step="0.01"
                :rules="[requiredMarkerResult]"
                variant="outlined"
                class="mb-4"
                :error="!isMarkerResultValid && hasAttemptedSubmit"
                @update:model-value="onResultChange"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-chart-line</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ LAB NAME -->
              <v-text-field 
                label="Lab Name (Optional)"
                v-model="healthMarker.lab_name"
                variant="outlined"
                class="mb-4"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-flask</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ DOCTOR NAME -->
              <v-text-field 
                label="Doctor Name (Optional)"
                v-model="healthMarker.doctor_name"
                variant="outlined"
                class="mb-4"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-doctor</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ RESULT STATUS INDICATOR -->
              <v-alert
                v-if="resultStatus"
                :type="resultStatus.type"
                :title="resultStatus.title"
                :text="resultStatus.message"
                class="mb-4"
              >
                <template v-slot:prepend>
                  <v-icon 
                    :icon="getStatusIcon(resultStatus.type)" 
                    size="large"
                  />
                </template>
              </v-alert>

              <!-- ✅ NOTES TEXTAREA -->
              <v-textarea
                label="Notes (Optional)"
                v-model="healthMarker.notes"
                variant="outlined"
                clearable
                rows="3"
                class="mb-4"
                placeholder="Additional notes about the test, conditions, medications, etc..."
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-note</v-icon>
                </template>
              </v-textarea>

              <!-- ✅ METADATA DISPLAY -->
              <v-card variant="tonal" color="surface" class="mb-4">
                <v-card-text>
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
                </v-card-text>
              </v-card>

              <!-- ✅ ACTION BUTTONS -->
              <div class="action-buttons">
                <v-btn 
                  type="submit" 
                  color="primary"
                  size="large"
                  class="mr-2"
                  :loading="isSubmitting"
                  :disabled="!isFormValid || !hasChanges"
                  prepend-icon="mdi-content-save"
                >
                  Save Changes
                </v-btn>

                <v-btn 
                  variant="outlined"
                  color="secondary"
                  size="large"
                  class="mr-2"
                  @click="resetForm"
                  :disabled="isSubmitting"
                  prepend-icon="mdi-refresh"
                >
                  Reset
                </v-btn>

                <v-btn 
                  variant="outlined"
                  color="error"
                  size="large"
                  @click="confirmDelete"
                  :disabled="isSubmitting"
                  prepend-icon="mdi-delete"
                >
                  Delete
                </v-btn>
              </div>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ✅ DEBUG INFO (DEV ONLY) -->
      <v-card v-if="isDev" class="mt-4" color="warning" variant="tonal">
        <v-card-title>
          <i class="fas fa-bug mr-2"></i>
          Debug Info
        </v-card-title>
        <v-card-text>
          <div class="debug-grid">
            <div><strong>Form Valid:</strong> {{ isFormValid }}</div>
            <div><strong>Has Changes:</strong> {{ hasChanges }}</div>
            <div><strong>Loading:</strong> {{ isLoading }}</div>
            <div><strong>Record ID:</strong> {{ healthMarker.id }}</div>
            <div><strong>Selected Marker:</strong> {{ healthMarker.marker_name }}</div>
            <div><strong>Result Status:</strong> {{ resultStatus?.type }}</div>
          </div>
          
          <v-btn 
            @click="debugFormState"
            variant="outlined"
            size="small"
            class="mt-3"
          >
            Debug Form State
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- ✅ DELETE CONFIRMATION DIALOG -->
      <v-dialog v-model="showDeleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">
            <v-icon icon="mdi-delete" class="mr-2" />
            Confirm Delete
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete this health marker record?
            <br><br>
            <strong>Marker:</strong> {{ healthMarker.marker_name }}<br>
            <strong>Result:</strong> {{ healthMarker.marker_result }}<br>
            <strong>Date:</strong> {{ formatDate(healthMarker.marker_date) }}<br>
            <br>
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="outlined"
              @click="showDeleteDialog = false"
              :disabled="isDeleting"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              @click="deleteHealthMarker"
              :loading="isDeleting"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/oobs/HealthMarkerEdit.vue -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { 
  getHealthMarkerOptions, 
  getResultStatus, 
  getHealthMarkerByName 
} from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();
const route = useRoute();
const formRef = ref(null);

// ✅ REACTIVE STATE
const isLoading = ref(true);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const hasAttemptedSubmit = ref(false);
const isMarkerNameValid = ref(true);
const isMarkerDateValid = ref(true);
const isMarkerResultValid = ref(true);
const loadError = ref('');
const showDeleteDialog = ref(false);

// ✅ FORM DATA - FIXED FIELD NAMES TO MATCH API
const healthMarker = ref({
  id: '',
  marker_name: '',
  marker_date: '',        // ✅ CHANGED FROM marker_date
  marker_result: '',      // ✅ CHANGED FROM marker_result
  notes: '',
  created_by: '',
  created_at: '',
  updated_at: ''
});

// ✅ ORIGINAL DATA FOR COMPARISON
const originalHealthMarker = ref({});

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);
const isDev = computed(() => process.env.NODE_ENV === 'development');

const healthMarkerOptions = computed(() => getHealthMarkerOptions());

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
      await router.push({ name: 'HealthMarkerList' });
      
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
  showDeleteDialog.value = true;
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
      await router.push({ name: 'HealthMarkerList' });
      
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error deleting health marker - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error deleting health marker:', error);
    alert(`❌ Error deleting health marker: ${error.message}`);
  } finally {
    isDeleting.value = false;
    showDeleteDialog.value = false;
  }
};

// ✅ DEBUG FUNCTION
const debugFormState = () => {
  console.log('🔍 HEALTH MARKER EDIT DEBUG:');
  console.log('Route ID:', route.params.id);
  console.log('Form data:', healthMarker.value);
  console.log('Original data:', originalHealthMarker.value);
  console.log('Has changes:', hasChanges.value);
  console.log('All health markers in store:', store.state.healthMarkers?.length);
  console.log('Selected marker info:', selectedMarkerInfo.value);
  console.log('Result status:', resultStatus.value);
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

#form-container {
  text-align: left;
  width: 100% !important;
  padding: 1rem;
}

.icon-css {
  color: #1976d2 !important;
  top: -0.2rem;
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
  
  .action-buttons .v-btn {
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