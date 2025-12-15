<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-pills"></i> 
        <router-link :to="{ name: 'HealthDashboard' }" class="oobs-menu-link">
          Health Dashboard
        </router-link>
      </h2>
    </v-card-title>
    <v-card-title class="pb-0">
      <h2><i class="fa fa-thumbs-down" aria-hidden="true"></i>
        OOBs Dashboard
      </h2>
    </v-card-title>    
    
    <!-- ✅ NAVIGATION BUTTONS -->    
    <div class="navigation-buttons">
      <router-link :to="{ name: 'OobCreate' }" class="nav-btn">
        <i class="fas fa-plus"></i>
        <span>Add OOB</span>
      </router-link>
      
      <button @click="toggleIndexView" class="nav-btn">
        <i :class="showIndexView ? 'fas fa-th' : 'fas fa-list'"></i>
        <span>{{ showIndexView ? 'Card View' : 'Index View' }}</span>
      </button>
      
      <button @click="toggleOobChart" class="nav-btn">
        <i class="fas fa-chart-bar"></i>
        <span>{{ showOobChart ? 'Hide Chart' : 'Show Chart' }}</span>
      </button>
    </div>
  </v-card>

  <!-- ✅ EXTERNAL LINK -->
  <div class="external-link">
    <a href="https://myhealthchart.com/" target="_blank">
      <i class="fas fa-external-link-alt"></i>
      MyHealthChart Portal
    </a>
  </div>

  <!-- ✅ FILTERS SECTION -->
  <div class="filters-section">
    <div class="time-frame-filter">
      <label>
        <i class="fas fa-calendar-alt"></i>
        Time Frame:
      </label>
      <select v-model="selectedTimeFrame" @change="filterByTimeFrame" class="time-select">
        <option value="">All Time</option>
        <option value="7">Week</option>
        <option value="14">2 Weeks</option>
        <option value="30">Month</option>
        <option value="90">Quarter</option>
        <option value="365">Year</option>
      </select>
    </div>

    <div class="search-section">
      <v-text-field
        v-model="searchText"
        clearable
        clear-icon="fas fa-times"
        @click:clear="clearSearch"
        @input="performSearch"
        placeholder="Search OOBs..."
        prepend-inner-icon="fas fa-search"
        class="search-field"
      />
    </div>
  </div>

  <!-- ✅ CHART SECTION -->
  <div v-if="showOobChart && displayedOobs.length > 0" class="chart-section">
    <div class="chart-debug mb-3">
      <p><strong>Debug Info:</strong></p>
      <p>📊 Displaying {{ displayedOobs.length }} OOBs</p>
      <p>📅 Time Frame: {{ selectedTimeFrame || 'All Time' }} days</p>
    </div>
    
    <OobChart 
      :key="chartKey"
      :oobs="displayedOobs" 
      :timeFrame="parseInt(selectedTimeFrame) || 365"
    />
  </div>
  
  <!-- ✅ RESULTS SECTION -->
  <div class="results-section">
    <h3 class="results-count">
      <i class="fas fa-hashtag"></i>
      List Total: {{ displayedOobs.length }}
    </h3>
    
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading OOBs...</p>
    </div>
    
    <div v-else-if="displayedOobs.length === 0" class="no-results">
      <i class="fas fa-info-circle"></i>
      <p>No OOBs found matching your criteria.</p>
    </div>
    
    <div v-else>
      <!-- ✅ INDEX/TABLE VIEW -->
      <div v-if="showIndexView">
        <OobIndex :oobs="displayedOobs" />
      </div>
      
      <!-- ✅ CARD VIEW -->
      <div v-else class="cards-container">
        <p class="edit-hint">
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useOobStore } from '@/stores/OobStore';
import BaseModal from '@/components/ui/BaseModal.vue';
import OobCard from '@/components/oobs/OobCard.vue';
import OobIndex from '@/components/oobs/OobIndex.vue';
import OobForm from '@/components/oobs/OobForm.vue';
import OobChart from '@/components/oobs/OobChart.vue';
import ConfirmDialogue from '@/components/ConfirmDialogue.vue';

// ✅ PINIA STORE
const oobStore = useOobStore();

// ✅ STATE
const showIndexView = ref(false);  // false = cards, true = table
const showOobChart = ref(false);
const showDialog = ref(false);
const selectedOob = ref(null);
const confirmDialogue = ref(null);
const searchText = ref('');
const selectedTimeFrame = ref('7');
const chartKey = ref(0);

// ✅ COMPUTED FROM PINIA STORE
const oobs = computed(() => oobStore.allOobs);
const isLoading = computed(() => oobStore.isLoading);
const oobCount = computed(() => oobStore.oobCount);

