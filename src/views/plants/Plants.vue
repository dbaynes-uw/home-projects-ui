<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Plants</h2>
        <!--router-link :to="{ name: 'PlantCreate' }">Create New Plant</!--router-link-->
      </v-card-title>
    </v-card>
    <div class="plant-details">
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

        <PlantIndex :plants="plants"
          v-if="showIndex"
          @edit="editPlant"
          @delete="handleDeletePlant"
        />
        <PlantDetails :plants="plants"
          v-else
          @edit="editPlant"
          @delete="handleDeletePlant"
        />
        
      </template>
    </div>
  </v-container>
</template>

<script setup>
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

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editPlant(plant) {
  router.push({ name: 'PlantEdit', params: { id: plant.id } });
}

async function handleDeletePlant(plant) {
  if (confirm(`Delete plant ${plant.name}?`)) {
    await store.dispatch('deletePlant', plant);
    await store.dispatch('fetchPlants');
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