<template>
  <div class="sleep-markers-container">
    <!-- ✅ HEADER WITH CONTROLS -->
    <BaseCard class="header-card">
      <template #header>
        <div class="header-content">
          <div class="title-section">
            <h2>
              <i class="fas fa-bed bed-icon"></i>
              <router-link :to="{ name: 'MedsMenu' }" class="meds-menu-link">Sleep Markers Dashboard</router-link>
            </h2>           
          </div>
          
          <div class="controls-section">
            <!-- Add New Sleep Entry Button -->
            <BaseButton
              variant="success"
              icon="plus"
              @click="openAddDialog"
            >
              Add Sleep Entry
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
            <i class="fas fa-brain"></i>
          </div>
          <div class="stat-value">{{ averageAwakeSleep }}</div>
          <div class="stat-label">Avg Awake Sleep</div>
        </div>
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="stat-value">{{ averageRemSleep }}</div>
          <div class="stat-label">Avg Rem Sleep</div>
        </div>
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="stat-value">{{ averageCoreSleep }}</div>
          <div class="stat-label">Avg Core Sleep</div>
        </div>
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="stat-value">{{ averageDeepSleep }}</div>
          <div class="stat-label">Avg Deep Sleep</div>
        </div>        
      </div>
    </BaseCard>

    <!-- ✅ LOADING STATE -->
    <BaseCard v-if="isLoading" class="loading-card">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Loading sleep data...</p>
      </div>
    </BaseCard>

    <!-- ✅ CARD VIEW -->
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
      
      <!-- Empty State -->
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

    <!-- ✅ ADD/EDIT DIALOG (NOW USING BaseModal!) -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSleepMarkerStore } from '@/stores/SleepMarkerStore';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import SleepMarkerCard from '@/components/sleepMarkers/SleepMarkerCard.vue';
import SleepMarkerTable from '@/components/sleepMarkers/SleepMarkerTable.vue';
import SleepMarkerCalendar from '@/components/sleepMarkers/SleepMarkerCalendar.vue';
import SleepMarkerCharts from '@/components/sleepMarkers/SleepMarkerCharts.vue';
import SleepMarkerForm from '@/components/sleepMarkers/SleepMarkerForm.vue';

// ✅ PINIA STORE
const sleepMarkerStore = useSleepMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const showDialog = ref(false);
const selectedMarker = ref(null);

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
  if (confirm(`Delete sleep entry for ${marker.sleep_date}?`)) {
    try {
      await sleepMarkerStore.deleteSleepMarker(marker.id);
    } catch (error) {
      alert('Failed to delete sleep entry. Please try again.');
    }
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
    alert('Failed to load sleep data. Please refresh the page.');}
});
</script>

<style scoped>
/* ✅ CONTAINER */
.sleep-markers-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* ✅ HEADER CARD */
.header-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.header-card :deep(.base-card-header) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-card :deep(.base-card-body) {
  padding-top: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.title-section h2 {
  margin: 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}
.meds-menu-link {
  color: white;
  text-decoration: none;
}
.meds-menu-link:hover {
  text-decoration: underline;
}
.bed-icon {
  color: #FFD700;
  font-size: 1.5em;
  animation: gentle-bounce 2s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.controls-section {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

/* ✅ VIEW TOGGLE */
.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.view-btn {
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.view-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn i {
  font-size: 16px;
}

/* ✅ STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-card-info {
  border-left: 4px solid #2196F3;
}

.stat-card-success {
  border-left: 4px solid #4CAF50;
}

.stat-card-warning {
  border-left: 4px solid #FF9800;
}

.stat-card-danger {
  border-left: 4px solid #F44336;
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.stat-card-info .stat-icon { color: #2196F3; }
.stat-card-success .stat-icon { color: #4CAF50; }
.stat-card-warning .stat-icon { color: #FF9800; }
.stat-card-danger .stat-icon { color: #F44336; }

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* ✅ LOADING STATE */
.loading-card {
  margin-top: 24px;
}

.loading-content {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-content p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* ✅ CARDS VIEW */
.cards-view {
  margin-top: 24px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* ✅ EMPTY STATE */
.empty-state {
  margin-top: 24px;
}

.empty-content {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-content p {
  margin: 0 0 20px;
  font-size: 18px;
  color: #666;
}

/* ✅ MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .sleep-markers-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .title-section h2 {
    font-size: 24px;
  }
  
  .controls-section {
    flex-direction: column;
    width: 100%;
  }
  
  .view-toggle {
    width: 100%;
  }
  
  .view-btn {
    flex: 1;
    justify-content: center;
  }
  
  .view-btn span {
    display: none;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>