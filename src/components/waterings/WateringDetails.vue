<template>
  <div>
    <span v-if="isSingle">
      <h1>Watering Details</h1>
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
          @click="setSortField('start_time')"
          :color="sortField === 'start_time' ? 'primary' : 'default'"
          :prepend-icon="sortField === 'start_time' && sortOrder === 'asc' ? 'fas fa-sort-calendar-ascending' : 'fas fa-sort-calendar-descending'"
          centered
          class="sort-btn"
        >
          Start Time
        </v-btn>
        <v-btn
          @click="setSortField('name')"
          :color="sortField === 'name' ? 'primary' : 'default'"
          :prepend-icon="sortField === 'name' && sortOrder === 'asc' ? 'fas fa-sort-alphabetical-ascending' : 'fas fa-sort-alphabetical-descending'"
          centered
          class="sort-btn"
        >
          Sort by Name
        </v-btn>
                
      </v-btn-group>
      
      <!-- ✅ Optional: Separate toggle button -->
      <v-btn
        @click="toggleSortOrder"
        variant="outlined"
        :prepend-icon="sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
        centered
        class="sort-btn"
      >
        {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
      </v-btn>
      
      <!-- ✅ Show current sort info -->
      <span id="count-display">
        {{ filteredSortedWaterings.length }} Waterings 
        <small>(by {{ sortField === 'name' ? 'Name' : 'Time' }}, {{ sortOrder === 'asc' ? (sortField === 'name' ? 'A-Z' : 'Earliest to Latest') : (sortField === 'name' ? 'Z-A' : 'Latest to Earliest') }})</small>
      </span>
    </div>
    <h3 class="h3-left-total-child"><b>Double click Item Below to Edit</b></h3>
    <div :class="['cards', { 'center-single': isSingle }]">
      <WateringCard 
        v-for="watering in filteredSortedWaterings"
        :key="watering.id"
        :watering="watering"
        @dblclick="editWatering"
      />
    </div>
    <router-link v-if="isSingle" :to="{ name: 'Waterings' }">Back to List</router-link>
  </div>
</template>

<script setup>
import WateringCard from "@/components/waterings/WateringCard.vue";
import router from "@/router";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const waterings = ref(null);

const isLoading = ref(true);
const isSingle = computed(() => {
  return Array.isArray(waterings.value) && waterings.value.length === 1;
});
const filterStatus = ref(null);
//const wateringStatuses = ['Active', 'Inactive']; // Add your statuses

const sortField = ref('name'); // Default sort by name
const sortOrder = ref('asc');

const filteredSortedWaterings = computed(() => {
  let wateringList = Array.isArray(waterings.value)
    ? waterings.value.slice()
    : (waterings.value ? [waterings.value] : []);

  if (filterStatus.value) {
    wateringList = wateringList.filter(watering => watering.status === filterStatus.value);
  }
  // ✅ NEW: FILTER OUT NULL start_time WHEN SORTING BY start_time
  if (sortField.value === 'start_time') {
    wateringList = wateringList.filter(watering => 
      watering.start_time && 
      watering.start_time !== null && 
      watering.start_time !== ''
    );
  }
  
  // ✅ FLEXIBLE SORTING - Handle both name and start_time
  wateringList.sort((a, b) => {
    let valueA, valueB;
    if (sortField.value === 'name') {
      valueA = (a.name || '').toLowerCase();
      valueB = (b.name || '').toLowerCase();
      
      if (sortOrder.value === 'asc') {
        return valueA.localeCompare(valueB); // A-Z
      } else {
        return valueB.localeCompare(valueA); // Z-A
      }
    } else if (sortField.value === 'start_time') {
      valueA = new Date(a.start_time);
      valueB = new Date(b.start_time);
      
      if (sortOrder.value === 'asc') {
        return valueA - valueB; // Oldest first
      } else {
        return valueB - valueA; // Newest first
      }
    }
    
    return 0; // Fallback
  });

  return wateringList;
});

// ✅ ADD THESE - Sort control functions
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
}

async function fetchWaterings() {
  isLoading.value = true;  // ✅ Add this
  
  await store.dispatch("fetchWaterings");
  waterings.value = store.getters.waterings;
  
  isLoading.value = false;  // ✅ Add this
}
async function fetchWatering() {
  isLoading.value = true;
  
  const requestedId = route.params.id;  
  await store.dispatch("fetchWatering", requestedId);
  const watering = store.state.watering;
  if (watering && watering.id === parseInt(requestedId)) {
    waterings.value = [watering];
  } else {
    console.error('❌ Wrong watering received!');
    console.error('  Requested:', requestedId);
    console.error('  Received:', watering?.id);
    
    // Try to find correct watering from all waterings
    await store.dispatch("fetchWaterings");
    const allWaterings = store.getters.waterings;
    const correctWatering = allWaterings.find(w => w.id === parseInt(requestedId));
    
    if (correctWatering) {
      console.log('✅ Found correct watering in all waterings');
      waterings.value = [correctWatering];
    } else {
      console.error('❌ Watering not found anywhere!');
      waterings.value = [];
    }
  }
  isLoading.value = false;
}

function editWatering(watering) {
  router.push({ name: 'WateringEdit', params: { id: watering.id } });
}

onMounted(() => {
  if (route.params.id && route.params.id !== '') {
    fetchWatering();
  } else {
    fetchWaterings();
  }
});
</script>
<style scoped>
/* ✅ CONTAINER APPROACH */
.waterings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.center-single {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh; /* Adjust as needed */
}
/* ✅ TEMPORARY DEBUG BORDERS */
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 1rem !important;
}

.cards {
  padding: 0 1rem !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
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