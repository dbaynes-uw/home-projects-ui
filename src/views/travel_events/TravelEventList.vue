<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <h1>{{ travel?.title || 'Travel' }} Details</h1>
  <router-link :to="{ name: 'Travels' }">
      <b>Back to List of Journies</b>
    </router-link>
  <br/>
  <br/>
  <h3>{{ statusMessage }}</h3>
  <span class="h3-left-total-child">Click to Change</span>
  <span class="h3-left-total-child">Double Click Item Below to Change</span>
  <br/>
  <div class="cards">
    <TravelEventCard
      v-for="travel_event in travel_events"
      :key="travel_event.id"
      :travel_event="travel_event"
    />
  </div>
  <p id="p-custom-link">
    <router-link
      :to="{ name: 'TravelEventCreate', params: { id: `${travel.id}` } }"
    >
      <b>Add Travel Event</b>
    </router-link>
  </p>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore as useVuexStore } from 'vuex' // For user data
import { useTravelStore } from '@/stores/travel/TravelStore'
import ConfirmDialogue from "@/components/ConfirmDialogue.vue"
import DateFormatService from "@/services/DateFormatService.js"
import TravelEventCard from "@/components/travel_events/TravelEventCard.vue"
import dayjs from 'dayjs'

// Props
defineProps(["id"])

// Composables
const route = useRoute()
const router = useRouter()
const vuexStore = useVuexStore() // For user data
const travelStore = useTravelStore()

// Reactive data
const statusMessage = ref('')
const successMessage = ref('')
// Computed properties
const travel = computed(() => travelStore.currentTravel)
const travel_events = computed(() => {
  return travelStore.travelEventsForTravel(route.params.id)
})

// Travel event template object (for future use)
const _travel_event = ref({
  id: "",
  travel_id: "",
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  transport: "",
  booking_reference: "",
  transport_url: "",
  travel_event_url: "",
  notes: "",
  created_by: computed(() => vuexStore.state.user?.resource_owner?.email || ''),
})

// Lifecycle hooks
onMounted(async () => {
  successMessage.value = route.query.success
  statusMessage.value = successMessage.value
  
  // Fetch travel and travel events
  await travelStore.fetchTravel(route.params.id)
  await travelStore.fetchTravelEvents(route.params.id)
})

// Methods (for future use if needed)
const _editTravel = (travel) => {
  router.push({ name: 'TravelEdit', params: { id: `${travel.id}` } })
}

const _editTravelEvent = (travel_event) => {
  router.push({ name: 'TravelEventEdit', params: { id: `${travel_event.id}` } })
}

const _hasEventPassed = (te) => {
  const formatDateToday = dayjs(new Date()).format("MM-DD-YY")
  return DateFormatService.formatYearDatejs(te.end_date) < formatDateToday ? 'event-has-passed' : 'card'
}

const _formatYearDate = (value) => {
  return DateFormatService.formatYearDatejs(value)
}
</script>