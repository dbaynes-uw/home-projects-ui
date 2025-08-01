<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Glucose Readings</h2>
        <router-link :to="{ name: 'GlucoseReadingCreate' }">Create New Glucose Reading</router-link>
      </v-card-title>
    </v-card>
    <div class="glucose-reading-details">
      <template v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading glucose readings...</p>
      </template>
      <template v-else>
        <v-card-actions>
          <v-btn id="indent-primary-button" color="primary" @click="showSummary = !showSummary">
            {{ showSummary ? 'Hide Summary/Averages' : 'Show Summary and Averages' }}
          </v-btn>
        </v-card-actions>
        <!-- Add the summary here -->
        <GlucoseReadingSummary
          v-if="showSummary"
          :glucose_readings="glucose_readings"
        />
        <v-card-actions>
          <v-btn id="indent-secondary-button" color="secondary" @click="toggleView">
            {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </v-btn>
        </v-card-actions>
        
        <GlucoseReadingIndex :glucose_readings="glucose_readings"
          v-if="showIndex"
          @edit="editGlucoseReading"
          @delete="handleDeleteReading"
        />
        <GlucoseReadingDetails :glucose_readings="glucose_readings" 
          v-else
          @edit="editGlucoseReading"
          @delete="handleDeleteReading"
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
import GlucoseReadingDetails from '@/components/glucose_readings/GlucoseReadingDetails.vue';
import GlucoseReadingSummary from '@/components/glucose_readings/GlucoseReadingSummary.vue'; // <-- Import it

const store = useStore();
const router = useRouter();
const glucose_readings = computed(() => store.state.glucoseReadings);
const isLoading = ref(true);
const showSummary = ref(false);
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
#indent-primary-button {
  margin-left: 5.8rem;
}
#indent-secondary-button {
  margin-left: 2rem;
}
</style>