<template>
  <div class="travel-event-create">
    <!-- Breadcrumbs -->
    <nav class="breadcrumb">
      <router-link to="/travels" class="breadcrumb-link">Travels</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link 
        :to="{ name: 'TravelDetails', params: { id: travel?.id } }" 
        class="breadcrumb-link"
      >
        {{ travel?.title || 'Travel Details' }}
      </router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">Add Event</span>
    </nav>

    <!-- Main Content -->
    <BaseCard class="create-card">
      <template #header>
        <h2>Add Travel Event</h2>
      </template>
      
      <TravelEventForm
        v-if="!isLoading"
        :travel-id="travelId"
        :travel-title="travelTitle"
        @save="handleCreateEvent"
        @cancel="handleCancel"
      />
      
      <div v-else class="loading">
        Loading travel details...
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
const travel = ref({})
const isLoading = ref(true)
const travelId = computed(() => route.params.id)
const travelTitle = computed(() => travel.value?.title || '')

// Lifecycle
onMounted(async () => {
  await loadTravel()
})

// Methods
const loadTravel = async () => {
  try {
    isLoading.value = true
    travel.value = await travelStore.fetchTravel(travelId.value)
  } catch (error) {
    console.error('Error loading travel:', error)
    router.push('/travels')
  } finally {
    isLoading.value = false
  }
}

const handleCreateEvent = async (eventData) => {
  try {
    await travelStore.createTravelEvent(eventData)
    router.push({ 
      name: 'TravelDetails', 
      params: { id: travelId.value },
      query: { tab: 'events' }
    })
  } catch (error) {
    console.error('Error creating travel event:', error)
    // Handle error (show toast, etc.)
  }
}

const handleCancel = () => {
  router.push({ 
    name: 'TravelDetails', 
    params: { id: travelId.value },
    query: { tab: 'events' }
  })
}
</script>

<style scoped>
.travel-event-create {
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

.create-card {
  margin-top: 0;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}
</style>
