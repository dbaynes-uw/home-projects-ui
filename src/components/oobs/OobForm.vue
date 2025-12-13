<template>
  <form @submit.prevent="handleSubmit" class="oob-form">
    <!-- ✅ OOB INFORMATION SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-exclamation-triangle"></i>
        OOB Information
      </h3>

      <div class="form-row">
        <!-- OOB Date -->
        <div class="form-group">
          <label for="date_of_occurrence" class="required">OOB Date</label>
          <input
            id="date_of_occurrence"
            v-model="formData.date_of_occurrence"
            type="date"
            class="form-control"
            required
          />
        </div>

        <!-- OOB Type -->
        <div class="form-group">
          <label for="type_of_occurrence" class="required">OOB Type</label>
          <select
            id="type_of_occurrence"
            v-model="formData.type_of_occurrence"
            class="form-control"
            required
          >
            <option value="">Select Type</option>
            <option value="Bowel Movement">Bowel Movement</option>
            <option value="Urination">Urination</option>
            <option value="Vomiting">Vomiting</option>
            <option value="Nausea">Nausea</option>
            <option value="Diarrhea">Diarrhea</option>
            <option value="Constipation">Constipation</option>
            <option value="Bleeding">Bleeding</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <!-- Severity -->
        <div class="form-group">
          <label for="severity">Severity</label>
          <select
            id="severity"
            v-model="formData.severity"
            class="form-control"
          >
            <option value="">Select Severity</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        <!-- Time of Day -->
        <div class="form-group">
          <label for="time_of_day">Time of Day</label>
          <input
            id="time_of_day"
            v-model="formData.time_of_day"
            type="time"
            class="form-control"
          />
        </div>
      </div>

      <div class="form-row">
        <!-- Duration -->
        <div class="form-group">
          <label for="duration">Duration (minutes)</label>
          <input
            id="duration"
            v-model.number="formData.duration"
            type="number"
            class="form-control"
            placeholder="e.g., 15"
            min="0"
          />
        </div>

        <!-- Frequency -->
        <div class="form-group">
          <label for="frequency">Frequency (times today)</label>
          <input
            id="frequency"
            v-model.number="formData.frequency"
            type="number"
            class="form-control"
            placeholder="e.g., 3"
            min="0"
          />
        </div>
      </div>
    </div>

    <!-- ✅ ADDITIONAL DETAILS SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-clipboard-list"></i>
        Additional Details
      </h3>

      <div class="form-group">
        <label for="circumstances">Notes/Circumstances</label>
        <textarea
          id="circumstances"
          v-model="formData.circumstances"
          class="form-control"
          rows="4"
          placeholder="Any additional observations or circumstances..."
        ></textarea>
      </div>
    </div>

    <!-- ✅ FORM ACTIONS -->
    <div class="form-actions">
      <BaseButton
        type="button"
        variant="secondary"
        @click="handleCancel"
      >
        Cancel
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        icon="save"
        :disabled="!isFormValid"
      >
        {{ isEditing ? 'Update OOB' : 'Create OOB' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const props = defineProps({
  oob: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

// ✅ FORM DATA - OLD FIELD NAMES
const formData = ref({
  date_of_occurrence: '',
  type_of_occurrence: '',
  severity: '',
  time_of_day: '',
  duration: null,
  frequency: null,
  circumstances: ''
});

// ✅ COMPUTED
const isEditing = computed(() => !!props.oob?.id);

const isFormValid = computed(() => {
  return formData.value.date_of_occurrence !== '' &&
         formData.value.type_of_occurrence !== '';
});

// ✅ WATCH FOR PROP CHANGES
watch(
  () => props.oob,
  (newOob) => {
    console.log('📥 OOB prop received:', newOob);
    
    if (newOob) {
      // Populate form with existing data
      formData.value = {
        id: newOob.id,
        date_of_occurrence: newOob.date_of_occurrence || '',
        type_of_occurrence: newOob.type_of_occurrence || '',
        severity: newOob.severity || '',
        time_of_day: newOob.time_of_day || '',
        duration: newOob.duration || null,
        frequency: newOob.frequency || null,
        circumstances: newOob.circumstances || ''
      };
      
      console.log('✅ Form populated with:', formData.value);
    } else {
      // Reset form for new entry
      resetForm();
    }
  },
  { immediate: true }
);

// ✅ METHODS
function handleSubmit() {
  if (!isFormValid.value) return;

  console.log('📤 Submitting form data:', formData.value);
  emit('save', { ...formData.value });
}

function handleCancel() {
  emit('cancel');
}

function resetForm() {
  formData.value = {
    date_of_occurrence: '',
    type_of_occurrence: '',
    severity: '',
    time_of_day: '',
    duration: null,
    frequency: null,
    circumstances: ''
  };
}
</script>
<style scoped>
/* ✅ IMPORT SHARED FORM STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   OOB FORM
   ======================================== */

.oob-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(239, 68, 68, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.1);
}

.form-section:last-of-type {
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #ef4444;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  font-size: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-control::placeholder {
  color: #cbd5e0;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a5568' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

/* Checkbox Group */
.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #ef4444;
}

.checkbox-label span {
  color: #4a5568;
  font-weight: 500;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(239, 68, 68, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .oob-form {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>