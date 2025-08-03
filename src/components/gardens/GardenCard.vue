<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card" @dblclick="emit('dblclick', garden)">
    <span v-if="$route.name == 'Gardens'">
      <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
        <h4><b>{{garden.name}}</b></h4>
      </router-link>
    </span>
    <span v-else>
      <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
        <h4><b>{{garden.name}}</b></h4>
      </router-link>
    </span>
    <p id="p-custom-left">Notes:</p>
    <b class="li-left-none">{{ garden.notes }}</b>
    <br/>
    <p id="p-custom-left">Waterings:</p>
    <span v-for="watering, wateringIndex in garden.waterings" :key="wateringIndex">
      <ul>
        <li class="li-left-bold">
          <span v-if="watering.start_time && watering.end_time">
            <router-link
              :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
            >
              {{watering.name}} - {{ formatTime(watering.start_time) }} to {{ formatTime(watering.end_time) }}
            </router-link>
          </span>
          <span v-else>
            {{ watering.name }} - As Needed
          </span>
        </li>
      </ul>
    </span>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'WateringCreate', params: { garden_id: `${garden.id}` } }"
        >
          Add Watering for {{ garden.name }}
      </router-link>
    </p>
    <br/>
    <span v-if="garden.plants && garden.plants.length > 0">
      <p id="p-custom-left">Plants:</p>
      <span v-for="(plant, plantIndex) in garden.plants" :key="plantIndex ">
        <ul class="ul-left">
          <li>
            <router-link
              :to="{ name: 'PlantDetails', params: { id: `${plant.id}`} }"
            >
            <b>{{plant.plant_name}}</b>
            </router-link>
          </li>
        </ul>          
      </span>
    </span>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'PlantCreate', params: { id: `${garden.id}` } }"
      >
        Add Plant
      </router-link>
    </p>
    <br/>
      <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'GardenEdit', params: { id: `${garden.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="$route.name == 'Gardens'">
        <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'Gardens' }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteGarden(garden)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
    </div>

  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
defineProps({
  garden: {
    type: Object,
    default: () => ({})
  }
});
const store = useStore();
const router = useRouter();
const emit = defineEmits(['dblclick']);
async function deleteGarden(garden) {
  if (confirm(`Are you sure you want to delete ${garden.name}? It cannot be undone.`)) {
    await store.dispatch("deleteGarden", garden);
    router.push({ name: "GlucoseReadings" });
  }
}  
function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
}
</script>
<style scoped></style>

