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
import { useRouter } from 'vue-router';
import MedCard from "@/components/meds/MedCard.vue";
import MedChart from "@/components/meds/MedChart.vue";
import MedIndex from "@/components/meds/MedIndex.vue";
import DateFormatService from "@/services/DateFormatService.js";

// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();

// ✅ REACTIVE STATE
const showIndexView = ref(false);
const showMedChart = ref(false);
const searchText = ref('');
const selectedTimeFrame = ref('30'); // Default to 30 days
const chartKey = ref(0); // Force chart re-render

// ✅ COMPUTED PROPERTIES
const meds = computed(() => store.state.meds || []);

const chartLabels = computed(() => {
  return displayedMeds.value.map(med => 
    DateFormatService.formatStandardDatejs(med.date_of_occurrence)
  );
});

const chartIntervals = computed(() => {
  return displayedMeds.value.map(med => med.interval_days || 0);
});

// ✅ MAIN DISPLAY LOGIC
const displayedMeds = computed(() => {
  // ✅ SAFETY CHECK: ENSURE WE HAVE AN ARRAY
  let result = Array.isArray(meds.value) ? meds.value : [];
  
  // Early return if no meds
  if (result.length === 0) {
    return [];
  }
  
  // Apply time frame filter
  if (selectedTimeFrame.value && result.length > 0) {
    const daysBack = parseInt(selectedTimeFrame.value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    result = result.filter(med => {
      const medDate = new Date(med.date_of_occurrence);
      return medDate >= cutoffDate;
    });
  }
  
  // Apply search filter
  if (searchText.value && searchText.value.length >= 2) {
    const searchLower = searchText.value.toLowerCase();
    
    result = result.filter(med => {
      const searchInDate = med.date_of_occurrence && 
        DateFormatService.formatDatejs(med.date_of_occurrence)
          .toLowerCase()
          .includes(searchLower);
          
      const searchInDuration = med.duration && 
        med.duration.toLowerCase().includes(searchLower);
        
      const searchInCircumstances = med.circumstances && 
        med.circumstances.toLowerCase().includes(searchLower);
      
      return searchInDate || searchInDuration || searchInCircumstances;
    });
  }
  
  // ✅ SAFE SORT: ENSURE result IS STILL AN ARRAY
  return Array.isArray(result) ? result.sort((a, b) => 
    new Date(b.date_of_occurrence) - new Date(a.date_of_occurrence)
  ) : [];
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

// ✅ LIFECYCLE
onMounted(async () => {
  
  // Fetch meds data
  await store.dispatch("fetchMeds");
  
  // Wait for data to load
  await nextTick();
  
});
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