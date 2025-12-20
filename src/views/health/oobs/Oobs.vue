<template>
  <div class="oob-list-wrapper">
    <!-- ✅ HEADER WITH BREADCRUMB -->
    <div class="page-wrapper gradient-oob">
      <div class="page-container">
        <div class="page-header">
          <h1>
            <router-link :to="{ name: 'HealthDashboard' }" class="breadcrumb-link">
              <i class="fas fa-pills"></i>
              Health Dashboard
            </router-link>
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span>
              <i class="fas fa-exclamation-triangle icon-oob"></i>
              OOBs Dashboard
            </span>
          </h1>
        </div>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <div class="action-bar">
          <div class="action-buttons">
            <router-link :to="{ name: 'OobCreate' }" class="btn btn-success">
              <i class="fas fa-plus"></i>
              Add OOB
            </router-link>
            
            <button @click="toggleIndexView" class="btn btn-secondary">
              <i :class="showIndexView ? 'fas fa-th' : 'fas fa-list'"></i>
              {{ showIndexView ? 'Card View' : 'Index View' }}
            </button>
            <!--
            <button @click="toggleOobChart" class="btn btn-info">
              <i class="fas fa-chart-bar"></i>
              {{ showOobChart ? 'Hide Chart' : 'Show Chart' }}
            </button>
            -->
            <a href="https://myhealthchart.com/" target="_blank" class="btn btn-primary">
              <i class="fas fa-external-link-alt"></i>
              MyHealthChart
            </a>
          </div>
        </div>

        <!-- ✅ FILTERS SECTION -->
        <div class="filter-section">
          <div class="filter-row">
            <div class="filter-item">
              <label class="filter-label">
                <i class="fas fa-calendar-alt"></i>
                Time Frame
              </label>
              <select v-model="selectedTimeFrame" class="filter-select">
                <option value="">All Time</option>
                <option value="7">Week</option>
                <option value="14">2 Weeks</option>
                <option value="30">Month</option>
                <option value="90">Quarter</option>
                <option value="365">Year</option>
              </select>
            </div>

            <div class="filter-item">
              <label class="filter-label">
                <i class="fas fa-search"></i>
                Search
              </label>
              <input
                v-model="searchText"
                type="text"
                placeholder="Search OOBs..."
                class="filter-input"
              />
            </div>
          </div>
        </div>

        <!-- ✅ CHART SECTION -->
        <div v-if="showOobChart && displayedOobs.length > 0" class="chart-container">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-chart-line"></i>
                OOB Trends
              </h3>
              <span class="badge badge-info">
                {{ displayedOobs.length }} records
              </span>
            </div>
            <!--
            <div class="card-body">
              <OobChart 
                :key="chartKey"
                :oobs="displayedOobs" 
                :timeFrame="parseInt(selectedTimeFrame) || 365"
              />
            </div>
            -->
          </div>
        </div>
        
        <!-- ✅ RESULTS SECTION -->
        <div class="results-header">
          <h3>
            <i class="fas fa-list"></i>
            OOBs List
            <span class="badge badge-info">{{ displayedOobs.length }}</span>
          </h3>
        </div>
        
        <!-- ✅ LOADING STATE -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Loading OOBs...
        </div>
        
        <!-- ✅ EMPTY STATE -->
        <div v-else-if="displayedOobs.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No OOBs Found</h3>
          <p v-if="searchText || selectedTimeFrame">
            Try adjusting your filters or search criteria
          </p>
          <p v-else>
            You haven't recorded any OOBs yet
          </p>
          <router-link :to="{ name: 'OobCreate' }" class="btn btn-primary mt-3">
            <i class="fas fa-plus"></i>
            Add Your First OOB
          </router-link>
        </div>
        
        <!-- ✅ DATA DISPLAY -->
        <div v-else class="content-wrapper">
          <!-- ✅ INDEX/TABLE VIEW - ADD @delete HANDLER -->
          <div v-if="showIndexView">
            <OobIndex 
              :oobs="displayedOobs" 
              @delete="deleteOob"
            />
          </div>
          
          <!-- ✅ CARD VIEW - ALREADY HAS @delete -->
          <div v-else>
            <p class="hint-text">
              <i class="fas fa-hand-pointer"></i>
              Double click any card to edit
            </p>
            
            <div class="cards-grid">
              <OobCard
                v-for="oob in displayedOobs"
                :key="oob.id"
                :oob="oob"
                @edit="editOob"
                @delete="deleteOob"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ EDIT/ADD DIALOG -->
    <BaseModal
      v-model="showDialog"
      :title="selectedOob?.id ? 'Edit OOB' : 'Add OOB'"
      size="large"
      @close="closeDialog"
    >
      <OobForm
        :oob="selectedOob"
        @save="handleSave"
        @cancel="closeDialog"
      />
    </BaseModal>

    <ConfirmDialogue ref="confirmDialogue" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOobStore } from '@/stores/health/OobStore';
