<template>
  <form @submit.prevent="handleSubmit" class="oob-form">
    <!-- ✅ DATE & TIME -->
    <div class="form-group">
      <label for="date_of_occurrence" class="form-label required">
        <i class="fas fa-calendar-alt"></i>
        Date & Time of Occurrence
      </label>
      <input
        id="date_of_occurrence"
        v-model="formData.date_of_occurrence"
        type="datetime-local"
        class="form-input"
        :class="{ 'input-error': errors.date_of_occurrence }"
        required
      />
      <span v-if="errors.date_of_occurrence" class="error-message">
        {{ errors.date_of_occurrence }}
      </span>
    </div>

    <!-- ✅ DURATION -->
    <div class="form-group">
      <label for="duration" class="form-label required">
        <i class="fas fa-clock"></i>
        Duration
      </label>
      <select
        id="duration"
        v-model="formData.duration"
        class="form-select"
        :class="{ 'input-error': errors.duration }"
        required
      >
        <option value="">Select duration...</option>
        <option value="Short">Short (< 1 minute)</option>
        <option value="Medium">Medium (1 - 2 minutes)</option>
        <option value="Long">Long (> 2 minutes)</option>
      </select>
      <span v-if="errors.duration" class="error-message">
        {{ errors.duration }}
      </span>
    </div>

    <!-- ✅ CIRCUMSTANCES (OPTIONAL) -->
    <div class="form-group">
      <label for="circumstances" class="form-label">
        <i class="fas fa-notes-medical"></i>
        Circumstances
        <span class="optional-badge">Optional</span>
      </label>
      <textarea
        id="circumstances"
        v-model="formData.circumstances"
        class="form-textarea"
        rows="4"
        placeholder="Describe what happened, where it occurred, any triggers..."
      ></textarea>
      <p class="form-hint">
        <i class="fas fa-info-circle"></i>
        Include details like location, activities, and any potential causes
      </p>
    </div>

    <!-- ✅ INTERVAL DISPLAY (EDIT MODE ONLY) -->
    <div v-if="isEditMode && hasInterval" class="form-group">
      <label class="form-label">
        <i class="fas fa-stopwatch"></i>
        Time Since Last OOB
      </label>
      <div class="interval-display-card">
        <div v-if="formData.interval_days" class="interval-stat">
          <span class="interval-value">{{ formData.interval_days }}</span>
          <span class="interval-label">Days</span>
        </div>
        <div v-if="formData.interval_hours" class="interval-stat">
          <span class="interval-value">{{ formData.interval_hours }}</span>
          <span class="interval-label">Hours</span>
        </div>
        <div v-if="formData.interval_minutes" class="interval-stat">
          <span class="interval-value">{{ formData.interval_minutes }}</span>
          <span class="interval-label">Minutes</span>
        </div>
      </div>
      <p class="form-hint">
        <i class="fas fa-info-circle"></i>
        This is automatically calculated and cannot be edited
      </p>
    </div>

    <!-- ✅ CREATED BY (EDIT MODE ONLY) -->
    <div v-if="isEditMode && formData.created_by" class="form-group">
      <label class="form-label">
        <i class="fas fa-user"></i>
        Created By
      </label>
      <div class="readonly-field">
        {{ formData.created_by }}
      </div>
    </div>

    <!-- ✅ FORM ACTIONS -->
    <div class="form-actions">
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSubmitting"
      >
        <i v-if="!isSubmitting" class="fas fa-save"></i>
        <i v-else class="fas fa-spinner fa-spin"></i>
        {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update OOB' : 'Create OOB') }}
      </button>
      
      <button
        type="button"
        class="btn btn-secondary"
        @click="handleCancel"
        :disabled="isSubmitting"
      >
        <i class="fas fa-times"></i>
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// ✅ PROPS
const props = defineProps({
  oob: {
    type: Object,
    default: null
  }
});

// ✅ EMITS
const emit = defineEmits(['save', 'cancel']);

// ✅ FORM STATE
const formData = ref({
  date_of_occurrence: '',
  duration: '',
  circumstances: '',
  interval_days: null,
  interval_hours: null,
  interval_minutes: null,
  created_by: ''
});

const errors = ref({});
const isSubmitting = ref(false);

// ✅ COMPUTED
const isEditMode = computed(() => !!props.oob);

const hasInterval = computed(() => {
  return formData.value.interval_days !== null || 
         formData.value.interval_hours !== null || 
         formData.value.interval_minutes !== null;
});

// ✅ METHODS
function initializeForm() {
  if (props.oob) {
    // Edit mode - populate with existing data
    formData.value = {
      id: props.oob.id,
      date_of_occurrence: formatDateForInput(props.oob.date_of_occurrence),
      duration: props.oob.duration || '',
      circumstances: props.oob.circumstances || '',
      interval_days: props.oob.interval_days,
      interval_hours: props.oob.interval_hours,
      interval_minutes: props.oob.interval_minutes,
      created_by: props.oob.created_by || ''
    };
  } else {
    // Create mode - set default date to now
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    formData.value.date_of_occurrence = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

function validateForm() {
  errors.value = {};
  
  if (!formData.value.date_of_occurrence) {
    errors.value.date_of_occurrence = 'Date and time is required';
  }
  
  if (!formData.value.duration) {
    errors.value.duration = 'Duration is required';
  }
  
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Convert datetime-local to ISO format for API
    const submitData = {
      ...formData.value,
      date_of_occurrence: new Date(formData.value.date_of_occurrence).toISOString()
    };
    
    emit('save', submitData);
  } catch (error) {
    console.error('❌ Form submission error:', error);
    errors.value.submit = 'Failed to save OOB. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  emit('cancel');
}

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

.oob-form {
  width: 100%;
}

/* Required field indicator */
.required::after {
  content: ' *';
  color: #ef4444;
  font-weight: bold;
}

/* Optional badge */
.optional-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

/* Interval display card */
.interval-display-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fecaca;
  border-radius: 12px;
}

.interval-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.interval-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ef4444;
  line-height: 1;
}

.interval-label {
  font-size: 0.875rem;
  color: #991b1b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Readonly field */
.readonly-field {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Form actions - FIXED ALIGNMENT */
.form-actions {
  display: flex;
  gap: 1rem; /* ✅ SPACE BETWEEN BUTTONS */
  justify-content: flex-start; /* ✅ ALIGN LEFT */
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f3f4f6;
}

/* Disabled button state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error state for form controls */
.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.input-error:focus {
  outline-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .interval-display-card {
    gap: 1rem;
    padding: 1rem;
  }
  
  .interval-value {
    font-size: 1.5rem;
  }
  
  .interval-label {
    font-size: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem; /* ✅ VERTICAL GAP ON MOBILE */
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style>