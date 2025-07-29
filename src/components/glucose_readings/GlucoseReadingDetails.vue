<template>
  <div>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <div :class="['cards', { 'center-single': isSingle }]">
      <!--
        Below is a conditional rendering logic for glucose_readings:
          If glucose_readings is an array, loop through it.
          If glucose_readings is a single object (not an array), wrap it in an array and loop through that.
          If glucose_readings is null or undefined, loop through an empty array (so nothing is rendered).
        -->
      <GlucoseReadingCard 
        v-for="glucose_reading in Array.isArray(glucose_readings) ? glucose_readings : (glucose_readings ? [glucose_readings] : [])"
        :key="glucose_reading.id"
        :glucose_reading="glucose_reading"
        class="card"
        @dblclick="$emit('edit', glucose_reading)"
      />
    </div>
    <router-link v-if="glucose_readings && !Array.isArray(glucose_readings)" :to="{ name: 'GlucoseReadingEdit', params: { id: glucose_readings.id } }">Edit</router-link>
    <router-link :to="{ name: 'GlucoseReadings' }">Back to List</router-link>
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
</style>