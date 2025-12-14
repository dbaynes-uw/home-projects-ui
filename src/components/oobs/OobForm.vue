<template>
  <form @submit.prevent="handleSubmit" class="oob-form">
    <!-- ✅ OOB INFORMATION SECTION -->
    <div class="form-section">
      <h3 class="section-title">
        <i class="fas fa-exclamation-triangle"></i>
        OOB Information
      </h3>

      <!-- ✅ DATE & TIME OF OCCURRENCE -->
      <div class="form-group">
        <label for="date_of_occurrence" class="required">Date & Time of Occurrence</label>
        <input
          id="date_of_occurrence"
          v-model="formData.date_of_occurrence"
          type="datetime-local"
          class="form-control"
          required
        />
      </div>

      <!-- ✅ DURATION - DROPDOWN -->
      <div class="form-group">
        <label for="duration">Duration</label>
        <select
          id="duration"
          v-model="formData.duration"
          class="form-control"
        >
          <option value="">Select Duration (Optional)</option>
          <option value="Short: < 1min">Short: &lt; 1min</option>
          <option value="Medium: 1 to 2mins">Medium: 1 to 2mins</option>
          <option value="Long: > 2mins">Long: &gt; 2mins</option>
        </select>
      </div>

      <!-- ✅ CIRCUMSTANCES -->
      <div class="form-group">
        <label for="circumstances">Circumstances / Notes</label>
        <textarea
          id="circumstances"
          v-model="formData.circumstances"
          class="form-control"
          rows="6"
          placeholder="Describe what happened, any triggers, symptoms, etc..."
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
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/ui/BaseButton.vue';

const props = defineProps({
  oob: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);

// ✅ VUEX STORE FOR USER
const store = useStore();

// ✅ FORM DATA - ONLY 4 FIELDS
const formData = ref({
  date_of_occurrence: '',
  duration: '',
  circumstances: ''
});

// ✅ COMPUTED
const isEditing = computed(() => !!props.oob?.id);

const isFormValid = computed(() => {
  return formData.value.date_of_occurrence !== '';
});

const user = computed(() => store.state.user);

// ✅ WATCH FOR PROP CHANGES
watch(
  () => props.oob,
  (newOob) => {
    console.log('📥 OOB prop received:', newOob);
    
    if (newOob) {
      // ✅ NO NEED TO FORMAT - STORE ALREADY DID IT!
      formData.value = {
        id: newOob.id,
        date_of_occurrence: newOob.date_of_occurrence || '', // Already formatted by store!
        duration: newOob.duration || '',
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
    duration: '',
    circumstances: ''
  };
}

// ✅ LIFECYCLE
onMounted(() => {
  console.log('📝 OobForm mounted. Editing mode:', isEditing.value);
});
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

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
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

.form-control:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

/* ✅ SELECT DROPDOWN STYLING */
select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ef4444' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  padding-right: 2.5rem;
}

select.form-control::-ms-expand {
  display: none;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(239, 68, 68, 0.1);
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .oob-form {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>