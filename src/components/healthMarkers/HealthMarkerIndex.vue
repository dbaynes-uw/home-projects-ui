<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/healthMarkers/HealthMarkerIndex.vue -->
<template>
  <div class="health-marker-index">
    <!-- ✅ INDEX HEADER -->
    <div class="index-header">
      <h3 class="index-title">
        <v-icon icon="mdi-table" class="mr-2" />
        Health Markers Index View
      </h3>
      
      <div class="index-controls">
        <v-chip 
          size="small" 
          color="primary" 
          prepend-icon="mdi-format-list-numbered"
        >
          {{ healthMarkers.length }} results
        </v-chip>
        
        <v-btn
          size="small"
          variant="outlined"
          @click="exportToCsv"
          prepend-icon="mdi-download"
          class="ml-2"
        >
          Export CSV
        </v-btn>
      </div>
    </div>

    <!-- ✅ DATA TABLE -->
    <v-data-table
      :headers="headers"
      :items="tableItems"
      :items-per-page="itemsPerPage"
      :sort-by="[{ key: 'marker_date', order: 'desc' }]"
      class="health-marker-table"
      density="comfortable"
      hover
      @click:row="editHealthMarker"
    >
      <!-- ✅ MARKER NAME COLUMN -->
      <template v-slot:item.marker_name="{ item }">
        <div class="marker-cell">
          <v-icon 
            :icon="getMarkerIcon(item.marker_name)" 
            size="small" 
            :color="getMarkerColor(item.marker_name)"
            class="mr-2"
          />
          <div class="marker-info">
            <div class="marker-label">{{ getMarkerLabel(item.marker_name) }}</div>
            <v-chip 
              size="x-small" 
              :color="getCategoryColor(item.marker_name)"
              class="category-mini-chip"
            >
              {{ getMarkerCategory(item.marker_name) }}
            </v-chip>
          </div>
        </div>
      </template>

      <!-- ✅ TEST RESULT COLUMN -->
      <template v-slot:item.marker_result="{ item }">
        <div class="result-cell">
          <span class="result-value">{{ item.marker_result }}</span>
          <span class="result-unit">{{ getMarkerUnit(item.marker_name) }}</span>
        </div>
      </template>

      <!-- ✅ STATUS COLUMN -->
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.marker_name, item.marker_result)"
          size="small"
          :prepend-icon="getStatusIcon(item.marker_name, item.marker_result)"
          class="status-chip"
        >
          {{ getStatusText(item.marker_name, item.marker_result) }}
        </v-chip>
      </template>

      <!-- ✅ TEST DATE COLUMN -->
      <template v-slot:item.marker_date="{ item }">
        <div class="date-cell">
          <div class="date-value">{{ formatDate(item.marker_date) }}</div>
          <div class="days-ago">{{ getDaysAgo(item.marker_date) }}</div>
        </div>
      </template>
      <!-- ✅ LAB NAME COLUMN -->
      <template v-slot:item.labName="{ item }">
        <div class="item-cell">
          <div class="text-value">{{ getLabName(item.lab_name) }}</div>
        </div>
      </template>
      <!-- ✅ NOTES COLUMN -->
      <template v-slot:item.notes="{ item }">
        <div class="notes-cell">
          <span 
            v-if="item.notes" 
            class="notes-preview"
            :title="item.notes"
          >
            <v-icon icon="mdi-note-text" size="small" class="mr-1" />
            {{ truncateNotes(item.notes) }}
          </span>
          <span v-else class="no-notes">—</span>
        </div>
      </template>

      <!-- ✅ CREATED BY COLUMN -->
      <template v-slot:item.created_by="{ item }">
        <v-chip 
          size="small" 
          variant="outlined"
          prepend-icon="mdi-account"
        >
          {{ item.created_by || 'Unknown' }}
        </v-chip>
      </template>

      <!-- ✅ ACTIONS COLUMN -->
      <template v-slot:item.actions="{ item }">
        <div class="actions-cell">
          <v-btn
            icon
            size="small"
            variant="text"
            @click.stop="editHealthMarker(null, item)"
            title="Edit Health Marker"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          
          <v-btn
            icon
            size="small"
            variant="text"
            @click.stop="duplicateHealthMarker(item)"
            title="Duplicate Health Marker"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </div>
      </template>

      <!-- ✅ NO DATA SLOT -->
      <template v-slot:no-data>
        <div class="no-data">
          <v-icon icon="mdi-database-off" size="x-large" color="grey" class="mb-4" />
          <h3>No Health Markers Found</h3>
          <p>Try adjusting your filters or add your first health marker.</p>
          <v-btn 
            color="primary" 
            :to="{ name: 'HealthMarkerCreate' }"
            prepend-icon="mdi-plus"
            class="mt-3"
          >
            Add Health Marker
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- ✅ TABLE FOOTER INFO -->
    <div class="table-footer">
      <div class="footer-info">
        <v-icon icon="mdi-information" size="small" class="mr-1" />
        <span>Click any row to edit • Use filters above to narrow results</span>
      </div>
      
      <div class="pagination-info">
        <span>Showing {{ Math.min(itemsPerPage, healthMarkers.length) }} of {{ healthMarkers.length }} results</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  getHealthMarkerByName, 
  getResultStatus, 
  HEALTH_MARKER_CATEGORIES 
} from '@/services/health-marker-constants';
import DateFormatService from '@/services/DateFormatService';

