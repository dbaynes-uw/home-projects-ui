<template>
  <div class="page-wrapper">
    <div class="oob-create-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-exclamation-triangle"></i>
            Add OOB Record
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'OobList' }"
              prepend-icon="fas fa-list"
              class="nav-button"
            >
              View All OOBs
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ MAIN FORM CARD -->
      <v-card class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="onSubmit" ref="formRef">
            <v-container id="form-container">
              <!-- ✅ DATE OF OCCURRENCE - DATETIME-LOCAL -->
              <v-text-field 
                label="Date & Time of Occurrence"
                v-model="oob.date_of_occurrence"
                type="datetime-local"
                :rules="[requiredDateOccurrence]"
                variant="outlined"
                class="mb-4"
                :error="!isDateOccurrenceValid && hasAttemptedSubmit"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-calendar-clock</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ DURATION -->
              <v-text-field 
                label="Duration (minutes)"
                v-model="oob.duration"
                type="text"
                variant="outlined"
                class="mb-4"
                placeholder="e.g., 15 minutes, 1 hour, etc."
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-timer</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ CIRCUMSTANCES TEXTAREA -->
              <v-textarea
                label="Circumstances / Notes"
                v-model="oob.circumstances"
                variant="outlined"
                clearable
                rows="6"
                class="mb-4"
                placeholder="Describe what happened, any triggers, symptoms, etc..."
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-note-text</v-icon>
                </template>
              </v-textarea>

              <!-- ✅ CREATED BY (READ-ONLY, AUTO-FILLED) -->
              <v-text-field 
                label="Created By"
                v-model="oob.created_by"
                variant="outlined"
                class="mb-4"
                readonly
                disabled
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-account</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ SUBMIT BUTTON WITH LOADING STATE -->
              <v-btn 
                type="submit" 
                color="error"
                size="large"
                block 
                class="mt-4"
                :loading="isSubmitting"
                :disabled="!isFormValid && hasAttemptedSubmit"
              >
                <i class="fas fa-save"></i>
                Add OOB Record
              </v-btn>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useOobStore } from '@/stores/OobStore';

// ✅ COMPOSITION API SETUP
const router = useRouter();
const store = useStore();
const oobStore = useOobStore();
const formRef = ref(null);

// ✅ REACTIVE STATE
const isSubmitting = ref(false);
const hasAttemptedSubmit = ref(false);
const isFormValid = ref(false);
const isDateOccurrenceValid = ref(false);

// ✅ FORM DATA - ONLY 4 FIELDS
const oob = ref({
  date_of_occurrence: '',
  duration: '',
  circumstances: '',
  created_by: '',
});

// ✅ COMPUTED PROPERTIES
const user = computed(() => store.state.user);

// ✅ VALIDATION RULES
const requiredDateOccurrence = (value) => {
  if (value && value.trim()) {
    isDateOccurrenceValid.value = true;
    return true;
  } else {
    isDateOccurrenceValid.value = false;
    return 'Please enter Date & Time of Occurrence';
  }
};

// ✅ FORM VALIDATION WATCHER
watch(isDateOccurrenceValid, (newValue) => {
  isFormValid.value = newValue;
});

// ✅ WATCH DATE FIELD FOR VALIDATION
watch(() => oob.value.date_of_occurrence, (newValue) => {
  if (hasAttemptedSubmit.value) {
    requiredDateOccurrence(newValue);
  }
});

// ✅ METHODS
const checkValidations = () => {
  const dateValid = requiredDateOccurrence(oob.value.date_of_occurrence);
  isFormValid.value = dateValid === true;
  return isFormValid.value;
};

const onSubmit = async () => {
  try {
    isSubmitting.value = true;
    hasAttemptedSubmit.value = true;
    
    // ✅ VALIDATE FORM
    const isValid = checkValidations();
    
    if (!isValid) {
      console.warn('❌ Form validation failed');
      alert('Please enter a date & time of occurrence');
      return;
    }
    
    // ✅ VALIDATE REQUIRED FIELD
    if (!oob.value.date_of_occurrence) {
      throw new Error('Date of occurrence is required');
    }
    
    console.log('📤 Submitting OOB:', oob.value);
    
    // ✅ SUBMIT TO PINIA STORE
    await oobStore.createOob(oob.value);
    
    alert(`✅ OOB record created for ${formatDateTime(oob.value.date_of_occurrence)}`);
    
    // ✅ NAVIGATE TO OOB LIST
    await router.push({ name: 'OobList' });
    
  } catch (error) {
    console.error('❌ Error in onSubmit:', error);
    
    if (error.response?.status === 422) {
      alert(`❌ Validation Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.response?.status === 500) {
      alert(`❌ Server Error: Check backend logs`);
    } else {
      alert(`❌ Error creating OOB: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ HELPER FUNCTION: Format datetime-local for display
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ✅ LIFECYCLE
onMounted(() => {
  console.log('✅ OobCreate mounted');
  
  // ✅ AUTO-FILL created_by WITH CURRENT USER
  if (user.value) {
    oob.value.created_by = user.value.email || user.value.username || user.value.name || 'Unknown User';
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

.oob-create-container {
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
  color: #ef4444 !important; /* Red theme for OOBs */
  top: -0.2rem;
}

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
  
  .oob-create-container {
    padding: 0.5rem;
  }
}

/* ✅ ACCESSIBILITY */
.nav-button:focus {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}
</style>