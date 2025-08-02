<template>
  <div>
    <h1>Garden Details VIEW ~~~</h1>
    <div class="controls-bar">
      <v-select
        v-model="filterName"
        :items="names"
        label="Name"
        clearable
        class="filter-select"
        density="compact"
      />
      <v-select
        v-model="filterStartTime"
        :items="gardenStart"
        label="Start Time"
        clearable
        class="filter-select"
        density="compact"
      />
      <v-btn @click="toggleSortOrder" color="primary" small class="sort-btn">
        Sort by Start Time {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </v-btn>
      <br/>
      <span id="count-display" class="filtered-count">
        Showing {{ filteredSortedGardens.length }} Garden{{ filteredSortedGardens.length === 1 ? '' : 's' }}
      </span>
    </div>
    <span class="h3-left-total-child">Double click Item Below to Edit</span>
    <div :class="['cards', { 'center-single': isSingle }]">
      <GardenCard 
        v-for="garden in filteredSortedGardens"
        :key="garden.id"
        :garden="garden"
        class="card"
        @dblclick="$emit('edit', garden)"
      />
    </div>
    <router-link v-if="isSingle" :to="{ name: 'Gardens' }">Back to List</router-link>
  </div>
</template>

<script setup>
import GardenCard from "@/components/gardens/GardenCard.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const gardens = ref(null);
const isLoading = ref(true);
const isSingle = computed(() => {
  return Array.isArray(gardens.value) && gardens.value.length === 1;
});
const filterName = ref(null);
const filterStartTime = ref(null);
const sortOrder = ref('desc');
//const gardenTypes = ['Vegetable', 'Flower', 'Herb']; // Add your types
const filteredSortedGardens = computed(() => {
  let gardens = Array.isArray(gardens.value)
    ? gardens.value.slice()
    : (gardens.value ? [gardens.value] : []);

  if (filterName.value) {
    gardens = gardens.filter(r => r.name === filterName.value);
  }
  if (filterStartTime.value) {
    gardens = gardens.filter(r => r.startTime === filterStartTime.value);
  }
  gardens.sort((a, b) => {
    const dateA = new Date(a.start_time );
    const dateB = new Date(b.start_time);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return gardens;
});

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}
async function fetchGardens() {
  await store.dispatch("fetchGardens");
  gardens.value = store.getters.gardens;
}
async function fetchGarden() {
  isLoading.value = true;
  await store.dispatch("fetchGarden", route.params.id);
  // If the store returns a single object, wrap it in an array for the card view
  const garden = store.state.garden;
  gardens.value = Array.isArray(garden) ? garden : (garden ? [garden] : []);
  isLoading.value = false;
}

onMounted(() => {
  console.log("Mounted Gardens.vue");
  console.log("Route params:", route.params);
  if (route.params.id && route.params.id !== '') {
    fetchGarden();
  } else {
    fetchGardens();
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