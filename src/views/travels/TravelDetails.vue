<template>
  <div class="travel-details">
    <!-- Breadcrumbs -->
    <nav class="breadcrumb">
      <router-link to="/travels" class="breadcrumb-link">Travels</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ travel?.title || 'Travel Details' }}</span>
    </nav>

    <!-- Travel Header Card -->
    <BaseCard class="travel-header-card">
      <template #header>
        <div class="header-content">
          <h2>{{ travel?.title || 'Travel' }} Overview, Details and Events</h2>
          <div class="header-actions">
            <BaseButton
              variant="primary"
              size="small"
              icon="edit"
              @click="openEditTravel"
            >
              Edit
            </BaseButton>
          </div>
        </div>
      </template>

      <!-- Status Message -->
      <div v-if="statusMessage" class="status-message">
        {{ statusMessage }}
      </div>

      <!-- Travel Info Summary -->
      <div v-if="travel" class="travel-summary">
        <div class="summary-item">
          <i class="mdi mdi-calendar"></i>
          <span>{{ formatDateRange() }}</span>
        </div>
        <div class="summary-item">
          <i class="mdi mdi-map-marker"></i>
          <span>{{ travel.description || 'No description' }}</span>
        </div>
        <div class="summary-item">
          <i class="mdi mdi-calendar-check"></i>
          <span>{{ travel_events?.length || 0 }} Events</span>
        </div>
      </div>
    </BaseCard>

    <!-- Travel Card -->
    <h2 class="section-title" style="margin-left: 1rem">Travel Details</h2>
    <TravelCard v-if="travel" :travel="travel" class="travel-card-display" />

    <!-- Search and Controls -->
    <BaseCard class="controls-card">
      <div class="controls-container">
        <div class="search-container">
          <BaseInput
            v-model="inputSearchText"
            type="text"
            placeholder="Search events..."
            prepend-icon="magnify"
            :append-icon="inputSearchText ? 'close' : null"
            @append-click="clearSearch"
            @input="searchColumns"
            class="search-input"
          />
        </div>
        
        <div class="view-toggle">
          <BaseButton
            @click="toggleView"
            :variant="requestIndexDetailFlag ? 'secondary' : 'primary'"
            size="small"
          >
            <i :class="requestIndexDetailFlag ? 'mdi-view-grid' : 'mdi-view-list'"></i>
            {{ requestIndexDetailFlag ? 'Card View' : 'List View' }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Events Section -->
    <BaseCard class="events-card">
      <template #header>
        <h3>Travel Events</h3>
        <div class="events-count">
          {{ displayedEvents.length }} of {{ travel_events?.length || 0 }} events
          <BaseButton
            @click="openAddEventDialog"
            variant="primary"
            size="small"
            class="button-in-heading"
          >
            <i class="mdi mdi-plus"></i>
            Add Event
          </BaseButton>
        </div>
      </template>

      <!-- No Events State -->
      <div v-if="!travel_events || travel_events.length === 0" class="empty-state">
        <i class="mdi mdi-calendar-plus"></i>
        <h4>No Events Yet</h4>
        <p>Start planning your journey by adding your first travel event.</p>
        <BaseButton
          :to="{ name: 'TravelEventCreate', params: { id: travel?.id } }"
          variant="primary"
        >
          <i class="mdi mdi-plus"></i>
          Add First Event
        </BaseButton>
      </div>

      <!-- No Search Results -->
      <div v-else-if="inputSearchText && displayedEvents.length === 0" class="no-results">
        <i class="mdi mdi-magnify"></i>
        <h4>No Results Found</h4>
        <p>No events match your search "{{ inputSearchText }}"</p>
        <BaseButton @click="clearSearch" variant="secondary">
          Clear Search
        </BaseButton>
      </div>

      <!-- Events List/Cards -->
      <div v-else class="events-container">
        <!-- Card View -->
        <div v-if="!requestIndexDetailFlag" class="events-grid">
          <div
            v-for="travel_event in displayedEvents"
            :key="travel_event.id"
            class="event-card"
          >
            <TravelEventCard
              :travel-event="travel_event"
              @delete="handleDeleteEvent"
            />
          </div>
        </div>

        <!-- List View -->
        <div v-else class="events-list">
          <TravelEventIndex :travel_events="displayedEvents" />
        </div>
      </div>
    </BaseCard>
    
    <!-- Edit Travel Modal -->
    <BaseModal
      v-model="showEditDialog"
      title="Edit Travel"
      size="large"
      @close="closeEditDialog"
    >
      <TravelForm
        :travel="travel"
        @save="handleSaveTravel"
        @cancel="closeEditDialog"
      />
    </BaseModal>
    
    <!-- Add Event Modal -->
    <BaseModal
      v-model="showAddEventDialog"
      title="Add Event"
      size="large"
      @close="closeAddEventDialog"
    >
      <TravelEventForm
        :travel-id="travel?.id"
        @save="handleSaveEvent"
        @cancel="closeAddEventDialog"
      />
    </BaseModal>
    
    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteDialog"
      @close="cancelDelete"
    >
      <template #header>
        <h3>Confirm Delete</h3>
      </template>
      
      <div class="delete-confirmation">
        <div class="warning-icon">
          <i class="mdi mdi-alert-circle-outline"></i>
        </div>
        <p>
          Are you sure you want to delete the event 
          <strong>"{{ eventToDelete?.title }}"</strong>?
        </p>
        <p class="warning-text">
          This action cannot be undone.
        </p>
        
        <!-- Action Buttons -->
        <div class="modal-actions">
          <BaseButton
            @click="cancelDelete"
            variant="secondary"
            :disabled="isDeleting"
          >
            Cancel
          </BaseButton>
          <BaseButton
            @click="confirmDeleteEvent"
            variant="danger"
            :loading="isDeleting"
          >
            Delete Event
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import TravelEventIndex from "@/components/travel_events/TravelEventIndex.vue"
import TravelEventCard from "@/components/travel_events/TravelEventCard.vue"
import TravelEventForm from '@/components/travel_events/TravelEventForm.vue'
import TravelForm from '@/components/travels/TravelForm.vue'
import TravelCard from '@/components/travels/TravelCard.vue'
import dayjs from 'dayjs'

// Props
defineProps(["id"])

// Composables
const route = useRoute()
const router = useRouter()
const travelStore = useTravelStore()

// Reactive data
const statusMessage = ref('')
const requestIndexDetailFlag = ref(false)
const inputSearchText = ref("")
const filteredResults = ref([])
const showDeleteDialog = ref(false)
const showEditDialog = ref(false)
const showAddEventDialog = ref(false)
const eventToDelete = ref(null)
const isDeleting = ref(false)

// Computed properties
const travel = computed(() => travelStore.currentTravel)
const travel_events = computed(() => {
  return travelStore.travelEventsForTravel(route.params.id)
})

const displayedEvents = computed(() => {
  if (inputSearchText.value && inputSearchText.value.length >= 2) {
    return filteredResults.value
  }
  return travel_events.value || []
})

// Lifecycle hooks
onMounted(async () => {
  // Handle success message from query params
  if (route.query.success) {
    statusMessage.value = route.query.success
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
  
  // Fetch travel and its events
  try {
    await travelStore.fetchTravel(route.params.id)
    await travelStore.fetchTravelEvents(route.params.id)
  } catch (error) {
    console.error('Error loading travel details:', error)
    router.push('/travels')
  }
})

// Watch for search input changes
watch(inputSearchText, (newValue) => {
  if (!newValue || newValue.length < 2) {
    filteredResults.value = []
    return
  }
  
  searchColumns()
}, { immediate: false })

// Methods
const toggleView = () => {
  requestIndexDetailFlag.value = !requestIndexDetailFlag.value
}

const clearSearch = () => {
  inputSearchText.value = ""
  filteredResults.value = []
}

const searchColumns = () => {
  filteredResults.value = []
  
  if (!inputSearchText.value || inputSearchText.value.length < 2) {
    return
  }
  
  const searchTerm = inputSearchText.value.toLowerCase()
  const events = travel_events.value || []
  
  filteredResults.value = events.filter(event => {
    const titleMatch = event.title?.toLowerCase().includes(searchTerm)
    const descriptionMatch = event.description?.toLowerCase().includes(searchTerm)
    const transportMatch = event.transport?.toLowerCase().includes(searchTerm)
    const notesMatch = event.notes?.toLowerCase().includes(searchTerm)
    
    return titleMatch || descriptionMatch || transportMatch || notesMatch
  })
}

const formatDateRange = () => {
  if (!travel.value?.departure_date || !travel.value?.return_date) {
    return 'Dates not specified'
  }
  
  const start = dayjs(travel.value.departure_date).format('MMM D, YYYY')
  const end = dayjs(travel.value.return_date).format('MMM D, YYYY')
  
  if (start === end) {
    return start
  }
  
  return `Flights: ${start}, Returning ${end}`
}

const openAddEventDialog = () => {
  showAddEventDialog.value = true
}

const closeAddEventDialog = () => {
  showAddEventDialog.value = false
}

const handleSaveEvent = async (eventData) => {
  try {
    await travelStore.createTravelEvent(eventData)
    
    // Show success message
    statusMessage.value = 'Event created successfully!'
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
    // Refresh events
    await travelStore.fetchTravelEvents(route.params.id)
    
    closeAddEventDialog()
  } catch (error) {
    console.error('Error creating travel event:', error)
    statusMessage.value = 'Failed to create event. Please try again.'
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

const openEditTravel = () => {
  showEditDialog.value = true
}

const closeEditDialog = () => {
  showEditDialog.value = false
}

const handleSaveTravel = async (travelData) => {
  try {
    await travelStore.updateTravel(travel.value.id, travelData)
    
    // Show success message
    statusMessage.value = 'Travel updated successfully!'
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
    // Refresh travel data
    await travelStore.fetchTravel(route.params.id)
    
    closeEditDialog()
  } catch (error) {
    console.error('Error updating travel:', error)
    statusMessage.value = 'Failed to update travel. Please try again.'
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

const handleDeleteEvent = (event) => {
  eventToDelete.value = event
  showDeleteDialog.value = true
}

const confirmDeleteEvent = async () => {
  if (!eventToDelete.value) return
  
  try {
    isDeleting.value = true
    await travelStore.deleteTravelEvent(eventToDelete.value)
    
    // Show success message
    statusMessage.value = `Event "${eventToDelete.value.title}" was successfully deleted.`
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
    // Refresh events
    await travelStore.fetchTravelEvents(route.params.id)
    
    // Clear search if the deleted event was in filtered results
    if (filteredResults.value.length > 0) {
      searchColumns()
    }
    
  } catch (error) {
    console.error('Error deleting travel event:', error)
    statusMessage.value = 'Failed to delete event. Please try again.'
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
    eventToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  eventToDelete.value = null
}
</script>

<style scoped>
.travel-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Breadcrumbs */
.breadcrumb {
  display: flex;
  align-items: center;
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

/* Header Card */
.travel-header-card {
  margin: 0;
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

.header-actions {
  display: flex;
  gap: 0.5rem;
}
.button-in-heading {
  margin-left: 3rem;
}
.status-message {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

/* Travel Summary */
.travel-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.summary-item i {
  color: #007bff;
  font-size: 1.1rem;
}

/* Controls Card */
.controls-card {
  margin: 0;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.view-toggle {
  flex-shrink: 0;
}

/* Events Card */
.events-card {
  margin: 0;
}

.events-count {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: normal;
}

/* Empty States */
.empty-state,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

.empty-state i,
.no-results i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.empty-state h4,
.no-results h4 {
  margin: 0;
  color: #495057;
}

.empty-state p,
.no-results p {
  margin: 0;
  color: #6c757d;
  max-width: 400px;
}

/* Events Container */
.events-container {
  margin-top: 1rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem 0;
}

.event-card {
  margin: 0;
}

.events-list {
  padding: 0.5rem 0;
}

/* Delete Confirmation Modal */
.delete-confirmation {
  text-align: center;
  padding: 1rem 0;
}

.warning-icon {
  margin-bottom: 1rem;
}

.warning-icon i {
  font-size: 3rem;
  color: #dc3545;
}

.delete-confirmation p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.warning-text {
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

/* Responsive Design */
@media (max-width: 768px) {
  .travel-details {
    padding: 0.5rem;
    gap: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .controls-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-container {
    max-width: none;
  }
  
  .travel-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .empty-state,
  .no-results {
    padding: 2rem 1rem;
  }
  
  .breadcrumb {
    flex-wrap: wrap;
  }
}
</style>