<template>
  <div class="health-marker-edit-wrapper">
    <!-- ✅ PAGE HEADER WITH GRADIENT -->
    <div class="page-wrapper">
      <div class="page-container hm-track header-track gradient-health">
        <!-- ✅ BREADCRUMB -->
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <router-link :to="{ name: 'HealthMarkers' }" class="breadcrumb-link">
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
      </div>
    </div>

    <div class="content-wrapper">
      <div class="page-container hm-track">
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
          <router-link :to="{ name: 'HealthMarkers' }" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i>
            Back to List
          </router-link>
        </div>

        <!-- ✅ FORM CARD - ADD mode="edit" -->
        <div v-else class="form-card">
          <HealthMarkerForm
            :health-marker="healthMarker"
            mode="edit"
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
import { useHealthMarkerStore } from '@/stores/health/HealthMarkerStore';
import HealthMarkerForm from '@/components/health/healthMarkers/HealthMarkerForm.vue';

// ✅ ROUTER, ROUTE & STORE
const router = useRouter();
const route = useRoute();
const healthMarkerStore = useHealthMarkerStore();

// ✅ COMPUTED
const healthMarker = computed(() => {
  const id = parseInt(route.params.id);
  return healthMarkerStore.allHealthMarkers.find(m => m.id === id);
});

const isLoading = computed(() => healthMarkerStore.loading);

// ✅ METHODS
async function handleSubmit(formData) {
  try {
    const id = parseInt(route.params.id);
    await healthMarkerStore.updateHealthMarker(id, formData);
    router.push({ name: 'HealthMarkers' });
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error; // Let form handle the error display
  }
}

function handleCancel() {
  router.push({ name: 'HealthMarkers' });
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
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-edit-wrapper {
  --hm-track-width: 980px;
  width: 100%;
  min-height: 100vh;
}

.hm-track {
  width: min(var(--hm-track-width), calc(100% - 2rem));
  max-width: none;
  margin-left: auto;
  margin-right: auto;
}

/* Page wrapper spacing */
.page-wrapper {
  min-height: auto;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0.75rem;
  padding-bottom: 0.5rem;
}

.header-track {
  border-radius: 12px;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.header-track .page-header {
  margin-bottom: 0;
}

.header-track .page-header h1 {
  font-size: 1.25rem;
}

.content-wrapper {
  padding: 0.75rem 0 2rem;
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

.header-track .page-header h1 .breadcrumb-link i,
.header-track .page-header h1 > span i {
  font-size: 0.95rem;
  opacity: 0.9;
}

.breadcrumb-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.breadcrumb-separator {
  font-size: 0.95rem;
  opacity: 0.45;
  margin: 0 0.35rem;
}

/* Form card */
.form-card {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .header-track {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .header-track .page-header h1 {
    font-size: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 0.35rem;
    line-height: 1.3;
    text-align: left;
  }

  .breadcrumb-link {
    gap: 0.35rem;
  }

  .breadcrumb-link i {
    font-size: 0.85rem;
    opacity: 0.85;
  }

  .header-track .page-header h1 > span {
    flex: 1 1 100%;
    margin-top: 0.15rem;
    font-weight: 700;
  }

  .form-card {
    max-width: 100%;
  }

  .breadcrumb-separator {
    font-size: 0.8rem;
    opacity: 0.4;
    margin: 0 0.1rem;
  }
}
</style>