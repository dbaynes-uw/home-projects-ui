<template>
  <div>
    <h1>Glucose Reading Details</h1>
    <template v-if="isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading glucose readings...</p>
    </template>
    <template v-else>
      <p><strong>Date:</strong> {{ glucoseReading?.reading_date }}</p>
      <p><strong>Value:</strong> {{ glucoseReading?.reading }}</p>
      <router-link v-if="glucoseReading" :to="{ name: 'GlucoseReadingEdit', params: { id: glucoseReading.id } }">Edit</router-link>
      <router-link :to="{ name: 'GlucoseReadings' }">Back to List</router-link>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const glucoseReading = ref(null);
const isLoading = ref(true);

const fetchReading = async () => {
  isLoading.value = true;
  await store.dispatch('fetchGlucoseReading', route.params.id);
  glucoseReading.value = store.state.glucoseReading;
  isLoading.value = false;
};

onMounted(fetchReading);

// Optional: re-fetch if route param changes
watch(() => route.params.id, fetchReading);
</script>