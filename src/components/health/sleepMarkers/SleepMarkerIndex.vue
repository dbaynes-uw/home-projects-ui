/* filepath: /Users/davidbaynes/sites/home-projects-ui/src/components/sleepMarkers/SleepMarkerIndex.vue */

<template>
  <ConfirmDialogue ref="confirmDialogue" />  
  <div class="table-container">
    <!-- ✅ TABLE HEADER -->
    <div class="table-header">
      <h3>
        <i class="fas fa-bed header-icon"></i>
        Sleep Records Index
      </h3>
      
      <div class="table-controls">
        <div class="table-count">
          <i class="fas fa-moon"></i>
          {{ props.sleepMarkers.length }} record{{ props.sleepMarkers.length === 1 ? '' : 's' }}
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
            <th @click="sortBy('sleep_date')" class="sortable">
              Date
              <i v-if="sortKey === 'sleep_date'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('time_asleep')" class="sortable center">
              Time Asleep
              <i v-if="sortKey === 'time_asleep'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('time_in_bed')" class="sortable">
              Time in Bed
              <i v-if="sortKey === 'time_in_bed'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('sleep_quality')" class="sortable center">
              Quality
              <i v-if="sortKey === 'sleep_quality'" :class="sortIcon" class="sort-icon"></i>
            </th>

            <th @click="sortBy('awakenings')" class="sortable center">
              Awakenings
              <i v-if="sortKey === 'awakenings'" :class="sortIcon" class="sort-icon"></i>
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

            <th>Notes</th>
            <th class="center">Actions</th>
          </tr>
        </thead>
        <tbody v-if="sortedMarkers.length > 0">
          <tr 
            v-for="marker in sortedMarkers" 
            :key="marker.id"
            @click="editSleepMarker(marker)"
            class="clickable-row"
          >
            <!-- Date -->
            <td>
              <div class="date-cell">
                <div class="date-value">{{ formatDate(marker.sleep_date) }}</div>
                <!--div class="days-ago">{{ getDaysAgo(marker.sleep_date) }}</!div-->
              </div>
            </td>

            <!-- Time Asleep -->
            <td class="center">
              <div class="result-cell">
                <span class="result-value">{{ marker.time_asleep || '—' }}</span>
              </div>
            </td>
            <td class="center">
              <div class="result-cell">
                <span class="result-value">{{ marker.time_in_bed || '—' }}</span>
              </div>
            </td>
            <!-- Quality -->
            <td class="center">
              <span :class="['status-badge', getQualityClass(marker.sleep_quality)]">
                <i :class="getQualityIcon(marker.sleep_quality)"></i>
                {{ marker.sleep_quality ? `${marker.sleep_quality}/10` : 'Not rated' }}
              </span>
            </td>

            <!-- Awakenings -->
            <td class="center">
              <span :class="['awakening-badge', getAwakeningClass(marker.awakenings)]">
                <i class="fas fa-eye"></i>
                {{ marker.awakenings || 0 }}
              </span>
            </td>
            <td class="center"><span class="result-value">{{ marker.awake_sleep }}</span></td>
            <td class="center"><span class="result-value">{{ marker.rem_sleep }}</span></td>
            <td class="center"><span class="result-value">{{ marker.core_sleep }}</span></td>
            <td class="center"><span class="result-value">{{ marker.deep_sleep }}</span></td>
            <td class="center"><span class="result-value">{{ marker.had_oob ? 'Yes' : 'No' }}</span></td>
            <!-- Notes -->
            <td>
              <div class="notes-cell">
                <span v-if="marker.sleep_notes" class="notes-preview" :title="marker.sleep_notes">
                  <i class="fas fa-sticky-note"></i>
                  {{ truncateNotes(marker.sleep_notes) }}
                </span>
                <span v-else class="no-notes">—</span>
              </div>
            </td>

            <!-- Actions (same as before) -->
            <td>
              <div class="actions-cell">
                <button 
                  class="table-action-btn edit" 
                  @click.stop="editSleepMarker(marker)"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="table-action-btn duplicate" 
                  @click.stop="duplicateSleepMarker(marker)"
                  title="Duplicate"
                >
                  <i class="fas fa-copy"></i>
                </button>
                <button
                  class="table-action-btn delete"
                  @click.stop="deleteMarker(marker)"
                  title="Delete Record"
                  type="button"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="sortedMarkers.length === 0" class="table-empty">
        <i class="fas fa-bed"></i>
        <h3>No Sleep Records Found</h3>
        <p>Start tracking your sleep to see records here.</p>
        <button class="table-empty-btn" @click="router.push({ name: 'SleepMarkerCreate' })">
          <i class="fas fa-plus"></i>
          Add Sleep Record
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
        Showing {{ sortedMarkers.length }} of {{ props.sleepMarkers.length }} records
      </div>
    </div>
  </div>
</template>

