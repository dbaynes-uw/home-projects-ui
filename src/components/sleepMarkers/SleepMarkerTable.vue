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

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  markers: {
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

function getQualityClass(quality) {
  const q = parseFloat(quality);
  if (q >= 8) return 'quality-good';
  if (q >= 6) return 'quality-medium';
  return 'quality-poor';
}
</script>

<style scoped>
/* ✅ All shared table styles now come from table-components.css */
/* Only component-specific overrides if needed */
</style>