<template>
  <div>
    <br/>
    <span v-if="!isSingle">
      <div class="controls-bar">
        <v-select
          v-model="filterType"
          :items="readingTypes"
          label="Type"
          clearable
          class="filter-select"
          density="compact"
        />
        <v-select
          v-model="filterStatus"
          :items="readingStatuses"
          label="Status"
          clearable
          class="filter-select"
          density="compact"
        />
        <v-btn @click="toggleSortOrder" color="primary" small class="sort-btn">
          Sort by Date {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </v-btn>
        <br/>
        <span id="count-display" class="filtered-count">
          Showing {{ filteredSortedReadings.length }} Glucose Reading{{ filteredSortedReadings.length === 1 ? '' : 's' }}
        </span>
      </div>
    </span>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <div :class="['cards', { 'center-single': isSingle }]">
      <!--
        Below is a conditional rendering logic for glucose_readings:
          If glucose_readings is an array, loop through it.
          If glucose_readings is a single object (not an array), wrap it in an array and loop through that.
          If glucose_readings is null or undefined, loop through an empty array (so nothing is rendered).
        
      <GlucoseReadingCard 
        v-for="glucose_reading in Array.isArray(glucose_readings) ? glucose_readings : (glucose_readings ? [glucose_readings] : [])"
        :key="glucose_reading.id"
        :glucose_reading="glucose_reading"
        class="card"
        @dblclick="$emit('edit', glucose_reading)"
      /-->
      <GlucoseReadingCard 
        v-for="glucose_reading in filteredSortedReadings"
        :key="glucose_reading.id"
        :glucose_reading="glucose_reading"
        class="card"
        @dblclick="$emit('edit', glucose_reading)"
      />
    </div>
    <router-link v-if="isSingle" :to="{ name: 'GlucoseReadings' }">Back to List</router-link>
  </div>
</template>

<script setup>
import GlucoseReadingCard from "@/components/glucose_readings/GlucoseReadingCard.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const glucose_readings = ref(null);
const isLoading = ref(true);
const isSingle = computed(() => {
  return Array.isArray(glucose_readings.value) && glucose_readings.value.length === 1;
});
const filterType = ref(null);
const filterStatus = ref(null);
const sortOrder = ref('desc');

const readingTypes = ['AM-Fasting', 'Post-Meal']; // Add your types
const readingStatuses = ['Good - 70-99 mg/dl', 'Prediabetes - 100-125 mg/dl', 'Diabetes - 126+ mg/dl']; // Add your statuses

const filteredSortedReadings = computed(() => {
  let readings = Array.isArray(glucose_readings.value)
    ? glucose_readings.value.slice()
    : (glucose_readings.value ? [glucose_readings.value] : []);

  if (filterType.value) {
    readings = readings.filter(r => r.reading_type === filterType.value);
  }
  if (filterStatus.value) {
    readings = readings.filter(r => r.status === filterStatus.value);
  }
  readings.sort((a, b) => {
    const dateA = new Date(a.reading_date);
    const dateB = new Date(b.reading_date);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return readings;
});

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}
async function fetchReadingDetails() {
  await store.dispatch("fetchGlucoseReadings");
  glucose_readings.value = store.getters.glucoseReadings;
}
async function fetchReadingDetail() {
  isLoading.value = true;
  await store.dispatch("fetchGlucoseReading", route.params.id);
  // If the store returns a single object, wrap it in an array for the card view
  const reading = store.state.glucoseReading;
  glucose_readings.value = Array.isArray(reading) ? reading : (reading ? [reading] : []);
  isLoading.value = false;
}

onMounted(() => {
  if (route.params.id) {
    fetchReadingDetail();
  } else {
    fetchReadingDetails();
  }
});
</script>
<style scoped>
.center-single {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh; /* Adjust as needed */
}
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}
.filter-select {
  min-width: 180px;
  max-width: 220px;
}
.sort-btn {
  top: -.6rem;
  min-width: 10rem;
}
#count-display {
  font-weight: bold;
  font-size: 1.25rem;
}
@media (max-width: 600px) {
  .controls-bar {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  .filter-select, .sort-btn {
    width: 100%;
    min-width: unset;
    max-width: unset;
  }
}
</style>