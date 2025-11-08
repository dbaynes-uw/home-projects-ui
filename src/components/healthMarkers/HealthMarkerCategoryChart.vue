<!-- ✅ REPLACE THE ENTIRE HealthMarkerCategoryChart.vue WITH THIS FIXED VERSION: -->
<template>
  <div class="category-chart-container">
    <div class="chart-header">
      <h4>
        <v-icon 
          :icon="getCategoryIcon(category)" 
          :color="getCategoryColor(category)"
          size="small"
          class="mr-2"
        />
        {{ category }} Trends
      </h4>
      <div class="chart-stats">
        <span class="stat">{{ chartData.length }} data points</span>
        <span class="stat">{{ uniqueMarkers.length }} markers</span>
      </div>
    </div>

    <!-- ✅ SINGLE DATA POINT SPECIAL CASE -->
    <div v-if="chartData.length === 1" class="single-point-display">
      <div class="single-point-card">
        <v-icon 
          :icon="getCategoryIcon(category)" 
          :color="getCategoryColor(category)"
          size="large"
          class="mb-2"
        />
        <h5>{{ getHealthMarkerByName(chartData[0].markerName)?.label || chartData[0].markerName }}</h5>
        <div class="single-value">
          {{ chartData[0].value }} {{ getHealthMarkerByName(chartData[0].markerName)?.unit || '' }}
        </div>
        <div class="single-date">{{ chartData[0].formattedDate }}</div>
        <p class="single-note">Only one data point available - add more measurements to see trends</p>
      </div>
    </div>

    <!-- ✅ MULTIPLE DATA POINTS - SHOW CHART -->
    <div class="chart-area" v-else-if="chartData.length > 1">
      <svg 
        :width="chartWidth" 
        :height="chartHeight" 
        class="trend-chart"
        @mousemove="onMouseMove"
        @mouseleave="hideTooltip"
      >
        <!-- ✅ GRID LINES -->
        <g class="grid-lines">
          <!-- Horizontal grid lines -->
          <line 
            v-for="(line, index) in gridLines.horizontal"
            :key="`h-${index}`"
            :x1="padding.left"
            :y1="line.y"
            :x2="chartWidth - padding.right"
            :y2="line.y"
            stroke="#e0e0e0"
            stroke-width="1"
          />
          
          <!-- Vertical grid lines -->
          <line 
            v-for="(line, index) in gridLines.vertical"
            :key="`v-${index}`"
            :x1="line.x"
            :y1="padding.top"
            :x2="line.x"
            :y2="chartHeight - padding.bottom"
            stroke="#e0e0e0"
            stroke-width="1"
          />
        </g>

        <!-- ✅ TREND LINES FOR EACH MARKER TYPE -->
        <g v-for="(markerGroup, markerName) in groupedData" :key="markerName">
          <!-- ✅ ONLY SHOW POLYLINE IF MORE THAN ONE POINT -->
          <polyline
            v-if="markerGroup.length > 1"
            :points="getPolylinePoints(markerGroup)"
            :stroke="getMarkerColor(markerName)"
            :stroke-width="3"
            fill="none"
            class="trend-line"
          />
          
          <!-- ✅ DATA POINTS -->
          <circle
            v-for="(point, index) in markerGroup"
            :key="`${markerName}-${index}`"
            :cx="point.x"
            :cy="point.y"
            :r="markerGroup.length === 1 ? 8 : 4"
            :fill="getMarkerColor(markerName)"
            :stroke="'white'"
            :stroke-width="2"
            class="data-point"
            @mouseenter="showTooltip($event, point)"
            @mouseleave="hideTooltip"
          />
        </g>

        <!-- ✅ AXIS LABELS -->
        <g class="axis-labels">
          <!-- Y-axis labels -->
          <text 
            v-for="(label, index) in yAxisLabels"
            :key="`y-${index}`"
            :x="padding.left - 10"
            :y="label.y + 5"
            text-anchor="end"
            class="axis-label"
          >
            {{ label.value }}
          </text>
          
          <!-- X-axis labels -->
          <text 
            v-for="(label, index) in xAxisLabels"
            :key="`x-${index}`"
            :x="label.x"
            :y="chartHeight - padding.bottom + 20"
            text-anchor="middle"
            class="axis-label"
          >
            {{ label.value }}
          </text>
        </g>
      </svg>

      <!-- ✅ LEGEND -->
      <div class="chart-legend">
        <div 
          v-for="(markerName, index) in Object.keys(groupedData)"
          :key="markerName"
          class="legend-item"
        >
          <div 
            class="legend-color" 
            :style="{ backgroundColor: getMarkerColor(markerName) }"
          ></div>
          <span class="legend-label">
            {{ getHealthMarkerByName(markerName)?.label || markerName }}
          </span>
          <span class="legend-count">
            ({{ groupedData[markerName].length }})
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ NO DATA CASE -->
    <div v-else class="no-chart-data">
      <v-icon icon="mdi-chart-line" size="large" color="grey" class="mb-2" />
      <p>No trend data available for {{ category }}</p>
    </div>

    <!-- ✅ TOOLTIP -->
    <div 
      v-if="tooltip.show" 
      class="chart-tooltip"
      :style="{ 
        left: tooltip.x + 'px', 
        top: tooltip.y + 'px' 
      }"
    >
      <div class="tooltip-header">{{ tooltip.markerName }}</div>
      <div class="tooltip-value">{{ tooltip.value }} {{ tooltip.unit }}</div>
      <div class="tooltip-date">{{ tooltip.date }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getHealthMarkerByName } from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

