<<<<<<< Updated upstream
<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/oobs/HealthMarkerList.vue -->
=======
>>>>>>> Stashed changes
<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="fas fa-heartbeat"></i> Health Markers Dashboard</h2>
    </v-card-title>
    
    <!-- ✅ NAVIGATION BUTTONS -->
    <div class="navigation-buttons">
      <router-link :to="{ name: 'HealthMarkerCreate' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-plus"></i>
        <span>Add Marker</span>
      </router-link>
      
      <router-link :to="{ name: 'HealthMarkersByCategory' }" class="nav-btn" id="button-as-link">
        <i class="fas fa-layer-group"></i>
        <span>View Category</span>
      </router-link>
      
      <button @click="toggleIndexView" class="nav-btn" id="button-as-link">
        <i :class="showIndexView ? 'fas fa-th' : 'fas fa-list'"></i>
        <span>{{ showIndexView ? 'Card View' : 'Index View' }}</span>
      </button>
      
      <button @click="toggleChart" class="nav-btn" id="button-as-link">
        <i class="fas fa-chart-line"></i>
        <span>{{ showChart ? 'Hide Chart' : 'Show Chart' }}</span>
      </button>
    </div>
  </v-card>

  <!-- ✅ FILTERS SECTION -->
  <div class="filters-section">
    <div class="category-filter">
      <label>
        <i class="fas fa-filter"></i>
        Category:
      </label>
      <select v-model="selectedCategory" @change="filterByCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="category in healthMarkerCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="time-frame-filter">
      <label>
        <i class="fas fa-calendar-alt"></i>
        Time Frame:
      </label>
      <select v-model="selectedTimeFrame" @change="filterByTimeFrame" class="time-select">
        <option value="">All Time</option>
        <option value="7">Week</option>
        <option value="30">Month</option>
        <option value="90">Quarter</option>
        <option value="180">6 Months</option>
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
        placeholder="Search health markers..."
        prepend-inner-icon="fas fa-search"
        class="search-field"
      />
    </div>
  </div>

  <!-- ✅ CHART SECTION -->
  <div v-if="showChart && displayedHealthMarkers.length > 0" class="chart-section">
    <div class="chart-debug mb-3">
      <p><strong>Chart Info:</strong></p>
      <p>📊 Displaying {{ displayedHealthMarkers.length }} results</p>
      <p>📅 Time Frame: {{ selectedTimeFrame || 'All Time' }} days</p>
      <p>🏷️ Category: {{ selectedCategory || 'All Categories' }}</p>
    </div>
    
    <!--HealthMarkerChart 
      :key="chartKey"
      :healthMarkers="displayedHealthMarkers" 
      :timeFrame="parseInt(selectedTimeFrame) || 365"
      :selectedCategory="selectedCategory"
    /-->
  </div>
  
  <!-- ✅ RESULTS SECTION -->
  <div class="results-section">
    <h3 class="results-count">
      <i class="fas fa-hashtag"></i>
      Results New {{ displayedHealthMarkers.length }}
    </h3>
    
    <!-- ✅ CATEGORY BREAKDOWN -->
    <div v-if="displayedHealthMarkers.length > 0" class="category-breakdown">
      <div class="category-chips">
        <v-chip 
          v-for="stat in categoryStats" 
          :key="stat.category"
          size="small"
          :color="stat.category === selectedCategory ? 'primary' : 'default'"
          class="mr-2 mb-2"
          @click="selectCategory(stat.category)"
        >
          {{ stat.category }}: {{ stat.count }}
        </v-chip>
      </div>
    </div>
    
    <div v-if="displayedHealthMarkers.length === 0" class="no-results">
      <i class="fas fa-info-circle"></i>
      <p>No health marker results found matching your criteria.</p>
      <v-btn 
        :to="{ name: 'HealthMarkerCreate' }" 
        color="primary"
        prepend-icon="fas fa-plus"
        class="mt-3"
      >
        Add Your First Health Marker
      </v-btn>
    </div>
    
    <div v-else>
      <!-- ✅ INDEX VIEW -->
      <div v-if="showIndexView">
        <HealthMarkerIndex :healthMarkers="displayedHealthMarkers" />
      </div>
      
      <!-- ✅ CARD VIEW -->
      <div v-else class="cards-container">
        <div class="cards-grid">
          <HealthMarkerCard
            v-for="healthMarker in displayedHealthMarkers"
            :key="healthMarker.id"
            :healthMarker="healthMarker"
            class="health-marker-card"
            @dblclick="editHealthMarker(healthMarker)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { HEALTH_MARKER_CATEGORIES, getHealthMarkersByCategory } from '@/services/health-marker-constants';