// ✅ PROPS
const props = defineProps({
  healthMarkers: {
    type: Array,
    required: true,
    default: () => []
  }
});

// ✅ ROUTER
const router = useRouter();

// ✅ REACTIVE STATE
const itemsPerPage = ref(25);

// ✅ TABLE HEADERS
const headers = computed(() => [
  {
    title: 'Health Marker',
    key: 'marker_name',
    align: 'start',
    sortable: true,
    width: '200px'
  },
  {
    title: 'Result',
    key: 'marker_result',
    align: 'center',
    sortable: true,
    width: '120px'
  },
  {
    title: 'Status',
    key: 'status',
    align: 'center',
    sortable: false,
    width: '130px'
  },
  {
    title: 'Test Date',
    key: 'marker_date',
    align: 'center',
    sortable: true,
    width: '150px'
  },
  {
    title: 'Doctor',
    key: 'lab_name',
    align: 'center',
    sortable: true,
    width: '150px'
  },
  {
    title: 'Notes',
    key: 'notes',
    align: 'start',
    sortable: false,
    width: '200px'
  },
  {
    title: 'Created By',
    key: 'created_by',
    align: 'center',
    sortable: true,
    width: '120px'
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    sortable: false,
    width: '100px'
  }
]);

// ✅ TABLE ITEMS
const tableItems = computed(() => {
  return props.healthMarkers.map(item => ({
    ...item,
    // Add computed status for sorting if needed
    status: getStatusText(item.marker_name, item.marker_result)
  }));
});

// ✅ HELPER METHODS
const getMarkerIcon = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.icon || 'mdi-heart-pulse';
};

const getMarkerLabel = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.label || markerName;
};

const getMarkerCategory = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.category || 'Other';
};
const getLabName = (labName) => {
  const marker = getHealthMarkerByName(labName);
  return marker?.lab_name || '';
};
const getDoctorName = (doctorName) => {
  const marker = getHealthMarkerByName(doctorName);
  return marker?.doctor_name || '';
};
const getMarkerUnit = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  return marker?.unit || '';
};

const getMarkerColor = (markerName) => {
  const marker = getHealthMarkerByName(markerName);
  if (!marker) return 'primary';
  
  switch (marker.category) {
    case 'Diabetes': return 'error';
    case 'Thyroid': return 'warning';
    case 'Lipids': return 'info';
    case 'Vitamins': return 'success';
    case 'Heart': return 'deep-purple';
    case 'General': return 'blue-grey';
    default: return 'primary';
  }
};

