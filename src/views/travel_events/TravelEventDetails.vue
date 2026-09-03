<template>
  <div class="travel-event-details">
    <!-- Breadcrumbs -->
    <nav class="breadcrumb">
      <router-link to="/travels" class="breadcrumb-link">Travels</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link 
        v-if="travel"
        :to="{ name: 'TravelDetails', params: { id: travel.id } }" 
        class="breadcrumb-link"
      >
        {{ travel.title || 'Travel Details' }}
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ travelEvent?.title || 'Event Details' }}</span>
    </nav>

    <!-- Main Content -->
    <BaseCard v-if="travelEvent" class="details-card">
      <template #header>
        <div class="header-content">
          <h2>{{ travelEvent.title }}</h2>
          <div class="header-actions">
            <BaseButton
              @click="handleEdit"
              variant="primary"
              size="small"
            >
              <i class="mdi mdi-pencil"></i>
              Edit Event
            </BaseButton>
            <BaseButton
              @click="handleDelete"
              variant="danger"
              size="small"
            >
              <i class="mdi mdi-delete"></i>
              Delete Event
            </BaseButton>
          </div>
        </div>
      </template>

      <section class="event-navigation" aria-label="Travel event navigation">
        <BaseButton
          variant="secondary"
          size="small"
          :disabled="!previousEvent"
          @click="goToEvent(previousEvent)"
        >
          <i class="mdi mdi-chevron-left"></i>
          Previous
        </BaseButton>

        <div class="event-position">
          <span>Event {{ currentEventPosition }} of {{ travelEvents.length }}</span>
          <strong>{{ travel?.title || 'Travel itinerary' }}</strong>
        </div>

        <BaseButton
          variant="secondary"
          size="small"
          :disabled="!nextEvent"
          @click="goToEvent(nextEvent)"
        >
          Next
          <i class="mdi mdi-chevron-right"></i>
        </BaseButton>
      </section>

      <section class="key-information" aria-labelledby="key-information-heading">
        <h3 id="key-information-heading">Key Information</h3>
        <div class="key-information-grid">
          <div v-if="travelEvent.start_date" class="key-information-item">
            <i class="mdi mdi-calendar-start"></i>
            <div><span>Starts</span><strong>{{ formatEventDate(travelEvent.start_date) }}</strong></div>
          </div>
          <div v-if="travelEvent.end_date" class="key-information-item">
            <i class="mdi mdi-calendar-end"></i>
            <div><span>Ends</span><strong>{{ formatEventDate(travelEvent.end_date) }}</strong></div>
          </div>
          <div v-if="travelEvent.transport" class="key-information-item">
            <i class="mdi mdi-train-car"></i>
            <div><span>Transportation</span><strong>{{ travelEvent.transport }}</strong></div>
          </div>
          <div v-if="travelEvent.booking_reference" class="key-information-item">
            <i class="mdi mdi-ticket-confirmation-outline"></i>
            <div><span>Booking</span><strong>{{ bookingReferenceLabel }}</strong></div>
          </div>
        </div>
        <div v-if="travelEvent.travel_event_url || travelEvent.transport_url" class="quick-links">
          <a v-if="travelEvent.travel_event_url" :href="travelEvent.travel_event_url" target="_blank" rel="noopener noreferrer">
            <i class="mdi mdi-open-in-new"></i> Event site
          </a>
          <a v-if="travelEvent.transport_url" :href="travelEvent.transport_url" target="_blank" rel="noopener noreferrer">
            <i class="mdi mdi-map-marker-path"></i> Directions
          </a>
        </div>
      </section>
      
      <!-- Debug: Show raw data -->
      <!--div style="background: #f0f0f0; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
        <strong>Debug - Raw travelEvent data:</strong>
        <pre style="overflow-x: auto;">{{ JSON.stringify(travelEvent, null, 2) }}</pre>
      </div-->
      
      <TravelEventCard
        :travel-event="travelEvent"
        class="event-card-details"
      />
    </BaseCard>
    
    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading">
      <i class="mdi mdi-loading mdi-spin"></i>
      Loading event details...
    </div>
    
    <!-- Error State -->
    <BaseCard v-else-if="error" class="error-card">
      <template #header>
        <h2>Error</h2>
      </template>
      
      <div class="error-content">
        <i class="mdi mdi-alert-circle-outline"></i>
        <p>{{ error }}</p>
        <BaseButton @click="handleRetry" variant="primary">
          Retry
        </BaseButton>
      </div>
    </BaseCard>
    
    <!-- Not Found State -->
    <BaseCard v-else class="not-found-card">
      <template #header>
        <h2>Event Not Found</h2>
      </template>
      
      <div class="not-found-content">
        <i class="mdi mdi-emoticon-sad-outline"></i>
        <p>The requested travel event could not be found.</p>
        <BaseButton @click="handleBackToTravels" variant="primary">
          Back to Travels
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Confirm Delete Dialog -->
    <BaseModal
      v-model="showDeleteDialog"
    >
      <template #header>
        <h3>Confirm Delete</h3>
      </template>
      
      <p>Are you sure you want to delete this travel event? This action cannot be undone.</p>
      
      <template #footer>
        <BaseButton
          @click="showDeleteDialog = false"
          variant="secondary"
        >
          Cancel
        </BaseButton>
        <BaseButton
          @click="confirmDelete"
          variant="danger"
          :loading="isDeleting"
        >
          Delete Event
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import TravelEventCard from '@/components/travel_events/TravelEventCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import DateFormatService from '@/services/DateFormatService.js'

