<template>
  <div class="table-container">
    <!-- ✅ TABLE HEADER -->
    <div class="table-header">
      <h3>
        <i class="fas fa-table header-icon"></i>
        Health Markers Index
      </h3>
      
      <div class="table-controls">
        <div class="table-count">
          <i class="fas fa-list-ol"></i>
          {{ healthMarkers.length }} result{{ healthMarkers.length === 1 ? '' : 's' }}
        </div>
        
        <button class="export-btn" @click="exportToCsv">
          <i class="fas fa-download"></i>
          Export CSV
        </button>
      </div>
    </div>

    <!-- ✅ TABLE WRAPPER -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('marker_name')" class="sortable">
              Health Marker
              <i v-if="sortKey === 'marker_name'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('marker_result')" class="sortable center">
              Result
              <i v-if="sortKey === 'marker_result'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th class="center">Status</th>
            <th @click="sortBy('marker_date')" class="sortable center">
              Test Date
              <i v-if="sortKey === 'marker_date'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('lab_name')" class="sortable center">
              Lab
              <i v-if="sortKey === 'lab_name'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th>Notes</th>
            <th @click="sortBy('created_by')" class="sortable center">
              Created By
              <i v-if="sortKey === 'created_by'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th class="center">Actions</th>
          </tr>
        </thead>
        <tbody v-if="sortedMarkers.length > 0">
          <tr 
            v-for="marker in sortedMarkers" 
            :key="marker.id"
            @click="editHealthMarker(marker)"
          >
            <!-- Marker Name -->
            <td>
              <div class="marker-cell">
                <i :class="getMarkerIconClass(marker.marker_name)" class="marker-icon" :style="{ color: getMarkerColor(marker.marker_name) }"></i>
                <div class="marker-info">
                  <div class="marker-label">{{ getMarkerLabel(marker.marker_name) }}</div>
                  <span class="marker-category" :class="getCategoryClass(marker.marker_name)">
                    {{ getMarkerCategory(marker.marker_name) }}
                  </span>
                </div>
              </div>
            </td>
            
            <!-- Result -->
            <td class="center">
              <div class="result-cell">
                <span class="result-value">{{ marker.marker_result }}</span>
                <span class="result-unit">{{ getMarkerUnit(marker.marker_name) }}</span>
              </div>
            </td>
            
            <!-- Status -->
            <td class="center">
              <span class="status-badge" :class="getStatusClass(marker.marker_name, marker.marker_result)">
                <i :class="getStatusIconClass(marker.marker_name, marker.marker_result)"></i>
                {{ getStatusText(marker.marker_name, marker.marker_result) }}
              </span>
            </td>
            
            <!-- Test Date -->
            <td class="center">
              <div class="date-cell">
                <div class="date-value">{{ formatDate(marker.marker_date) }}</div>
                <div class="days-ago">{{ getDaysAgo(marker.marker_date) }}</div>
              </div>
            </td>
            
            <!-- Lab Name -->
            <td class="center">{{ marker.lab_name || '—' }}</td>
            
            <!-- Notes -->
            <td>
              <div class="notes-cell">
                <span v-if="marker.notes" class="notes-preview" :title="marker.notes">
                  <i class="fas fa-sticky-note"></i>
                  {{ truncateNotes(marker.notes) }}
                </span>
                <span v-else class="no-notes">—</span>
              </div>
            </td>
            
            <!-- Created By -->
            <td class="center">
              <span class="user-badge">
                <i class="fas fa-user"></i>
                {{ marker.created_by || 'Unknown' }}
              </span>
            </td>
            
            <!-- Actions -->
            <td>
              <div class="actions-cell">
                <button 
                  class="table-action-btn edit" 
                  @click.stop="editHealthMarker(marker)"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="table-action-btn duplicate" 
                  @click.stop="duplicateHealthMarker(marker)"
                  title="Duplicate"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="sortedMarkers.length === 0" class="table-empty">
        <i class="fas fa-database"></i>
        <h3>No Health Markers Found</h3>
        <p>Try adjusting your filters or add your first health marker.</p>
        <button class="table-empty-btn" @click="$router.push({ name: 'HealthMarkerCreate' })">
          <i class="fas fa-plus"></i>
          Add Health Marker
        </button>
      </div>
    </div>

    <!-- ✅ TABLE FOOTER -->
    <div class="table-footer">
      <div class="footer-info">
        <i class="fas fa-info-circle"></i>
        <span>Click any row to edit • Use column headers to sort</span>
      </div>
      
      <div class="pagination-info">
        Showing {{ sortedMarkers.length }} of {{ healthMarkers.length }} results
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getHealthMarkerByName, 
  getResultStatus 
} from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

