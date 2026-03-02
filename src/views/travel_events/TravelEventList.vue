<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <br/>
  <h1>{{ travel?.title || 'Travel' }} Events</h1>
  <router-link :to="{ name: 'Travels' }">
    <b>Back to List of Journeys</b>
  </router-link>
  <br/><br/>

  <!-- View Toggle -->
  <div class="view-toggle">
    <button
      :class="['toggle-btn', { active: currentView === 'cards' }]"
      @click="currentView = 'cards'"
    >
      <i class="fas fa-th"></i>
      Cards
    </button>
    <button
      :class="['toggle-btn', { active: currentView === 'table' }]"
      @click="currentView = 'table'"
    >
      <i class="fas fa-list"></i>
      Table
    </button>
  </div>
  <br/>

  <!-- Cards View -->
  <div v-if="currentView === 'cards'" class="cards">
    <TravelEventCard
      v-for="travel_event in travel_events"
      :key="travel_event.id"
      :travel_event="travel_event"
    />
  </div>

  <!-- Table View -->
  <TravelEventIndex
    v-else-if="currentView === 'table'"
    :travelEvents="travel_events"
    @deleted="handleDeleted"
  />

  <p id="p-custom-link">
    <router-link
      :to="{ name: 'TravelEventCreate', params: { id: `${travel?.id}` } }"
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
import TravelEventIndex from "@/components/travel_events/TravelEventIndex.vue"
import dayjs from 'dayjs'

// Props
defineProps(["id"])

// Composables
const route = useRoute()
const router = useRouter()
const vuexStore = useVuexStore()
const travelStore = useTravelStore()

// Reactive data
const currentView = ref('cards')
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
  await travelStore.fetchTravel(route.params.id)
  await travelStore.fetchTravelEvents(route.params.id)
})

// Methods
const handleDeleted = () => {
  travelStore.fetchTravelEvents(route.params.id)
}

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

<style scoped>
.view-toggle {
  display: inline-flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
}

.toggle-btn:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.toggle-btn.active {
  background: #3b82f6;
  color: white;
}
</style>