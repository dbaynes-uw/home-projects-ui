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
    <span class="h3-left-total-child"><b>Double click Item Below to Edit</b></span>
    <br/>
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

const sortOrder = ref('desc');
//const wateringTypes = ['Vegetable', 'Flower', 'Herb']; // Add your types
const filteredSortedWaterings = computed(() => {
  let wateringList = Array.isArray(waterings.value)
    ? waterings.value.slice()
    : (waterings.value ? [waterings.value] : []);
  if (filterStatus.value) {
    wateringList = wateringList.filter(watering => watering.status === filterStatus.value);
  }
  wateringList.sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return wateringList;
});
async function fetchWaterings() {
  isLoading.value = true;  // ✅ Add this
  
  await store.dispatch("fetchWaterings");
  waterings.value = store.getters.waterings;
  console.log('💧 Fetched waterings:', waterings.value);
  
  isLoading.value = false;  // ✅ Add this
}
async function fetchWatering() {
  isLoading.value = true;
  
  const requestedId = route.params.id;  
  await store.dispatch("fetchWatering", requestedId);
  const watering = store.state.watering;
  if (watering && watering.id === parseInt(requestedId)) {
    console.log('✅ Correct watering received');
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