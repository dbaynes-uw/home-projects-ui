<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h2>Glucose Reading List</h2>
        <router-link :to="{ name: 'GlucoseReadingCreate' }">Create New Glucose Reading</router-link>
      </v-card-title>
      <v-card-actions>
        <!--v-btn color="primary" @click="requestIndexDetail">
          Toggle Index or Card View
        </v-btn-->
        <v-btn color="primary" @click="requestIndexDetail" aria-label="Toggle Index or Card View">
          Toggle Index or Card View
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="glucose-reading-list">
      <template v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading glucose readings...</p>
      </template>
      <template v-else>
        <template v-if="requestIndexDetailFlag">
          <GlucoseReadingIndex :glucose_readings="glucose_readings" />
        </template>
        <template v-else>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <GlucoseReadingCard
              v-for="glucose_reading in glucose_readings"
              :key="glucose_reading.id"
              :glucose_reading="glucose_reading"
              class="card"
              @dblclick="editGlucoseReading(glucose_reading)"
            />
          </div>
        </template>
      </template>
    </div>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import GlucoseReadingCard from "@/components/glucose_readings/GlucoseReadingCard.vue";
import GlucoseReadingIndex from "@/components/glucose_readings/GlucoseReadingIndex.vue";

export default {
  name: 'GlucoseReadingList',
  components: {
    GlucoseReadingCard,
    GlucoseReadingIndex,
  },
  setup() {
    const store = useStore();
    const glucose_readings = computed(() => store.state.glucoseReadings); // Use Vuex state directly
    const isLoading = ref(true); // Add loading state
    const requestIndexDetailFlag = ref(false); // Reactive flag for toggling views

    const editGlucoseReading = (glucose_reading) => {
      store.$router.push({ name: 'GlucoseReadingEdit', params: { id: glucose_reading.id } });
    };

    const requestIndexDetail = () => {
      requestIndexDetailFlag.value = !requestIndexDetailFlag.value;
    };

    onMounted(async () => {
      try {
        await store.dispatch('fetchGlucoseReadings');
      } catch (error) {
        console.error("Error fetching glucose readings:", error);
      } finally {
        isLoading.value = false; // Set loading to false after data is fetched
      }
    });

    return { glucose_readings, isLoading, requestIndexDetailFlag, editGlucoseReading, requestIndexDetail };
  },
};
</script>

<style scoped>
.glucose-reading-list {
  margin-top: 20px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 calc(33.333% - 16px);
  max-width: calc(33.333% - 16px);
}
.h3-left-total-child {
  font-size: 1.2rem;
  margin-bottom: 16px;
}
</style>