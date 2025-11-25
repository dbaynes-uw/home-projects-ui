<template>
  <v-container fluid class="sleep-markers-container">
    <!-- ✅ HEADER WITH CONTROLS -->
    <v-card class="header-card mb-4">
      <v-card-title class="d-flex align-center justify-space-between flex-wrap">
        <div class="title-section">
          <h2>
            <i class="fas fa-bed bed-icon"></i>
            Sleep Markers Dashboard
          </h2>
        </div>
        
        <div class="controls-section d-flex align-center gap-2">
          <!-- Add New Sleep Entry Button -->
          <v-btn
            color="success"
            @click="openAddDialog"
            prepend-icon="fas fa-plus"
          >
            Add Sleep Entry
          </v-btn>
          
          <!-- View Toggle Buttons -->
          <v-btn-toggle
            v-model="currentView"
            color="primary"
            mandatory
            class="view-toggle"
          >
            <v-btn value="cards" size="small">
              <i class="fas fa-th"></i>
              <span class="ml-2">Cards</span>
            </v-btn>
            <v-btn value="table" size="small">
              <i class="fas fa-list"></i>
              <span class="ml-2">Table</span>
            </v-btn>
            <v-btn value="calendar" size="small">
              <i class="fas fa-calendar"></i>
              <span class="ml-2">Calendar</span>
            </v-btn>
            <v-btn value="charts" size="small">
              <i class="fas fa-chart-line"></i>
              <span class="ml-2">Charts</span>
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-card-title>

      <!-- ✅ STATS SUMMARY ROW -->
      <v-card-text>
        <v-row class="stats-row">
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" color="info" variant="tonal">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <i class="fas fa-moon"></i>
                </div>
                <div class="stat-value">{{ averageSleepHours }}h</div>
                <div class="stat-label">Avg Sleep/Night</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" color="success" variant="tonal">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="stat-value">{{ averageSleepQuality }}/10</div>
                <div class="stat-label">Avg Quality</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" color="warning" variant="tonal">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <i class="fas fa-brain"></i>
                </div>
                <div class="stat-value">{{ averageDeepSleep }}h</div>
                <div class="stat-label">Avg Deep Sleep</div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6" md="3">
            <v-card class="stat-card" color="error" variant="tonal">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="stat-value">{{ averageAwakenings }}</div>
                <div class="stat-label">Avg Awakenings</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ✅ LOADING STATE -->
    <v-card v-if="isLoading" class="text-center pa-5">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-3">Loading sleep data...</p>
    </v-card>

    <!-- ✅ CARD VIEW -->
    <div v-else-if="currentView === 'cards'" class="cards-view">
      <v-row>
        <v-col
          v-for="marker in sleepMarkers"
          :key="marker.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <SleepMarkerCard
            :marker="marker"
            @edit="editMarker"
            @delete="deleteMarker"
          />
        </v-col>
      </v-row>
      
      <v-card v-if="sleepMarkers.length === 0" class="text-center pa-5">
        <i class="fas fa-bed" style="font-size: 64px; color: #ccc;"></i>
        <p class="mt-3">No sleep entries yet. Start tracking your sleep!</p>
        <v-btn color="primary" @click="openAddDialog" class="mt-2">
          Add First Entry
        </v-btn>
      </v-card>
    </div>

    <!-- ✅ TABLE VIEW -->
    <SleepMarkerTable
      v-else-if="currentView === 'table'"
      :markers="sleepMarkers"
      @edit="editMarker"
      @delete="deleteMarker"
    />

    <!-- ✅ CALENDAR VIEW -->
    <SleepMarkerCalendar
      v-else-if="currentView === 'calendar'"
      :markers="sleepMarkers"
      @edit="editMarker"
      @date-click="openAddDialogForDate"
    />

    <!-- ✅ CHARTS VIEW -->
    <SleepMarkerCharts
      v-else-if="currentView === 'charts'"
      :markers="sleepMarkers"
    />

    <!-- ✅ ADD/EDIT DIALOG -->
    <SleepMarkerForm
      v-model="showDialog"
      :marker="selectedMarker"
      @save="handleSave"
      @close="closeDialog"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSleepMarkerStore } from '@/stores/SleepMarkerStore'; // ✅ NEW IMPORT
