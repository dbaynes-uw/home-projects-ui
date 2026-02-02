<template>
  <div class="travel-create-container">
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
      <span class="breadcrumb-current">Create New Travel</span>
    </div>

    <!-- ✅ HEADER -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <h2>
            <i class="fas fa-plus animated-icon"></i>
            Create a New Journey
          </h2>
          <p class="subtitle">Plan your next adventure</p>
        </div>
      </template>
    </BaseCard>

    <!-- ✅ FORM CARD -->
    <BaseCard class="form-card">
      <template #header>
        <h3>Travel Details</h3>
      </template>

      <TravelForm
        @save="handleSave"
        @cancel="handleCancel"
      />
    </BaseCard>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useTravelStore } from '@/stores/travel/TravelStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import TravelForm from '@/components/travels/TravelForm.vue'

// ✅ COMPOSABLES
const router = useRouter()
const travelStore = useTravelStore()

// ✅ METHODS
const handleSave = async (travelData) => {
  try {
    await travelStore.createTravel(travelData)
    router.push({ name: 'Travels' })
  } catch (error) {
    console.error('Error creating travel:', error)
    alert('Failed to create travel. Please try again.')
  }
}

const handleCancel = () => {
  router.push({ name: 'Travels' })
}
</script>
<style scoped>
/* ✅ LAYOUT */
.travel-create-container {
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
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
}

.animated-icon {
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.animated-icon:hover {
  transform: scale(1.1);
}

.subtitle {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* ✅ FORM CARD */
.form-card {
  margin-bottom: 1.5rem;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .travel-create-container {
    padding: 0.5rem;
  }
  
  .header-content h2 {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
