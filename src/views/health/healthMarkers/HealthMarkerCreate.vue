<template>
  <div class="health-marker-create-wrapper">
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
              <i class="fas fa-plus-circle"></i>
              New Health Marker
            </span>
          </h1>
        </div>

        <!-- ✅ FORM CARD - ADD mode="create" -->
        <div class="form-card">
          <HealthMarkerForm
            mode="create"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/health/HealthMarkerStore';
import HealthMarkerForm from '@/components/health/healthMarkers/HealthMarkerForm.vue';

// ✅ ROUTER & STORE
const router = useRouter();
const healthMarkerStore = useHealthMarkerStore();

// ✅ METHODS
async function handleSubmit(formData) {
  try {
    await healthMarkerStore.createHealthMarker(formData);
    router.push({ name: 'HealthMarkerList' });
  } catch (error) {
    console.error('❌ Create failed:', error);
    throw error; // Let form handle the error display
  }
}

function handleCancel() {
  router.push({ name: 'HealthMarkerList' });
}
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-create-wrapper {
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