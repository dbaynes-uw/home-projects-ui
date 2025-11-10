<<<<<<< HEAD
<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/Oobs/HealthMarkerCreate.vue -->
=======
<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/oobs/HealthMarkerCreate.vue -->
>>>>>>> HealthMarker
<template>
  <div class="page-wrapper">
    <div class="health-marker-create-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-heartbeat"></i>
            Add Health Marker Result
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
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN FORM CARD -->
      <v-card class="mt-4">
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
                    <p><strong>Marker Frequency:</strong> {{ selectedMarkerInfo.markerFrequency }}</p>
                  </div>
                </v-card-text>
              </v-card>
              <!-- ✅ MARKER DATE -->
              <v-text-field 
                label="Marker Date"
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
              />
              <!-- ✅ DOCTOR NAME -->
              <v-text-field 
                label="Doctor Name (Optional)"
                v-model="healthMarker.doctor_name"
                variant="outlined"
                class="mb-4"
              />

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

              <!-- ✅ SUBMIT BUTTON WITH LOADING STATE -->
              <v-btn 
                type="submit" 
                color="primary"
                size="large"
                block 
                class="mt-4"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                <i class="fas fa-save mr-2"></i>
                Save Health Marker Result
              </v-btn>
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
            <div><strong>Selected Marker:</strong> {{ healthMarker.marker_name }}</div>
            <div><strong>Marker Result:</strong> {{ healthMarker.marker_result }}</div>
            <div><strong>Result Status:</strong> {{ resultStatus?.type }}</div>
            <div><strong>User Email:</strong> {{ user?.email }}</div>
            <div><strong>Attempted Submit:</strong> {{ hasAttemptedSubmit }}</div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { 
  getHealthMarkerOptions, 
  getResultStatus, 
  getHealthMarkerByName 
} from '@/services/health-marker-constants';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();
const formRef = ref(null);

// ✅ REACTIVE STATE
const isSubmitting = ref(false);
const hasAttemptedSubmit = ref(false);
const isMarkerNameValid = ref(false);
const isMarkerDateValid = ref(false);
const isMarkerResultValid = ref(false);

// ✅ FORM DATA
const healthMarker = ref({
  marker_name: '',
  marker_date: '',
  marker_result: '',
  lab_name: '',
  doctor_name: '',  
  notes: '',
  created_by: '',
});

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

// ✅ VALIDATION RULES
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

// ✅ WATCH USER AND SET CREATED_BY
watch(user, (newUser) => {
  if (newUser?.email) {
    healthMarker.value.created_by = newUser.email;
  }
}, { immediate: true });

// ✅ METHODS
const onMarkerChange = (markerName) => {
  
  if (hasAttemptedSubmit.value) {
    requiredMarkerName(markerName);
  }
};

const onResultChange = (result) => {
  
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

const checkValidations = () => {
  const markerValid = requiredMarkerName(healthMarker.value.marker_name);
  const dateValid = requiredMarkerDate(healthMarker.value.marker_date);
  const resultValid = requiredMarkerResult(healthMarker.value.marker_result);
    
  return markerValid === true && dateValid === true && resultValid === true;
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
    
    // ✅ PREPARE HEALTH MARKER DATA
    const healthMarkerData = {
      ...healthMarker.value,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
        
    // ✅ SUBMIT TO STORE (Will need to create this action)
    const result = await store.dispatch('createHealthMarker', healthMarkerData);    
    
    if (result !== false) {
      alert(`✅ Health marker ${healthMarkerData.marker_name}  submitted for ${healthMarkerData.marker_date}`);
      
      // ✅ NAVIGATE TO HEALTH MARKER LIST (When created)
      // await router.push({ name: 'HealthMarkerList' });
      
      // ✅ FOR NOW, CLEAR FORM
      healthMarker.value = {
        marker_name: '',
        marker_date: '',
        marker_result: '',
        lab_name: '',
        doctor_name: '',
        notes: '',
        created_by: user.value?.email || '',
      };
      
      hasAttemptedSubmit.value = false;
      isMarkerNameValid.value = false;
      isMarkerResultValid.value = false;
      
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error adding health marker - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error in onSubmit:', error);
    alert(`❌ Error creating health marker: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ DEBUG FUNCTION
const debugFormState = () => {
  console.log('🔍 HEALTH MARKER FORM DEBUG:');
  console.log('Form data:', healthMarker.value);
  console.log('Selected marker info:', selectedMarkerInfo.value);
  console.log('Result status:', resultStatus.value);
  console.log('Validations:', {
    isFormValid: isFormValid.value,
    isMarkerNameValid: isMarkerNameValid.value,
    isMarkerResultValid: isMarkerResultValid.value
  });
  console.log('User:', user.value);
};

// ✅ LIFECYCLE
onMounted(() => {
  if (user.value?.email) {
    healthMarker.value.created_by = user.value.email;
  }
  // ✅ SET TODAY'S DATE AS DEFAULT
  const today = new Date().toISOString().split('T')[0];
  healthMarker.value.marker_date = today;  
});
</script>

<style scoped>
/* ✅ CONSISTENT STYLES WITH MedCreate */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.health-marker-create-container {
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
  min-width: 200px !important;
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
  
  .health-marker-create-container {
    padding: 0.5rem;
  }
  
  .marker-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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