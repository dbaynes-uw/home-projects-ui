<template>
  <v-container>
    <v-card class="mx-auto mt-5">
      <v-card-title>
        <h2>Waterings</h2>
        <router-link :to="{ name: 'WateringCreate' }">Create New Watering</router-link>
      </v-card-title>
    </v-card>
    <div class="watering-details">
      <template v-if="isLoading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading Waterings...</p>
      </template>
      <template v-else>
        <v-card-actions>
          <v-btn id="indent-secondary-button" color="secondary" @click="toggleView">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </v-btn>
        </v-card-actions>

        <WateringIndex :waterings="waterings"
          v-if="showIndex"
          @edit="editWatering"
          @delete="handleDeleteWatering"
        />
        <WateringDetails :waterings="waterings"
          v-else
          @edit="editWatering"
          @delete="handleDeleteWatering"
        />
        
      </template>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import WateringIndex from '@/components/waterings/WateringIndex.vue';
import WateringDetails from '@/components/waterings/WateringDetails.vue';

const store = useStore();
const router = useRouter();
const waterings = computed(() => store.state.waterings);
const isLoading = ref(true);
const showIndex = ref(false);

function toggleView() {
  showIndex.value = !showIndex.value;
}

function editWatering(watering) {
  router.push({ name: 'WateringEdit', params: { id: watering.id } });
}

async function handleDeleteWatering(watering) {
  if (confirm(`Delete watering ${watering.name}?`)) {
    await store.dispatch('deleteWatering', watering);
    await store.dispatch('fetchWaterings');
  }
}

onMounted(async () => {
  try {
    await store.dispatch('fetchWaterings');
  } catch (error) {
    console.error("Error fetching waterings:", error);
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