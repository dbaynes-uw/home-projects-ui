<template>
  <div class="waterings-page-container">
    <section class="page-shell mx-auto mt-5">
      <div class="page-shell-title-row">
        <h2>Waterings</h2>
        <router-link class="page-link-button" :to="{ name: 'WateringCreate' }">Create New Watering</router-link>
      </div>

      <div class="page-shell-nav-row">
        <router-link class="page-link-button" :to="{ name: 'Gardens' }">
          Gardens
        </router-link>
        <router-link class="page-link-button" :to="{ name: 'Plants' }">
          Plants
        </router-link>
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
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-shell-nav-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.page-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}

.page-link-button:hover {
  background: #e2e8f0;
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

@media (max-width: 640px) {
  .page-shell {
    padding: 0.85rem;
  }

  .page-shell-title-row,
  .page-shell-nav-row {
    flex-direction: column;
    align-items: stretch;
  }

  .page-shell-title-row h2 {
    margin-bottom: 0;
  }

  .page-link-button,
  #indent-secondary-button {
    width: 100%;
    margin-left: 0;
  }
}
</style>