import HealthMarkerCard from "@/components/healthMarkers/HealthMarkerCard.vue";
//import HealthMarkerChart from "@/components/healthMarkers/HealthMarkerChart.vue";
import HealthMarkerIndex from "@/components/healthMarkers/HealthMarkerIndex.vue";
import DateFormatService from "@/services/DateFormatService.js";

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();

// ✅ REACTIVE STATE
const showIndexView = ref(false);
const showChart = ref(false);
const searchText = ref('');
const selectedCategory = ref('');
const selectedTimeFrame = ref(''); // Default to 90 days
const chartKey = ref(0); // Force chart re-render

// ✅ CLEANUP ON UNMOUNT
onUnmounted(() => {
  searchText.value = '';
  selectedCategory.value = '';
  selectedTimeFrame.value = '90';
  
  if (healthMarkers.value.length > 100) {
    console.log('🧹 Clearing large health markers array...');
    store.dispatch('clearLargeDatasets');
  }
});

// ✅ COMPUTED PROPERTIES
const healthMarkers = computed(() => {
  const storeState = store.state.healthMarkers;
  if (Array.isArray(storeState)) {
    return storeState;
  } else if (storeState === 0 || storeState === null || storeState === undefined) {
    return [];
  } else {
    console.warn('⚠️ Unexpected healthMarkers state type:', typeof storeState, storeState);
    return [];
  }
});

const healthMarkerCategories = computed(() => HEALTH_MARKER_CATEGORIES);

