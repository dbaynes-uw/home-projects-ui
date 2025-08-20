<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Plants</h2>
      </v-card-title>
      <span>
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
    </v-card>
    
    <div class="plant-details" :key="refreshKey">
      <template v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading Plants...</p>
      </template>
      <template v-else>
        <v-card-actions>
          <v-btn id="indent-secondary-button" color="secondary" @click="toggleView">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </v-btn>
        </v-card-actions>
        <!-- Add key to force re-render -->
        <PlantIndex 
          v-if="showIndex" 
          :key="`index-${refreshKey}`"
          :plants="plants" 
          @edit="editPlant" 
          @delete="handleDeletePlant" 
        />
        
        <PlantDetails 
          v-else 
          :key="`details-${refreshKey}`"
          :plants="plants" 
          @edit="editPlant" 
          @delete="handleDeletePlant" 
        />
      </template>
    </div>
  </v-container>
</template><script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import PlantIndex from '@/components/plants/PlantIndex.vue';
import PlantDetails from '@/components/plants/PlantDetails.vue';

const store = useStore();
const router = useRouter();
const plants = computed(() => store.state.plants);
const isLoading = ref(true);
const showIndex = ref(false);
const refreshKey = ref(0); 

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editPlant(plant) {
  router.push({ name: 'PlantEdit', params: { id: plant.id } });
}

async function handleDeletePlant(plant) {
  console.log('🗑️ Attempting to delete plant:', plant.plant_name);
  const confirmed = confirm(`Are you sure you want to delete "${plant.plant_name}"?\n\nThis action cannot be undone.`);
  
  if (confirmed) {
    try {
      console.log('🗑️ Deleting plant:', plant.plant_name);
      isLoading.value = true;
      
      // Delete the plant
      const result = await store.dispatch('deletePlant', plant);
      console.log('✅ Delete result:', result);
      
      // 💥 NUCLEAR OPTION - Force everything to update
      // 1. Force fresh fetch from server
      await store.dispatch('fetchPlants');
      console.log('🔄 Fresh fetch completed');
      
      // 2. Force component re-render
      refreshKey.value++;
      console.log('🔄 Component refresh forced, new key:', refreshKey.value);
      
      // 3. Force Vue to process the changes
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('🔄 Timeout completed');
      
      console.log('✅ Plant deleted and UI refreshed!');
      
    } catch (error) {
      console.error('❌ Error deleting plant:', error);
      alert(`Failed to delete plant "${plant.plant_name}". Please try again.`);
      
      // Force refresh on error too
      await store.dispatch('fetchPlants');
      refreshKey.value++;
    } finally {
      isLoading.value = false;
    }
  }
}
onMounted(async () => {
  try {
    await store.dispatch('fetchPlants');
  } catch (error) {
    console.error("Error fetching plants:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<style scoped>
#indent-primary-button {
  margin-left: 5.8rem;
}
#indent-secondary-button {
  margin-left: 2rem;
}
</style>