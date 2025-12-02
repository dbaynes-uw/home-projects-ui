<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-pills"></i> 
        <router-link :to="{ name: 'HealthDashboard' }" class="meds-menu-link"> Health Dashboard</router-link>
      </h2>
    </v-card-title>
    <v-card-title class="pb-0">
      <h2><i class="fa fa-thumbs-down" aria-hidden="true"></i>
        OOBs Dashboard
      </h2>
    </v-card-title>    
    <!-- ✅ MODERN NAVIGATION -->    
    <div class="navigation-buttons">

      <router-link :to="{ name: 'OobCreate' }" class="nav-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-plus → fas fa-plus -->
        <i class="fas fa-plus"></i>
        <span style="position: relative; left: 2rem;">Add OOB</span>
      </router-link>
      
      <button @click="toggleIndexView" class="nav-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-view-grid/mdi-view-list → fas fa-th/fas fa-list -->
        <i :class="showIndexView ? 'fas fa-th' : 'fas fa-list'"></i>
        <span>{{ showIndexView ? 'Card View' : 'Index View' }}</span>
      </button>
      
      <button @click="toggleOobChart" class="nav-btn" id="button-as-link">
        <!-- ✅ CHANGED: mdi-chart-bar → fas fa-chart-bar -->
        <i class="fas fa-chart-bar"></i>
        <span>{{ showOobChart ? 'Hide Chart' : 'Show Chart' }}</span>
      </button>
    </div>
  </v-card>

  <!-- ✅ EXTERNAL LINK (already FontAwesome) -->
  <div class="external-link">
    <a href="https://myhealthchart.com/" target="_blank">
      <i class="fas fa-external-link-alt"></i>
      MyHealthChart Portal
    </a>
  </div>
  <!-- ✅ FILTERS SECTION (already FontAwesome) -->
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
        placeholder="Search meds..."
        prepend-inner-icon="fas fa-search"
        class="search-field"
      />
    </div>
  </div>

  <!-- ✅ ENHANCED CHART SECTION (no icon changes needed) -->
  <div v-if="showOobChart && displayedMeds.length > 0" class="chart-section">
    <div class="chart-debug mb-3">
      <p><strong>Debug Info:</strong></p>
      <p>📊 Displaying {{ displayedMeds.length }} meds</p>
      <p>📅 Time Frame: {{ selectedTimeFrame || 'All Time' }} days</p>
    </div>
    
    <OobChart 
      :key="chartKey"
      :meds="displayedMeds" 
      :timeFrame="parseInt(selectedTimeFrame) || 365"
      :chartLabels="chartLabels" 
      :chartIntervals="chartIntervals"
    />
  </div>
  
  <!-- ✅ RESULTS SECTION (already FontAwesome) -->
  <div class="results-section">
    <h3 class="results-count">
      <i class="fas fa-hashtag"></i>
      List Total: {{ displayedMeds.length }}
    </h3>
    
    <div v-if="displayedMeds.length === 0" class="no-results">
      <i class="fas fa-info-circle"></i>
      <p>No meds found matching your criteria.</p>
    </div>
    
    <div v-else>
      <!-- ✅ INDEX VIEW -->
      <div v-if="showIndexView">
        <OobIndex :meds="displayedMeds" />
      </div>
      
      <!-- ✅ CARD VIEW -->
      <div v-else class="cards-container">
        <p class="edit-hint">
          <i class="fas fa-hand-pointer"></i>
          Double click any card to edit
        </p>
        
        <div class="cards-grid">
          <OobCard
            v-for="med in displayedMeds"
            :key="med.id"
            :med="med"
            class="med-card"
            @dblclick="editMed(med)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ YOUR SCRIPT STAYS EXACTLY THE SAME
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import OobCard from "@/components/oobs/OobCard.vue";
import OobChart from "@/components/oobs/OobChart.vue";
import OobIndex from "@/components/oobs/OobIndex.vue";
import DateFormatService from "@/services/DateFormatService.js";
import { onUnmounted } from 'vue';

onUnmounted(() => {  
  // Clear search and filters
  searchText.value = '';
  selectedTimeFrame.value = '30';
  
  // Clear component-level data
  if (meds.value.length > 100) {
    console.log('🧹 Clearing large meds array...')
    store.dispatch('clearLargeDatasets');
  }
})
// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter(); // For navigation

// ✅ REACTIVE STATE
const showIndexView = ref(false);
const showOobChart = ref(false);
const searchText = ref('');
const selectedTimeFrame = ref('30'); // Default to 30 days
const chartKey = ref(0); // Force chart re-render

