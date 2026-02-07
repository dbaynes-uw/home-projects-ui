<template>
  <div 
    :class="{ 'event-has-passed': hasEventPassed(props.travelEvent), 'card': isEventCurrent(props.travelEvent)}"
    @dblclick="navigateToDetails"
  >
    <h2>{{ props.travelEvent.title }}</h2>
    <ul>
      <li class="li-left">Event Description:</li>
      <b class="li-left-none" v-for="(description, idx) in 
          joinedDescription(props.travelEvent)"
          :key="idx">{{ description }}
        </b>
      
      <span v-if="startsWithHtml(props.travelEvent.travel_event_url)">
        <li class="li-left">Event Information:
          <br/><b><a :href="props.travelEvent.travel_event_url" target="_blank" class="detail-link-blue">Link to {{ props.travelEvent.title }} site</a></b></li>
      </span>
      <span v-if="startsWithHtml(props.travelEvent.booking_reference)">
        <li class="li-left">Booking Reference:
          <b><a :href="props.travelEvent.booking_reference" target="_blank">Link</a></b></li>
      </span>
      <span v-if="props.travelEvent.booking_reference && !startsWithHtml(props.travelEvent.booking_reference)">
        <li class="li-left">Booking Reference:
          <br/><b>{{ props.travelEvent.booking_reference }}</b></li>
      </span>
      <li class="li-left">Transportation: <b>{{ props.travelEvent.transport }}</b></li>
      <span v-if="props.travelEvent.transport_url" style="margin-left: 2rem;">
        <b><a :href="props.travelEvent.transport_url" target="_blank" class="detail-link-blue">Map/Link</a></b>
      </span>
      <span v-if="props.travelEvent.start_date">
        <li class="li-left">Start: <b>{{ formatStandardDateTime(props.travelEvent.start_date) }}</b></li>
      </span>
      <span v-if="props.travelEvent.end_date">
        <li class="li-left">End: <b>{{ formatStandardDateTime(props.travelEvent.end_date) }}</b></li>
      </span>
      <li class="li-left">Notes:</li>
      <b class="li-left-none" v-for="(notes, idx) in 
          joinedNotes(props.travelEvent)"
          :key="idx">{{ notes }}
        </b>
    </ul>
    
    <!-- Action Buttons -->
    <!--div class="event-actions">
      <button 
        class="btn-action btn-edit"
        @click.stop="handleEdit"
        title="Edit Event"
      >
        <i class="mdi mdi-pencil"></i>
        @@Edit
      </button>
      <button 
        class="btn-action btn-delete"
        @click.stop="handleDelete"
        title="Delete Event"
      >
        <i class="mdi mdi-delete"></i>
        Delete
      </button>
    </div-->
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue"
import DateFormatService from "@/services/DateFormatService.js"
import dayjs from 'dayjs'

// Props
const props = defineProps({
  travelEvent: {
    type: Object,
    default: () => ({})
  }
})

// Emit events
const emit = defineEmits(['delete'])

// Composables
const travelStore = useTravelStore()
const router = useRouter()

// Reactive data
const splitLength = ref(30)
const statusMessage = ref('')
const confirmDialogue = ref(null)

// Methods
const navigateToDetails = () => {
  router.push({ name: 'TravelEventDetails', params: { id: props.travelEvent.id } })
}

const handleEdit = () => {
  router.push({ 
    name: 'TravelEventEdit', 
    params: { id: props.travelEvent.id } 
  })
}

const handleDelete = () => {
  emit('delete', props.travelEvent)
}

const startsWithHtml = (event) => {
  return event && event.startsWith('https')
}

const joinedDescription = (e) => {
  if (e.description != null) { 
    return e.description.split('\n')
  }
  return []
}

const joinedNotes = (e) => {
  if (e.notes != null) { 
    return e.notes.split('\n')
  }
  return []
}

const formatStandardDateTime = (value) => {
  return DateFormatService.formatStandardDateTimejs(value)
}

const hasEventPassed = (event) => {
  const formatDateTime = dayjs(new Date()).format("MM-DD-YY H:mma")
  return DateFormatService.formatDateTimejs(event.end_date) < formatDateTime
}

const isEventCurrent = (t) => {
  const formatDateToday = dayjs(new Date()).format("MM-DD-YY")
  return DateFormatService.formatYearDatejs(t.return_date) < formatDateToday
}
</script>
<style scoped>
.event-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  justify-content: flex-end;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-action i {
  font-size: 0.875rem;
}

.detail-link-blue {
  margin-left: 0rem;
  text-decoration: underline !important;
  color: blue;
  text-decoration: none;
}
</style>
