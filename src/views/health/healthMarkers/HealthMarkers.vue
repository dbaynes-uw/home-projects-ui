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
        <div class="header-link">
        <a href="https://myhealthchart.com/" target="_blank" class="btn btn-primary">
          <i class="fas fa-external-link-alt"></i>
            MyHealthChart
        </a>
        </div>  
        <!-- ✅ CONTROLS ROW -->
        <div class="controls-row">
          <div class="controls-left">
            <button class="btn btn-success" @click="handleCreate">
              <i class="fas fa-plus"></i>
              Add Health Marker
            </button>
            <button class="btn btn-primary" @click="handleCreatePanel">
              <i class="fas fa-folder-plus"></i>
              Create Panel
            </button>
            <button class="btn btn-success" @click="handleCreateHealthMarkerDefinition">
              <i class="fas fa-plus"></i>
              Add Marker Definition
            </button>
          </div>
          
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
              <div class="stat-value">{{ uniquePanelNames.length }}</div>
              <div class="stat-label">Panel Types</div>
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
            <router-link 
              :to="{ 
                name: 'HealthMarkersFiltered', 
                params: { status: 'Borderline High' },
                query: selectedTestDate ? { date: selectedTestDate } : {}
              }"
              class="stat-card-link"
            >
              <div class="stat-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statusCounts['Borderline High'] }}</div>
                <div class="stat-label">Borderline High</div>
              </div>
            </router-link>
          </div>
          <div class="stat-card stat-warning">
            <router-link 
              :to="{ 
                name: 'HealthMarkersFiltered', 
                params: { status: 'Prediabetes' },
                query: selectedTestDate ? { date: selectedTestDate } : {}
              }"
              class="stat-card-link"
            >
              <div class="stat-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statusCounts['Prediabetes'] }}</div>
                <div class="stat-label">Prediabetes</div>
              </div>
            </router-link>
          </div>          
          <!--div class="stat-card stat-warning">
            <div class="stat-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statusCounts.High + statusCounts.Low }}</div>
              <div class="stat-label">Abnormal</div>
            </div>
          </div-->

          <div class="stat-card stat-danger">
            <router-link 
              :to="{ 
                name: 'HealthMarkersFiltered', 
                params: { status: 'Critical' },
                query: selectedTestDate ? { date: selectedTestDate } : {}
              }"
              class="stat-card-link"
            >
              <div class="stat-icon">
                <i class="fas fa-exclamation-circle"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ statusCounts.Critical }}</div>
                <div class="stat-label">Critical</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
        <!-- ✅ TEST DATE FILTER -->
        <div v-if="uniqueTestDates.length > 0" class="date-filter-section">
          <label class="filter-label">
            <i class="fas fa-calendar-alt"></i>
            Filter by Test Date:
          </label>
          <select v-model="selectedTestDate" class="date-filter-select">
            <option :value="null">All Dates ({{ healthMarkers.length }} markers, {{ panels.length }} panels)</option>
            <option v-for="date in uniqueTestDates" :key="date" :value="date">
              {{ formatTestDate(date) }} 
              ({{ healthMarkers.filter(m => m.marker_date === date).length }} markers, 
              {{ panels.filter(p => p.test_date === date).length }} panels)
            </option>
          </select>
          <button v-if="selectedTestDate" class="btn-clear-filter" @click="selectedTestDate = null">
            <i class="fas fa-times"></i>
            Clear Filter
          </button>
        </div>

        <!-- ✅ PANEL FILTER -->
        <div v-if="panels.length > 0" class="date-filter-section">
          <label class="filter-label">
            <i class="fas fa-folder"></i>
            Filter by Panel:
          </label>
          <select v-model="selectedPanelId" class="date-filter-select">
            <option :value="null">All Panels</option>
            <option v-for="panel in panels" :key="panel.id" :value="panel.id">
              {{ panel.panel_name }} ({{ formatTestDate(panel.test_date) }})
            </option>
          </select>
          <button v-if="selectedPanelId" class="btn-clear-filter" @click="selectedPanelId = null">
            <i class="fas fa-times"></i>
            Clear Filter
          </button>
        </div>

        <!-- ✅ MARKER NAME FILTER -->
        <div v-if="uniqueMarkerNames.length > 0" class="date-filter-section">
          <label class="filter-label">
            <i class="fas fa-vial"></i>
            Filter by Marker:
          </label>
          <select v-model="selectedMarkerName" class="date-filter-select">
            <option :value="null">All Markers</option>
            <option v-for="name in uniqueMarkerNames" :key="name" :value="name">
              {{ name }} ({{ healthMarkers.filter(m => m.marker_name === name).length }} readings)
            </option>
          </select>
          <button v-if="selectedMarkerName" class="btn-clear-filter" @click="selectedMarkerName = null">
            <i class="fas fa-times"></i>
            Clear Filter
          </button>
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
        <!-- View Toggle -->
        <div class="view-mode-toggle">
          <button 
            :class="['toggle-btn', { active: viewMode === 'grouped' }]"
            @click="viewMode = 'grouped'"
          >
            <i class="fas fa-layer-group"></i>
            Grouped (Panels + Markers)
          </button>
          <button 
            :class="['toggle-btn', { active: viewMode === 'panels' }]"
            @click="viewMode = 'panels'"
          >
            <i class="fas fa-folder"></i>
            Panels Only
          </button>
          <button 
            :class="['toggle-btn', { active: viewMode === 'markers' }]"
            @click="viewMode = 'markers'"
          >
            <i class="fas fa-list"></i>
            All Markers
          </button>
        </div>

        <!-- ✅ DATE SUMMARY (when date is filtered) -->
        <div v-if="dateSummary && (viewMode === 'markers' || viewMode === 'grouped')" class="date-summary-card">
          <div class="summary-header">
            <div class="header-left">
              <h2 class="summary-title">
                <i class="fas fa-calendar-check"></i>
                Test Date Summary
              </h2>
              <div class="summary-meta">
                <span class="meta-item">
                  <i class="fas fa-calendar"></i>
                  {{ formatTestDate(dateSummary.test_date) }}
                </span>
                <span v-if="dateSummary.panel_count > 0" class="meta-item">
                  <i class="fas fa-folder"></i>
                  {{ dateSummary.panel_count }} Panel{{ dateSummary.panel_count !== 1 ? 's' : '' }}
                </span>
                <span v-if="dateSummary.lab_name" class="meta-item">
                  <i class="fas fa-hospital"></i>
                  {{ dateSummary.lab_name }}
                </span>
                <span v-if="dateSummary.doctor_name" class="meta-item">
                  <i class="fas fa-user-md"></i>
                  {{ dateSummary.doctor_name }}
                </span>
              </div>
            </div>
            <span v-if="dateSummary.needs_attention" class="attention-badge">
              <i class="fas fa-exclamation-circle"></i>
              Needs Attention
            </span>
          </div>

          <div class="status-summary-grid">
            <div class="status-summary-item">
              <i class="fas fa-vials"></i>
              <span class="summary-value">{{ dateSummary.total }}</span>
              <span class="summary-label">Total Markers</span>
            </div>
            <div v-if="dateSummary.normal > 0" class="status-summary-item status-normal">
              <i class="fas fa-check-circle"></i>
              <span class="summary-value">{{ dateSummary.normal }}</span>
              <span class="summary-label">Normal</span>
            </div>
            <div v-if="dateSummary.borderline > 0" class="status-summary-item status-borderline">
              <i class="fas fa-exclamation-triangle"></i>
              <span class="summary-value">{{ dateSummary.borderline }}</span>
              <span class="summary-label">Borderline</span>
            </div>
            <div v-if="dateSummary.high > 0" class="status-summary-item status-high">
              <i class="fas fa-arrow-up"></i>
              <span class="summary-value">{{ dateSummary.high }}</span>
              <span class="summary-label">High</span>
            </div>
            <div v-if="dateSummary.low > 0" class="status-summary-item status-low">
              <i class="fas fa-arrow-down"></i>
              <span class="summary-value">{{ dateSummary.low }}</span>
              <span class="summary-label">Low</span>
            </div>
            <div v-if="dateSummary.critical > 0" class="status-summary-item status-critical">
              <i class="fas fa-exclamation-circle"></i>
              <span class="summary-value">{{ dateSummary.critical }}</span>
              <span class="summary-label">Critical</span>
            </div>
          </div>
        </div>

        <!-- Grouped View (Panels + Standalone Markers) -->
        <div v-if="viewMode === 'grouped' && filteredMixedItems.length > 0" class="cards-grid">
          <template v-for="item in filteredMixedItems" :key="item.type + '-' + item.id">
            <HealthMarkerPanelCard
              v-if="item.type === 'panel'"
              :panel="item"
              @view="viewPanel"
              @edit="editPanel"
              @delete="deletePanel"
            />
            <HealthMarkerCard
              v-else
              :healthMarker="item"
              :panels="panels"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </template>
        </div>

        <!-- Panels Only View -->
        <div v-else-if="viewMode === 'panels' && filteredPanels.length > 0" class="cards-grid">
          <HealthMarkerPanelCard
            v-for="panel in filteredPanels"
            :key="panel.id"
            :panel="panel"
            @view="viewPanel"
            @edit="editPanel"
            @delete="deletePanel"
          />
        </div>

        <!-- Markers Only View -->
        <div v-else-if="viewMode === 'markers' && filteredMarkers.length > 0" class="cards-grid">
          <HealthMarkerCard
            v-for="marker in filteredMarkers"
            :key="marker.id"
            :healthMarker="marker"
            :panels="panels"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
        
        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="fas fa-vials"></i>
          <h3 v-if="viewMode === 'panels'">No Panels Yet</h3>
          <h3 v-else>No Health Markers Yet</h3>
          <p v-if="viewMode === 'panels'">Create a panel to group related health markers</p>
          <p v-else>Start tracking your health by adding your first marker</p>
          <button v-if="viewMode === 'panels'" class="btn btn-primary" @click="handleCreatePanel">
            <i class="fas fa-folder-plus"></i>
            Create Your First Panel
          </button>
          <button v-else class="btn btn-primary" @click="handleCreate">
            <i class="fas fa-plus"></i>
            Add First Marker
          </button>
        </div>
      </div>

      <!-- ✅ TABLE VIEW -->
      <HealthMarkerIndex
        v-else-if="currentView === 'table'"
        :healthMarkers="filteredMarkers"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useHealthMarkerStore } from '@/stores/health/HealthMarkerStore';
