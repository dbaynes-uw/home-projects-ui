<!-- filepath: src/components/travel_events/TravelEventForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="travel-event-form">
    <div class="form-container">
      <!-- Travel Title (Read-only reference) -->
      <div v-if="travelTitle" class="travel-reference">
        <label class="reference-label">
          <i class="mdi mdi-airplane"></i>
          Journey
        </label>
        <div class="reference-value">{{ travelTitle }}</div>
      </div>
      
      <!-- Event Title -->
      <BaseInput
        v-model="formData.title"
        label="Event Title"
        type="text"
        prepend-icon="calendar-star"
        required
        :error="errors.title"
        placeholder="Enter event title"
      />
      
      <!-- Event Description -->
      <BaseInput
        v-model="formData.description"
        label="Event Description"
        type="text"
        prepend-icon="text-box-outline"
        :error="errors.description"
        placeholder="Describe the event"
      />
      
      <!-- Event Information URL -->
      <BaseInput
        v-model="formData.travel_event_url"
        label="Event Information (URL)"
        type="url"
        prepend-icon="link"
        :error="errors.travel_event_url"
        placeholder="Link to event information"
      />
      
      <!-- URL Character Count for Event URL -->
      <span v-if="formData.travel_event_url" class="text-caption">
        {{ urlMaxLength - formData.travel_event_url.length }} / {{ urlMaxLength }} characters remaining
      </span>
      
      <!-- Transportation Type -->
      <BaseInput
        v-model="formData.transport"
        label="Transportation Type"
        type="text"
        prepend-icon="car"
        :error="errors.transport"
        placeholder="e.g. Flight, Car, Train"
      />
      
      <!-- Booking Reference -->
      <BaseInput
        v-model="formData.booking_reference"
        label="Booking Reference"
        type="text"
        prepend-icon="bookmark"
        :error="errors.booking_reference"
        placeholder="Confirmation or reference number"
      />
      
      <!-- Transport URL -->
      <BaseInput
        v-model="formData.transport_url"
        label="Link to Transportation"
        type="url"
        prepend-icon="link-variant"
        :error="errors.transport_url"
        placeholder="Link to transportation booking"
      />
      
      <!-- URL Character Count for Transport URL -->
      <span v-if="formData.transport_url" class="text-caption">
        {{ urlMaxLength - formData.transport_url.length }} / {{ urlMaxLength }} characters remaining
      </span>
      
      <!-- Start Date -->
      <BaseInput
        v-model="formData.start_date"
        label="Start Date"
        type="datetime-local"
        prepend-icon="calendar-start"
        required
        :error="errors.start_date"
      />
      
      <!-- End Date -->
      <BaseInput
        v-model="formData.end_date"
        label="End Date"
        type="datetime-local"
        prepend-icon="calendar-end"
        :error="errors.end_date"
      />
      
      <!-- Notes -->
      <BaseInput
        v-model="formData.notes"
        label="Notes"
        type="textarea"
        prepend-icon="note-text"
        :error="errors.notes"
        placeholder="Additional notes or details"
      />
      
      <!-- Form Actions -->
      <div class="form-actions">
        <BaseButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
          block
        >
          {{ isEditMode ? 'Update Event' : 'Create Event' }}
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
  travelEvent: {
    type: Object,
    default: null
  },
  travelId: {
    type: [String, Number],
    required: true
  },
  travelTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save', 'cancel'])

// Composables
const vuexStore = useVuexStore()

// Utilities
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  // Format for datetime-local input (YYYY-MM-DDTHH:MM)
  return dayjs(dateString).format('YYYY-MM-DDTHH:mm')
}

const formatDateForAPI = (dateString) => {
  if (!dateString) return null
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
}

// Reactive data
const isSubmitting = ref(false)
const errors = ref({})
const urlMaxLength = ref(255)

// Check if we're in edit mode
const isEditMode = computed(() => !!props.travelEvent)

// Form data with defaults
const formData = ref({
  id: '',
  travel_id: props.travelId,
  title: '',
  description: '',
  travel_event_url: '',
  start_date: '',
  end_date: '',
  transport: '',
  booking_reference: '',
  transport_url: '',
  notes: '',
  created_by: computed(() => vuexStore.state.user?.resource_owner?.email || ''),
})

// Form validation
const isFormValid = computed(() => {
  return formData.value.title && 
         formData.value.start_date &&
         !Object.keys(errors.value).length
})

// Methods
const resetForm = () => {
  formData.value = {
    id: '',
    travel_id: props.travelId,
    title: '',
    description: '',
    travel_event_url: '',
    start_date: '',
    end_date: '',
    transport: '',
    booking_reference: '',
    transport_url: '',
    notes: '',
    created_by: vuexStore.state.user?.resource_owner?.email || '',
  }
  errors.value = {}
}

// Watch for travelEvent changes (edit mode)
watch(() => props.travelEvent, (newTravelEvent) => {
  if (newTravelEvent) {
    // Populate form with existing travel event data for editing
    formData.value = {
      ...newTravelEvent,
      start_date: formatDateForInput(newTravelEvent.start_date),
      end_date: formatDateForInput(newTravelEvent.end_date)
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for travelId changes
watch(() => props.travelId, (newTravelId) => {
  formData.value.travel_id = newTravelId
}, { immediate: true })

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.title) {
    errors.value.title = 'Event title is required'
  }
  
  if (!formData.value.start_date) {
    errors.value.start_date = 'Start date is required'
  }
  
  if (formData.value.end_date && formData.value.start_date) {
    const startDate = new Date(formData.value.start_date)
    const endDate = new Date(formData.value.end_date)
    if (endDate < startDate) {
      errors.value.end_date = 'End date must be after start date'
    }
  }
  
  if (formData.value.travel_event_url && formData.value.travel_event_url.length > urlMaxLength.value) {
    errors.value.travel_event_url = `URL must be less than ${urlMaxLength.value} characters`
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
    // Prepare the travel event data with formatted dates
    const travelEventData = {
      ...formData.value,
      travel_id: props.travelId,
      start_date: formatDateForAPI(formData.value.start_date),
      end_date: formData.value.end_date ? formatDateForAPI(formData.value.end_date) : null,
      created_by: vuexStore.state.user?.resource_owner?.email || ''
    }
    
    // Emit the save event with the form data
    emit('save', travelEventData)
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
.travel-event-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.readonly-field {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.travel-reference {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.reference-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.reference-value {
  color: #212529;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.text-caption {
  color: #6c757d;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Character count spacing */
.form-container > .text-caption {
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}
</style>