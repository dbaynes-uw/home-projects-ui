<template>
  <div class="travel-edit-container">
    <!-- ✅ BREADCRUMB -->
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'Home' }" class="breadcrumb-link">
        <i class="fas fa-home"></i>
        Home
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <router-link :to="{ name: 'Travels' }" class="breadcrumb-link">
        Travels
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Edit Travel</span>
    </div>

    <!-- ✅ HEADER -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <h2>
            <i class="fas fa-edit animated-icon"></i>
            Edit Travel: {{ travel?.title || 'Loading...' }}
          </h2>
        </div>
      </template>
    </BaseCard>

    <!-- ✅ LOADING STATE -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading travel...</p>
      </div>
    </BaseCard>

    <!-- ✅ FORM CARD -->
    <BaseCard v-else-if="travel" class="form-card">
      <template #header>
        <h3>Travel Details</h3>
      </template>

      <TravelForm
        :travel="travel"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </BaseCard>

    <!-- ✅ ERROR STATE -->
    <BaseCard v-else class="error-card">
      <div class="error-content">
        <i class="fas fa-exclamation-circle"></i>
        <p>Travel not found or failed to load</p>
        <BaseButton variant="primary" @click="goBack">
          Go Back
        </BaseButton>
      </div>
    </BaseCard>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TravelForm from '@/components/travels/TravelForm.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'

// ✅ COMPOSABLES
const router = useRouter()
const route = useRoute()
const travelStore = useTravelStore()

// ✅ REACTIVE STATE
const isLoading = ref(true)
const confirmDialogue = ref(null)

// ✅ COMPUTED PROPERTIES
const travel = computed(() => travelStore.currentTravel)

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    const travelId = route.params.id
    if (travelId) {
      await travelStore.fetchTravel(travelId)
    }
  } catch (error) {
    console.error('Error loading travel:', error)
  } finally {
    isLoading.value = false
  }
})

// ✅ METHODS
const handleSave = async (travelData) => {
  try {
    const confirmed = await confirmDialogue.value.show(
      'Update Travel',
      `Are you sure you want to update "${travelData.title}"?`
    )
    
    if (confirmed) {
      await travelStore.updateTravel(route.params.id, travelData)
      router.push({ name: 'TravelDetails', params: { id: route.params.id } })
    }
  } catch (error) {
    console.error('Error updating travel:', error)
    alert('Failed to update travel. Please try again.')
  }
}

const handleCancel = () => {
  router.push({ name: 'TravelDetails', params: { id: route.params.id } })
}

const goBack = () => {
  router.push({ name: 'Travels' })
}
</script>
<style scoped>
/* ✅ LAYOUT */
.travel-edit-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

/* ✅ BREADCRUMB */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
}

.breadcrumb-separator {
  font-size: 0.75rem;
}

.breadcrumb-current {
  font-weight: 500;
}

/* ✅ HEADER */
.header-card {
  margin-bottom: 1.5rem;
}

.header-content h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: var(--color-text-primary);
}

.animated-icon {
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.animated-icon:hover {
  transform: scale(1.1);
}

/* ✅ FORM CARD */
.form-card {
  margin-bottom: 1.5rem;
}

/* ✅ LOADING */
.loading-card {
  margin: 2rem 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ✅ ERROR STATE */
.error-card {
  margin: 2rem 0;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.error-content i {
  font-size: 3rem;
  color: var(--color-error);
  opacity: 0.6;
}

.error-content p {
  margin: 0;
  color: var(--color-text-secondary);
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .travel-edit-container {
    padding: 0.5rem;
  }
  
  .header-content h2 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
