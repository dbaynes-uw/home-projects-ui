<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Glucose Readings</h2>
        <router-link :to="{ name: 'GlucoseReadingCreate' }">Create New Glucose Reading</router-link>
      </v-card-title>
      <v-card-actions>
        <v-btn id="indent-button" color="primary" @click="toggleView">
          {{ showIndex ? 'Show Card View' : 'Show Index View' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="glucose-reading-list">
      <template v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading glucose readings...</p>
      </template>
      <template v-else>
        <GlucoseReadingIndex :glucose_readings="glucose_readings"
          v-if="showIndex"
          @edit="editGlucoseReading"
          @delete="handleDeleteReading"
        />
        <GlucoseReadingList :glucose_readings="glucose_readings" />
          v-else
          :glucose_readings="glucose_readings"
          @edit="editGlucoseReading"
          @delete="handleDeleteReading
        />
      </template>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import GlucoseReadingIndex from '@/components/glucose_readings/GlucoseReadingIndex.vue';
import GlucoseReadingList from '@/components/glucose_readings/GlucoseReadingList.vue';

const store = useStore();
const router = useRouter();
const glucose_readings = computed(() => store.state.glucoseReadings);
const isLoading = ref(true);
const showIndex = ref(true);

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editGlucoseReading(glucose_reading) {
  router.push({ name: 'GlucoseReadingEdit', params: { id: glucose_reading.id } });
}

async function handleDeleteReading(reading) {
  if (confirm(`Delete reading for ${reading.reading_date}?`)) {
    await store.dispatch('deleteGlucoseReading', reading);
    await store.dispatch('fetchGlucoseReadings');
  }
}

onMounted(async () => {
  try {
    await store.dispatch('fetchGlucoseReadings');
  } catch (error) {
    console.error("Error fetching glucose readings:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<style scoped>
#indent-button {
  margin-left: 2rem;
}
</style>