const getCategoryColor = (markerName) => {
  return getMarkerColor(markerName);
};

const getStatusColor = (markerName, testResult) => {
  const status = getResultStatus(markerName, testResult);
  if (!status) return 'default';
  
  switch (status.type) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case 'info':
    default: return 'info';
  }
};

const getStatusIcon = (markerName, testResult) => {
  const status = getResultStatus(markerName, testResult);
  if (!status) return 'mdi-information-circle';
  
  switch (status.type) {
    case 'success': return 'mdi-check-circle';
    case 'warning': return 'mdi-alert-circle';
    case 'error': return 'mdi-close-circle';
    case 'info':
    default: return 'mdi-information-circle';
  }
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
  return notes.length > 50 ? notes.substring(0, 50) + '...' : notes;
};

// ✅ ACTION METHODS
const editHealthMarker = (event, item) => {
  const healthMarker = item || event;
  if (healthMarker?.id) {
    router.push({ name: 'HealthMarkerEdit', params: { id: healthMarker.id } });
  }
};

const duplicateHealthMarker = (item) => {
  // Navigate to create with pre-filled data
  router.push({ 
    name: 'HealthMarkerCreate', 
    query: { 
      duplicate: item.id,
      marker: item.marker_name,
      result: item.marker_result,
      notes: item.notes 
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
    'Doctor',
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
    getLabName(item.lab_name),
    getDoctorName(item.doctor_name),
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
/* ✅ INDEX CONTAINER */
.health-marker-index {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ✅ HEADER STYLES */
.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.index-title {
  display: flex;
  align-items: center;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.index-controls {
  display: flex;
  align-items: center;
}

/* ✅ TABLE STYLES */
.health-marker-table {
  background: white !important;
}

/* ✅ CELL STYLES */
.marker-cell {
  display: flex;
  align-items: center;
}

.marker-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.marker-label {
  font-weight: 500;
  color: #2c3e50;
}

.category-mini-chip {
  align-self: flex-start;
}

.result-cell {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.result-value {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.result-unit {
  font-size: 0.8rem;
  color: #666;
}

.status-chip {
  min-width: 100px;
}
.item-cell {
  text-align: center;
}
.item-value {
  font-weight: 500;
  color: #2c3e50;
}
.date-cell {
  text-align: center;
}

.date-value {
  font-weight: 500;
  color: #2c3e50;
}

.days-ago {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

.notes-cell {
  max-width: 200px;
}

.notes-preview {
  display: flex;
  align-items: center;
  color: #666;
  font-style: italic;
  cursor: help;
}

.no-notes {
  color: #ccc;
  text-align: center;
}

.actions-cell {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

/* ✅ NO DATA STYLES */
.no-data {
  text-align: center;
  padding: 3rem;
  color: #666;
}

/* ✅ FOOTER STYLES */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  font-size: 0.875rem;
  color: #666;
}

.footer-info {
  display: flex;
  align-items: center;
}

/* ✅ HOVER EFFECTS */
.health-marker-table :deep(.v-data-table__tbody tr:hover) {
  background-color: rgba(65, 184, 131, 0.05) !important;
  cursor: pointer;
}

/* ✅ RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .index-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .index-controls {
    justify-content: space-between;
  }
  
  .table-footer {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  /* Hide some columns on mobile */
  .health-marker-table :deep(.v-data-table__thead th:nth-child(5)),
  .health-marker-table :deep(.v-data-table__tbody td:nth-child(5)),
  .health-marker-table :deep(.v-data-table__thead th:nth-child(6)),
  .health-marker-table :deep(.v-data-table__tbody td:nth-child(6)) {
    display: none;
  }
}

@media (max-width: 480px) {
  /* Hide more columns on very small screens */
  .health-marker-table :deep(.v-data-table__thead th:nth-child(3)),
  .health-marker-table :deep(.v-data-table__tbody td:nth-child(3)) {
    display: none;
  }
}
</style>