// ✅ DISPLAYED OOBS (with filtering) - FIXED!
const displayedOobs = computed(() => {
  let filtered = [...oobs.value];

  console.log('🔍 Filtering OOBs...');
  console.log('📊 Total OOBs:', filtered.length);
  console.log('📅 Selected time frame:', selectedTimeFrame.value || 'All Time');
  console.log('🔎 Search text:', searchText.value || 'None');

  // ✅ Apply time frame filter (FIXED!)
  if (selectedTimeFrame.value) {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(selectedTimeFrame.value));
    
    console.log('📅 Filtering from date:', daysAgo.toISOString());
    
    filtered = filtered.filter(oob => {
      // ✅ FIXED: Use date_of_occurrence instead of oob_date
      const oobDate = new Date(oob.date_of_occurrence);
      const isInRange = oobDate >= daysAgo;
      
      if (!isInRange) {
        console.log(`❌ Filtered out: ${oob.id} - ${oobDate.toISOString()}`);
      }
      
      return isInRange;
    });
    
    console.log('✅ After time filter:', filtered.length, 'OOBs');
  }

  // ✅ Apply search filter (FIXED!)
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    
    filtered = filtered.filter(oob => {
      // ✅ FIXED: Search in correct fields
      const matchesCircumstances = oob.circumstances?.toLowerCase().includes(search);
      const matchesDuration = oob.duration?.toLowerCase().includes(search);
      const matchesCreatedBy = oob.created_by?.toLowerCase().includes(search);
      
      return matchesCircumstances || matchesDuration || matchesCreatedBy;
    });
    
    console.log('✅ After search filter:', filtered.length, 'OOBs');
  }

  console.log('📊 Final filtered count:', filtered.length);
  return filtered;
});

// ✅ METHODS
function toggleIndexView() {
  showIndexView.value = !showIndexView.value;
  console.log('📋 View toggled:', showIndexView.value ? 'Index' : 'Cards');
}

function toggleOobChart() {
  showOobChart.value = !showOobChart.value;
  if (showOobChart.value) {
    chartKey.value++; // Force chart re-render
    console.log('📊 Chart shown, key:', chartKey.value);
  } else {
    console.log('📊 Chart hidden');
  }
}

function filterByTimeFrame() {
  // ✅ REMOVED: This function is no longer needed!
  // The computed property `displayedOobs` handles filtering automatically
  console.log('📅 Time frame changed:', selectedTimeFrame.value || 'All Time');
}

function clearSearch() {
  searchText.value = '';
  console.log('🔎 Search cleared');
}

function performSearch() {
  // ✅ REMOVED: This function is no longer needed!
  // The computed property `displayedOobs` handles filtering automatically
  console.log('🔎 Searching for:', searchText.value);
}

function editOob(oob) {
  console.log('✏️ Editing OOB:', oob.id);
  selectedOob.value = { ...oob };
  showDialog.value = true;
}

async function deleteOob(oob) {
  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    return;
  }

  const ok = await confirmDialogue.value.show({
    title: "Delete OOB Record",
    message: `Are you sure you want to delete the OOB from ${oob.date_of_occurrence}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });

  if (!ok) {
    console.log('❌ Delete cancelled');
    return;
  }

  try {
    console.log('🗑️ Deleting OOB:', oob.id);
    await oobStore.deleteOob(oob.id);
    
    await confirmDialogue.value.show({
      title: "OOB Deleted",
      message: "OOB record has been deleted successfully.",
      okButton: "OK",
      cancelButton: null
    });
    
    console.log('✅ OOB deleted successfully');
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
      console.log('💾 Updating OOB:', oobData.id);
      await oobStore.updateOob(oobData);
    } else {
      console.log('➕ Creating new OOB');
      await oobStore.createOob(oobData);
    }
    closeDialog();
    console.log('✅ Save successful');
  } catch (error) {
    console.error('❌ Save error:', error);
  }
}

function closeDialog() {
  showDialog.value = false;
  selectedOob.value = null;
  console.log('❌ Dialog closed');
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
.title-section h2 {
  margin: 0;
  color: white;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}
.oobs-menu-link {
  color: #000;
  text-decoration: none;
}
.oobs-menu-link:hover {
  text-decoration: underline;
}
/* ✅ FONT AWESOME GLUCOSE BUTTON WITH HEART ICON */
.glucose-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* ✅ SPACE BETWEEN ICON AND TEXT */
  position: relative;
}

.heart-icon {
  color: #e91e63 !important;
  font-size: 18px !important;
  animation: heartbeat 1.5s ease-in-out infinite;
  /* ✅ REMOVE ABSOLUTE POSITIONING */
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ✅ HEART ON HOVER - ENHANCED */
.glucose-btn:hover .heart-icon {
  color: #ff1744 !important;
  transform: scale(1.2);
  animation-duration: 1s; /* Faster pulse on hover */
}

/* ✅ HEART PULSE ANIMATION */
.heart-icon {
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ✅ HEART ON HOVER */
.glucose-btn:hover .heart-icon {
  color: #ff1744 !important;
  transform: scale(1.2);
}

/* ✅ NAVIGATION BUTTON ICONS */
.nav-btn i {
  color: #495057;
  font-size: 18px;
  transition: all 0.3s ease;
}

.nav-btn:hover i {
  color: white;
  transform: scale(1.1);
}

/* ✅ SPECIAL STYLING FOR SPECIFIC ICONS */
.fa-pills {
  color: #17a2b8 !important; /* Blue for pills */
}

.fa-plus {
  color: #28a745 !important; /* Green for add */
}

.fa-chart-bar {
  color: #ffc107 !important; /* Yellow for chart */
}

.fa-th,
.fa-list {
  color: #6c757d !important; /* Gray for view toggle */
}

/* ✅ YOUR EXISTING CSS STAYS THE SAME */
.navigation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  text-decoration: none;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #41b883;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(65, 184, 131, 0.3);
}

.external-link {
  text-align: center;
  padding: 1rem;
}

.external-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #41b883;
  text-decoration: none;
  font-weight: 500;
}

.filters-section {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.time-frame-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.chart-section {
  margin: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.results-section {
  margin: 1rem;
}

.results-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.edit-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

.oob-card {
  transition: transform 0.2s ease;
}

.oob-card:hover {
  transform: scale(1.02);
  cursor: pointer;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation-buttons {
    flex-direction: column;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>