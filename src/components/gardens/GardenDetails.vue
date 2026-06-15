<template>
  <div>
    <div v-if="isSingle" class="single-header">
      <h1>Garden Details</h1>
      <div class="single-header-status" v-if="singleGarden">
        <span>Status:</span>
        <GardenStatusBadge :status="singleGarden.status" />
      </div>
      <div class="single-header-links">
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
      </div>
    </div>

    <div v-if="!isSingle" class="controls-bar">
      <button
        @click="toggleSortOrder"
        type="button"
        class="btn btn-outline-primary sort-btn"
      >
        <i :class="sortOrder === 'asc' ? 'fas fa-sort-alpha-down mr-2' : 'fas fa-sort-alpha-up mr-2'"></i>
        {{ sortOrder === 'asc' ? 'A → Z' : 'Z → A' }}
      </button>
      <span id="count-display">
        {{ filteredSortedGardens.length }} Gardens
      </span>
    </div>
    <div class="list-intro">
      <span class="h3-left-total-child"><b>Double click Item Below to Edit</b></span>
    </div>
    
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
import GardenStatusBadge from "@/components/gardens/GardenStatusBadge.vue";
import router from "@/router";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useGardenStore } from "@/stores/gardens/GardenStore";

const route = useRoute();
const gardenStore = useGardenStore();

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
const sortOrder = ref('asc');

// Use prop if available, otherwise use local data
const gardens = computed(() => props.gardens || localGardens.value);

const isSingle = computed(() => {
  return Array.isArray(gardens.value) && gardens.value.length === 1;
});

const singleGarden = computed(() => {
  if (!isSingle.value) return null
  return Array.isArray(gardens.value) ? gardens.value[0] : null
})

const filteredSortedGardens = computed(() => {
  let gardenList = Array.isArray(gardens.value)
    ? gardens.value.slice()
    : (gardens.value ? [gardens.value] : []);
    
  if (filterStatus.value) {
    gardenList = gardenList.filter(garden => garden.status === filterStatus.value);
  }
  
  // ✅ SIMPLIFIED - Only sort by name
  gardenList.sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    
    if (sortOrder.value === 'asc') {
      return nameA.localeCompare(nameB); // A-Z
    } else {
      return nameB.localeCompare(nameA); // Z-A
    }
  });
  
  return gardenList;
});  

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};

// Data fetching functions for standalone usage
async function fetchGardens() {
  try {
    await gardenStore.fetchGardens();
    localGardens.value = gardenStore.allGardens;
  } catch (error) {
    console.error("Error fetching gardens:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchGarden() {
  try {
    await gardenStore.fetchGarden(route.params.id);
    localGardens.value = [gardenStore.currentGarden];
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

.single-header {
  margin-bottom: 0.75rem;
}

.single-header-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
  color: #475569;
  font-size: 0.9rem;
}

.single-header-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.controls-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.list-intro {
  margin-bottom: 0.9rem;
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
  .single-header-links {
    flex-direction: column;
    align-items: stretch;
  }

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