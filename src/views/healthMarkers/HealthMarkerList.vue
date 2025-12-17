<template>
  <div class="health-marker-list-wrapper">
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
            <span>
              <i class="fas fa-heartbeat icon-health"></i>
              Health Markers
            </span>
          </h1>
        </div>

        <!-- ✅ CONTROLS ROW -->
        <div class="controls-row">
          <button class="btn btn-success" @click="handleCreate">
            <i class="fas fa-plus"></i>
            Add Health Marker
          </button>
          
          <!-- ✅ VIEW TOGGLE -->
          <div class="view-toggle">
            <button
              v-for="view in views"
              :key="view.value"
              :class="['view-btn', { active: currentView === view.value }]"
              @click="currentView = view.value"
              :title="view.label"
            >
              <i :class="`fas fa-${view.icon}`"></i>
              <span class="view-label">{{ view.label }}</span>
            </button>
          </div>
        </div>

        <!-- ✅ STATS CARDS -->
        <div class="stats-grid">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <i class="fas fa-vials"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ healthMarkerCount }}</div>
              <div class="stat-label">Total Markers</div>
            </div>
          </div>
          
          <div class="stat-card stat-info">
            <div class="stat-icon">
              <i class="fas fa-flask"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ uniqueMarkerNames.length }}</div>
              <div class="stat-label">Marker Types</div>
            </div>
          </div>
          
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statusCounts.Normal }}</div>
              <div class="stat-label">Normal</div>
            </div>
          </div>

          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statusCounts.High + statusCounts.Low }}</div>
              <div class="stat-label">Abnormal</div>
            </div>
          </div>

          <div class="stat-card stat-danger">
            <div class="stat-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statusCounts.Critical }}</div>
              <div class="stat-label">Critical</div>
            </div>
          </div>

          <div class="stat-card stat-info">
            <div class="stat-icon">
              <i class="fas fa-hospital"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ uniqueLabs.length }}</div>
              <div class="stat-label">Labs</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ CONTENT AREA -->
    <div class="content-wrapper">
      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading health markers...</p>
      </div>

      <!-- ✅ CARD VIEW -->
      <div v-else-if="currentView === 'cards'">
        <div v-if="healthMarkers.length > 0" class="cards-grid">
          <HealthMarkerCard
            v-for="marker in healthMarkers"
            :key="marker.id"
            :healthMarker="marker"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="fas fa-vials"></i>
          <h3>No Health Markers Yet</h3>
          <p>Start tracking your health by adding your first marker</p>
          <button class="btn btn-primary" @click="handleCreate">
            <i class="fas fa-plus"></i>
            Add First Marker
          </button>
        </div>
      </div>

      <!-- ✅ TABLE VIEW -->
      <HealthMarkerIndex
        v-else-if="currentView === 'table'"
        :healthMarkers="healthMarkers"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- ✅ CALENDAR VIEW (COMING SOON) -->
      <div v-else-if="currentView === 'calendar'" class="coming-soon">
        <i class="fas fa-calendar-alt"></i>
        <h3>Calendar View Coming Soon!</h3>
        <p>We're working on an awesome calendar view for your health markers.</p>
      </div>

      <!-- ✅ CHARTS VIEW (COMING SOON) -->
      <div v-else-if="currentView === 'charts'" class="coming-soon">
        <i class="fas fa-chart-line"></i>
        <h3>Charts View Coming Soon!</h3>
        <p>Visual analytics and trends will be available here soon.</p>
      </div>
    </div>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/HealthMarkerStore';
import HealthMarkerCard from '@/components/healthMarkers/HealthMarkerCard.vue';
import HealthMarkerIndex from '@/components/healthMarkers/HealthMarkerIndex.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ ROUTER & STORE
const router = useRouter();
const healthMarkerStore = useHealthMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const confirmDialogue = ref(null);

// ✅ VIEW OPTIONS
const views = [
  { value: 'cards', label: 'Cards', icon: 'th' },
  { value: 'table', label: 'Table', icon: 'list' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'charts', label: 'Charts', icon: 'chart-line' }
];

// ✅ COMPUTED FROM STORE
const healthMarkers = computed(() => healthMarkerStore.allHealthMarkers);
const isLoading = computed(() => healthMarkerStore.isLoading);
const healthMarkerCount = computed(() => healthMarkerStore.healthMarkerCount);
const uniqueMarkerNames = computed(() => healthMarkerStore.uniqueMarkerNames);
const uniqueLabs = computed(() => healthMarkerStore.uniqueLabs);
const statusCounts = computed(() => healthMarkerStore.statusCounts);

// ✅ METHODS

// Navigate to create page
function handleCreate() {
  router.push({ name: 'HealthMarkerCreate' });
}

// Navigate to edit page
function handleEdit(marker) {
  router.push({ 
    name: 'HealthMarkerEdit', 
    params: { id: marker.id } 
  });
}

// Delete marker with confirmation
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

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await healthMarkerStore.fetchHealthMarkers();
  } catch (error) {
    console.error('❌ Fetch error:', error);
    alert('Failed to load health markers. Please refresh the page.');
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.health-marker-list-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Page wrapper spacing */
.page-wrapper {
  padding-bottom: 2rem;
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

/* Controls row */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* View toggle buttons */
.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.view-btn:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.view-btn.active {
  background: #3b82f6;
  color: white;
}

.view-btn i {
  font-size: 1rem;
}

/* Coming soon placeholder */
.coming-soon {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
  display: block;
}

.coming-soon h3 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1.5rem;
  font-weight: 700;
}

.coming-soon p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

/* Content wrapper spacing */
.content-wrapper {
  padding-bottom: 120px;
}

/* Responsive */
@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-toggle {
    width: 100%;
    justify-content: space-around;
  }
  
  .view-label {
    display: none;
  }
  
  .view-btn {
    flex: 1;
    justify-content: center;
    padding: 0.75rem 0.5rem;
  }
  
  .breadcrumb-separator {
    font-size: 1.25rem;
    margin: 0 0.25rem;
  }
}
</style>