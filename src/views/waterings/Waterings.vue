<template>
  <div class="waterings-page-container">
    <section class="page-shell mx-auto mt-5">
      <div class="page-shell-title-row">
        <h2>Waterings</h2>
        <router-link :to="{ name: 'WateringCreate' }">Create New Watering</router-link>
              <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Gardens' }">
          <b>Gardens</b>
        </router-link>
      </button>
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Plants' }">
          <b>Plants</b>
        </router-link>
      </button> 
      </div>
    </section>
    <div class="watering-details">
      <template v-if="isLoading">
        <BaseSpinner size="large" label="Loading Waterings" />
        <p>Loading Waterings...</p>
      </template>
      <template v-else>
        <div class="page-shell-actions">
          <button id="indent-secondary-button" class="btn btn-secondary" @click="toggleView" type="button">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </button>
        </div>

        <WateringIndex :waterings="waterings"
          v-if="showIndex"
          @edit="editWatering"
          @delete="handleDeleteWatering"
        />
        <WateringDetails :waterings="waterings"
          v-else
          @edit="editWatering"
          @delete="handleDeleteWatering"
          @dblclick="editWatering"
        />
        
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import WateringIndex from '@/components/waterings/WateringIndex.vue';
import WateringDetails from '@/components/waterings/WateringDetails.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { usePlantStore } from '@/stores/plants/PlantStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';

const wateringStore = useWateringStore();
const plantStore = usePlantStore();
const gardenStore = useGardenStore();
const router = useRouter();
const waterings = computed(() => wateringStore.allWaterings);
const isLoading = ref(true);
const showIndex = ref(true);

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editWatering(watering) {
  router.push({ name: 'WateringEdit', params: { id: watering.id } });
}

async function handleDeleteWatering(watering) {
  if (confirm(`Delete watering ${watering.name}?`)) {
    await wateringStore.deleteWatering(watering);
    await wateringStore.fetchWaterings();
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      wateringStore.fetchWaterings(),
      plantStore.fetchPlants(),
      gardenStore.fetchGardens()
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // ✅ ADD THIS - Stop loading spinner
    isLoading.value = false;
  }
});
</script>
<style scoped>
.waterings-page-container {
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