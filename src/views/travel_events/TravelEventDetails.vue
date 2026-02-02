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
      v-if="showDeleteDialog"
      @close="showDeleteDialog = false"
    >
      <template #header>
        <h3>Confirm Delete</h3>
      </template>
      
      <p>Are you sure you want to delete this travel event? This action cannot be undone.</p>
      
      <template #actions>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import TravelEventCard from '@/components/travel_events/TravelEventCard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

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

// Lifecycle
onMounted(async () => {
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
