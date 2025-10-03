<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-pills"></i> Med List</h2>
    </v-card-title>
    <!-- ✅ MODERN NAVIGATION -->
    <div class="navigation-buttons">
      <router-link :to="{ name: 'GlucoseReadings' }" class="nav-btn glucose-btn" id="button-as-link">
        <i class="fas fa-heart heart-icon"></i>
        <span>Glucose Readings</span>
      </router-link>
      
      <router-link :to="{ name: 'MedCreate' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-plus"></i>
        <span style="position: relative; left: 2rem;">Add Med</span>
      </router-link>
      
      <button @click="toggleIndexView" class="nav-btn" id="button-as-link">
        <i class="fas" :class="showIndexView ? 'fa-th-large' : 'fa-list'"></i>
        <span>{{ showIndexView ? 'Card View' : 'Index View' }}</span>
      </button>
      
      <button @click="toggleMedChart" class="nav-btn" id="button-as-link">
        <i class="fas fa-chart-bar"></i>
        <span>{{ showMedChart ? 'Hide Chart' : 'Show Chart' }}</span>
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
        placeholder="Search meds..."
        prepend-inner-icon="fas fa-search"
        class="search-field"
      />
    </div>
  </div>

  <!-- ✅ ENHANCED CHART SECTION WITH FORCED REACTIVITY -->
  <div v-if="showMedChart && displayedMeds.length > 0" class="chart-section">
    <div class="chart-debug mb-3">
      <p><strong>Debug Info:</strong></p>
      <p>📊 Displaying {{ displayedMeds.length }} meds</p>
      <p>📅 Time Frame: {{ selectedTimeFrame || 'All Time' }} days</p>
    </div>
    
    <!-- ✅ ADD KEY TO FORCE CHART RE-RENDER -->
    <MedChart 
      :key="chartKey"
      :meds="displayedMeds" 
      :timeFrame="parseInt(selectedTimeFrame) || 365"
      :chartLabels="chartLabels" 
      :chartIntervals="chartIntervals"
    />
  </div>
  
  <!-- ✅ RESULTS SECTION -->
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
        <MedIndex :meds="displayedMeds" />
      </div>
      
      <!-- ✅ CARD VIEW -->
      <div v-else class="cards-container">
        <p class="edit-hint">
          <i class="fas fa-hand-pointer"></i>
          Double click any card to edit
        </p>
        
        <div class="cards-grid">
          <MedCard
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
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // ✅ IMPORT BOTH
import MedCard from "@/components/meds/MedCard.vue";
import MedChart from "@/components/meds/MedChart.vue";
import MedIndex from "@/components/meds/MedIndex.vue";
import DateFormatService from "@/services/DateFormatService.js";
// ✅ ADD CLEANUP ON UNMOUNT
import { onUnmounted } from 'vue';
// ✅ CLEANUP WHEN LEAVING COMPONENT
onUnmounted(() => {
  console.log('🧹 MedList unmounting - cleaning up...')
  
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
const showMedChart = ref(false);
const searchText = ref('');
const selectedTimeFrame = ref('30'); // Default to 30 days
const chartKey = ref(0); // Force chart re-render

// ✅ COMPUTED PROPERTIES
const meds = computed(() => {
  const storeState = store.state.meds;
  
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
  console.log('🔄 Computing displayedMeds...');
  
  // ✅ SAFETY CHECK: ENSURE WE HAVE AN ARRAY
  let result = Array.isArray(meds.value) ? [...meds.value] : [];
  
  console.log('🔄 Initial result:', result.length, 'items');
  
  // ✅ HARD LIMIT TO PREVENT MEMORY ISSUES (EMERGENCY PROTECTION)
  if (result.length > 500) {
    console.warn('🚨 Too many meds, limiting to 500 to prevent R14 memory errors');
    result = result.slice(0, 500);
  }
  
  // Early return if no meds
  if (result.length === 0) {
    console.log('🔄 No meds to display');
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
    console.log(`🔄 Time filter (${daysBack} days): ${beforeFilter} → ${result.length} items`);
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
    console.log(`🔄 Search filter ("${searchText.value}"): ${beforeFilter} → ${result.length} items`);
  }
  
  // ✅ SAFE SORT: ENSURE result IS STILL AN ARRAY
  const sortedResult = Array.isArray(result) ? result.sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.date_of_occurrence);
    const dateB = new Date(b.date_of_occurrence);
    return dateB - dateA;
  }) : [];
  
  console.log('🔄 Final result:', sortedResult.length, 'items');
  
  // ✅ ADDITIONAL MEMORY PROTECTION - WARN IF STILL TOO LARGE
  if (sortedResult.length > 200) {
    console.warn('⚠️ Large result set:', sortedResult.length, 'items - consider more filtering');
  }
  
  return sortedResult;
});

// ✅ ENHANCED DEBUG WATCHERS
//watch(meds, (newMeds) => {
//  console.log('🔍 Meds changed:', newMeds)
//  console.log('🔍 Is array?', Array.isArray(newMeds))
//  console.log('🔍 Length:', newMeds?.length || 0)
//  if (newMeds && newMeds.length > 0) {
//    console.log('🔍 First med:', newMeds[0])
//  }
//}, { immediate: true })

//?watch(displayedMeds, (newDisplayed) => {
//?  console.log('📊 DisplayedMeds changed:', newDisplayed)
//?  console.log('📊 Count:', newDisplayed?.length || 0)
//?}, { immediate: true })

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

const toggleMedChart = () => {
  showMedChart.value = !showMedChart.value;
};

const editMed = (med) => {
  router.push({ name: 'MedEdit', params: { id: med.id } });
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
    await store.dispatch('fetchMeds')
  } catch (error) {
    console.error('❌ Fetch Error details:', error.message, error.stack)
  }
})
</script>
<style scoped>
/* ✅ FONT AWESOME GLUCOSE BUTTON WITH HEART ICON */
.glucose-btn {
  position: relative;
}

.heart-icon {
  position: absolute !important;
  top: 0rem !important;
  right: 0rem !important;
  color: #e91e63 !important;
  font-size: 16px !important;
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

/* ... rest of your existing CSS ... */
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