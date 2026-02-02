<template>
  <div class="travel-event-edit">
    <!-- Breadcrumbs -->
    <nav class="breadcrumb">
      <router-link to="/travels" class="breadcrumb-link">Travels</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link 
        :to="{ name: 'TravelDetails', params: { id: travelEvent?.travel_id } }" 
        class="breadcrumb-link"
      >
        {{ travel?.title || 'Travel Details' }}
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Edit Event</span>
    </nav>

    <!-- Main Content -->
    <BaseCard class="edit-card">
      <template #header>
        <h2>Edit Travel Event</h2>
      </template>
      
      <TravelEventForm
        v-if="travelEvent && !isLoading"
        :travel-event="travelEvent"
        :travel-id="travelEvent.travel_id"
        :travel-title="travelTitle"
        @save="handleUpdateEvent"
        @cancel="handleCancel"
      />
      
      <div v-else class="loading">
        Loading event details...
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import TravelEventForm from '@/components/travel_events/TravelEventForm.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const router = useRouter()
const route = useRoute()
const travelStore = useTravelStore()

// Reactive data
const travelEvent = ref(null)
const travel = ref({})
const isLoading = ref(true)
const eventId = computed(() => route.params.id)
const travelTitle = computed(() => travel.value?.title || '')

// Lifecycle
onMounted(async () => {
  await loadTravelEvent()
  if (travelEvent.value?.travel_id) {
    await loadTravel(travelEvent.value.travel_id)
  }
})

// Methods
const loadTravelEvent = async () => {
  try {
    isLoading.value = true
    travelEvent.value = await travelStore.fetchTravelEvent(eventId.value)
  } catch (error) {
    console.error('Error loading travel event:', error)
    router.push('/travels')
  } finally {
    isLoading.value = false
  }
}

const loadTravel = async (travelId) => {
  try {
    travel.value = await travelStore.fetchTravel(travelId)
  } catch (error) {
    console.error('Error loading travel:', error)
  }
}

const handleUpdateEvent = async (eventData) => {
  try {
    await travelStore.updateTravelEvent(eventId.value, eventData)
    router.push({ 
      name: 'TravelDetails', 
      params: { id: travelEvent.value.travel_id },
      query: { tab: 'events' }
    })
  } catch (error) {
    console.error('Error updating travel event:', error)
    // Handle error (show toast, etc.)
  }
}

const handleCancel = () => {
  router.push({ 
    name: 'TravelDetails', 
    params: { id: travelEvent.value?.travel_id },
    query: { tab: 'events' }
  })
}
</script>

<style scoped>
.travel-event-edit {
  max-width: 800px;
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
}

.edit-card {
  margin-top: 0;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}
</style>