import HealthMarkerCard from '@/components/health/healthMarkers/HealthMarkerCard.vue';
import HealthMarkerPanelCard from '@/components/health/healthMarkers/HealthMarkerPanelCard.vue';
import HealthMarkerIndex from '@/components/health/healthMarkers/HealthMarkerIndex.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
import EventService from '@/services/EventService';

// ✅ ROUTER & STORE
const router = useRouter();
const healthMarkerStore = useHealthMarkerStore();

// ✅ STATE
const currentView = ref('cards');
const confirmDialogue = ref(null);
const mixedItems = ref([]);
const panels = ref([]);
const viewMode = ref('grouped'); // 'grouped', 'markers', 'panels'
const selectedTestDate = ref(null);
const selectedPanelId = ref(null);
const selectedMarkerName = ref(null);

// ✅ VIEW OPTIONS
const views = [
  { value: 'cards', label: 'Cards', icon: 'th' },
  { value: 'table', label: 'Table', icon: 'list' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'charts', label: 'Charts', icon: 'chart-line' }
];

// ✅ COMPUTED FOR MIXED VIEW
const panelItems = computed(() => mixedItems.value.filter(item => item.type === 'panel'));
const standaloneItems = computed(() => mixedItems.value.filter(item => item.type === 'marker'));

