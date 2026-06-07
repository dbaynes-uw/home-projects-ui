<template>
  <h1>Edit Garden {{ garden.name }}</h1>
  <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
    <b>Garden Details</b>
  </router-link>
  <br/>
  <router-link :to="{ name: 'Gardens' }">
    <b>Back to Gardens</b>
   </router-link>
    <br/>
    <v-form @submit.prevent="updateGarden">
    <ConfirmDialogue ref="confirmDialogue" />
       <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="garden.name"
            label="Garden Name"
            outlined
            required
            aria-label="Enter the name of the garden"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <span v-if="garden.status">
            <h3 id="p-custom-left">Current Status: {{ garden.status }}</h3>
          </span>
          <v-select
            v-model="status"
            :items="ACTIVE_STATUSES"
            label="Select Status to Change"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          label="Notes"
          v-model="garden.notes"
          rows="3"
          cols="40"
        />
      </v-row>
      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <BaseButton variant="primary" size="medium" type="submit" aria-label="Update the Garden">
            Update
          </BaseButton>
          <router-link :to="{ name: 'Gardens' }" class="back-link-btn" aria-label="Go back to the Gardens list">
            <BaseButton variant="secondary" size="medium" type="button">
              Back to List
            </BaseButton>
          </router-link>
        </v-col>
      </v-row>
  </v-form>

  <!-- Waterings -->
  <v-divider class="my-4" />
  <h2>Waterings</h2>
  <div v-if="garden.waterings && garden.waterings.length > 0">
    <v-table density="compact">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Line</th>
          <th>Target</th>
          <th>Days</th>
          <th>Duration</th>
          <th>Status</th>
          <th></th>
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
          <td>
            <router-link :to="{ name: 'WateringEdit', params: { id: w.id } }">
              Edit
            </router-link>
            &nbsp;|&nbsp;
            <a href="#" @click.prevent="deleteWatering(w)">Delete</a>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <p v-else>No waterings for this garden.</p>

  <!-- Plants -->
  <v-divider class="my-4" />
  <h2>Plants</h2>
  <div v-if="garden.plants && garden.plants.length > 0">
    <v-table density="compact">
      <thead>
        <tr>
          <th>Name</th>
          <th>Biological Name</th>
          <th>Yard Location</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in garden.plants" :key="p.id">
          <td>{{ p.plant_name }}</td>
          <td>{{ p.biological_name }}</td>
          <td>{{ p.yard_location }}</td>
          <td>{{ p.active }}</td>
          <td>
            <router-link :to="{ name: 'PlantEdit', params: { id: p.id } }">
              Edit
            </router-link>
            &nbsp;|&nbsp;
            <a href="#" @click.prevent="deletePlant(p)">Delete</a>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <p v-else>No plants for this garden.</p>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ACTIVE_STATUSES } from "@/services/constants";
import DateFormatService from "@/services/DateFormatService.js";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { usePlantStore } from '@/stores/plants/PlantStore';
import BaseButton from '@/components/ui/BaseButton.vue';

const gardenStore = useGardenStore();
const wateringStore = useWateringStore();
const plantStore = usePlantStore();
const router = useRouter();

const props = defineProps(["id"]);

const confirmDialogue = ref(null);
const status = ref(null);

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
    garden.value.status = 'Active';
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

function formatTime(value) {
  return DateFormatService.formatTimejs(value);
}
</script>
<style scoped>
.back-link-btn {
  margin-left: 0.5rem;
  text-decoration: none;
}
</style>