const displayedHealthMarkers = computed(() => {
  let result = Array.isArray(healthMarkers.value) ? [...healthMarkers.value] : [];
  
  // ✅ HARD LIMIT TO PREVENT MEMORY ISSUES
  if (result.length > 500) {
    console.warn('🚨 Too many health markers, limiting to 500 to prevent memory errors');
    result = result.slice(0, 500);
  }
  
  if (result.length === 0) {
    return [];
  }
  
  // ✅ APPLY CATEGORY FILTER
  if (selectedCategory.value) {
    result = result.filter(marker => marker.marker_name && 
      getHealthMarkersByCategory(selectedCategory.value)
        .some(hm => hm.name === marker.marker_name)
    );
  }
  
  // ✅ APPLY TIME FRAME FILTER
  if (selectedTimeFrame.value) {
    const daysBack = parseInt(selectedTimeFrame.value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    result = result.filter(marker => {
      const testDate = new Date(marker.marker_date);
      return testDate >= cutoffDate;
    });
  }
  
  // ✅ APPLY SEARCH FILTER
  if (searchText.value && searchText.value.length >= 2) {
    const searchLower = searchText.value.toLowerCase();
    
    result = result.filter(marker => {
      const searchInMarkerName = marker.marker_name && 
        marker.marker_name.toLowerCase().includes(searchLower);
        
      const searchInTestDate = marker.marker_date && 
        DateFormatService.formatDatejs(marker.marker_date)
          .toLowerCase()
          .includes(searchLower);
          
      const searchInTestResult = marker.marker_result && 
        marker.marker_result.toString().toLowerCase().includes(searchLower);
        
      const searchInNotes = marker.notes && 
        marker.notes.toLowerCase().includes(searchLower);
      
      return searchInMarkerName || searchInTestDate || searchInTestResult || searchInNotes;
    });
  }
  
  // ✅ SORT BY TEST DATE (MOST RECENT FIRST)
const sortedResult = Array.isArray(result) ? result.sort((a, b) => {
  const dateA = new Date(a.marker_date);
  const dateB = new Date(b.marker_date);
  return dateB - dateA;
  }) : [];
  
  if (sortedResult.length > 200) {
    console.warn('⚠️ Large result set:', sortedResult.length, 'items - consider more filtering');
  }
  
  return sortedResult;
});

const categoryStats = computed(() => {
  if (!displayedHealthMarkers.value.length) return [];
  
  const stats = {};
  
  displayedHealthMarkers.value.forEach(marker => {
    if (marker.marker_name) {
      // Find which category this marker belongs to
      const category = HEALTH_MARKER_CATEGORIES.find(cat => 
        getHealthMarkersByCategory(cat).some(hm => hm.name === marker.marker_name)
      ) || 'Other';
      
      stats[category] = (stats[category] || 0) + 1;
    }
  });
  
  return Object.entries(stats)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
});

// ✅ WATCHERS
watch(
  [selectedTimeFrame, selectedCategory, displayedHealthMarkers], 
  () => {
    chartKey.value++;
  },
  { immediate: true }
);

// ✅ METHODS
const toggleIndexView = () => {
  showIndexView.value = !showIndexView.value;
};

const toggleChart = () => {
  showChart.value = !showChart.value;
};

const editHealthMarker = (healthMarker) => {
  router.push({ name: 'HealthMarkerEdit', params: { id: healthMarker.id } });
};

const clearSearch = () => {
  searchText.value = '';
};

const performSearch = () => {
  // Search is reactive through computed property
};

const filterByCategory = () => {
  nextTick(() => {
    // Watcher will handle chartKey increment
  });
};

const filterByTimeFrame = () => {
  nextTick(() => {
    // Watcher will handle chartKey increment
  });
};

const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category;
};

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    await store.dispatch('fetchHealthMarkers');

  } catch (error) {
    console.error('❌ Fetch Health Markers Error:', error.message, error.stack);
  }
});
</script>

<style scoped>
/* ✅ HEART ANIMATION FOR GLUCOSE BUTTON */
.glucose-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.heart-icon {
  color: #e91e63 !important;
  font-size: 18px !important;
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

.glucose-btn:hover .heart-icon {
  color: #ff1744 !important;
  transform: scale(1.2);
  animation-duration: 1s;
}

/* ✅ NAVIGATION STYLES */
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

.nav-btn i {
  color: #495057;
  font-size: 18px;
  transition: all 0.3s ease;
}

.nav-btn:hover i {
  color: white;
  transform: scale(1.1);
}

/* ✅ ICON COLORS */
.fa-heartbeat {
  color: #e91e63 !important;
}

.fa-plus {
  color: #28a745 !important;
}

.fa-layer-group {
  color: #17a2b8 !important;
}

.fa-pills {
  color: #6f42c1 !important;
}

.fa-chart-line {
  color: #ffc107 !important;
}

.fa-th,
.fa-list {
  color: #6c757d !important;
}

/* ✅ FILTERS SECTION */
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

.category-filter,
.time-frame-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-select,
.time-select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  min-width: 120px;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

/* ✅ CHART SECTION */
.chart-section {
  margin: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-debug {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #17a2b8;
  font-size: 0.875rem;
}

/* ✅ RESULTS SECTION */
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

.category-breakdown {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  display: block;
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

.health-marker-card {
  transition: transform 0.2s ease;
}

.health-marker-card:hover {
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
  
  .category-chips {
    justify-content: center;
  }
}
</style>