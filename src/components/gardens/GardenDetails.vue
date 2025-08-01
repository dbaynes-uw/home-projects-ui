<template>
  <div>
    <h1>Garden Details</h1>
    <div class="controls-bar">
      <v-select
        v-model="filterStatus"
        :items="gardenStatuses"
        label="Status"
        clearable
        class="filter-select"
        density="compact"
      />
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
const filterStatus = ref(null);
const gardenStatuses = ['Active', 'Inactive']; // Add your statuses

const sortOrder = ref('desc');
//const gardenTypes = ['Vegetable', 'Flower', 'Herb']; // Add your types
const filteredSortedGardens = computed(() => {
  let gardenList = Array.isArray(gardens.value)
    ? gardens.value.slice()
    : (gardens.value ? [gardens.value] : []);
  if (filterStatus.value) {
    gardenList = gardenList.filter(garden => garden.status === filterStatus.value);
  }
  gardenList.sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return gardenList;
});
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