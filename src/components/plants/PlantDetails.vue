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
    <div v-if="!isSingle" class="controls-bar">
      <v-btn-group variant="outlined" divided>
        <v-btn
          @click="setSortField('plant_name')"
          :color="sortField === 'plant_name' ? 'primary' : 'default'"
          :prepend-icon="sortField === 'plant_name' && sortOrder === 'asc' ? 'mdi-sort-alphabetical-ascending' : 'mdi-sort-alphabetical-descending'"
          centered
          class="sort-btn"
        >
          Sort by Name
        </v-btn>
        
        <v-btn
          @click="setSortField('yard_location')"
          :color="sortField === 'yard_location' ? 'primary' : 'default'"
          :prepend-icon="sortField === 'yard_location' && sortOrder === 'asc' ? 'mdi-sort-calendar-ascending' : 'mdi-sort-calendar-descending'"
          centered
          class="sort-btn"
        >
          Yard Location
        </v-btn>
      </v-btn-group>
      
      <!-- ✅ Optional: Separate toggle button -->
      <v-btn
        @click="toggleSortOrder"
        variant="outlined"
        :prepend-icon="sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"
        centered
        class="sort-btn"
      >
        {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
      </v-btn>
      
      <!-- ✅ Show current sort info -->
      <span id="count-display">
        {{ filteredSortedPlants.length }} Plants
        <small>(by {{ sortField === 'plant_name' ? 'Name' : 'Yard Location' }}, {{ sortOrder === 'asc' ? (sortField === 'plant_name' ? 'A-Z' : 'A-Z') : (sortField === 'plant_name' ? 'Z-A' : 'Z-A') }})</small>
      </span>
    </div>
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
const sortField = ref('plant_name'); // Default sort by plant name
const sortOrder = ref('asc');

const singlePlant = ref(null);

const filteredSortedPlants = computed(() => {
  let plantList = Array.isArray(props.plants)
    ? props.plants.slice()
    : (props.plants ? [props.plants] : []);

  if (filterStatus.value) {
    plantList = plantList.filter(plant => plant.status === filterStatus.value);
  }
  
  // ✅ FIXED - Proper sorting for both fields
  plantList.sort((a, b) => {
    let valueA, valueB;
    
    if (sortField.value === 'plant_name') {
      valueA = (a.plant_name || '').toLowerCase();
      valueB = (b.plant_name || '').toLowerCase();
      
      if (sortOrder.value === 'asc') {
        return valueA.localeCompare(valueB); // A-Z
      } else {
        return valueB.localeCompare(valueA); // Z-A
      }
    } else if (sortField.value === 'yard_location') {
      valueA = (a.yard_location || '').toLowerCase();
      valueB = (b.yard_location || '').toLowerCase();

      // ✅ FIXED - Use localeCompare for strings, not subtraction
      if (sortOrder.value === 'asc') {
        return valueA.localeCompare(valueB); // A-Z
      } else {
        return valueB.localeCompare(valueA); // Z-A
      }
    }
    
    return 0; // Fallback
  });

  return plantList;
});

function setSortField(field) {
  if (sortField.value === field) {
    // If clicking same field, toggle order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If different field, set to ascending
    sortField.value = field;
    sortOrder.value = 'asc';
  }
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

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