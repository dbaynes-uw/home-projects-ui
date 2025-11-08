<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/views/OOBs/HealthMarkersByCategory.vue -->
<template>
  <div class="page-wrapper">
    <div class="health-markers-category-container">
      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h2>
            <i class="fas fa-layer-group"></i>
            Health Markers by Category
          </h2>
        </v-card-title>
        
        <!-- ✅ NAVIGATION BUTTONS -->
        <v-card-text>
          <div class="navigation-flex">
            <v-btn
              variant="outlined"
              :to="{ name: 'HealthMarkerCreate' }"
              prepend-icon="fas fa-plus"
              class="nav-button"
              color="success"
            >
              Add Health Marker
            </v-btn>

            <v-btn
              variant="outlined"
              :to="{ name: 'HealthMarkerList' }"
              prepend-icon="fas fa-list"
              class="nav-button"
            >
              View All Results
            </v-btn>

            <!-- ✅ ADD INDEX VIEW TOGGLE BUTTON -->
            <v-btn
              variant="outlined"
              @click="toggleIndexView"
              :prepend-icon="showIndexView ? 'fas fa-th' : 'fas fa-list'"
              class="nav-button"
              color="primary"
              :disabled="showChartView"
            >
              {{ showIndexView ? 'Category View' : 'Index View' }}
            </v-btn>

            <!-- ✅ ADD CHART VIEW TOGGLE BUTTON -->
            <v-btn
              variant="outlined"
              @click="toggleChartView"
              :prepend-icon="showChartView ? 'fas fa-th' : 'fas fa-chart-line'"
              class="nav-button"
              color="deep-purple"
            >
              {{ showChartView ? 'Category View' : 'Chart View' }}
            </v-btn>
          </div>
</v-card-text>
      </v-card>

      <!-- ✅ CATEGORY OVERVIEW STATS -->
      <v-card class="mt-4" v-if="categoryStats.length > 0">
        <v-card-title>
          <i class="fas fa-chart-pie"></i>
          Category Overview ({{ totalResults }} total results)
        </v-card-title>
        <v-card-text>
          <div class="stats-grid">
            <div 
              v-for="stat in categoryStats" 
              :key="stat.category"
              class="stat-card"
              :class="{ 'stat-card-active': selectedCategory === stat.category }"
              @click="toggleCategory(stat.category)"
            >
              <div class="stat-icon">
                <v-icon 
                  :icon="getCategoryIcon(stat.category)" 
                  :color="getCategoryColor(stat.category)"
                  size="large"
                />
              </div>
              <div class="stat-info">
                <h3>{{ stat.category }}</h3>
                <p class="stat-count">{{ stat.count }} results</p>
                <p class="stat-latest">Latest: {{ stat.latestDate }}</p>
                <p class="stat-range">{{ stat.dateRange }}</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ FILTERS SECTION -->
      <v-card class="mt-4">
        <v-card-text>
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
              <v-text-field
                v-model="searchText"
                clearable
                clear-icon="fas fa-times"
                @click:clear="clearSearch"
                @input="applyFilters"
                placeholder="Search health markers..."
                prepend-inner-icon="fas fa-search"
                class="search-field"
                density="compact"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
      <!-- ✅ UPDATE YOUR VIEW STATUS: -->
      <v-card class="mt-2" v-if="filteredHealthMarkers.length > 0">
        <v-card-text class="py-2">
          <div class="view-status">
            <div class="view-indicator">
              <v-icon 
                :icon="showChartView ? 'fas fa-chart-line' : showIndexView ? 'fas fa-table' : 'fas fa-layer-group'" 
                size="small" 
                class="mr-2"
              />
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
        </v-card-text>
      </v-card>
      <!-- ✅ NO RESULTS MESSAGE -->
      <div v-if="filteredHealthMarkers.length === 0" class="no-results-container">
        <v-card class="no-results-card">
          <v-card-text class="text-center">
            <v-icon icon="mdi-database-off" size="x-large" color="grey" class="mb-4" />
            <h3>No Health Markers Found</h3>
            <p>{{ getNoResultsMessage() }}</p>
            <v-btn 
              color="primary" 
              :to="{ name: 'HealthMarkerCreate' }"
              prepend-icon="mdi-plus"
              class="mt-3"
            >
              Add Your First Health Marker
            </v-btn>
          </v-card-text>
        </v-card>
      </div>

      <!-- ✅ CATEGORY SECTIONS -->
      <!-- ✅ INDEX VIEW -->
      <div v-if="showIndexView" class="index-view-container">
        <v-card class="mt-4">
          <v-card-title>
            <div class="index-header">
              <h3>
                <i class="fas fa-table"></i>
                Health Markers Index View
              </h3>
              <v-chip 
                color="primary" 
                prepend-icon="mdi-format-list-numbered"
                size="small"
              >
                {{ filteredHealthMarkers.length }} results
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text class="pa-0">
            <HealthMarkerIndex 
              :healthMarkers="filteredHealthMarkers"
              class="category-index-table"
            />
          </v-card-text>
        </v-card>
      </div>
      <!-- ✅ ADD THIS CHART VIEW AFTER INDEX VIEW: -->
          
      <!-- ✅ CHART VIEW -->
      <!-- ✅ REPLACE YOUR ENTIRE CHART VIEW SECTION WITH THIS: -->

      <!-- ✅ SIMPLE CHART VIEW -->
      <div v-if="showChartView" class="simple-chart-view-container">
        <v-card class="mt-4">
          <v-card-title>
            <div class="chart-header">
              <h3>
                <i class="fas fa-chart-line"></i>
                Health Marker Trends by Category
              </h3>
              <v-chip 
                color="deep-purple" 
                prepend-icon="mdi-chart-timeline-variant"
                size="small"
              >
                {{ getCategoriesWithData.length }} categories
              </v-chip>
            </div>
          </v-card-title>
        </v-card>
      
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
        <v-card class="mt-4 simple-chart-summary">
          <v-card-title>
            <i class="fas fa-chart-pie mr-2"></i>
            Chart Summary
          </v-card-title>
          <v-card-text>
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
          </v-card-text>
        </v-card>
      </div>

      <!-- ✅ CATEGORY VIEW (EXISTING) -->
      <div v-else class="category-sections">
        <div 
          v-for="category in displayedCategories" 
          :key="category"
          :id="`category-${category.toLowerCase().replace(/\s+/g, '-')}`"
          class="category-section"
        >
          <v-card class="category-card">
            <v-card-title class="category-header">
              <div class="category-title">
                <v-icon 
                  :icon="getCategoryIcon(category)" 
                  :color="getCategoryColor(category)"
                  size="large"
                  class="mr-3"
                />
                <h2>{{ category }}</h2>
                <v-chip 
                  :color="getCategoryColor(category)" 
                  size="small"
                  class="ml-3"
                >
                  {{ getCategoryMarkers(category).length }} results
                </v-chip>
              </div>

              <v-btn
                variant="outlined"
                size="small"
                @click="toggleCategoryExpansion(category)"
                :prepend-icon="isCategoryExpanded(category) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              >
                {{ isCategoryExpanded(category) ? 'Collapse' : 'Expand' }}
              </v-btn>
            </v-card-title>
          
            <!-- ✅ CATEGORY DESCRIPTION -->
            <v-card-text v-if="isCategoryExpanded(category)">
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
            </v-card-text>
          </v-card>
        </div>
      </div>

      <!-- ✅ FLOATING ACTION BUTTON -->
      <v-btn
        fab
        fixed
        bottom
        right
        color="success"
        size="large"
        :to="{ name: 'HealthMarkerCreate' }"
        class="fab-button"
        :class="{ 'fab-hidden': showIndexView }"
        elevation="8"
      >
        <v-icon size="large">mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
