<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/sleepMarkers/SleepMarkerList.vue -->

<template>
  <div class="list-view-container">
    <!-- ✅ BREADCRUMB - Now from shared CSS -->
    <div class="breadcrumb-nav">
      <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
        <i class="fas fa-heartbeat"></i>
        Health Dashboard
      </router-link>
      <i class="fas fa-chevron-right breadcrumb-separator"></i>
      <span class="breadcrumb-current">Sleep Markers</span>
    </div>

    <!-- ✅ HEADER - Now from shared CSS -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-bed animated-icon"></i>
              Sleep Markers
            </h2>           
          </div>
          
          <div class="controls-section">
            <BaseButton
              variant="success"
              icon="plus"
              @click="openAddDialog"
            >
              Add Sleep Entry
            </BaseButton>
            
            <!-- ✅ VIEW TOGGLE - Now from shared CSS -->
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

      <!-- ✅ STATS - Now from shared CSS -->
      <div class="stats-row">
        <div class="stat-card stat-card-info">
          <div class="stat-icon">
            <i class="fas fa-moon"></i>
          </div>
          <div class="stat-value">{{ averageSleepHours }}</div>
          <div class="stat-label">Avg Sleep/Night</div>
        </div>
        
        <div class="stat-card stat-card-success">
          <div class="stat-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-value">{{ averageSleepQuality }}/10</div>
          <div class="stat-label">Avg Quality</div>
        </div>
        
        <div class="stat-card stat-card-danger">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-value">{{ averageAwakenings }}</div>
          <div class="stat-label">Avg Awakenings</div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-moon-stars"></i>
          </div>
          <div class="stat-value">{{ averageAwakeSleep }}</div>
          <div class="stat-label">Avg Awake</div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="stat-value">{{ averageRemSleep }}</div>
          <div class="stat-label">Avg REM</div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-cloud"></i>
          </div>
          <div class="stat-value">{{ averageCoreSleep }}</div>
          <div class="stat-label">Avg Core</div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-water"></i>
          </div>
          <div class="stat-value">{{ averageDeepSleep }}</div>
          <div class="stat-label">Avg Deep</div>
        </div>        
      </div>
    </BaseCard>

    <!-- ✅ LOADING - Now from shared CSS -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading sleep data...</p>
      </div>
    </BaseCard>

    <!-- ✅ CARDS VIEW - Now from shared CSS -->
    <div v-else-if="currentView === 'cards'" class="cards-view">
      <div class="cards-grid">
        <SleepMarkerCard
          v-for="marker in sleepMarkers"
          :key="marker.id"
          :marker="marker"
          @edit="editMarker"
          @delete="deleteMarker"
        />
      </div>
      
      <!-- ✅ EMPTY STATE - Now from shared CSS -->
      <BaseCard v-if="sleepMarkers.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="fas fa-bed empty-icon"></i>
          <p>No sleep entries yet. Start tracking your sleep!</p>
          <BaseButton variant="primary" icon="plus" @click="openAddDialog">
            Add First Entry
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <!-- Table View -->
    <SleepMarkerIndex
      v-if="currentView === 'table'"
      :sleepMarkers="sleepMarkers"
    />
    <SleepMarkerCalendar
      v-else-if="currentView === 'calendar'"
      :markers="sleepMarkers"
      @edit="editMarker"
      @date-click="openAddDialogForDate"
    />

    <SleepMarkerCharts
      v-else-if="currentView === 'charts'"
      :markers="sleepMarkers"
    />

    <!-- ✅ DIALOG -->
    <BaseModal
      v-model="showDialog"
      :title="selectedMarker?.id ? 'Edit Sleep Entry' : 'Add Sleep Entry'"
      size="large"
      @close="closeDialog"
    >
      <SleepMarkerForm
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
import { useSleepMarkerStore } from '@/stores/SleepMarkerStore';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import SleepMarkerCard from '@/components/health/sleepMarkers/SleepMarkerCard.vue';
import SleepMarkerIndex from '@/components/health/sleepMarkers/SleepMarkerIndex.vue';
import SleepMarkerCalendar from '@/components/health/sleepMarkers/SleepMarkerCalendar.vue';
import SleepMarkerCharts from '@/components/health/sleepMarkers/SleepMarkerCharts.vue';
import SleepMarkerForm from '@/components/health/sleepMarkers/SleepMarkerForm.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ PINIA STORE
const sleepMarkerStore = useSleepMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
const selectedMarker = ref(null);
const confirmDialogue = ref(null);

// ✅ VIEW OPTIONS
const views = [
  { value: 'cards', label: 'Cards', icon: 'th' },
  { value: 'table', label: 'Table', icon: 'list' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'charts', label: 'Charts', icon: 'chart-line' }
];

// ✅ COMPUTED
const sleepMarkers = computed(() => sleepMarkerStore.allSleepMarkers);
const isLoading = computed(() => sleepMarkerStore.isLoading);
const averageSleepHours = computed(() => sleepMarkerStore.averageSleepHours);
const averageSleepQuality = computed(() => sleepMarkerStore.averageSleepQuality);
const averageAwakeSleep = computed(() => sleepMarkerStore.averageAwakeSleep);
const averageRemSleep = computed(() => sleepMarkerStore.averageRemSleep);
const averageCoreSleep = computed(() => sleepMarkerStore.averageCoreSleep);
const averageDeepSleep = computed(() => sleepMarkerStore.averageDeepSleep);
const averageAwakenings = computed(() => sleepMarkerStore.averageAwakenings);

// ✅ METHODS
function openAddDialog() {
  selectedMarker.value = null;
  showDialog.value = true;
}

function openAddDialogForDate(date) {
  selectedMarker.value = { sleep_date: date };
  showDialog.value = true;
}

function editMarker(marker) {
  selectedMarker.value = { ...marker };
  showDialog.value = true;
}

async function deleteMarker(marker) {
  const ok = await confirmDialogue.value?.show({
    title: "Delete Sleep Entry",
    message: `Are you sure you want to delete the sleep entry for ${marker.sleep_date}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await sleepMarkerStore.deleteSleepMarker(marker.id);
    await confirmDialogue.value?.show({
      title: "Entry Deleted",
      message: "Sleep entry has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    await confirmDialogue.value?.show({
      title: "Delete Failed",
      message: "Failed to delete sleep entry. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

async function handleSave(markerData) {
  try {
    if (markerData.id) {
      await sleepMarkerStore.updateSleepMarker(markerData);
    } else {
      await sleepMarkerStore.createSleepMarker(markerData);
    }
    closeDialog();
  } catch (error) {
    alert('Failed to save sleep entry. Please try again.');
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedMarker.value = null;
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await sleepMarkerStore.fetchSleepMarkers();
  } catch (error) {
    alert('Failed to load sleep data. Please refresh the page.');
  }
});
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/list-view-components.css';

/* ========================================
   NO COMPONENT-SPECIFIC STYLES NEEDED!
   Everything comes from list-view-components.css! 🎉
   ======================================== */
</style>