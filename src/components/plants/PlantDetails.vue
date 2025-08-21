<template>
  <div>
    <span v-if="isSingle">
      <h1>Plant Details</h1>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Gardens' }">
          <b>All Gardens</b>
        </router-link>
      </button>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Waterings' }">
          <b>All Waterings</b>
        </router-link>
      </button>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();
const props = defineProps({
  plants: {
    type: Array,
    required: false,
    default: () => []
  }
});

const isLoading = ref(true);
const isSingle = computed(() => {
  return (route.params.id && route.params.id !== '') || 
         (Array.isArray(props.plants) && props.plants.length === 1 && route.name === 'PlantDetails');
});

const filterStatus = ref(null);
const sortOrder = ref('desc');

const singlePlant = ref(null);

const filteredSortedPlants = computed(() => {
  // ✅ If we have a single plant from store, use that
  if (route.params.id && singlePlant.value) {
    return [singlePlant.value];
  }
  
  // Otherwise use the plants prop
  let plantList = Array.isArray(props.plants)
    ? props.plants.slice()
    : (props.plants ? [props.plants] : []);

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

// ✅ FIXED - Store the fetched plant
async function fetchPlant() {
  if (!route.params.id) return;
  
  isLoading.value = true;
  await store.dispatch("fetchPlant", route.params.id);
  singlePlant.value = store.state.plant; // ✅ Store the single plant
  isLoading.value = false;
}

onMounted(() => {
  if (route.params.id && route.params.id !== '') {
    fetchPlant(); // Fetch single plant and store it
  }
});

function editPlant(plant) {
  router.push({ name: 'PlantEdit', params: { id: plant.id } });
}

// ✅ DEBUG - Watch props changes
watch(() => props.plants, (newPlants) => {
  console.log('🔄 PlantDetails props.plants changed:', newPlants.length);
}, { deep: true });
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