<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/meds/MedCreate.vue -->
<template>
  <div class="page-wrapper">
    <div class="med-create-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-pills"></i>
            Add Med to Collection
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'MedList' }"
              prepend-icon="fas fa-list"
              class="nav-button"
            >
              View All Meds
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN FORM CARD -->
      <v-card class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="onSubmit" ref="formRef">
            <v-container id="form-container">
              <!-- ✅ DATE OF OCCURRENCE -->
              <v-text-field 
                label="Date of Occurrence"
                v-model="med.date_of_occurrence"
                type="datetime-local"
                :rules="[requiredDateOccurrence]"
                variant="outlined"
                class="mb-4"
                :error="!isDateOccurrenceValid && hasAttemptedSubmit"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-calendar</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ DURATION SELECT -->
              <v-select
                label="Duration"
                :items="MED_DURATIONS"
                v-model="med.duration"
                :rules="[requiredDuration]"
                variant="outlined"
                class="mb-4"
                :error="!isDurationValid && hasAttemptedSubmit"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-clock</v-icon>
                </template>
              </v-select>

              <!-- ✅ CIRCUMSTANCES TEXTAREA -->
              <v-textarea
                label="Circumstances: sugar, sleep, alcohol, etc..."
                v-model="med.circumstances"
                variant="outlined"
                clearable
                rows="4"
                class="mb-4"
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
                :disabled="!isFormValid && hasAttemptedSubmit"
              >
                <i class="fas fa-save"></i>
                Add Med to Collection
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- ✅ DEBUG INFO (DEV ONLY) -->
      <v-card v-if="isDev" class="mt-4" color="info" variant="tonal">
        <v-card-title>
          <i class="fas fa-bug"></i>
          Debug Info
        </v-card-title>
        <v-card-text>
          <p><strong>Form Valid:</strong> {{ isFormValid }}</p>
          <p><strong>Date Valid:</strong> {{ isDateOccurrenceValid }}</p>
          <p><strong>Duration Valid:</strong> {{ isDurationValid }}</p>
          <p><strong>Has Attempted Submit:</strong> {{ hasAttemptedSubmit }}</p>
          <p><strong>Is Submitting:</strong> {{ isSubmitting }}</p>
          <p><strong>User Email:</strong> {{ user?.email }}</p>
          
          <v-btn 
            @click="debugFormState"
            variant="outlined"
            size="small"
            class="mt-2"
          >
            Debug Form State
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { VSelect } from 'vuetify/components'
import { MED_DURATIONS } from '@/services/constants';

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();
const formRef = ref(null);

// ✅ ERROR HANDLER
onErrorCaptured((error, instance, info) => {
  console.error('❌ Component error captured:', error);
  console.error('❌ Error info:', info);
  return false;
});

// ✅ REACTIVE STATE
const isSubmitting = ref(false);
const hasAttemptedSubmit = ref(false);
const isFormValid = ref(false);
const isDateOccurrenceValid = ref(false);
const isDurationValid = ref(false);

// ✅ FORM DATA
const med = ref({
  date_of_occurrence: '',
  duration: '',
  circumstances: '',
  created_by: '',
});

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user?.resource_owner);
const isDev = computed(() => process.env.NODE_ENV === 'development');

// ✅ VALIDATION RULES
const requiredDateOccurrence = (value) => {
  if (value && value.trim()) {
    isDateOccurrenceValid.value = true;
    return true;
  } else {
    isDateOccurrenceValid.value = false;
    return 'Please enter Date of Occurrence';
  }
};

const requiredDuration = (value) => {
  if (value && value.trim()) {
    isDurationValid.value = true;
    return true;
  } else {
    isDurationValid.value = false;
    return 'Please Select Duration';
  }
};

// ✅ FORM VALIDATION WATCHER
watch([isDateOccurrenceValid, isDurationValid], () => {
  isFormValid.value = isDateOccurrenceValid.value && isDurationValid.value;
  console.log(`🔍 Form validation: Date(${isDateOccurrenceValid.value}) Duration(${isDurationValid.value}) = Valid(${isFormValid.value})`);
});

// ✅ WATCH USER AND SET CREATED_BY
watch(user, (newUser) => {
  if (newUser?.email) {
    med.value.created_by = newUser.email;
    console.log('✅ User loaded, set created_by:', newUser.email);
  }
}, { immediate: true });

