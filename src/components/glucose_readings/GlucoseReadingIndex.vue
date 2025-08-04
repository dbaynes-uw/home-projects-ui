<template>
  <div id="index-count-display">
    <span class="filtered-count">
      Showing {{ sortedReadings.length }} Glucose Reading{{ sortedReadings.length === 1 ? '' : 's' }}
    </span>
    <br/>
  </div>
  <v-table density="compact">
    <tr>
      <th id="background-blue" @click="sortList('reading_date')">Date</th>
      <th id="background-blue" @click="sortList('reading')">Reading</th>
      <th id="background-blue" @click="sortList('reading_type')">Reading Type</th>
      <th id="background-blue" @click="sortList('status')">Result</th>
      <th id="background-blue">Notes</th>
      <th class="th-center" id="background-blue">Actions</th>
    </tr>
    <tr v-for="reading in sortedReadings"
      :key="reading.id"
    >
      <td class="td-center">{{ formatStandardDateTime(reading.reading_date) }}</td>
      <td :class="readingColorClass(reading.reading)">
        {{ reading.reading }} mg/dl
      </td>
      <td>{{ reading.reading_type }}</td>
      <td>{{ reading.status }}</td>
      <td>{{ reading.notes }}</td>
      <td class="td-center" width="150px">
        <span v-if="onlineStatus">
          <span class="fa-stack" style="text-align: center">
            <router-link :to="{ name: 'GlucoseReadingEdit', params: { id: `${reading.id}` } }">
              <i id="medium-icon-edit" class="fa-solid fa-pen-to-square fa-stack-1x"></i>
            </router-link>
            <span class="fa-stack fa-table-stack">
              <router-link :to="{ name: 'GlucoseReadingDetails', params: { id: `${reading.id}` } }">
                <i id="booklist-icon-eye" class="fa fa-eye"></i>
              </router-link>
            </span>
            <span class="fa-table-stack">
              <i
                @click="deleteGlucoseReading(reading)"
                class="fas fa-trash-alt fa-stack-1x"
                id="booklist-icon-delete"
              ></i>
            </span>
          </span>
        </span>
        <span v-else>
          <router-link :to="{ name: 'GlucoseReadingDetails', params: { id: `${reading.id}` } }">View |</router-link>
          <router-link :to="{ name: 'GlucoseReadingEdit', params: { id: `${reading.id}` } }">Edit |</router-link>
          <span class="ok-btn" @click="deleteGlucoseReading(reading)"><u>Delete</u></span>
        </span>
      </td>
    </tr>
  </v-table>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  glucose_readings: { type: Array, required: true }
});

// Emits
const emit = defineEmits(['edit','delete']);

// State
const onlineStatus = ref(navigator.onLine);
const sortKey = ref('reading_date');
const sortAsc = ref(false);

// Computed sorted readings
const sortedReadings = computed(() => {
  const arr = [...props.glucose_readings];
  arr.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1;
    return 0;
  });
  return arr;
});
// Methods
function readingColorClass(readingValue) {
  if (readingValue < 70) return 'reading-low';
  if (readingValue >= 70 && readingValue <= 99) return 'reading-normal';
  if (readingValue >= 100 && readingValue <= 125) return 'reading-prediabetes';
  if (readingValue >= 126) return 'reading-diabetes';
  return '';
}
function formatStandardDateTime(date) {
  return new Date(date).toLocaleString();
}

function deleteGlucoseReading(reading) {
  emit('delete', reading);
}

function sortList(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}
</script>
<style scoped>
#index-count-display {
  font-weight: bold;
  font-size: 1.25rem;
}
.reading-normal {
  /* background-color: #e0ffe0; 
  color: #388e3c;
  */
  font-weight: bold;
  color: darkgreen
}
.reading-prediabetes {
  /*background-color: #fffbe0;
  color: #fbc02d;
  */
  font-weight: bold;
  color: #00f
}
.reading-diabetes {
  font-weight: bold;
  /*background-color: #ffe0ff;*/
  color: #e31b1b;
}
</style>