<template>
  <div class="health-marker-create-wrapper">
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
              <i class="fas fa-plus-circle"></i>
              New Health Marker
            </span>
          </h1>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="page-container hm-track">
        <!-- ✅ FORM CARD -->
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
    router.push({ name: 'HealthMarkers' });
  } catch (error) {
    console.error('❌ Create failed:', error);
    throw error; // Let form handle the error display
  }
}

function handleCancel() {
  router.push({ name: 'HealthMarkers' });
}
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-create-wrapper {
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
  width: 100%;
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