// ✅ WATCH FORM FIELDS FOR VALIDATION
watch(() => med.value.date_of_occurrence, (newValue) => {
  if (hasAttemptedSubmit.value) {
    requiredDateOccurrence(newValue);
  }
});

watch(() => med.value.duration, (newValue) => {
  if (hasAttemptedSubmit.value) {
    requiredDuration(newValue);
  }
});

// ✅ METHODS
const checkValidations = () => {
  console.log('🔍 Checking validations...');
  
  const dateValid = requiredDateOccurrence(med.value.date_of_occurrence);
  const durationValid = requiredDuration(med.value.duration);
  
  console.log(`🔍 Validation results: Date(${dateValid === true}) Duration(${durationValid === true})`);
  
  isFormValid.value = dateValid === true && durationValid === true;
  return isFormValid.value;
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    hasAttemptedSubmit.value = true;
    
    console.log('🔍 PRE-SUBMIT DEBUG:');
    console.log('- med.value:', med.value);
    console.log('- user email:', user.value?.email);
    
    // ✅ VALIDATE FORM
    const isValid = checkValidations();
    
    if (!isValid) {
      console.warn('❌ Form validation failed');
      alert('Please correct required fields and resubmit');
      return;
    }
    
    // ✅ PREPARE MED DATA
    const medData = {
      ...med.value,
      id: uuidv4(),
      created_by: user.value?.email || '',
    };
    
    console.log('🚀 Submitting med data:', medData);
    
    // ✅ VALIDATE REQUIRED FIELDS
    if (!medData.date_of_occurrence) {
      throw new Error('Date of occurrence is required');
    }
    
    if (!medData.duration) {
      throw new Error('Duration is required');
    }
    
    if (!medData.created_by) {
      throw new Error('User email is required');
    }
    
    // ✅ SUBMIT TO STORE
    const result = await store.dispatch('createMed', medData);
    
    console.log('🔄 Store result:', result);
    
    if (result !== false) {
      console.log('✅ Med created successfully');
      alert(`✅ Med was successfully added for ${medData.date_of_occurrence}`);
      
      // ✅ NAVIGATE TO MED LIST
      await router.push({ name: 'MedList' });
    } else {
      console.error('❌ Store returned false');
      alert('❌ Error adding Med - please try again');
    }
    
  } catch (error) {
    console.error('❌ Error in onSubmit:', error);
    
    if (error.response?.status === 422) {
      alert(`❌ Validation Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.response?.status === 500) {
      alert(`❌ Server Error: Check backend logs`);
    } else {
      alert(`❌ Error creating med: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ DEBUG FUNCTION
const debugFormState = () => {
  console.log('🔍 FORM STATE DEBUG:');
  console.log('='.repeat(50));
  
  console.log('Form data:', med.value);
  console.log('User:', user.value);
  console.log('Validations:', {
    isFormValid: isFormValid.value,
    isDateOccurrenceValid: isDateOccurrenceValid.value,
    isDurationValid: isDurationValid.value,
    hasAttemptedSubmit: hasAttemptedSubmit.value,
    isSubmitting: isSubmitting.value
  });
  
  console.log('Available durations:', MED_DURATIONS);
  
  console.log('='.repeat(50));
};

// ✅ LIFECYCLE
onMounted(() => {
  console.log('🔍 MedCreate mounted');
  console.log('✅ Available MED_DURATIONS:', MED_DURATIONS);
  
  // ✅ SET INITIAL USER IF AVAILABLE
  if (user.value?.email) {
    med.value.created_by = user.value.email;
    console.log('✅ Initial user set:', user.value.email);
  }
});
</script>

<style scoped>
/* ✅ MODERN CONSISTENT STYLES */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.med-create-container {
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

/* ✅ KEEP ESSENTIAL LEGACY STYLES */
.v-field__clearable {
  padding: 1rem !important;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .med-create-container {
    padding: 0.5rem;
  }
}

/* ✅ ACCESSIBILITY */
.nav-button:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* ✅ REMOVE UNUSED LEGACY STYLES */
/* Cleaned up all the old float-based and manual styling */
</style>