const router = useRouter()
const route = useRoute()
const travelStore = useTravelStore()

// Reactive data
const travelEvent = ref(null)
const travel = ref(null)
const isLoading = ref(true)
const error = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

// Computed
const eventId = computed(() => route.params.id)
const travelEvents = computed(() => {
  if (!travelEvent.value?.travel_id) return []

  return travelStore.travelEventsForTravel(travelEvent.value.travel_id)
})
const currentEventIndex = computed(() =>
  travelEvents.value.findIndex(event => event.id === travelEvent.value?.id)
)
const currentEventPosition = computed(() =>
  currentEventIndex.value >= 0 ? currentEventIndex.value + 1 : 1
)
const previousEvent = computed(() =>
  currentEventIndex.value > 0 ? travelEvents.value[currentEventIndex.value - 1] : null
)
const nextEvent = computed(() =>
  currentEventIndex.value >= 0 && currentEventIndex.value < travelEvents.value.length - 1
    ? travelEvents.value[currentEventIndex.value + 1]
    : null
)
const bookingReferenceLabel = computed(() => {
  const bookingReference = travelEvent.value?.booking_reference
  return /^https?:\/\//i.test(bookingReference) ? 'Open booking reference' : bookingReference
})

// Lifecycle
onMounted(async () => {
  await loadTravelEvent()
})

watch(eventId, async () => {
  await loadTravelEvent()
})

// Methods
const loadTravelEvent = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    travelEvent.value = await travelStore.fetchTravelEvent(eventId.value)
    
    // Load associated travel details
    if (travelEvent.value?.travel_id) {
      travel.value = await travelStore.fetchTravel(travelEvent.value.travel_id)
      await travelStore.fetchTravelEvents(travelEvent.value.travel_id)
    }
  } catch (err) {
    console.error('Error loading travel event:', err)
    error.value = 'Failed to load travel event details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleEdit = () => {
  router.push({ 
    name: 'TravelEventEdit', 
    params: { id: travelEvent.value.id } 
  })
}

const goToEvent = (event) => {
  if (!event) return

  router.push({ name: 'TravelEventDetails', params: { id: event.id } })
}

const formatEventDate = (value) => DateFormatService.formatStandardDateTimejs(value)

const handleDelete = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true
    await travelStore.deleteTravelEvent(travelEvent.value)
    
    // Navigate back to travel details
    if (travel.value) {
      router.push({ 
        name: 'TravelDetails', 
        params: { id: travel.value.id },
        query: { tab: 'events' }
      })
    } else {
      router.push('/travels')
    }
  } catch (err) {
    console.error('Error deleting travel event:', err)
    error.value = 'Failed to delete travel event. Please try again.'
    showDeleteDialog.value = false
  } finally {
    isDeleting.value = false
  }
}

const handleRetry = () => {
  loadTravelEvent()
}

const handleBackToTravels = () => {
  router.push('/travels')
}
</script>
<style scoped>
.travel-event-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #6c757d;
}

.breadcrumb-current {
  color: #6c757d;
  font-weight: 500;
}

.details-card {
  margin-top: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h2 {
  margin: 0;
  color: #2c3e50;
}

.event-navigation {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) auto minmax(100px, 1fr);
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;
}

.event-navigation > :last-child {
  justify-self: end;
}

.event-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
}

.event-position span {
  color: #6c757d;
  font-size: 0.8rem;
}

.event-position strong {
  color: #2c3e50;
  font-size: 0.95rem;
}

.key-information {
  padding: 1.25rem 0;
  border-bottom: 1px solid #e9ecef;
}

.key-information h3 {
  margin: 0 0 0.9rem;
  color: #2c3e50;
  font-size: 1rem;
}

.key-information-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.key-information-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 3px solid #007bff;
}

.key-information-item > i {
  color: #007bff;
  font-size: 1.2rem;
}

.key-information-item div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.15rem;
}

.key-information-item span {
  color: #6c757d;
  font-size: 0.8rem;
}

.key-information-item strong {
  color: #2c3e50;
  overflow-wrap: anywhere;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.9rem;
}

.quick-links a {
  color: #0069d9;
  font-weight: 600;
  text-decoration: none;
}

.quick-links a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .event-navigation {
    grid-template-columns: 1fr 1fr;
  }

  .event-position {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .event-navigation > :last-child {
    justify-self: end;
  }
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.event-card-details {
  margin: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  gap: 1rem;
}

.loading i {
  font-size: 2rem;
  color: #007bff;
}

.error-card,
.not-found-card {
  margin-top: 0;
}

.error-content,
.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  gap: 1rem;
}

.error-content i,
.not-found-content i {
  font-size: 3rem;
  color: #dc3545;
}

.not-found-content i {
  color: #6c757d;
}

.error-content p,
.not-found-content p {
  margin: 0;
  font-size: 1.1rem;
  color: #6c757d;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .breadcrumb {
    flex-wrap: wrap;
  }
}
</style>