// ✅ PROPS
const props = defineProps({
  category: {
    type: String,
    required: true
  },
  healthMarkers: {
    type: Array,
    required: true
  }
});

// ✅ REACTIVE STATE
const chartWidth = ref(800);
const chartHeight = ref(300);
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  markerName: '',
  value: '',
  unit: '',
  date: ''
});

const padding = {
  top: 20,
  right: 20,
  bottom: 50,
  left: 60
};

// ✅ COMPUTED PROPERTIES
const chartData = computed(() => {
  return props.healthMarkers
    .filter(marker => marker.marker_result && marker.marker_date)
    .map(marker => ({
      markerName: marker.marker_name,
      value: parseFloat(marker.marker_result),
      date: new Date(marker.marker_date),
      dateString: marker.marker_date,
      formattedDate: DateFormatService.formatDatejs(marker.marker_date)
    }))
    .sort((a, b) => a.date - b.date);
});

const uniqueMarkers = computed(() => {
  return [...new Set(chartData.value.map(d => d.markerName))];
});

const minDate = computed(() => {
  if (chartData.value.length === 0) return new Date();
  if (chartData.value.length === 1) return chartData.value[0].date;
  return new Date(Math.min(...chartData.value.map(d => d.date)));
});

const maxDate = computed(() => {
  if (chartData.value.length === 0) return new Date();
  if (chartData.value.length === 1) {
    // ✅ FOR SINGLE POINT, ADD ONE DAY TO AVOID DIVISION BY ZERO
    const singleDate = chartData.value[0].date;
    const nextDay = new Date(singleDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }
  return new Date(Math.max(...chartData.value.map(d => d.date)));
});

const minValue = computed(() => {
  if (chartData.value.length === 0) return 0;
  const min = Math.min(...chartData.value.map(d => d.value));
  
  // ✅ FOR SINGLE POINT, PROVIDE SOME RANGE
  if (chartData.value.length === 1) {
    return min - Math.max(min * 0.1, 1);
  }
  
  return min - (min * 0.1); // Add 10% padding
});

const maxValue = computed(() => {
  if (chartData.value.length === 0) return 100;
  const max = Math.max(...chartData.value.map(d => d.value));
  
  // ✅ FOR SINGLE POINT, PROVIDE SOME RANGE
  if (chartData.value.length === 1) {
    return max + Math.max(max * 0.1, 1);
  }
  
  return max + (max * 0.1); // Add 10% padding
});

const groupedData = computed(() => {
  if (chartData.value.length <= 1) return {};
  
  const groups = {};
  
  chartData.value.forEach(data => {
    if (!groups[data.markerName]) {
      groups[data.markerName] = [];
    }
    groups[data.markerName].push(data);
  });
  
  // ✅ SAFE DIVISION - CHECK FOR ZERO RANGE
  const dateRange = maxDate.value - minDate.value;
  const valueRange = maxValue.value - minValue.value;
  
  if (dateRange === 0 || valueRange === 0) {
    console.warn('⚠️ Zero range detected, cannot create chart coordinates');
    return {};
  }
  
  // Convert to chart coordinates
  Object.keys(groups).forEach(markerName => {
    groups[markerName] = groups[markerName].map((data, index, array) => {
      const xPos = padding.left + 
        ((data.date - minDate.value) / dateRange) * 
        (chartWidth.value - padding.left - padding.right);
        
      const yPos = chartHeight.value - padding.bottom - 
        ((data.value - minValue.value) / valueRange) * 
        (chartHeight.value - padding.top - padding.bottom);
      
      return {
        ...data,
        x: isNaN(xPos) ? padding.left : xPos,
        y: isNaN(yPos) ? chartHeight.value / 2 : yPos
      };
    });
  });
  
  return groups;
});

const gridLines = computed(() => {
  if (chartData.value.length <= 1) return { horizontal: [], vertical: [] };
  
  const horizontal = [];
  const vertical = [];
  
  // Horizontal grid lines (5 lines)
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i * (chartHeight.value - padding.top - padding.bottom) / 4);
    horizontal.push({ y });
  }
  
  // Vertical grid lines (based on data points, max 6)
  const dataCount = Math.min(chartData.value.length, 6);
  for (let i = 0; i <= dataCount - 1; i++) {
    const x = padding.left + (i * (chartWidth.value - padding.left - padding.right) / Math.max(dataCount - 1, 1));
    vertical.push({ x });
  }
  
  return { horizontal, vertical };
});