// ✅ COMPUTED FROM STORE
const healthMarkers = computed(() => healthMarkerStore.allHealthMarkers);
const isLoading = computed(() => healthMarkerStore.isLoading);
const healthMarkerCount = computed(() => healthMarkerStore.healthMarkerCount);
const uniquePanelNames = computed(() => {
  const names = new Set(panels.value.map(p => p.panel_name));
  return Array.from(names);
});

const uniqueMarkerNames = computed(() => healthMarkerStore.uniqueMarkerNames);

// ✅ STATUS COUNTS (respects date filtering)
const statusCounts = computed(() => {
  const markers = filteredMarkers.value;
  const counts = {
    'Normal': 0,
    'Borderline High': 0,
    'Prediabetes': 0,
    'High': 0,
    'Low': 0,
    'Critical': 0
  };
  
  markers.forEach(marker => {
    const status = marker.marker_status || marker.status || 'Unknown';
    if (counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  });
  
  return counts;
});

// ✅ AUTO-SWITCH VIEW WHEN FILTERING BY MARKER NAME
watch(selectedMarkerName, (name) => {
  if (name) viewMode.value = 'markers';
});

// ✅ TEST DATE FILTERING
const uniqueTestDates = computed(() => {
  const dates = new Set(healthMarkers.value.map(m => m.marker_date).filter(d => d));
  return Array.from(dates).sort((a, b) => new Date(b) - new Date(a));
});

const filteredMarkers = computed(() => {
  let markers = healthMarkers.value;
  if (selectedTestDate.value) markers = markers.filter(m => m.marker_date === selectedTestDate.value);
  if (selectedPanelId.value) markers = markers.filter(m => m.health_marker_panel_id === selectedPanelId.value);
  if (selectedMarkerName.value) markers = markers.filter(m => m.marker_name === selectedMarkerName.value);
  return markers;
});

const filteredPanels = computed(() => {
  let panelList = panels.value;
  if (selectedTestDate.value) panelList = panelList.filter(p => p.test_date === selectedTestDate.value);
  if (selectedPanelId.value) panelList = panelList.filter(p => p.id === selectedPanelId.value);
  return panelList;
});

const filteredMixedItems = computed(() => {
  let items = mixedItems.value;
  if (selectedTestDate.value) {
    items = items.filter(item => {
      if (item.type === 'panel') return item.test_date === selectedTestDate.value;
      if (item.type === 'marker') return item.marker_date === selectedTestDate.value;
      return false;
    });
  }
  if (selectedPanelId.value) {
    items = items.filter(item => item.type === 'panel' && item.id === selectedPanelId.value);
  }
  if (selectedMarkerName.value) {
    items = items.filter(item =>
      item.type === 'marker' && item.marker_name === selectedMarkerName.value
    );
  }
  return items;
});

const dateSummary = computed(() => {
  if (!selectedTestDate.value) return null;
  
  const markers = filteredMarkers.value;
  const panelCount = filteredPanels.value.length;
  
  if (markers.length === 0 && panelCount === 0) return null;
  
  const summary = {
    test_date: selectedTestDate.value,
    total: markers.length,
    panel_count: panelCount,
    normal: 0,
    borderline: 0,
    high: 0,
    low: 0,
    critical: 0,
    unknown: 0,
    labs: new Set(),
    doctors: new Set()
  };
  
  markers.forEach(marker => {
    const status = marker.status?.toLowerCase() || 'unknown';
    if (status.includes('normal')) summary.normal++;
    else if (status.includes('borderline')) summary.borderline++;
    else if (status.includes('high')) summary.high++;
    else if (status.includes('low')) summary.low++;
    else if (status.includes('critical')) summary.critical++;
    else summary.unknown++;
    
    if (marker.lab_name) summary.labs.add(marker.lab_name);
    if (marker.doctor_name) summary.doctors.add(marker.doctor_name);
  });
  
  return {
    ...summary,
    lab_name: Array.from(summary.labs).join(', '),
    doctor_name: Array.from(summary.doctors).join(', '),
    needs_attention: summary.high > 0 || summary.low > 0 || summary.critical > 0
  };
});

// ✅ METHODS

// ✅ HELPER FUNCTIONS
function formatTestDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

// Navigate to create page
function handleCreate() {
  router.push({ name: 'HealthMarkerCreate' });
}

// Navigate to create panel page
function handleCreatePanel() {
  router.push({ name: 'HealthMarkerPanelCreate' });
}
// Navigate to create panel page
function handleCreateHealthMarkerDefinition() {
  router.push({ name: 'MarkerDefinitions' });
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

// ✅ PANEL METHODS
function viewPanel(panel) {
  router.push({ 
    name: 'HealthMarkerPanelDetails', 
    params: { id: panel.id } 
  });
}

function editPanel(panel) {
  router.push({ 
    name: 'HealthMarkerPanelEdit', 
    params: { id: panel.id } 
  });
}

async function deletePanel(panel) {
  if (!confirmDialogue.value) return;

  const ok = await confirmDialogue.value.show({
    title: "Delete Panel",
    message: `Are you sure you want to delete "${panel.panel_name}"? This will not delete the markers, only ungroup them.`,
    okButton: "Delete Panel",
    cancelButton: "Cancel"
  });

  if (!ok) return;

  try {
    await EventService.deleteHealthMarkerPanel(panel);
    await fetchMixedView();
    
    await confirmDialogue.value.show({
      title: "Panel Deleted",
      message: "Panel has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Delete panel error:', error);
    
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete panel. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

async function fetchMixedView() {
  try {
    const response = await EventService.getHealthMarkerPanelsMixedView();
    mixedItems.value = response.data.items || [];
  } catch (error) {
    console.error('❌ Fetch mixed view error:', error);
    mixedItems.value = [];
  }
}

async function fetchPanels() {
  try {
    const response = await EventService.getHealthMarkerPanels();
    panels.value = response.data || [];
  } catch (error) {
    console.error('❌ Fetch panels error:', error);
    panels.value = [];
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await Promise.all([
      healthMarkerStore.fetchHealthMarkers(),
      fetchMixedView(),
      fetchPanels()
    ]);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    alert('Failed to load health markers. Please refresh the page.');
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

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

.controls-left {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* View mode toggle */
.view-mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
}

.toggle-btn:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.toggle-btn.active {
  background: #3b82f6;
  color: white;
}

.toggle-btn i {
  font-size: 1rem;
}

/* Date filter section */
.date-filter-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9375rem;
}

.filter-label i {
  color: #667eea;
}

.date-filter-select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-clear-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-clear-filter:hover {
  background: #dc2626;
}

/* Date summary card */
.date-summary-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.header-left {
  flex: 1;
}

.summary-title {
  margin: 0 0 1rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-title i {
  color: #667eea;
}

.summary-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
}

.meta-item i {
  color: #667eea;
}

.attention-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
}

.status-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.status-summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.status-summary-item i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-summary-item.status-normal { background: #d1fae5; }
.status-summary-item.status-normal i { color: #065f46; }
.status-summary-item.status-normal .summary-value { color: #065f46; }

.status-summary-item.status-borderline { background: #fef3c7; }
.status-summary-item.status-borderline i { color: #92400e; }
.status-summary-item.status-borderline .summary-value { color: #92400e; }

.status-summary-item.status-high { background: #fee2e2; }
.status-summary-item.status-high i { color: #991b1b; }
.status-summary-item.status-high .summary-value { color: #991b1b; }

.status-summary-item.status-low { background: #dbeafe; }
.status-summary-item.status-low i { color: #1e40af; }
.status-summary-item.status-low .summary-value { color: #1e40af; }

.status-summary-item.status-critical { background: #fee2e2; }
.status-summary-item.status-critical i { color: #991b1b; }
.status-summary-item.status-critical .summary-value { color: #991b1b; }

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

/* Stat card link styling */
.stat-card-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.stat-card-link:hover {
  transform: translateY(-2px);
  text-decoration: none;
  color: inherit;
}

.stat-card:has(.stat-card-link):hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
</style>