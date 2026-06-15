<template>
  <div class="page-wrapper">
    <div class="health-markers-category-container">
      <BaseCard class="mx-auto mt-5">
        <div class="card-title pb-0">
          <h2>
            <i class="fas fa-layer-group"></i>
            Health Markers by Category
          </h2>
        </div>

        <div class="card-text">
          <div class="navigation-flex">
            <router-link :to="{ name: 'HealthMarkerCreate' }" class="btn btn-outline-success nav-button">
              <i class="fas fa-plus"></i>
              Add Health Marker
            </router-link>

            <router-link :to="{ name: 'HealthMarkers' }" class="btn btn-outline-primary nav-button">
              <i class="fas fa-list"></i>
              View All Results
            </router-link>

            <button
              class="btn btn-outline-primary nav-button"
              @click="toggleIndexView"
              :disabled="showChartView"
            >
              <i :class="showIndexView ? 'fas fa-th' : 'fas fa-list'"></i>
              {{ showIndexView ? 'Category View' : 'Index View' }}
            </button>

            <button
              class="btn btn-outline-secondary nav-button"
              @click="toggleChartView"
            >
              <i :class="showChartView ? 'fas fa-th' : 'fas fa-chart-line'"></i>
              {{ showChartView ? 'Category View' : 'Chart View' }}
            </button>
          </div>
        </div>
      </BaseCard>

      <!-- ✅ CATEGORY OVERVIEW STATS -->
      <BaseCard class="mt-4" v-if="categoryStats.length > 0">
        <div class="card-title">
          <i class="fas fa-chart-pie"></i>
          Category Overview ({{ totalResults }} total results)
        </div>
        <div class="card-text">
          <div class="stats-grid">
            <div 
              v-for="stat in categoryStats" 
              :key="stat.category"
              class="stat-card"
              :class="{ 'stat-card-active': selectedCategory === stat.category }"
              @click="toggleCategory(stat.category)"
            >
              <div class="stat-icon">
                <i
                  :class="['category-icon', getCategoryFaIcon(stat.category)]"
                  :style="{ color: getCategoryColorHex(stat.category) }"
                ></i>
              </div>
              <div class="stat-info">
                <h3>{{ stat.category }}</h3>
                <p class="stat-count">{{ stat.count }} results</p>
                <p class="stat-latest">Latest: {{ stat.latestDate }}</p>
                <p class="stat-range">{{ stat.dateRange }}</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- ✅ FILTERS SECTION -->
      <BaseCard class="mt-4">
        <div class="card-text">
          <div class="filters-section">
            <div class="filter-group">
              <label>
                <i class="fas fa-calendar-alt"></i>
                Time Frame:
              </label>
              <select v-model="selectedTimeFrame" @change="applyFilters" class="filter-select">
                <option value="">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 3 Months</option>
                <option value="180">Last 6 Months</option>
                <option value="365">Last Year</option>
              </select>
            </div>

            <div class="filter-group">
              <label>
                <i class="fas fa-filter"></i>
                Category:
              </label>
              <select v-model="selectedCategory" @change="applyFilters" class="filter-select">
                <option value="">All Categories</option>
                <option v-for="category in availableCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="search-section">
              <input
                v-model="searchText"
                @input="applyFilters"
                placeholder="Search health markers..."
                class="search-field"
                type="text"
              />
              <button v-if="searchText" class="btn btn-outline-secondary clear-search-btn" @click="clearSearch">
                <i class="fas fa-times"></i>
                Clear
              </button>
            </div>
          </div>
        </div>
      </BaseCard>
      <!-- ✅ UPDATE YOUR VIEW STATUS: -->
      <BaseCard class="mt-2" v-if="filteredHealthMarkers.length > 0">
        <div class="card-text py-2">
          <div class="view-status">
            <div class="view-indicator">
              <i :class="showChartView ? 'fas fa-chart-line mr-2' : showIndexView ? 'fas fa-table mr-2' : 'fas fa-layer-group mr-2'"></i>
              <span class="view-text">
                {{ showChartView ? 'Chart View' : showIndexView ? 'Index View' : 'Category View' }} - 
                {{ filteredHealthMarkers.length }} health markers
              </span>
              </div>

            <div class="quick-stats" v-if="!showIndexView && !showChartView">
              <span class="stat-item">
                <i class="fas fa-tags"></i>
                {{ displayedCategories.length }} categories
              </span>
              <span class="stat-item">
                <i class="fas fa-expand-arrows-alt"></i>
                {{ Array.from(expandedCategories).length }} expanded
              </span>
              </div>

            <div class="quick-stats" v-if="showChartView">
              <span class="stat-item">
                <i class="fas fa-chart-area"></i>
                {{ getCategoriesWithData.length }} charts
              </span>
              <span class="stat-item">
                <i class="fas fa-calendar-alt"></i>
                Trends over time
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
      <!-- ✅ NO RESULTS MESSAGE -->
      <div v-if="filteredHealthMarkers.length === 0" class="no-results-container">
        <BaseCard class="no-results-card">
          <div class="card-text text-center">
            <i class="fas fa-database no-results-icon"></i>
            <h3>No Health Markers Found</h3>
            <p>{{ getNoResultsMessage() }}</p>
            <router-link :to="{ name: 'HealthMarkerCreate' }" class="btn btn-primary mt-3">
              <i class="fas fa-plus"></i>
              Add Your First Health Marker
            </router-link>
          </div>
        </BaseCard>
      </div>

      <!-- ✅ CATEGORY SECTIONS -->
      <!-- ✅ INDEX VIEW -->
      <div v-if="showIndexView" class="index-view-container">
        <BaseCard class="mt-4">
          <div class="card-title">
            <div class="index-header">
              <h3>
                <i class="fas fa-table"></i>
                Health Markers Index View
              </h3>
              <span class="pill pill-primary">
                <i class="fas fa-list-ol"></i>
                {{ filteredHealthMarkers.length }} results
              </span>
            </div>
          </div>

          <div class="card-text pa-0">
            <HealthMarkerIndex 
              :healthMarkers="filteredHealthMarkers"
              class="category-index-table"
            />
          </div>
        </BaseCard>
      </div>
      <!-- ✅ ADD THIS CHART VIEW AFTER INDEX VIEW: -->
          
      <!-- ✅ CHART VIEW -->
      <!-- ✅ REPLACE YOUR ENTIRE CHART VIEW SECTION WITH THIS: -->

      <!-- ✅ SIMPLE CHART VIEW -->
      <div v-if="showChartView" class="simple-chart-view-container">
        <BaseCard class="mt-4">
          <div class="card-title">
            <div class="chart-header">
              <h3>
                <i class="fas fa-chart-line"></i>
                Health Marker Trends by Category
              </h3>
              <span class="pill pill-secondary">
                <i class="fas fa-chart-line"></i>
                {{ getCategoriesWithData.length }} categories
              </span>
            </div>
          </div>
        </BaseCard>
      
        <!-- ✅ SIMPLE CHARTS FOR EACH CATEGORY -->
        <div class="simple-charts-container">
          <HealthMarkerCategoryChart
            v-for="category in getCategoriesWithData" 
            :key="`simple-chart-${category}`"
            :category="category"
            :healthMarkers="getCategoryMarkers(category)"
            class="category-chart"
          />
        </div>
      
        <!-- ✅ SUMMARY CARD -->
        <BaseCard class="mt-4 simple-chart-summary">
          <div class="card-title">
            <i class="fas fa-chart-pie mr-2"></i>
            Chart Summary
          </div>
          <div class="card-text">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-number">{{ getCategoriesWithData.length }}</div>
                <div class="summary-label">Categories</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">{{ filteredHealthMarkers.length }}</div>
                <div class="summary-label">Data Points</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">{{ [...new Set(filteredHealthMarkers.map(m => m.marker_name))].length }}</div>
                <div class="summary-label">Markers</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- ✅ CATEGORY VIEW (EXISTING) -->
      <div v-else class="category-sections">
        <div 
          v-for="category in displayedCategories" 
          :key="category"
          :id="`category-${category.toLowerCase().replace(/\s+/g, '-')}`"
          class="category-section"
        >
          <BaseCard class="category-card">
            <div class="card-title category-header">
              <div class="category-title">
                <i
                  :class="['category-icon mr-3', getCategoryFaIcon(category)]"
                  :style="{ color: getCategoryColorHex(category) }"
                ></i>
                <h2>{{ category }}</h2>
                <span class="pill ml-3" :style="{ backgroundColor: getCategoryColorHex(category) }">
                  {{ getCategoryMarkers(category).length }} results
                </span>
              </div>

              <button
                class="btn btn-outline-secondary btn-sm"
                @click="toggleCategoryExpansion(category)"
              >
                <i :class="isCategoryExpanded(category) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                {{ isCategoryExpanded(category) ? 'Collapse' : 'Expand' }}
              </button>
            </div>
          
            <!-- ✅ CATEGORY DESCRIPTION -->
            <div class="card-text" v-if="isCategoryExpanded(category)">
              <div class="category-description">
                <p><strong>{{ getCategoryDescription(category) }}</strong></p>
                <div class="category-info">
                  <span class="info-item">
                    <i class="fas fa-chart-line"></i>
                    Total Tests: {{ getCategoryMarkers(category).length }}
                  </span>
                  <span class="info-item">
                    <i class="fas fa-calendar"></i>
                    Date Range: {{ getCategoryDateRange(category) }}
                  </span>
                  <span class="info-item">
                    <i class="fas fa-user"></i>
                    Contributors: {{ getCategoryContributors(category) }}
                  </span>
                </div>
              </div>
            
              <!-- ✅ MARKERS GRID FOR THIS CATEGORY -->
              <div class="markers-grid">
                <HealthMarkerCard
                  v-for="healthMarker in getCategoryMarkers(category)"
                  :key="healthMarker.id"
                  :healthMarker="healthMarker"
                  class="category-marker-card"
                  @dblclick="editHealthMarker(healthMarker)"
                />
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- ✅ FLOATING ACTION BUTTON -->
      <router-link
        :to="{ name: 'HealthMarkerCreate' }"
        class="fab-button"
        :class="{ 'fab-hidden': showIndexView }"
      >
        <i class="fas fa-plus"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// ✅ UPDATE YOUR IMPORTS:
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { HEALTH_MARKER_CATEGORIES, getHealthMarkerByName } from '@/services/health-marker-constants';
import HealthMarkerCard from '@/components/health/healthMarkers/HealthMarkerCard.vue';
import HealthMarkerIndex from '@/components/health/healthMarkers/HealthMarkerIndex.vue';
import DateFormatService from '@/services/DateFormatService';
import HealthMarkerCategoryChart from '@/components/health/healthMarkers/HealthMarkerCategoryChart.vue';
import BaseCard from '@/components/ui/BaseCard.vue';