const yAxisLabels = computed(() => {
  if (chartData.value.length <= 1) return [];
  
  const labels = [];
  for (let i = 0; i <= 4; i++) {
    const value = minValue.value + (i * (maxValue.value - minValue.value) / 4);
    const y = chartHeight.value - padding.bottom - (i * (chartHeight.value - padding.top - padding.bottom) / 4);
    labels.push({ 
      value: Math.round(value * 10) / 10, 
      y 
    });
  }
  return labels;
});

const xAxisLabels = computed(() => {
  if (chartData.value.length <= 1) return [];
  
  const labels = [];
  const dataPoints = chartData.value.slice(0, 6); // Limit to 6 labels
  
  dataPoints.forEach((data, index) => {
    const dateRange = maxDate.value - minDate.value;
    if (dateRange === 0) return;
    
    const x = padding.left + 
      ((data.date - minDate.value) / dateRange) * 
      (chartWidth.value - padding.left - padding.right);
      
    if (!isNaN(x)) {
      labels.push({
        value: DateFormatService.formatDatejs(data.dateString).split(' ')[0], // Just date part
        x
      });
    }
  });
  
  return labels;
});

// ✅ METHODS
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

const getMarkerColor = (markerName) => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];
  
  const index = uniqueMarkers.value.indexOf(markerName);
  return colors[index % colors.length];
};

const getPolylinePoints = (points) => {
  return points.filter(p => !isNaN(p.x) && !isNaN(p.y))
              .map(p => `${p.x},${p.y}`)
              .join(' ');
};

const showTooltip = (event, point) => {
  const markerInfo = getHealthMarkerByName(point.markerName);
  
  tooltip.value = {
    show: true,
    x: event.clientX + 10,
    y: event.clientY - 10,
    markerName: markerInfo?.label || point.markerName,
    value: point.value,
    unit: markerInfo?.unit || '',
    date: point.formattedDate
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};

const onMouseMove = (event) => {
  // Update tooltip position if showing
  if (tooltip.value.show) {
    tooltip.value.x = event.clientX + 10;
    tooltip.value.y = event.clientY - 10;
  }
};

// ✅ LIFECYCLE
onMounted(() => {
  // Adjust chart size based on container
  const container = document.querySelector('.category-chart-container');
  if (container) {
    chartWidth.value = Math.min(container.offsetWidth - 40, 800);
  }
});
</script>

<style scoped>
.category-chart-container {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.chart-header h4 {
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.chart-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  font-size: 0.875rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* ✅ SINGLE POINT DISPLAY STYLES */
.single-point-display {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.single-point-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  max-width: 300px;
}

.single-point-card h5 {
  margin: 0.5rem 0;
  color: #2c3e50;
  font-weight: 600;
}

.single-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
  margin: 1rem 0;
}

.single-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.single-note {
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
  margin: 0;
}

.chart-area {
  position: relative;
}

.trend-chart {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
}

.trend-line {
  transition: stroke-width 0.2s ease;
}

.trend-line:hover {
  stroke-width: 4;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 8;
}

.axis-label {
  font-size: 12px;
  fill: #666;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-label {
  color: #2c3e50;
  font-weight: 500;
}

.legend-count {
  color: #666;
  font-size: 0.8rem;
}

.no-chart-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
  text-align: center;
}

.chart-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tooltip-header {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.tooltip-value {
  color: #ffd700;
  font-weight: 500;
}

.tooltip-date {
  color: #ccc;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    text-align: center;
  }
  
  .chart-stats {
    justify-content: center;
  }
  
  .chart-legend {
    flex-direction: column;
    align-items: center;
  }
  
  .single-point-card {
    max-width: 100%;
    padding: 1.5rem;
  }
  
  .single-value {
    font-size: 1.5rem;
  }
}
</style>