<script setup>
// Around line 200 in SleepMarkerIndex.vue
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSleepMarkerStore } from '@/stores/SleepMarkerStore'; // ✅ Use Pinia store
import dayjs from 'dayjs';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from '@/services/DateFormatService';

const props = defineProps({
  sleepMarkers: {
    type: Array,
    required: true,
    default: () => []
  }
});
defineEmits(['edit', 'delete']);
const router = useRouter();
const sleepMarkerStore = useSleepMarkerStore(); // ✅ Use Pinia store

// ✅ REFS
const confirmDialogue = ref(null);

// ✅ SORTING STATE
const sortKey = ref('sleep_date'); // ✅ CHANGED from marker_date
const sortAsc = ref(false);

const sortedMarkers = computed(() => {
  const sorted = [...props.sleepMarkers];
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

// ✅ QUALITY HELPERS (updated for numeric scale)
const getQualityClass = (quality) => {
  const q = parseFloat(quality);
  if (q >= 8) return 'status-success';
  if (q >= 6) return 'status-warning';
  return 'status-error';
};

const getQualityIcon = (quality) => {
  const q = parseFloat(quality);
  if (q >= 8) return 'fas fa-star';
  if (q >= 6) return 'fas fa-check-circle';
  return 'fas fa-times-circle';
};

// ✅ AWAKENING HELPERS
const getAwakeningClass = (awakenings) => {
  if (!awakenings || awakenings === 0) return 'awakening-good';
  if (awakenings <= 2) return 'awakening-fair';
  return 'awakening-poor';
};

// ✅ DATE/TIME FORMATTING
function formatDate(date) {
  return dayjs(date).format('MMM DD, YYYY');
}

const formatTime = (time) => {
  if (!time) return '—';
  // Time is already formatted as HH:MM from the store
  return dayjs(time, 'HH:mm').format('h:mm A');
};

//const getDaysAgo = (dateString) => {
//  if (!dateString) return '';
//  
//  const testDate = new Date(dateString);
//  const today = new Date();
//  const diffTime = today - testDate;
//  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//  
//  if (diffDays === 0) return 'Today';
//  if (diffDays === 1) return '1 day ago';
//  if (diffDays < 30) return `${diffDays} days ago`;
//  if (diffDays < 365) {
//    const months = Math.floor(diffDays / 30);
//    return months === 1 ? '1 month ago' : `${months} months ago`;
//  }
//  
//  const years = Math.floor(diffDays / 365);
//  return years === 1 ? '1 year ago' : `${years} years ago`;
//};

const truncateNotes = (notes) => {
  if (!notes) return '';
  return notes.length > 40 ? notes.substring(0, 40) + '...' : notes;
};

// ✅ ACTION METHODS
const editSleepMarker = (marker) => {
  if (marker?.id) {
    router.push({ name: 'SleepMarkerEdit', params: { id: marker.id } });
  }
};

const duplicateSleepMarker = (marker) => {
  router.push({ 
    name: 'SleepMarkerCreate', 
    query: { 
      duplicate: marker.id,
      sleep_quality: marker.sleep_quality,
      sleep_notes: marker.sleep_notes
    } 
  });
};

const deleteMarker = async (marker) => {
  if (!confirmDialogue.value) {
    console.error('❌ confirmDialogue ref is null!');
    return;
  }
  
  const ok = await confirmDialogue.value.show({
    title: "Delete Sleep Record",
    message: `Are you sure you want to delete the sleep record from ${formatDate(marker.sleep_date)}? This cannot be undone.`,
    okButton: "Delete Forever",
    cancelButton: "Cancel"
  });
  
  if (!ok) return;

  try {
    await sleepMarkerStore.deleteSleepMarker(marker.id);
  } catch (error) {
    console.error('❌ Delete error:', error);
  }
};

const exportToCsv = () => {
  const csvHeaders = [
    'Date',
    'Bed Time',
    'Wake Time',
    'Time in Bed',
    'Time Asleep',
    'Awakenings',
    'Quality',
    'Deep Sleep',
    'REM Sleep',
    'Core Sleep',
    'Awake Sleep',
    'Days Ago',
    'Notes'
  ];
  
  const csvData = props.sleepMarkers.map(item => [
    formatDate(item.sleep_date),
    formatTime(item.bed_time),
    formatTime(item.wake_time),
    item.time_in_bed || '',
    item.time_asleep || '',
    item.awakenings || 0,
    item.sleep_quality || '',
    item.deep_sleep || '',
    item.rem_sleep || '',
    item.core_sleep || '',
    item.awake_sleep || '',
    // getDaysAgo(item.sleep_date),
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
   SLEEP MARKER INDEX SPECIFIC STYLES
   ======================================== */

/* Time Cell */
.time-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.time-cell i {
  color: #667eea;
  font-size: 1rem;
}

/* Awakening Badge */
.awakening-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.awakening-good {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.awakening-fair {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.awakening-poor {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Clickable Row */
.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.03) 0%, rgba(102, 126, 234, 0.06) 100%);
}
</style>