// ✅ ADD CHART.JS IMPORTS
/*import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'vue-chartjs';
import 'chartjs-adapter-date-fns';

// ✅ REGISTER CHART COMPONENTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);
*/
// ✅ COMPOSITION API SETUP
const store = useStore();
const router = useRouter();

// ✅ REACTIVE STATE
const searchText = ref('');
const selectedTimeFrame = ref('');
const selectedCategory = ref('');
const showIndexView = ref(false); 
const showChartView = ref(false);
const expandedCategories = ref(new Set(['Diabetes', 'Lipids', 'Heart']));

// ✅ COMPUTED PROPERTIES
const healthMarkers = computed(() => {
  const storeState = store.state.healthMarkers;
  return Array.isArray(storeState) ? storeState : [];
});

const availableCategories = computed(() => {
  return HEALTH_MARKER_CATEGORIES.filter(category => 
    healthMarkers.value.some(marker => getMarkerCategory(marker.marker_name) === category)
  );
});

const filteredHealthMarkers = computed(() => {
  let result = [...healthMarkers.value];
  
  // ✅ TIME FRAME FILTER
  if (selectedTimeFrame.value) {
    const daysBack = parseInt(selectedTimeFrame.value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    
    result = result.filter(marker => {
      const testDate = new Date(marker.marker_date);
      return testDate >= cutoffDate;
    });
  }
  
  // ✅ CATEGORY FILTER
  if (selectedCategory.value) {
    result = result.filter(marker => 
      getMarkerCategory(marker.marker_name) === selectedCategory.value
    );
  }
  
  // ✅ SEARCH FILTER
  if (searchText.value && searchText.value.length >= 2) {
    const searchLower = searchText.value.toLowerCase();
    
    result = result.filter(marker => {
      const markerInfo = getHealthMarkerByName(marker.marker_name);
      
      return (
        marker.marker_name?.toLowerCase().includes(searchLower) ||
        markerInfo?.label?.toLowerCase().includes(searchLower) ||
        markerInfo?.description?.toLowerCase().includes(searchLower) ||
        marker.marker_result?.toString().includes(searchLower) ||
        marker.notes?.toLowerCase().includes(searchLower)
      );
    });
  }
  
  // ✅ SORT BY DATE (NEWEST FIRST)
  return result.sort((a, b) => new Date(b.marker_date) - new Date(a.marker_date));
});

const displayedCategories = computed(() => {
  if (selectedCategory.value) {
    return [selectedCategory.value];
  }
  
  return availableCategories.value.filter(category => 
    filteredHealthMarkers.value.some(marker => 
      getMarkerCategory(marker.marker_name) === category
    )
  );
});

const categoryStats = computed(() => {
  return availableCategories.value.map(category => {
    const categoryMarkers = healthMarkers.value.filter(marker => 
      getMarkerCategory(marker.marker_name) === category
    );
    
    if (categoryMarkers.length === 0) return null;
    
    const sortedByDate = categoryMarkers.sort((a, b) => new Date(b.marker_date) - new Date(a.marker_date));
    const latestDate = sortedByDate[0]?.marker_date;
    const oldestDate = sortedByDate[sortedByDate.length - 1]?.marker_date;
    
    return {
      category,
      count: categoryMarkers.length,
      latestDate: latestDate ? DateFormatService.formatDatejs(latestDate) : 'No date',
      dateRange: oldestDate && latestDate ? 
        `${DateFormatService.formatDatejs(oldestDate)} - ${DateFormatService.formatDatejs(latestDate)}` : 
        'Single date'
    };
  }).filter(Boolean).sort((a, b) => b.count - a.count);
});

const toggleIndexView = () => {
  showIndexView.value = !showIndexView.value;
  console.log('🔄 Toggled index view:', showIndexView.value ? 'INDEX' : 'CATEGORY');
};
// ✅ ADD THESE METHODS TO YOUR SCRIPT:

const toggleChartView = () => {
  showChartView.value = !showChartView.value;
  if (showChartView.value) {
    showIndexView.value = false; // Can't show both at once
  }
  console.log('📊 Toggled chart view:', showChartView.value ? 'CHART' : 'CATEGORY');
};

const getCategoriesWithData = computed(() => {
  return displayedCategories.value.filter(category => {
    const markers = filteredHealthMarkers.value.filter(marker => 
      getMarkerCategory(marker.marker_name) === category
    );
    return markers.length > 0;
  });
});
const totalResults = computed(() => filteredHealthMarkers.value.length);

// ✅ HELPER METHODS

const getMarkerCategory = (markerName) => {
  const markerInfo = getHealthMarkerByName(markerName);
  return markerInfo?.category || 'Other';
};

const getCategoryColorHex = (category) => {
  const colorMap = {
    'Diabetes': '#dc3545',
    'Thyroid': '#fd7e14',
    'Lipids': '#0d6efd',
    'Vitamins': '#198754',
    'Heart': '#6f42c1',
    'Liver': '#8d6e63',
    'Kidney': '#20c997',
    'General': '#6c757d',
    'Other': '#9ca3af'
  };
  return colorMap[category] || '#9ca3af';
};

const getCategoryFaIcon = (category) => {
  const iconMap = {
    'Diabetes': 'fas fa-droplet',
    'Thyroid': 'fas fa-user-doctor',
    'Lipids': 'fas fa-heart-pulse',
    'Vitamins': 'fas fa-capsules',
    'Heart': 'fas fa-heart',
    'Liver': 'fas fa-notes-medical',
    'Kidney': 'fas fa-filter',
    'General': 'fas fa-stethoscope',
    'Other': 'fas fa-vial'
  };
  return iconMap[category] || 'fas fa-vial';
};

const getCategoryDescription = (category) => {
  const descriptions = {
    'Diabetes': 'Blood sugar control and diabetes management markers including A1C and glucose levels.',
    'Thyroid': 'Thyroid function tests including TSH and related hormones.',
    'Lipids': 'Cholesterol panel including total, LDL, HDL cholesterol and triglycerides.',
    'Vitamins': 'Vitamin levels including D, B12, and other essential vitamins.',
    'Heart': 'Cardiovascular health indicators including blood pressure and heart-related markers.',
    'Liver': 'Liver function tests and hepatic health indicators.',
    'Kidney': 'Kidney function and renal health markers.',
    'General': 'General health markers including weight, BMI, and routine measurements.',
    'Other': 'Additional health markers not categorized elsewhere.'
  };
  return descriptions[category] || 'Health markers for this category.';
};

const getCategoryMarkers = (category) => {
  return filteredHealthMarkers.value.filter(marker => 
    getMarkerCategory(marker.marker_name) === category
  );
};

const getCategoryDateRange = (category) => {
  const markers = getCategoryMarkers(category);
  if (markers.length === 0) return 'No data';
  
  const dates = markers.map(m => new Date(m.marker_date)).sort((a, b) => a - b);
  const oldest = DateFormatService.formatDatejs(dates[0]);
  const newest = DateFormatService.formatDatejs(dates[dates.length - 1]);
  
  return oldest === newest ? oldest : `${oldest} - ${newest}`;
};

const getCategoryContributors = (category) => {
  const markers = getCategoryMarkers(category);
  const contributors = [...new Set(markers.map(m => m.created_by).filter(Boolean))];
  return contributors.length;
};

const isCategoryExpanded = (category) => {
  return expandedCategories.value.has(category);
};

// ✅ ACTION METHODS
const toggleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category;
  applyFilters();
};

