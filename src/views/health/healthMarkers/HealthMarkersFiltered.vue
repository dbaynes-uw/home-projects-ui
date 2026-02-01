<template>
  <div class="health-markers-filtered-wrapper">
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
            <router-link :to="{ name: 'HealthMarkers' }" class="breadcrumb-link">
              <i class="fas fa-heartbeat"></i>
              Health Markers
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-filter icon-health"></i>
              {{ statusFilter }} Results
            </span>
          </h1>
        </div>

        <!-- ✅ FILTER INFO -->
        <div class="filter-info">
          <div class="filter-badges">
            <div class="filter-badge" :class="getBadgeClass()">
              <i :class="getStatusIcon()"></i>
              <span>{{ filteredMarkers.length }} markers with status: {{ statusFilter }}</span>
            </div>
            <div v-if="dateFilter" class="filter-badge badge-info">
              <i class="fas fa-calendar-alt"></i>
              <span>Date: {{ formatTestDate(dateFilter) }}</span>
            </div>
          </div>
          <router-link :to="{ name: 'HealthMarkers' }" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Back to All Markers
          </router-link>
        </div>
      </div>
    </div>

    <!-- ✅ CONTENT AREA -->
    <div class="content-wrapper">
      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading filtered health markers...</p>
      </div>

      <!-- ✅ NO RESULTS -->
      <div v-else-if="filteredMarkers.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>No {{ statusFilter }} Markers Found</h3>
        <p>There are no health markers with the status "{{ statusFilter }}".</p>
        <router-link :to="{ name: 'HealthMarkers' }" class="btn btn-primary">
          <i class="fas fa-arrow-left"></i>
          View All Markers
        </router-link>
      </div>

      <!-- ✅ FILTERED RESULTS -->
      <div v-else class="cards-container">
        <HealthMarkerCard
          v-for="marker in filteredMarkers"
          :key="marker.id"
          :healthMarker="marker"
          :panels="panels"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- ✅ DELETE CONFIRMATION MODAL -->
    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/health/HealthMarkerStore';
import HealthMarkerCard from '@/components/health/healthMarkers/HealthMarkerCard.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import EventService from '@/services/EventService';

// ✅ ROUTER & STORE
const route = useRoute();
const router = useRouter();
const healthMarkerStore = useHealthMarkerStore();

// ✅ REFS
const isLoading = ref(true);
const confirmDialogue = ref(null);
const panels = ref([]);

// ✅ COMPUTED
const statusFilter = computed(() => route.params.status || 'Unknown');
const dateFilter = computed(() => route.query.date || null);

const filteredMarkers = computed(() => {
  const status = statusFilter.value;
  let markers = healthMarkerStore.healthMarkers;
  
  // Filter by status first
  markers = markers.filter(marker => {
    const markerStatus = marker.marker_status || marker.status;
    if (!markerStatus) return false;
    
    // Exact match first
    if (markerStatus === status) return true;
    
    // Handle variations
    const normalizedMarkerStatus = markerStatus.toLowerCase().trim();
    const normalizedFilterStatus = status.toLowerCase().trim();
    
    return normalizedMarkerStatus === normalizedFilterStatus;
  });
  
  // Filter by date if specified
  if (dateFilter.value) {
    markers = markers.filter(marker => marker.marker_date === dateFilter.value);
  }
  
  return markers;
});

// ✅ METHODS
function getBadgeClass() {
  const status = statusFilter.value.toLowerCase();
  if (status.includes('normal')) return 'badge-success';
  if (status.includes('borderline') || status.includes('prediabetes') || status.includes('high') || status.includes('low')) return 'badge-warning';
  if (status.includes('critical') || status.includes('danger')) return 'badge-danger';
  return 'badge-info';
}

function getStatusIcon() {
  const status = statusFilter.value.toLowerCase();
  if (status.includes('normal')) return 'fas fa-check-circle';
  if (status.includes('borderline') || status.includes('prediabetes')) return 'fas fa-exclamation-triangle';
  if (status.includes('critical')) return 'fas fa-exclamation-circle';
  if (status.includes('high')) return 'fas fa-arrow-up';
  if (status.includes('low')) return 'fas fa-arrow-down';
  return 'fas fa-info-circle';
}

function handleView(marker) {
  router.push({ name: 'HealthMarkerView', params: { id: marker.id } });
}

function handleEdit(marker) {
  router.push({ name: 'HealthMarkerEdit', params: { id: marker.id } });
}

async function handleDelete(marker) {
  if (!confirmDialogue.value) return;

  const confirmed = await confirmDialogue.value.show({
    title: 'Delete Health Marker',
    message: `Are you sure you want to delete the ${marker.marker_name} test from ${formatDate(marker.marker_date)}?`,
    okButton: 'Delete',
    cancelButton: 'Cancel'
  });

  if (confirmed) {
    try {
      await healthMarkerStore.deleteHealthMarker(marker.id);
    } catch (error) {
      console.error('Error deleting health marker:', error);
      await confirmDialogue.value.show({
        title: 'Delete Failed',
        message: 'Failed to delete health marker. Please try again.',
        okButton: 'OK',
        cancelButton: null
      });
    }
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown Date';
  
  try {
    // Manual parsing to avoid timezone conversion issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.log('Date format error:', error);
    return dateString;
  }
}

function formatTestDate(dateString) {
  if (!dateString) return 'Unknown Date';
  
  try {
    // Manual parsing to avoid timezone conversion issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.log('Date format error:', error);
    return dateString;
  }
}

async function fetchPanels() {
  try {
    const response = await EventService.getHealthMarkerPanels();
    panels.value = response.data || [];
  } catch (error) {
    console.error('Error fetching panels:', error);
    panels.value = [];
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      healthMarkerStore.fetchHealthMarkers(),
      fetchPanels()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-markers-filtered-wrapper {
  min-height: 100vh;
}

/* Filter info section */
.filter-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.filter-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  color: white;
}

.filter-badge.badge-success {
  background: linear-gradient(135deg, #10b981, #047857);
}

.filter-badge.badge-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.filter-badge.badge-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.filter-badge.badge-info {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.filter-badge i {
  font-size: 1.25rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 50%;
  color: #9ca3af;
}

.empty-icon i {
  font-size: 3rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.empty-state p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

/* Cards container */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.loading-state p {
  font-size: 1rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-badges {
    align-self: stretch;
    justify-content: center;
  }

  .filter-badge {
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .cards-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
  }

  .empty-icon i {
    font-size: 2rem;
  }
}
</style>