import BaseModal from '@/components/ui/BaseModal.vue';
import OobCard from '@/components/health/oobs/OobCard.vue';
import OobIndex from '@/components/health/oobs/OobIndex.vue';
import OobForm from '@/components/health/oobs/OobForm.vue';
//import OobChart from '@/components/oobs/OobChart.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ PINIA STORE
const oobStore = useOobStore();

// ✅ STATE
const showIndexView = ref(false);
const showOobChart = ref(false);
const showDialog = ref(false);
const selectedOob = ref(null);
const confirmDialogue = ref(null);
const searchText = ref('');
const selectedTimeFrame = ref('7');

// ✅ COMPUTED FROM PINIA STORE
const oobs = computed(() => oobStore.allOobs);
const isLoading = computed(() => oobStore.isLoading);

// ✅ DISPLAYED OOBS (with filtering)
const displayedOobs = computed(() => {
  let filtered = [...oobs.value];

  // Apply time frame filter
  if (selectedTimeFrame.value) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(selectedTimeFrame.value));
        
    filtered = filtered.filter(oob => {
      const oobDate = new Date(oob.date_of_occurrence);
      return oobDate >= daysAgo;
    });
  }

  // Apply search filter
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    
    filtered = filtered.filter(oob => {
      const matchesCircumstances = oob.circumstances?.toLowerCase().includes(search);
      const matchesDuration = oob.duration?.toLowerCase().includes(search);
      const matchesCreatedBy = oob.created_by?.toLowerCase().includes(search);
      
      return matchesCircumstances || matchesDuration || matchesCreatedBy;
    });
  }

  return filtered;
});

// ✅ METHODS
function toggleIndexView() {
  showIndexView.value = !showIndexView.value;
}

function editOob(oob) {
  selectedOob.value = { ...oob };
  showDialog.value = true;
}

async function deleteOob(oob) {
  if (!confirmDialogue.value) {
    return;
  }

  const ok = await confirmDialogue.value.show({
    title: "Delete OOB Record",
    message: `Are you sure you want to delete the OOB from ${oob.date_of_occurrence}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) {
    return;
  }

  try {
    await oobStore.deleteOob(oob.id);
    
    await confirmDialogue.value.show({
      title: "OOB Deleted",
      message: "OOB record has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    await confirmDialogue.value.show({
      title: "Delete Failed",
      message: "Failed to delete OOB record. Please try again.",
      okButton: "OK",
      cancelButton: null
    });
  }
}

async function handleSave(oobData) {
  try {
    if (oobData.id) {
      await oobStore.updateOob(oobData);
    } else {
      await oobStore.createOob(oobData);
    }
    closeDialog();
  } catch (error) {
    console.error('❌ Save error:', error);
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedOob.value = null;
}

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await oobStore.fetchOobs();
  } catch (error) {
    console.error('❌ Failed to load OOBs:', error);
  }
});
</script>

<style scoped>
/* ✅ IMPORT SHARED HEALTH STYLES */
@import '@/assets/styles/health/health-shared.css';

/* ========================================
   COMPONENT-SPECIFIC STYLES
   ======================================== */

.oob-list-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* ✅ FIX: Add padding to bottom to prevent footer overlap */
.page-wrapper {
  padding-bottom: 120px; /* Space for footer (80px) + extra margin */
}

/* ✅ FIX: Content wrapper with proper spacing */
.content-wrapper {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

/* Breadcrumb navigation */
.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: flex;
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

/* Chart container */
.chart-container {
  margin-bottom: 2rem;
}

/* Results header */
.results-header {
  margin-bottom: 1.5rem;
}

.results-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.results-header .badge {
  font-size: 1rem;
}

/* ✅ FIX: Cards grid with proper spacing */
.cards-grid {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}

/* Remove Vuetify overrides */
:deep(.v-card) {
  display: none !important;
}

:deep(.v-text-field) {
  display: none !important;
}
</style>