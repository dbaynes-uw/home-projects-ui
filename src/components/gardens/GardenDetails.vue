<template>
  <div>
    <span v-if="isSingle">
      <h1>Garden Details</h1>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Gardens' }">
          <b>All Gardens</b>
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
import { ref, computed} from "vue";

// Define the props
const props = defineProps({
  gardens: {
    type: Array,
    required: true
  }
});

//const isLoading = ref(false); // No loading needed since parent handles it
const filterStatus = ref(null);
const sortOrder = ref('desc');

// Use props.gardens instead of gardens.value
const isSingle = computed(() => {
  return Array.isArray(props.gardens) && props.gardens.length === 1;
});
const filteredSortedGardens = computed(() => {
  // Use props.gardens instead of gardens.value
  let gardenList = Array.isArray(props.gardens)
    ? props.gardens.slice()
    : (props.gardens ? [props.gardens] : []);
    
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
function editGarden(garden) {
  router.push({ name: 'GardenEdit', params: { id: garden.id } });
}
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