const toggleCategoryExpansion = (category) => {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category);
  } else {
    expandedCategories.value.add(category);
  }
};

const applyFilters = () => {
  // Filters are reactive through computed properties
};

const clearSearch = () => {
  searchText.value = '';
};

const editHealthMarker = (healthMarker) => {
  router.push({ name: 'HealthMarkerEdit', params: { id: healthMarker.id } });
};

const getNoResultsMessage = () => {
  if (searchText.value) {
    return `No health markers found matching "${searchText.value}".`;
  }
  if (selectedCategory.value) {
    return `No health markers found in the ${selectedCategory.value} category.`;
  }
  if (selectedTimeFrame.value) {
    const timeFrameText = {
      '30': 'last 30 days',
      '90': 'last 3 months', 
      '180': 'last 6 months',
      '365': 'last year'
    };
    return `No health markers found in the ${timeFrameText[selectedTimeFrame.value]}.`;
  }
  return 'No health markers found. Add your first health marker to get started.';
};

// ✅ LIFECYCLE
onMounted(async () => {
  try {
    console.log('🏥 Loading health markers for category view...');
    await store.dispatch('fetchHealthMarkers');
    console.log('✅ Health markers loaded:', healthMarkers.value.length);
  } catch (error) {
    console.error('❌ Error loading health markers:', error);
  }
});
</script>

