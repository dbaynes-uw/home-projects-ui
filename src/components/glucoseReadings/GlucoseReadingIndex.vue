<template>
  <div class="table-container">
    <div class="table-header">
      <h3>
        <i class="fas fa-table header-icon"></i>
        Glucose Readings Table
      </h3>
      <div class="table-controls">
        <div class="table-count">
          <i class="fas fa-list-ol"></i>
          {{ glucose_readings.length }} entr{{ glucose_readings.length === 1 ? 'y' : 'ies' }}
        </div>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('reading_date')" class="sortable">
              Date 
              <i v-if="sortKey === 'reading_date'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('reading')" class="sortable">
              Reading
              <i v-if="sortKey === 'reading'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('reading_type')" class="sortable">
              Type
              <i v-if="sortKey === 'reading_type'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <i v-if="sortKey === 'status'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th @click="sortBy('notes')" class="sortable">
              Notes
              <i v-if="sortKey === 'notes'" :class="sortIcon" class="sort-icon"></i>
            </th>
            <th class="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="glucose_reading in sortedGlucoseReadings" :key="glucose_reading.id" @click="$emit('edit', glucose_reading)">
            <td>
              <div class="date-cell">
                <div class="date-value">{{ formatDate(glucose_reading.reading_date) }}</div>
              </div>
            </td>
            <td>{{ glucose_reading.reading }}</td>
            <td>{{ glucose_reading.reading_type }}</td>
            <td>{{ glucose_reading.status }}</td>
            <td>{{ glucose_reading.notes }}</td>
            <td>
              <div class="actions-cell">
                <button 
                  class="table-action-btn edit" 
                  @click.stop="$emit('edit', glucose_reading)"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="table-action-btn delete" 
                  @click.stop="$emit('delete', glucose_reading)"
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
        Showing {{ sortedGlucoseReadings.length }} of {{ sortedGlucoseReadings.length }} results
      </div>    
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  glucose_readings: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'delete']);

const sortKey = ref('reading_date');
const sortAsc = ref(false);

const sortedGlucoseReadings = computed(() => {
  const sorted = [...props.glucose_readings];
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