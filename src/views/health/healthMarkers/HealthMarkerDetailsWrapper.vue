<template>
  <div class="health-marker-details-wrapper">
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <!-- Breadcrumb -->
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'HealthMarkerList' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat icon-health"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-vial"></i>
              {{ healthMarker?.marker_name || 'Details' }}
            </span>
          </h1>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading marker details...
        </div>

        <!-- Error -->
        <div v-else-if="!healthMarker" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Health Marker Not Found</h3>
          <p>The requested health marker could not be found.</p>
          <router-link :to="{ name: 'HealthMarkerList' }" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i>
            Back to List
          </router-link>
        </div>

        <!-- ✅ USE FORM IN VIEW MODE -->
        <HealthMarkerForm
          v-else
          :health-marker="healthMarker"
          mode="view"
          @delete="handleDelete"
        />
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/HealthMarkerStore';
import HealthMarkerForm from '@/components/health/healthMarkers/HealthMarkerForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

const router = useRouter();
const route = useRoute();
const healthMarkerStore = useHealthMarkerStore();
const confirmDialogue = ref(null);

const healthMarker = computed(() => {
  const id = parseInt(route.params.id);
  return healthMarkerStore.allHealthMarkers.find(m => m.id === id);
});

const isLoading = computed(() => healthMarkerStore.loading);

async function handleDelete(marker) {
  if (!confirmDialogue.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Delete Health Marker",
    message: `Are you sure you want to delete ${marker.marker_name}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await healthMarkerStore.deleteHealthMarker(marker.id);
    
    await confirmDialogue.value.show({
      title: "Marker Deleted",
      message: "Health marker has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    router.push({ name: 'HealthMarkerList' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete health marker. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

onMounted(async () => {
  if (healthMarkerStore.allHealthMarkers.length === 0) {
    try {
      await healthMarkerStore.fetchHealthMarkers();
    } catch (error) {
      console.error('❌ Failed to load health markers:', error);
    }
  }
});
</script>

<style scoped>
@import '@/assets/styles/health-shared.css';

.health-marker-details-wrapper {
  width: 100%;
  min-height: 100vh;
}

.page-wrapper {
  padding-bottom: 120px;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 1.5rem;
  opacity: 0.6;
  margin: 0 0.5rem;
}

@media (max-width: 768px) {
  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>