import SleepMarkerCard from '@/components/sleepMarkers/SleepMarkerCard.vue';
import SleepMarkerTable from '@/components/sleepMarkers/SleepMarkerTable.vue';
import SleepMarkerCalendar from '@/components/sleepMarkers/SleepMarkerCalendar.vue';
import SleepMarkerCharts from '@/components/sleepMarkers/SleepMarkerCharts.vue';
import SleepMarkerForm from '@/components/sleepMarkers/SleepMarkerForm.vue';

// ✅ USE NEW PINIA STORE
const sleepMarkerStore = useSleepMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
const selectedMarker = ref(null);

// ✅ COMPUTED - NOW USING PINIA STORE
const sleepMarkers = computed(() => sleepMarkerStore.allSleepMarkers);
const isLoading = computed(() => sleepMarkerStore.isLoading);
const averageSleepHours = computed(() => sleepMarkerStore.averageSleepHours);
const averageSleepQuality = computed(() => sleepMarkerStore.averageSleepQuality);
const averageDeepSleep = computed(() => sleepMarkerStore.averageDeepSleep);
const averageAwakenings = computed(() => sleepMarkerStore.averageAwakenings);

// ✅ METHODS - NOW USING PINIA ACTIONS
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
  if (confirm(`Delete sleep entry for ${marker.sleep_date}?`)) {
    try {
      await sleepMarkerStore.deleteSleepMarker(marker.id);
      console.log('✅ Sleep marker deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting sleep marker:', error);
      alert('Failed to delete sleep entry. Please try again.');
    }
  }
}

async function handleSave(markerData) {
  try {
    if (markerData.id) {
      await sleepMarkerStore.updateSleepMarker(markerData);
      console.log('✅ Sleep marker updated successfully');
    } else {
      await sleepMarkerStore.createSleepMarker(markerData);
      console.log('✅ Sleep marker created successfully');
    }
    closeDialog();
  } catch (error) {
    console.error('❌ Error saving sleep marker:', error);
    alert('Failed to save sleep entry. Please try again.');
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedMarker.value = null;
}

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('🚀 SleepMarkerList mounted, fetching data...');
  try {
    await sleepMarkerStore.fetchSleepMarkers();
    console.log('✅ Sleep markers fetched successfully');
    
    // ✅ ADD THESE DEBUG LOGS
    console.log('📊 All markers:', sleepMarkerStore.sleepMarkers);
    console.log('📊 First marker:', sleepMarkerStore.sleepMarkers[0]);
    console.log('🕐 Bed time:', sleepMarkerStore.sleepMarkers[0]?.bed_time);
    console.log('🕐 Wake time:', sleepMarkerStore.sleepMarkers[0]?.wake_time);
    console.log('📊 Computed sleepMarkers:', sleepMarkers.value);
    
  } catch (error) {
    console.error('❌ Error fetching sleep markers:', error);
  }
});
</script>


<style scoped>
.sleep-markers-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.header-card .v-card-title h2 {
  color: white !important;
  font-weight: 700;
}

.bed-icon {
  color: #FFD700;
  font-size: 1.5em;
  margin-right: 0.5rem;
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.title-section {
  flex: 1;
}

.controls-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.view-toggle {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* ✅ STATS CARDS */
.stats-row {
  margin-top: 1rem;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ✅ CARDS VIEW */
.cards-view {
  margin-top: 1rem;
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .controls-section {
    width: 100%;
    flex-direction: column;
  }
  
  .view-toggle {
    width: 100%;
  }
  
  .view-toggle .v-btn {
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}
</style>