<style scoped>
/* ✅ REPLACE ALL CHART STYLES WITH THESE SIMPLE ONES: */

/* ✅ SIMPLE CHART VIEW STYLES */
.simple-chart-view-container {
  margin-top: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.chart-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.simple-charts-container {
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
}

.category-chart {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.simple-chart-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.simple-chart-summary .v-card-title {
  color: white;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  text-align: center;
}

.summary-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.summary-number {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.summary-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
/* ✅ ADD FAB TRANSITION: */
.fab-button {
  position: fixed !important;
  bottom: 2rem !important;
  right: 2rem !important;
  z-index: 1000;
  transition: all 0.3s ease;
}

.fab-hidden {
  opacity: 0.7;
  transform: scale(0.9);
}
/* ✅ ADD TO YOUR STYLES: */
.view-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-indicator {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 500;
}

.view-text {
  font-size: 0.9rem;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

@media (max-width: 768px) {
  .view-status {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .quick-stats {
    justify-content: center;
  }
}
/* ✅ INDEX VIEW STYLES */
.index-view-container {
  margin-top: 1rem;
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.index-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.category-index-table {
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* ✅ ENHANCED NAVIGATION BUTTONS */
.nav-button {
  min-width: 160px !important; /* ✅ SLIGHTLY SMALLER FOR 3 BUTTONS */
  height: 40px !important;
  transition: all 0.3s ease;
}

.nav-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ INDEX VIEW RESPONSIVE */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .index-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }
}
/* ✅ PAGE LAYOUT */
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.health-markers-category-container {
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  margin: 0 auto;
}

/* ✅ NAVIGATION */
.navigation-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  min-width: 180px !important;
  height: 40px !important;
}

.glucose-btn {
  background: linear-gradient(45deg, #e91e63, #ff4081) !important;
  color: white !important;
}

/* ✅ STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.stat-card-active {
  border-color: #1976d2 !important;
  background: #e3f2fd !important;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.stat-count {
  margin: 0;
  font-weight: 500;
  color: #1976d2;
}

.stat-latest,
.stat-range {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #666;
}

/* ✅ FILTERS */
.filters-section {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  min-width: 140px;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

/* ✅ NO RESULTS */
.no-results-container {
  margin-top: 2rem;
}

.no-results-card {
  padding: 2rem;
}

/* ✅ CATEGORY SECTIONS */
.category-sections {
  margin-top: 1rem;
  display: grid;
  gap: 1.5rem;
}

.category-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e0e0;
}

.category-title {
  display: flex;
  align-items: center;
}

.category-title h2 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

/* ✅ CATEGORY DESCRIPTION */
.category-description {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.category-info {
  display: flex;
  gap: 2rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

/* ✅ MARKERS GRID */
.markers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
}

.category-marker-card {
  transition: transform 0.2s ease;
}

.category-marker-card:hover {
  transform: scale(1.02);
}

/* ✅ FLOATING ACTION BUTTON */
.fab-button {
  position: fixed !important;
  bottom: 2rem !important;
  right: 2rem !important;
  z-index: 1000;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .navigation-flex {
    flex-direction: column;
  }
  
  .nav-button {
    min-width: 100% !important;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .markers-grid {
    grid-template-columns: 1fr;
  }
  
  .category-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .health-markers-category-container {
    padding: 0.5rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .fab-button {
    bottom: 1rem !important;
    right: 1rem !important;
  }
}
</style>