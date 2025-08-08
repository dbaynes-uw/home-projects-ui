<template>
  <div>
    <span v-if="isSingle">
      <h1>Plant Details</h1>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Plants' }">
          <b>All Plants</b>
        </router-link>
      </button>
    </span>
    <!--span v-if="!isSingle">
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
    </!--span-->
    <span class="h3-left-total-child"><b>Double click Item Below to Edit</b></span>
    <br/>
    <div :class="['cards', { 'center-single': isSingle }]">
      <PlantCard 
        v-for="plant in filteredSortedPlants"
        :key="plant.id"
        :plant="plant"
        @dblclick="editPlant"
      />
    </div>
    <router-link v-if="isSingle" :to="{ name: 'Plants' }">Back to List</router-link>
  </div>
</template>

<script setup>
import PlantCard from "@/components/plants/PlantCard.vue";
import router from "@/router";
import { ref, computed, onMounted,watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const plants = ref(null);

const isLoading = ref(true);
const isSingle = computed(() => {
  return Array.isArray(plants.value) && plants.value.length === 1;
});
const filterStatus = ref(null);
//const plantStatuses = ['Active', 'Inactive']; // Add your statuses

const sortOrder = ref('desc');
//const gardenTypes = ['Vegetable', 'Flower', 'Herb']; // Add your types
const filteredSortedPlants = computed(() => {
  let plantList = Array.isArray(plants.value)
    ? plants.value.slice()
    : (plants.value ? [plants.value] : []);
  if (filterStatus.value) {
    plantList = plantList.filter(plant => plant.status === filterStatus.value);
  }
  plantList.sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return plantList;
});
async function fetchPlants() {
  await store.dispatch("fetchPlants");
  plants.value = store.getters.plants;
}
async function fetchPlant() {
  isLoading.value = true;

  await store.dispatch("fetchPlant", route.params.id);
  // If the store returns a single object, wrap it in an array for the card view
  const plant = store.state.plant;
  plants.value = Array.isArray(plant) ? plant : (plant ? [plant] : []);
  isLoading.value = false;
}
function editPlant(plant) {
  router.push({ name: 'PlantEdit', params: { id: plant.id } });
}
onMounted(() => {
  if (route.params.id && route.params.id !== '') {
    fetchPlant();
  } else {
    fetchPlants();
  }
});
// Optional: If you can navigate to PlantDetails with a different id without remounting
watch(() => route.params.id, (newId) => {
  store.dispatch("fetchPlant", newId)
})
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