<template>
  <div class="plants-page-container">
    <section class="page-shell mx-auto mt-5">
      <div class="page-shell-title-row">
        <h2>Plants</h2>
      </div>
      <div class="details-top-links">
        <router-link class="details-top-link" :to="{ name: 'Gardens' }">
          <b>All Gardens</b>
        </router-link>
        <router-link class="details-top-link" :to="{ name: 'Waterings' }">
          <b>All Waterings</b>
        </router-link>
        <router-link class="details-top-link" :to="{ name: 'Plants' }">
          <b>All Plants</b>
        </router-link>
      </div>
    </section>
    
    <div class="plant-details" :key="refreshKey">
      <template v-if="isLoading">
        <BaseSpinner size="large" label="Loading Plants" />
        <p>Loading Plants...</p>
      </template>
      <template v-else>
        <div class="page-shell-actions">
          <button id="indent-secondary-button" class="btn btn-secondary" @click="toggleView" type="button">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </button>
        </div>
        <!-- Add key to force re-render -->
        <PlantIndex 
          v-if="showIndex" 
          :key="`index-${refreshKey}`"
          :plants="filteredPlants" 
          @edit="editPlant" 
          @delete="handleDeletePlant" 
        />
        
        <PlantDetails 
          v-else 
          :key="`details-${refreshKey}`"
          :plants="filteredPlants" 
          @edit="editPlant" 
          @delete="handleDeletePlant" 
        />
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PlantIndex from '@/components/plants/PlantIndex.vue';
import PlantDetails from '@/components/plants/PlantDetails.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { usePlantStore } from '@/stores/plants/PlantStore';

const plantStore = usePlantStore();
const route = useRoute();
const router = useRouter();
const plants = ref([]);
const isLoading = ref(true);
const showIndex = ref(false);
const refreshKey = ref(0); 
const filteredPlants = computed(() => {
  if (route.query.wateringId) {
    const wateringId = parseInt(route.query.wateringId);
    return plants.value.filter(plant => 
      parseInt(plant.watering_id) === wateringId
    );
  }
  
  // If no wateringId query, show all plants
  return plants.value;
});
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
      const result = await plantStore.deletePlant(plant);
      console.log('✅ Delete result:', result);
      
      // 💥 NUCLEAR OPTION - Force everything to update
      // 1. Force fresh fetch from server
      await plantStore.fetchPlants();
      console.log('🔄 Fresh fetch completed');
      
      // 2. Force component re-render
      refreshKey.value++;
      console.log('🔄 Component refresh forced, new key:', refreshKey.value);
      
      // 3. Force Vue to process the changes
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('❌ Error deleting plant:', error);
      alert(`Failed to delete plant "${plant.plant_name}". Please try again.`);
      
      // Force refresh on error too
      await plantStore.fetchPlants();
      refreshKey.value++;
    } finally {
      isLoading.value = false;
    }
  }
}
onMounted(async () => {
  try {
    // Fetch all plants
    await plantStore.fetchPlants();
    plants.value = plantStore.allPlants;
    
    // Check if we need to filter
    if (route.query.wateringId) {
      console.log(`Filtering plants for watering ID: ${route.query.wateringId}`);
      console.log(`Found ${filteredPlants.value.length} plants for this watering`);
    }
  } catch (error) {
    console.error('❌ Error loading plants:', error);
  } finally {
    // ✅ ADD THIS MISSING LINE
    isLoading.value = false;
  }
});
</script>
<style scoped>
.plants-page-container {
  width: 100%;
}

.page-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}

.page-shell-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.details-top-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.details-top-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
}

.details-top-link:hover {
  background: #e2e8f0;
}

@media (max-width: 640px) {
  .details-top-links {
    flex-direction: column;
    align-items: stretch;
  }

  .details-top-link {
    width: 100%;
  }
}

.page-shell-actions {
  margin: 0.5rem 0;
}

#indent-primary-button {
  margin-left: 5.8rem;
}
#indent-secondary-button {
  margin-left: 2rem;
}
</style>