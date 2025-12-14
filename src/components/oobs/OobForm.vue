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

      <!-- ✅ DURATION -->
      <div class="form-group">
        <label for="duration">Duration</label>
        <input
          id="duration"
          v-model="formData.duration"
          type="text"
          class="form-control"
          placeholder="e.g., 15 minutes, 1 hour, etc."
        />
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

      <!-- ✅ CREATED BY (READ-ONLY, AUTO-FILLED) -->
      <div class="form-group">
        <label for="created_by">Created By</label>
        <input
          id="created_by"
          v-model="formData.created_by"
          type="text"
          class="form-control"
          readonly
          disabled
        />
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
  circumstances: '',
  created_by: ''
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
      // Populate form with existing data
      formData.value = {
        id: newOob.id,
        date_of_occurrence: formatDatetimeLocal(newOob.date_of_occurrence) || '',
        duration: newOob.duration || '',
        circumstances: newOob.circumstances || '',
        created_by: newOob.created_by || ''
      };
      
      console.log('✅ Form populated with:', formData.value);
    } else {
      // Reset form for new entry
      resetForm();
      
      // Auto-fill created_by with current user
      if (user.value) {
        formData.value.created_by = user.value.email || user.value.username || user.value.name || 'Unknown User';
      }
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
    circumstances: '',
    created_by: ''
  };
}

// ✅ HELPER: Convert timestamp to datetime-local format
function formatDatetimeLocal(timestamp) {
  if (!timestamp) return '';
  
  try {
    console.log('🔍 Raw timestamp from API:', timestamp);
    
    // Method 1: Extract date/time directly from Rails timestamp format
    // Format: "2025-12-12 19:07:00.000000000 -0800"
    const match = timestamp.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
    
    if (match) {
      const [, year, month, day, hours, minutes, seconds] = match;
      
      // Extract timezone offset (e.g., "-0800")
      const tzMatch = timestamp.match(/([+-]\d{4})$/);
      
      if (tzMatch) {
        const tzOffset = tzMatch[1];
        
        // Build ISO 8601 string with timezone
        const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${tzOffset.slice(0, 3)}:${tzOffset.slice(3)}`;
        console.log('🔄 Constructed ISO string:', isoString);
        
        // Parse as Date (which handles timezone conversion)
        const date = new Date(isoString);
        
        // Format for datetime-local using the DATE'S local representation
        // This preserves the DISPLAY time from the API
        const localYear = date.getFullYear();
        const localMonth = String(date.getMonth() + 1).padStart(2, '0');
        const localDay = String(date.getDate()).padStart(2, '0');
        const localHours = String(date.getHours()).padStart(2, '0');
        const localMinutes = String(date.getMinutes()).padStart(2, '0');
        
        const formatted = `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}`;
        console.log('✅ Formatted for datetime-local:', formatted);
        return formatted;
      }
      
      // If no timezone, use the raw values (treat as local time)
      const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
      console.log('✅ Formatted (no TZ):', formatted);
      return formatted;
    }
    
    // Fallback: Try parsing as standard date
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      console.error('❌ Invalid date:', timestamp);
      return '';
    }
    
    // Format for datetime-local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log('✅ Formatted (fallback):', formatted);
    return formatted;
    
  } catch (error) {
    console.error('❌ Error formatting datetime:', error);
    return '';
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  // Auto-fill created_by if creating new OOB
  if (!isEditing.value && user.value) {
    formData.value.created_by = user.value.email || user.value.username || user.value.name || 'Unknown User';
  }
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