<template>
  <div class="list-view-container">
    <!-- ✅ BREADCRUMB NAVIGATION -->
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
        <i class="fas fa-heartbeat"></i>
        Health Dashboard
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Health Markers</span>
    </div>

    <!-- ✅ HEADER WITH CONTROLS -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-heartbeat animated-icon"></i>
              Health Markers
            </h2>           
          </div>
          
          <div class="controls-section">
            <!-- Add New Health Marker Button -->
            <BaseButton
              variant="success"
              icon="plus"
              @click="openAddDialog"
            >
              Add Health Marker
            </BaseButton>
            
            <!-- View Toggle Buttons -->
            <div class="view-toggle">
              <button
                v-for="view in views"
                :key="view.value"
                :class="['view-btn', { active: currentView === view.value }]"
                @click="currentView = view.value"
              >
                <i :class="`fas fa-${view.icon}`"></i>
                <span>{{ view.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ✅ STATS SUMMARY ROW -->
      <div class="stats-row">
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">
            <i class="fas fa-vials"></i>
          </div>
          <div class="stat-value">{{ healthMarkerCount }}</div>
          <div class="stat-label">Total Markers</div>
        </div>
        
        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="fas fa-flask"></i>
          </div>
          <div class="stat-value">{{ uniqueMarkerNames.length }}</div>
          <div class="stat-label">Marker Types</div>
        </div>
        
        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-value">{{ statusCounts.Normal }}</div>
          <div class="stat-label">Normal Results</div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-value">{{ statusCounts.High + statusCounts.Low }}</div>
          <div class="stat-label">Abnormal Results</div>
        </div>

        <div class="stat-card stat-card-danger">
          <div class="stat-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="stat-value">{{ statusCounts.Critical }}</div>
          <div class="stat-label">Critical Results</div>
        </div>

        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="fas fa-hospital"></i>
          </div>
          <div class="stat-value">{{ uniqueLabs.length }}</div>
          <div class="stat-label">Labs/Facilities</div>
        </div>
      </div>
    </BaseCard>

    <!-- ✅ LOADING STATE -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading health markers...</p>
      </div>
    </BaseCard>

    <!-- ✅ CARD VIEW -->
    <div v-else-if="currentView === 'cards'" class="cards-view">
      <div class="cards-grid">
        <HealthMarkerCard
          v-for="marker in healthMarkers"
          :key="marker.id"
          :healthMarker="marker"    
          @edit="editMarker"
          @delete="deleteMarker"
        />
      </div>
      
      <!-- Empty State -->
      <BaseCard v-if="healthMarkers.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="fas fa-vials empty-icon"></i>
          <p>No health markers yet. Start tracking your health!</p>
          <BaseButton variant="primary" icon="plus" @click="openAddDialog">
            Add First Marker
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- ✅ TABLE VIEW -->
    <HealthMarkerIndex
      v-else-if="currentView === 'table'"
      :healthMarkers="healthMarkers"
    />

    <!-- ✅ CALENDAR VIEW -->
    <!--HealthMarkerCalendar
      v-else-if="currentView === 'calendar'"
      :markers="healthMarkers"
      @edit="editMarker"
      @date-click="openAddDialogForDate"
    /-->
    <BaseCard v-else-if="currentView === 'calendar'" class="coming-soon-card">
      <div class="coming-soon-content">
        <i class="fas fa-calendar-alt"></i>
        <h3>Calendar View Coming Soon!</h3>
        <p>We're working on an awesome calendar view for your health markers.</p>
      </div>
    </BaseCard>
    <!-- ✅ CHARTS VIEW -->
    <!--HealthMarkerCharts
      v-else-if="currentView === 'charts'"
      :markers="healthMarkers"
    /-->
    <BaseCard v-else-if="currentView === 'charts'" class="coming-soon-card">
      <div class="coming-soon-content">
        <i class="fas fa-chart-line"></i>
        <h3>Charts View Coming Soon!</h3>
        <p>Visual analytics and trends will be available here soon.</p>
      </div>
    </BaseCard>
    <!-- ✅ ADD/EDIT DIALOG -->
    <BaseModal
      v-model="showDialog"
      :title="selectedMarker?.id ? 'Edit Health Marker' : 'Add Health Marker'"
      size="large"
      @close="closeDialog"
    >
      <HealthMarkerForm
        :marker="selectedMarker"
        @save="handleSave"
        @cancel="closeDialog"
      />
    </BaseModal>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useHealthMarkerStore } from '@/stores/HealthMarkerStore'; // ✅ Pinia!
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import HealthMarkerCard from '@/components/healthMarkers/HealthMarkerCard.vue';
import HealthMarkerIndex from '@/components/healthMarkers/HealthMarkerIndex.vue';
//import HealthMarkerCalendar from '@/components/healthMarkers/HealthMarkerCalendar.vue';
//import HealthMarkerCharts from '@/components/healthMarkers/HealthMarkerCharts.vue';
import HealthMarkerForm from '@/components/healthMarkers/HealthMarkerForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ PINIA STORE
const healthMarkerStore = useHealthMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
const selectedMarker = ref(null);
const confirmDialogue = ref(null);

// ✅ VIEW OTIONS
const views = [
  { value: 'cards', label: 'Cards', icon: 'th' },
  { value: 'table', label: 'Table', icon: 'list' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'charts', label: 'Charts', icon: 'chart-line' }
];

// ✅ COMUTED FROM PINIA STORE
const healthMarkers = computed(() => healthMarkerStore.allHealthMarkers);
const isLoading = computed(() => healthMarkerStore.isLoading);
const healthMarkerCount = computed(() => healthMarkerStore.healthMarkerCount);
const uniqueMarkerNames = computed(() => healthMarkerStore.uniqueMarkerNames);
const uniqueLabs = computed(() => healthMarkerStore.uniqueLabs);
const statusCounts = computed(() => healthMarkerStore.statusCounts);

// ✅ METHODS
function openAddDialog() {
  selectedMarker.value = null;
  showDialog.value = true;
}

function openAddDialogForDate(date) {
  selectedMarker.value = { marker_date: date };
  showDialog.value = true;
}

function editMarker(healthMarker) {     // ✅ Parameter name can be healthMarker
  selectedMarker.value = { ...healthMarker };
  showDialog.value = true;
}

async function deleteMarker(healthMarker) {    // ✅ Parameter name can be healthMarker
  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    return;
  }

  const ok = await confirmDialogue.value.show({
    title: "Delete Health Marker",
    message: `Are you sure you want to delete ${healthMarker.marker_name} from ${healthMarker.marker_date}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) {
    console.log('❌ Delete cancelled by user');
    return;
  }

  try {
    await healthMarkerStore.deleteHealthMarker(healthMarker.id);
    
    // Show success message
    await confirmDialogue.value.show({
      title: "Marker Deleted",
      message: "Health marker has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    
    // Show error message
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete health marker. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

async function handleSave(markerData) {
  try {
    if (markerData.id) {
      await healthMarkerStore.updateHealthMarker(markerData);
    } else {
      await healthMarkerStore.createHealthMarker(markerData);
    }
    closeDialog();
  } catch (error) {
    alert('Failed to save health marker. Please try again.');
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedMarker.value = null;
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await healthMarkerStore.fetchHealthMarkers();
  } catch (error) {
    alert('Failed to load health markers. Please refresh the page.');
  }
});
</script>

<style scoped>
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

/* ========================================
   COMING SOON PLACEHOLDER
   ======================================== */

.coming-soon-card {
  margin-top: 1.5rem;
}

.coming-soon-content {
  text-align: center;
  padding: 4rem 2rem;
}

.coming-soon-content i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
  display: block;
}

.coming-soon-content h3 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1.5rem;
  font-weight: 700;
}

.coming-soon-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}
</style>