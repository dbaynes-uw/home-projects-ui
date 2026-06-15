<template>
  <div class="gardens-page-container">
    <section class="page-shell mx-auto mt-5">
      <div class="page-shell-title-row">
        <h1>Gardens</h1>
        <router-link class="page-link-button" :to="{ name: 'GardenCreate' }">Create New Garden</router-link>
      </div>

      <div class="page-shell-nav-row">
        <router-link class="page-link-button" :to="{ name: 'Waterings' }">
          Waterings
        </router-link>
        <router-link class="page-link-button" :to="{ name: 'Plants' }">
          Plants
        </router-link>
      </div>
    </section>
    <div class="garden-details">
      <template v-if="isLoading">
        <BaseSpinner size="large" label="Loading Gardens" />
        <p>Loading Gardens...</p>
      </template>
      <template v-else>
        <div class="page-shell-actions">
          <button id="indent-secondary-button" class="btn btn-secondary" @click="toggleView" type="button">
             {{ showIndex ? 'Show Card View' : 'Show Index View' }}
          </button>
        </div>

        <div class="filter-row">
          <BaseTextField
            v-model="searchQuery"
            label="Search gardens..."
            prepend-inner-icon="fas fa-magnify"
            clearable
            density="compact"
            variant="outlined"
            class="garden-search-input"
          />

          <BaseSelect
            v-model="statusFilter"
            :items="statusFilterOptions"
            label="Status Filter"
            :include-empty-option="true"
            empty-option-label="All statuses"
            class="garden-status-filter"
          />
        </div>
  
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GardenIndex from '@/components/gardens/GardenIndex.vue';
import GardenDetails from '@/components/gardens/GardenDetails.vue';
import BaseSpinner from '@/components/ui/BaseSpinner.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { ACTIVE_STATUSES } from '@/services/constants';

const gardenStore = useGardenStore();
const router = useRouter();

// Replace the gardens computed with filtered version
const searchQuery = ref(''); // Add search query
const statusFilter = ref(null);
const statusFilterOptions = ACTIVE_STATUSES.map(status => ({ value: status, title: status }));

const gardens = computed(() => {
  const allGardens = gardenStore.allGardens || [];
  const query = String(searchQuery.value || '').trim().toLowerCase();

  return allGardens.filter((garden) => {
    const matchesSearch = !query ||
      garden.name?.toLowerCase().includes(query) ||
      garden.location?.toLowerCase().includes(query) ||
      garden.description?.toLowerCase().includes(query);

    const matchesStatus = !statusFilter.value || garden.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const isLoading = ref(true);
const showIndex = ref(true);

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
.gardens-page-container {
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

.page-shell-title-row h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.25;
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
  margin: 0.75rem 0;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 0.5rem 0 0.75rem;
}

.garden-search-input {
  max-width: 300px;
  margin-left: 1rem;
}

.garden-status-filter {
  min-width: 200px;
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

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .garden-search-input,
  .garden-status-filter {
    width: 100%;
    max-width: none;
    min-width: 0;
    margin-left: 0;
  }
}
</style>