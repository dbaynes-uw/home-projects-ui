<!-- filepath: src/components/travels/TravelForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="travel-form">
    <div class="form-container">
      <!-- Title -->
      <BaseInput
        v-model="formData.title"
        label="Title"
        type="text"
        prepend-icon="airplane"
        required
        :error="errors.title"
        placeholder="Enter travel title"
      />
      
      <!-- Description -->
      <div class="form-field">
        <label class="form-label">
          <i class="mdi mdi-note-text"></i>
          Description
        </label>
        <textarea
          v-model="formData.description"
          class="form-textarea"
          rows="3"
          placeholder="Describe your travel plans"
        ></textarea>
        <div v-if="errors.description" class="form-error">
          <i class="mdi mdi-alert-circle"></i>
          {{ errors.description }}
        </div>
      </div>
      
      <!-- Departure Date -->
      <BaseInput
        v-model="formData.departure_date"
        label="Departure Date"
        type="datetime-local"
        prepend-icon="calendar-start"
        required
        :error="errors.departure_date"
      />
      
      <!-- Return Date -->
      <BaseInput
        v-model="formData.return_date"
        label="Return Date"
        type="datetime-local"
        prepend-icon="calendar-end"
        :error="errors.return_date"
      />
      
      <!-- Transportation Type -->
      <BaseInput
        v-model="formData.transport"
        label="Type of Transportation"
        type="text"
        prepend-icon="car"
        :error="errors.transport"
        placeholder="e.g. Flight, Car, Train"
      />
      
      <!-- Booking Reference -->
      <BaseInput
        v-model="formData.booking_reference"
        label="Booking Reference Number"
        type="text"
        prepend-icon="bookmark"
        :error="errors.booking_reference"
        placeholder="Confirmation or reference number"
      />
      
      <!-- Transport URL -->
      <BaseInput
        v-model="formData.transport_url"
        label="Transportation Booking Link"
        type="url"
        prepend-icon="link"
        :error="errors.transport_url"
        placeholder="Link to transportation booking"
      />
      
      <!-- URL Character Count -->
      <span v-if="formData.transport_url" class="text-caption">
        {{ urlMaxLength - formData.transport_url.length }} / {{ urlMaxLength }} characters remaining
      </span>
      
      <!-- Notes -->
      <div class="form-field">
        <label class="form-label">
          <i class="mdi mdi-note-text"></i>
          Notes
        </label>
        <textarea
          v-model="formData.notes"
          class="form-textarea"
          rows="4"
          placeholder="Additional notes or details"
        ></textarea>
        <div v-if="errors.notes" class="form-error">
          <i class="mdi mdi-alert-circle"></i>
          {{ errors.notes }}
        </div>
      </div>
      
      <!-- Form Actions -->
      <div class="form-actions">
        <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          block
        >
          {{ isEditMode ? 'Update Travel' : 'Create Travel' }}
        </BaseButton>
        
        <BaseButton
          @click="handleCancel"
          variant="secondary"
          block
        >
          Cancel
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore as useVuexStore } from 'vuex'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import dayjs from 'dayjs'

const props = defineProps({
  travel: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

// Composables
const vuexStore = useVuexStore()

// Reactive data
const isSubmitting = ref(false)
const errors = ref({})
const urlMaxLength = ref(255)

// Check if we're in edit mode
const isEditMode = computed(() => !!props.travel)

// Form data with defaults
const formData = ref({
  title: '',
  description: '',
  departure_date: '',
  return_date: '',
  transport: '',
  transport_url: '',
  booking_reference: '',
  notes: '',
  created_by: vuexStore.state.user?.resource_owner?.email || '',
})

// Form validation
const requiredTitle = (value) => {
  return !!value || 'Title is required'
}

const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.departure_date &&
         !Object.keys(errors.value).length
})

// Utility function to format dates for datetime-local input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  // Convert ISO date to YYYY-MM-DDTHH:MM format for datetime-local
  const date = dayjs(dateString);
  return date.isValid() ? date.format('YYYY-MM-DDTHH:mm') : '';
};

// Methods - Define before watchers to avoid hoisting issues
const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    departure_date: '',
    return_date: '',
    transport: '',
    transport_url: '',
    booking_reference: '',
    notes: '',
    created_by: vuexStore.state.user?.resource_owner?.email || '',
  }
  errors.value = {}
}

// Watch for travel changes (edit mode)
watch(() => props.travel, (newTravel) => {
  if (newTravel) {
    const data = { ...newTravel };
    
    // ✅ Format dates for datetime-local inputs
    if (data.departure_date) {
      data.departure_date = formatDateForInput(data.departure_date);
    }
    if (data.return_date) {
      data.return_date = formatDateForInput(data.return_date);
    }
    
    formData.value = data;
  } else {
    resetForm();
  }
}, { immediate: true });

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.title) {
    errors.value.title = 'Title is required'
  }
  
  if (!formData.value.departure_date) {
    errors.value.departure_date = 'Departure date is required'
  }
  
  if (formData.value.transport_url && formData.value.transport_url.length > urlMaxLength.value) {
    errors.value.transport_url = `URL must be less than ${urlMaxLength.value} characters`
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Prepare the travel data
    const travelData = {
      ...formData.value,
      created_by: vuexStore.state.user?.resource_owner?.email || ''
    }
    
    // Emit the save event with the form data
    emit('save', travelData)
  } catch (error) {
    console.error('Error submitting form:', error)
    // Handle error appropriately
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Expose reset method for parent components
defineExpose({
  resetForm
})
</script>

<style scoped>
.travel-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  padding: 16px;
}

.form-actions {
  margin-top: 24px;
}

.icon-css {
  color: #1976d2;
}

.text-caption {
  color: #666;
  font-size: 0.75rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-label i {
  color: #667eea;
  font-size: 1.1rem;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  background: white;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea::placeholder {
  color: #999;
  font-style: italic;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-error i {
  font-size: 1rem;
}

.notes-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  background: white;
}

.notes-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.notes-textarea::placeholder {
  color: #999;
  font-style: italic;
}

</style>