const props = defineProps({
  healthMarkers: {
    type: Array,
    required: true,
    default: () => []
  }
});

const router = useRouter();

// ✅ SORTING STATE
const sortKey = ref('marker_date');
const sortAsc = ref(false);

const sortedMarkers = computed(() => {
  const sorted = [...props.healthMarkers];
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];
    
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    
    if (aVal < bVal) return sortAsc.value ? -1 : 1;
    if (aVal > bVal) return sortAsc.value ? 1 : -1;
    return 0;
  });
  return sorted;
});

const sortIcon = computed(() => {
  return sortAsc.value ? 'fas fa-sort-up' : 'fas fa-sort-down';
});

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = false;
  }
}

// ✅ HELPER METHODS
const getMarkerIconClass = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  // Convert MDI icons to Font Awesome
  const iconMap = {
    'mdi-water': 'fas fa-tint',
    'mdi-heart-pulse': 'fas fa-heartbeat',
    'mdi-pill': 'fas fa-pills',
    'mdi-molecule': 'fas fa-atom',
    'mdi-test-tube': 'fas fa-vial',
    'mdi-needle': 'fas fa-syringe',
    'mdi-shield-check': 'fas fa-shield-alt'
  };
  return iconMap[marker?.icon] || 'fas fa-heartbeat';
};

const getMarkerLabel = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.label || markerName;
};

const getMarkerCategory = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.category || 'Other';
};

const getCategoryClass = (markerName) => {
  const category = getMarkerCategory(markerName).toLowerCase();
  return `category-${category}`;
};

const getMarkerUnit = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.unit || '';
};

const getMarkerColor = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  if (!marker) return '#667eea';
  
  const colorMap = {
    'Diabetes': '#dc2626',
    'Thyroid': '#ca8a04',
    'Lipids': '#2563eb',
    'Vitamins': '#16a34a',
    'Heart': '#7c3aed',
    'General': '#4b5563'
  };
  return colorMap[marker.category] || '#667eea';
};

const getStatusClass = (markerName, testResult) => {
  const status = getResultStatus(markerName, testResult);
  if (!status) return 'status-info';
  
  return `status-${status.type}`;
};

const getStatusIconClass = (markerName, testResult) => {
  const status = getResultStatus(markerName, testResult);
  if (!status) return 'fas fa-info-circle';
  
  const iconMap = {
    'success': 'fas fa-check-circle',
    'warning': 'fas fa-exclamation-circle',
    'error': 'fas fa-times-circle',
    'info': 'fas fa-info-circle'
  };
  return iconMap[status.type] || 'fas fa-info-circle';
};

const getStatusText = (markerName, testResult) => {
  const status = getResultStatus(markerName, testResult);
  return status?.title || 'Unknown';
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  return DateFormatService.formatDatejs(dateString);
};

const getDaysAgo = (dateString) => {
  if (!dateString) return '';
  
  const testDate = new Date(dateString);
  const today = new Date();
  const diffTime = today - testDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  
  const years = Math.floor(diffDays / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};

const truncateNotes = (notes) => {
  if (!notes) return '';
  return notes.length > 40 ? notes.substring(0, 40) + '...' : notes;
};

// ✅ ACTION METHODS
const editHealthMarker = (marker) => {
  if (marker?.id) {
    router.push({ name: 'HealthMarkerEdit', params: { id: marker.id } });
  }
};

const duplicateHealthMarker = (marker) => {
  router.push({ 
    name: 'HealthMarkerCreate', 
    query: { 
      duplicate: marker.id,
      marker: marker.marker_name,
      result: marker.marker_result,
      notes: marker.notes 
    } 
  });
};

const exportToCsv = () => {
  const csvHeaders = [
    'Health Marker',
    'Category', 
    'Result',
    'Unit',
    'Status',
    'Test Date',
    'Lab',
    'Days Ago',
    'Notes',
    'Created By'
  ];
  
  const csvData = props.healthMarkers.map(item => [
    getMarkerLabel(item.marker_name),
    getMarkerCategory(item.marker_name),
    item.marker_result,
    getMarkerUnit(item.marker_name),
    getStatusText(item.marker_name, item.marker_result),
    formatDate(item.marker_date),
    item.lab_name || '',
    getDaysAgo(item.marker_date),
    item.notes || '',
    item.created_by || ''
  ]);
  
  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `health-markers-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ✅ All shared table styles now come from table-components.css */
/* Only component-specific overrides if needed */
</style>