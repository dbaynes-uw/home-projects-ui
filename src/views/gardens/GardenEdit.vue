<template>
  <ConfirmDialogue ref="confirmDialogue" />

  <div class="garden-edit-page">
    <section class="page-shell">
      <div class="page-shell-title-row">
        <h1>Edit Garden {{ garden.name || '' }}</h1>
        <div class="page-shell-nav-row">
          <router-link class="page-link-button" :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
            Garden Details
          </router-link>
          <router-link class="page-link-button" :to="{ name: 'Gardens' }">
            Back to Gardens
          </router-link>
        </div>
      </div>

      <BaseForm @submit.prevent="updateGarden">
        <div class="form-row">
          <div class="form-col half-width">
            <BaseTextField
              v-model="garden.name"
              label="Garden Name"
              required
              aria-label="Enter the name of the garden"
            />
          </div>
          <div class="form-col half-width">
            <BaseSelect
              v-model="garden.status"
              :items="ACTIVE_STATUSES"
              label="Status"
            />
            <div class="status-preview-row">
              <span class="status-preview-label">Current:</span>
              <GardenStatusBadge :status="garden.status" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col full-width">
            <BaseTextarea
              label="Notes"
              v-model="garden.notes"
              rows="3"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-col full-width action-row">
            <BaseButton variant="primary" size="medium" type="submit" aria-label="Update the Garden">
              Update Garden
            </BaseButton>
            <router-link :to="{ name: 'WateringCreate', params: { gardenId: props.id } }" class="back-link-btn">
              <BaseButton variant="secondary" size="medium" type="button">
                Add Watering
              </BaseButton>
            </router-link>
            <router-link :to="{ name: 'PlantCreate', params: { gardenId: garden.id } }" class="back-link-btn">
              <BaseButton variant="secondary" size="medium" type="button">
                Add Plant
              </BaseButton>
            </router-link>
            <router-link :to="{ name: 'Gardens' }" class="back-link-btn" aria-label="Go back to the Gardens list">
              <BaseButton variant="secondary" size="medium" type="button">
                Back to List
              </BaseButton>
            </router-link>
          </div>
        </div>
      </BaseForm>
    </section>

    <section class="data-shell">
      <div class="section-header">
        <h2>Waterings</h2>
        <router-link :to="{ name: 'WateringCreate', params: { gardenId: props.id } }" class="page-link-button">
          Add Watering
        </router-link>
      </div>
      <div v-if="garden.waterings && garden.waterings.length > 0" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Line</th>
              <th>Target</th>
              <th>Days</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="w in garden.waterings" :key="w.id">
              <td>{{ w.name }}</td>
              <td>{{ w.location }}</td>
              <td>{{ w.line }}</td>
              <td>{{ w.target }}</td>
              <td>{{ w.days }}</td>
              <td>{{ w.duration }}</td>
              <td>{{ w.status }}</td>
              <td class="row-actions">
                <router-link :to="{ name: 'WateringEdit', params: { id: w.id } }">Edit</router-link>
                <button type="button" class="link-like" @click="deleteWatering(w)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No waterings for this garden.</p>
    </section>

    <section class="data-shell">
      <div class="section-header">
        <h2>Plants</h2>
        <router-link :to="{ name: 'PlantCreate', params: { gardenId: garden.id } }" class="page-link-button">
          Add Plant
        </router-link>
      </div>
      <div v-if="garden.plants && garden.plants.length > 0" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Biological Name</th>
              <th>Yard Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in garden.plants" :key="p.id">
              <td>{{ p.plant_name }}</td>
              <td>{{ p.biological_name }}</td>
              <td>{{ p.yard_location }}</td>
              <td>{{ p.active }}</td>
              <td class="row-actions">
                <router-link :to="{ name: 'PlantEdit', params: { id: p.id } }">Edit</router-link>
                <button type="button" class="link-like" @click="deletePlant(p)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No plants for this garden.</p>
    </section>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ACTIVE_STATUSES } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { usePlantStore } from '@/stores/plants/PlantStore';
import BaseButton from '@/components/ui/BaseButton.vue';
import GardenStatusBadge from '@/components/gardens/GardenStatusBadge.vue';

const gardenStore = useGardenStore();
const wateringStore = useWateringStore();
const plantStore = usePlantStore();
const router = useRouter();

const props = defineProps(["id"]);

const confirmDialogue = ref(null);

const garden = computed(() => gardenStore.currentGarden || {});

onMounted(() => {
  gardenStore.fetchGarden(props.id);
});

async function updateGarden() {
  const ok = await confirmDialogue.value.show({
    title: "Update Garden",
    message: "Are you sure you want to update " + garden.value.name,
    okButton: "Update",
  });
  if (ok) {
    garden.value.status = garden.value.status || 'Active';
    const gardenData = { ...garden.value };
    await gardenStore.updateGarden(gardenData);
    router.push({ name: "GardenDetails", params: { id: gardenData.id } });
  }
}

async function deleteWatering(watering) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Watering',
    message: `Are you sure you want to delete watering "${watering.name}"?`,
    okButton: 'Delete',
    cancelButton: 'Cancel',
  });
  if (ok) {
    await wateringStore.deleteWatering(watering);
    await gardenStore.fetchGarden(props.id);
  }
}

async function deletePlant(plant) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Plant',
    message: `Are you sure you want to delete plant "${plant.plant_name}"?`,
    okButton: 'Delete',
    cancelButton: 'Cancel',
  });
  if (ok) {
    await plantStore.deletePlant(plant);
    await gardenStore.fetchGarden(props.id);
  }
}

</script>
<style scoped>
.garden-edit-page {
  width: 100%;
}

.page-shell,
.data-shell {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.page-shell-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
}

.page-shell-title-row h1,
.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.25;
}

.section-header h2 {
  font-size: 1.2rem;
}

.page-shell-nav-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.85rem;
  border-radius: 0.6rem;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.35rem;
}

.form-col {
  flex: 1;
  min-width: 0;
}

.half-width {
  flex: 1 1 calc(50% - 0.5rem);
}

.full-width {
  width: 100%;
  flex: 0 0 100%;
}

.status-preview-row {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.status-preview-label {
  font-size: 0.84rem;
  color: #475569;
}

.action-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.back-link-btn {
  text-decoration: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.data-shell p {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.row-actions {
  white-space: nowrap;
}

.link-like {
  background: transparent;
  border: 0;
  color: #0f172a;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.5rem;
  padding: 0;
}

@media (max-width: 768px) {
  .half-width {
    flex: 0 0 100%;
  }

  .page-shell-title-row,
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-shell-nav-row {
    width: 100%;
  }

  .page-link-button {
    width: 100%;
  }
}
</style>