// ✅ UPDATE YOUR IMPORTS:
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  HEALTH_MARKER_CATEGORIES, 
  getHealthMarkersByCategory, 
  getHealthMarkerByName 
} from '@/services/health-marker-constants';
import HealthMarkerCard from '@/components/healthMarkers/HealthMarkerCard.vue';
import HealthMarkerIndex from '@/components/healthMarkers/HealthMarkerIndex.vue';
import DateFormatService from '@/services/DateFormatService';
import HealthMarkerCategoryChart from '@/components/healthMarkers/HealthMarkerCategoryChart.vue';

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

const getCategoryChartData = (category) => {
  const markers = filteredHealthMarkers.value.filter(marker => 
    getMarkerCategory(marker.marker_name) === category
  );
  
  if (markers.length === 0) return null;
  
  // Group by marker type and sort by date
  const markerGroups = {};
  
  markers.forEach(marker => {
    if (!markerGroups[marker.marker_name]) {
      markerGroups[marker.marker_name] = [];
    }
    
    markerGroups[marker.marker_name].push({
      x: marker.marker_date,
      y: parseFloat(marker.marker_result),
      label: `${marker.marker_result} on ${DateFormatService.formatDatejs(marker.marker_date)}`
    });
  });
  
  // Sort each group by date
  Object.keys(markerGroups).forEach(markerName => {
    markerGroups[markerName].sort((a, b) => new Date(a.x) - new Date(b.x));
  });
  
  // Create chart datasets
  const datasets = Object.keys(markerGroups).map((markerName, index) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    return {
      label: getHealthMarkerByName(markerName)?.label || markerName,
      data: markerGroups[markerName],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      fill: false,
      tension: 0.1,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBorderWidth: 2,
      pointBackgroundColor: '#fff'
    };
  });
  
  return {
    datasets,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `${category} Trends Over Time`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            title: function(context) {
              return DateFormatService.formatDatejs(context[0].parsed.x);
            },
            label: function(context) {
              const markerInfo = getHealthMarkerByName(context.dataset.label);
              const unit = markerInfo?.unit || '';
              return `${context.dataset.label}: ${context.parsed.y}${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM yyyy'
            }
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Result Value'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  };
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

const getCategoryIcon = (category) => {
  const iconMap = {
    'Diabetes': 'mdi-water-percent',
    'Thyroid': 'mdi-thyroid',
    'Lipids': 'mdi-heart-pulse',
    'Vitamins': 'mdi-pill',
    'Heart': 'mdi-heart',
    'Liver': 'mdi-liver',
    'Kidney': 'mdi-kidney',
    'General': 'mdi-account-check',
    'Other': 'mdi-test-tube'
  };
  return iconMap[category] || 'mdi-test-tube';
};

const getCategoryColor = (category) => {
  const colorMap = {
    'Diabetes': 'error',
    'Thyroid': 'warning',
    'Lipids': 'info',
    'Vitamins': 'success',
    'Heart': 'deep-purple',
    'Liver': 'brown',
    'Kidney': 'teal',
    'General': 'blue-grey',
    'Other': 'grey'
  };
  return colorMap[category] || 'grey';
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