<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2><i class="mdi mdi-medication-outline"></i> Med List</h2>
    </v-card-title>
    
    <!-- ✅ MODERN NAVIGATION -->
    <div class="navigation-buttons">
      <router-link :to="{ name: 'GlucoseReadings' }" class="nav-btn">
        <i class="mdi mdi-chart-line"></i>
        <span>Glucose Readings</span>
      </router-link>
      
      <router-link :to="{ name: 'MedCreate' }" class="nav-btn">
        <i class="mdi mdi-plus"></i>
        <span>Add Med</span>
      </router-link>
      
      <button @click="toggleIndexView" class="nav-btn">
        <i class="mdi" :class="showIndexView ? 'mdi-card-multiple' : 'mdi-view-list'"></i>
        <span>{{ showIndexView ? 'Card View' : 'Index View' }}</span>
      </button>
      
      <button @click="toggleMedChart" class="nav-btn">
        <i class="mdi mdi-chart-bar"></i>
        <span>{{ showMedChart ? 'Hide Chart' : 'Show Chart' }}</span>
      </button>
    </div>
  </v-card>

  <!-- ✅ EXTERNAL LINK -->
  <div class="external-link">
    <a href="https://myhealthchart.com/" target="_blank">
      <i class="mdi mdi-open-in-new"></i>
      MyHealthChart Portal
    </a>
  </div>

  <!-- ✅ FILTERS SECTION -->
  <div class="filters-section">
    <div class="time-frame-filter">
      <label>
        <i class="mdi mdi-calendar-range"></i>
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
        clear-icon="mdi-close"
        @click:clear="clearSearch"
        @input="performSearch"
        placeholder="Search meds..."
        prepend-inner-icon="mdi-magnify"
        class="search-field"
      />
    </div>
  </div>

  <!-- ✅ CHART SECTION -->
  <div v-if="showMedChart && displayedMeds.length > 0" class="chart-section">
    <MedChart 
      :meds="displayedMeds" 
      :timeFrame="selectedTimeFrame || 30"
      :chartLabels="chartLabels" 
      :chartIntervals="chartIntervals"
    />
  </div>

  <!-- ✅ RESULTS SECTION -->
  <div class="results-section">
    <h3 class="results-count">
      <i class="mdi mdi-counter"></i>
      Total: {{ displayedMeds.length }}
    </h3>
    
    <div v-if="displayedMeds.length === 0" class="no-results">
      <i class="mdi mdi-information-outline"></i>
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
          <i class="mdi mdi-gesture-double-tap"></i>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue';
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
//const filteredMeds = ref([]);

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
  let result = meds.value;
  
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
  
  // Sort by date (newest first)
  return result.sort((a, b) => 
    new Date(b.date_of_occurrence) - new Date(a.date_of_occurrence)
  );
});

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
  console.log('🔍 Searching for:', searchText.value);
};

const filterByTimeFrame = () => {
  console.log('📅 Time frame changed to:', selectedTimeFrame.value);
};

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('✅ MedList mounted (Composition API)');
  
  // Fetch meds data
  await store.dispatch("fetchMeds");
  
  // Wait for data to load
  await nextTick();
  
  console.log('📊 Loaded meds:', meds.value.length);
});

// ✅ WATCH FOR CHANGES
watch(meds, (newMeds) => {
  console.log('📊 Meds updated:', newMeds.length);
}, { deep: true });
</script>

<style scoped>
/* ✅ MODERN STYLING */
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