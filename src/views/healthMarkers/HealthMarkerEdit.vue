<template>
  <div class="health-marker-edit-wrapper">
    <!-- ✅ PAGE HEADER WITH GRADIENT -->
    <div class="page-wrapper gradient-health">
      <div class="page-container">
        <!-- ✅ BREADCRUMB -->
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
              <i class="fas fa-edit"></i>
              Edit Health Marker
            </span>
          </h1>
        </div>

        <!-- ✅ LOADING STATE -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading health marker...
        </div>

        <!-- ✅ ERROR STATE -->
        <div v-else-if="!healthMarker" class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Health Marker Not Found</h3>
          <p>The requested health marker could not be found.</p>
          <router-link :to="{ name: 'HealthMarkerList' }" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i>
            Back to List
          </router-link>
        </div>

        <!-- ✅ FORM CARD -->
        <div v-else class="form-card">
          <HealthMarkerForm
            :health-marker="healthMarker"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/HealthMarkerStore';
import HealthMarkerForm from '@/components/healthMarkers/HealthMarkerForm.vue';

// ✅ ROUTER, ROUTE & STORE
const router = useRouter();
const route = useRoute();
const healthMarkerStore = useHealthMarkerStore();

// ✅ COMPUTED
const healthMarker = computed(() => {
  const id = parseInt(route.params.id);
  return healthMarkerStore.allHealthMarkers.find(m => m.id === id);
});

const isLoading = computed(() => healthMarkerStore.isLoading);

// ✅ METHODS
async function handleSubmit(formData) {
  try {
    const id = parseInt(route.params.id);
    await healthMarkerStore.updateHealthMarker(id, formData);
    router.push({ name: 'HealthMarkerList' });
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error; // Let form handle the error display
  }
}

function handleCancel() {
  router.push({ name: 'HealthMarkerList' });
}

// ✅ LIFECYCLE
onMounted(async () => {
  if (healthMarkerStore.allHealthMarkers.length === 0) {
    try {
      await healthMarkerStore.fetchHealthMarkers();
    } catch (error) {
      console.error('❌ Failed to load health markers:', error);
    }
  }
  
  if (!healthMarker.value) {
    console.warn('⚠️ Health marker not found:', route.params.id);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-edit-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Page wrapper spacing */
.page-wrapper {
  padding-bottom: 120px;
}

/* Breadcrumb styling */
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

/* Form card */
.form-card {
  max-width: 900px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }

  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>