<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Gardens</h2>
        <router-link :to="{ name: 'GardenCreate' }">Create New Garden</router-link>
      </v-card-title>

      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Waterings' }">
          <b>Waterings</b>
        </router-link>
      </button>     
      <button id="button-as-link" @click="requestIndexDetail">
        <router-link :to="{ name: 'Plants' }">
          <b>Plants</b>
        </router-link>
      </button> 
    </v-card>
    <div class="garden-details">
      <template v-if="isLoading">
        <BaseSpinner size="large" label="Loading Gardens" />
        <p>Loading Gardens...</p>
      </template>
      <template v-else>
        <v-card-actions>
          <button id="indent-secondary-button" class="btn btn-secondary" @click="toggleView" type="button">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </button>
        </v-card-actions>

        <!-- Add search input -->
        <v-text-field
          v-model="searchQuery"
          label="Search gardens..."
          prepend-inner-icon="fas fa-magnify"
          clearable
          density="compact"
          variant="outlined"
          style="max-width: 300px; margin-left: 1rem;"
          @input="console.log('Search query:', searchQuery)"
        ></v-text-field>
  
        <GardenIndex :gardens="gardens"
          v-if="showIndex"
          @edit="editGarden"
          @delete="handleDeleteGarden"
        />
        <GardenDetails :gardens="gardens"
          v-else
          @edit="editGarden"
          @delete="handleDeleteGarden"
        />
      </template>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GardenIndex from '@/components/gardens/GardenIndex.vue';
import GardenDetails from '@/components/gardens/GardenDetails.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import { useGardenStore } from '@/stores/gardens/GardenStore';

const gardenStore = useGardenStore();
const router = useRouter();

// Replace the gardens computed with filtered version
const searchQuery = ref(''); // Add search query
const gardens = computed(() => {
  const allGardens = gardenStore.allGardens;
  
  if (!searchQuery.value) {
    return allGardens;
  }
  
  const query = searchQuery.value.toLowerCase();
  return allGardens.filter(garden => 
    garden.name?.toLowerCase().includes(query) ||
    garden.location?.toLowerCase().includes(query) ||
    garden.description?.toLowerCase().includes(query)
  );
});

const isLoading = ref(true);
const showIndex = ref(false);

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editGarden(garden) {
  router.push({ name: 'GardenEdit', params: { id: garden.id } });
}

async function handleDeleteGarden(garden) {
  if (confirm(`Delete garden ${garden.name}?`)) {
    await gardenStore.deleteGarden(garden);
    await gardenStore.fetchGardens();
  }
}

onMounted(async () => {
  try {
    await gardenStore.fetchGardens();
  } catch (error) {
    console.error("Error fetching gardens:", error);
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