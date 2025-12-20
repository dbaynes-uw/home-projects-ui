<template>
  <div class="table-container">
    <div class="table-header">
      <h3>
        <i class="fas fa-table header-icon"></i>
        Sleep Entries Table
      </h3>
      
      <div class="table-controls">
        <div class="table-count">
          <i class="fas fa-list-ol"></i>
          {{ markers.length }} entr{{ markers.length === 1 ? 'y' : 'ies' }}
        </div>
        <button class="export-btn" @click="exportToCsv">
          <i class="fas fa-download"></i>
          Export CSV
        </button>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('sleep_date')" class="sortable">
              Date 
              <i v-if="sortKey === 'sleep_date'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('bed_time')" class="sortable">
              Bed Time
              <i v-if="sortKey === 'bed_time'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('wake_time')" class="sortable">
              Wake Time
              <i v-if="sortKey === 'wake_time'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('time_in_bed')" class="sortable">
              Time in Bed
              <i v-if="sortKey === 'time_in_bed'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('time_asleep')" class="sortable">
              Time Asleep
              <i v-if="sortKey === 'time_asleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('awakenings')" class="sortable center">
              Ups
              <i v-if="sortKey === 'awakenings'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('sleep_quality')" class="sortable center">
              Quality
              <i v-if="sortKey === 'sleep_quality'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('awake_sleep')" class="sortable">
              Awake Sleep
              <i v-if="sortKey === 'awake_sleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('rem_sleep')" class="sortable">
              REM Sleep
              <i v-if="sortKey === 'rem_sleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('core_sleep')" class="sortable">
              Core Sleep
              <i v-if="sortKey === 'core_sleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('deep_sleep')" class="sortable">
              Deep Sleep
              <i v-if="sortKey === 'deep_sleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('had_oob')" class="sortable center">
              OOBs
              <i v-if="sortKey === 'had_oob'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th class="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="marker in sortedMarkers" :key="marker.id" @click="$emit('edit', marker)">
            <td>
              <div class="date-cell">
                <div class="date-value">{{ formatDate(marker.sleep_date) }}</div>
              </div>
            </td>
            <td>{{ marker.bed_time }}</td>
            <td>{{ marker.wake_time }}</td>
            <td>{{ marker.time_in_bed }}</td>
            <td>{{ marker.time_asleep }}</td>
            <td class="center">{{ marker.awakenings }}</td>
            <td class="center">
              <span class="quality-badge" :class="getQualityClass(marker.sleep_quality)">
                {{ marker.sleep_quality }}/10
              </span>
            </td>
            <td>{{ marker.awake_sleep }}</td>
            <td>{{ marker.rem_sleep }}</td>
            <td>{{ marker.core_sleep }}</td>
            <td>{{ marker.deep_sleep }}</td>
            <td class="center">{{ marker.had_oob ? 'Yes' : 'No' }}</td>
            <td>
              <div class="actions-cell">
                <button 
                  class="table-action-btn edit" 
                  @click.stop="$emit('edit', marker)"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="table-action-btn delete" 
                  @click.stop="$emit('delete', marker)"
                  title="Delete"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="footer-info">
        <i class="fas fa-info-circle"></i>
        <span>Click any row to edit • Click column headers to sort</span>
      </div>
      
      <div class="pagination-info">
        Showing {{ sortedMarkers.length }} of {{ markers.length }} results
      </div>
    </div>
  </div>
</template>

<!-- filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/sleepMarkers/SleepMarkerTable.vue -->

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  markers: {  // ✅ The prop is called 'markers'
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const sortKey = ref('sleep_date');
const sortAsc = ref(false);

const sortedMarkers = computed(() => {
  const sorted = [...props.markers];
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];
    
    // Handle null/undefined
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    
    // Compare values
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
    sortAsc.value = false; // Default to descending
  }
}

function formatDate(date) {
  return dayjs(date).format('MMM DD, YYYY');
}

function formatTime(time) {
  if (!time) return '—';
  return dayjs(time, 'HH:mm').format('h:mm A');
}


function truncateNotes(notes) {
  if (!notes) return '';
  return notes.length > 40 ? notes.substring(0, 40) + '...' : notes;
}

function getQualityClass(quality) {
  const q = parseFloat(quality);
  if (q >= 8) return 'quality-good';
  if (q >= 6) return 'quality-medium';
  return 'quality-poor';
}

const exportToCsv = () => {
  const csvHeaders = [
    'Date',
    'Bed Time',
    'Wake Time',
    'Time in Bed',
    'Time Asleep',
    'Awakenings',
    'Quality',
    'Awake Sleep',
    'REM Sleep',
    'Core Sleep',
    'Deep Sleep',
    'Had OOB',
    'Notes'
  ];
  
  // ✅ FIXED: Changed props.sleepMarkers to props.markers
  const csvData = props.markers.map(item => [
    formatDate(item.sleep_date),
    formatTime(item.bed_time),
    formatTime(item.wake_time),
    item.time_in_bed || '',
    item.time_asleep || '',
    item.awakenings || 0,
    item.sleep_quality || '',
    item.awake_sleep || '',
    item.rem_sleep || '',
    item.core_sleep || '',
    item.deep_sleep || '',
    item.had_oob ? 'Yes' : 'No',
    truncateNotes(item.sleep_notes) || ''
  ]);
  
  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sleep-records-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* ✅ IMPORT ALL SHARED STYLES */
@import '@/assets/styles/ui-components.css';
@import '@/assets/styles/table-components.css';

/* ========================================
   SLEEP MARKER TABLE SPECIFIC STYLES
   ======================================== */

/* Quality Badge */
.quality-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.quality-good {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.quality-medium {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.quality-poor {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>