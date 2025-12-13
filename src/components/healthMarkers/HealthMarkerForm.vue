<template>
  <form @submit.prevent="handleSubmit" class="health-marker-form">
    <!-- ✅ MARKER INFORMATION SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-vial"></i>
        Marker Information
      </h3>

      <div class="form-row">
        <!-- Marker Name -->
        <div class="form-group">
          <label for="marker_name" class="required">Marker Name</label>
          <input
            id="marker_name"
            v-model="formData.marker_name"
            type="text"
            class="form-control"
            placeholder="e.g., Total Cholesterol"
            required
          />
        </div>

        <!-- Test Date -->
        <div class="form-group">
          <label for="marker_date" class="required">Test Date</label>
          <input
            id="marker_date"
            v-model="formData.marker_date"
            type="date"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <!-- Result -->
        <div class="form-group">
          <label for="marker_result" class="required">Result</label>
          <input
            id="marker_result"
            v-model="formData.marker_result"
            type="text"
            class="form-control"
            placeholder="e.g., 180 or Negative"
            required
          />
        </div>

        <!-- Unit -->
        <div class="form-group">
          <label for="marker_unit">Unit</label>
          <input
            id="marker_unit"
            v-model="formData.marker_unit"
            type="text"
            class="form-control"
            placeholder="e.g., mg/dL"
          />
        </div>
      </div>

      <div class="form-row">
        <!-- Status -->
        <div class="form-group">
          <label for="marker_status">Status</label>
          <select
            id="marker_status"
            v-model="formData.marker_status"
            class="form-control"
          >
            <option value="">Select Status</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <!-- Reference Range -->
        <div class="form-group">
          <label for="marker_range">Reference Range</label>
          <input
            id="marker_range"
            v-model="formData.marker_range"
            type="text"
            class="form-control"
            placeholder="e.g., 0-200 mg/dL"
          />
        </div>
      </div>
    </div>

    <!-- ✅ LAB INFORMATION SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-hospital"></i>
        Lab Information
      </h3>

      <div class="form-row">
        <!-- Lab Name -->
        <div class="form-group">
          <label for="marker_lab">Lab/Facility</label>
          <input
            id="marker_lab"
            v-model="formData.marker_lab"
            type="text"
            class="form-control"
            placeholder="e.g., Quest Diagnostics"
          />
        </div>

        <!-- Ordered By -->
        <div class="form-group">
          <label for="marker_ordered_by">Ordered By</label>
          <input
            id="marker_ordered_by"
            v-model="formData.marker_ordered_by"
            type="text"
            class="form-control"
            placeholder="e.g., Dr. Smith"
          />
        </div>
      </div>
    </div>

    <!-- ✅ NOTES SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-sticky-note"></i>
        Notes
      </h3>

      <div class="form-group">
        <label for="marker_notes">Additional Notes</label>
        <textarea
          id="marker_notes"
          v-model="formData.marker_notes"
          class="form-control"
          rows="4"
          placeholder="Any additional notes about this test..."
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
        {{ isEditing ? 'Update Marker' : 'Create Marker' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const props = defineProps({
  marker: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

// ✅ FORM DATA
const formData = ref({
  marker_name: '',
  marker_date: '',
  marker_result: '',
  marker_unit: '',
  marker_status: '',
  marker_range: '',
  marker_lab: '',
  marker_ordered_by: '',
  marker_notes: ''
});

// ✅ COMPUTED
const isEditing = computed(() => !!props.marker?.id);

const isFormValid = computed(() => {
  return formData.value.marker_name.trim() !== '' &&
         formData.value.marker_date !== '' &&
         formData.value.marker_result.trim() !== '';
});

// ✅ WATCH FOR PROP CHANGES
watch(
  () => props.marker,
  (newMarker) => {
    if (newMarker) {
      // Populate form with existing data
      formData.value = {
        id: newMarker.id,
        marker_name: newMarker.marker_name || '',
        marker_date: newMarker.marker_date || '',
        marker_result: newMarker.marker_result || '',
        marker_unit: newMarker.marker_unit || '',
        marker_status: newMarker.marker_status || '',
        marker_range: newMarker.marker_range || '',
        marker_lab: newMarker.marker_lab || '',
        marker_ordered_by: newMarker.marker_ordered_by || '',
        marker_notes: newMarker.marker_notes || ''
      };
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

  emit('save', { ...formData.value });
}

function handleCancel() {
  emit('cancel');
}

function resetForm() {
  formData.value = {
    marker_name: '',
    marker_date: '',
    marker_result: '',
    marker_unit: '',
    marker_status: '',
    marker_range: '',
    marker_lab: '',
    marker_ordered_by: '',
    marker_notes: ''
  };
}
</script>

<style scoped>
/* ✅ IMPORT SHARED FORM STYLES */
@import '@/assets/styles/ui-components.css';

/* ========================================
   HEALTH MARKER FORM
   ======================================== */

.health-marker-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.form-section:last-of-type {
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #667eea;
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .health-marker-form {
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