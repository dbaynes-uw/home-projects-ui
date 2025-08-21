<template>
  <div>
    <span v-if="isSingle">
      <h1>Garden Details</h1>
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
    <span class="h3-left-total-child"><b>Double click Item Below to Edit</b></span>
    <br/>
    <div :class="['cards', { 'center-single': isSingle }]">
      <GardenCard 
        v-for="garden in filteredSortedGardens"
        :key="garden.id"
        :garden="garden"
        @dblclick="editGarden"
      />
    </div>
    <router-link v-if="isSingle" :to="{ name: 'Gardens' }">Back to List</router-link>
  </div>
</template>

<script setup>
import GardenCard from "@/components/gardens/GardenCard.vue";
import router from "@/router";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

// Make gardens prop optional
const props = defineProps({
  gardens: {
    type: Array,
    default: null  // Make it optional
  }
});

const localGardens = ref(null);
const isLoading = ref(true);
const filterStatus = ref(null);
const sortOrder = ref('desc');

// Use prop if available, otherwise use local data
const gardens = computed(() => props.gardens || localGardens.value);

const isSingle = computed(() => {
  return Array.isArray(gardens.value) && gardens.value.length === 1;
});

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

// Data fetching functions for standalone usage
async function fetchGardens() {
  try {
    await store.dispatch("fetchGardens");
    localGardens.value = store.getters.gardens;
  } catch (error) {
    console.error("Error fetching gardens:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchGarden() {
  try {
    await store.dispatch("fetchGarden", route.params.id);
    localGardens.value = [store.state.garden];
  } catch (error) {
    console.error("Error fetching garden:", error);
  } finally {
    isLoading.value = false;
  }
}

function editGarden(garden) {
  router.push({ name: 'GardenEdit', params: { id: garden.id } });
}

// Only fetch data if no prop was provided (standalone usage)
onMounted(() => {
  if (!props.gardens) {
    if (route.params.id && route.params.id !== '') {
      fetchGarden();
    } else {
      fetchGardens();
    }
  } else {
    isLoading.value = false;
  }
});

// Watch for route changes in standalone mode
watch(() => route.params.id, (newId) => {
  if (!props.gardens && newId) {
    isLoading.value = true;
    fetchGarden();
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