// ✅ COMPUTED PROPERTIES
const meds = computed(() => {
  const storeState = store.state.oobs;
  // ✅ HANDLE BOTH ARRAY AND NON-ARRAY STATES
  if (Array.isArray(storeState)) {
    return storeState;
  } else if (storeState === 0 || storeState === null || storeState === undefined) {
    return [];
  } else {
    console.warn('⚠️ Unexpected meds state type:', typeof storeState, storeState);
    return [];
  }
});

const chartLabels = computed(() => {
  return displayedMeds.value.map(med => 
    DateFormatService.formatStandardDatejs(med.date_of_occurrence)
  );
});

const chartIntervals = computed(() => {
  return displayedMeds.value.map(med => med.interval_days || 0);
});


const displayedMeds = computed(() => {  
  // ✅ SAFETY CHECK: ENSURE WE HAVE AN ARRAY
  let result = Array.isArray(meds.value) ? [...meds.value] : [];
  // ✅ HARD LIMIT TO PREVENT MEMORY ISSUES (EMERGENCY PROTECTION)
  if (result.length > 500) {
    console.warn('🚨 Too many meds, limiting to 500 to prevent R14 memory errors');
    result = result.slice(0, 500);
  }
  // Early return if no meds
  if (result.length === 0) {
    return [];
  }
  
  // ✅ APPLY TIME FRAME FILTER
  if (selectedTimeFrame.value && result.length > 0) {
    const daysBack = parseInt(selectedTimeFrame.value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    const beforeFilter = result.length;
    result = result.filter(med => {
      const medDate = new Date(med.date_of_occurrence);
      return medDate >= cutoffDate;
    });
  }
  
  // ✅ APPLY SEARCH FILTER
  if (searchText.value && searchText.value.length >= 2) {
    const searchLower = searchText.value.toLowerCase();
    const beforeFilter = result.length;
    
    result = result.filter(med => {
      // Search in date
      const searchInDate = med.date_of_occurrence && 
        DateFormatService.formatDatejs(med.date_of_occurrence)
          .toLowerCase()
          .includes(searchLower);
          
      // Search in duration
      const searchInDuration = med.duration && 
        med.duration.toLowerCase().includes(searchLower);
        
      // Search in circumstances
      const searchInCircumstances = med.circumstances && 
        med.circumstances.toLowerCase().includes(searchLower);
      
      // Search in description (if exists)
      const searchInDescription = med.description && 
        med.description.toLowerCase().includes(searchLower);
        
      // Search in type (if exists)
      const searchInType = med.type && 
        med.type.toLowerCase().includes(searchLower);
      
      return searchInDate || searchInDuration || searchInCircumstances || 
             searchInDescription || searchInType;
    });
  }
  
  // ✅ SAFE SORT: ENSURE result IS STILL AN ARRAY
  const sortedResult = Array.isArray(result) ? result.sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.date_of_occurrence);
    const dateB = new Date(b.date_of_occurrence);
    return dateB - dateA;
  }) : [];
  
  // ✅ ADDITIONAL MEMORY PROTECTION - WARN IF STILL TOO LARGE
  if (sortedResult.length > 200) {
    console.warn('⚠️ Large result set:', sortedResult.length, 'items - consider more filtering');
  }
  
  return sortedResult;
});

// ✅ WATCHER TO FORCE CHART UPDATE (NO SIDE EFFECTS)
watch(
  [selectedTimeFrame, displayedMeds], 
  () => {    
    // Force chart re-render by incrementing key
    chartKey.value++;
  },
  { immediate: true }
);

// ✅ METHODS
const toggleIndexView = () => {
  showIndexView.value = !showIndexView.value;
};

const toggleOobChart = () => {
  showOobChart.value = !showOobChart.value;
};

const editMed = (med) => {
  router.push({ name: 'OobEdit', params: { id: med.id } });
};

const clearSearch = () => {
  searchText.value = '';
};

const performSearch = () => {
  // Search is reactive through computed property
};

// ✅ SIMPLIFIED FILTER FUNCTION
const filterByTimeFrame = () => {
  // The watcher will handle chartKey increment
  nextTick(() => {
  });
};

// ✅ ENHANCED MOUNTED DEBUG
onMounted(async () => {

  try {
    await store.dispatch('fetchOobs')
  } catch (error) {
    console.error('❌ Fetch Error details:', error.message, error.stack)
  }
})
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
.meds-menu-link {
  color: #000;
  text-decoration: none;
}
.meds-menu-link:hover {
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

.med-card {
  transition: transform 0.2s ease;
}

.med-card:hover {
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