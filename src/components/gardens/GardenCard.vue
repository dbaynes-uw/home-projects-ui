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
    <p id="p-card-left">Notes:</p>
    <b class="li-left-none">{{ garden.notes }}</b>
    <br/>
    <p id="p-card-left">
      <router-link :to="{ name: 'Waterings' }" >
        Waterings:
      </router-link>
    </p>
    <span v-for="watering, wateringIndex in garden.waterings" :key="wateringIndex">
     <ul>
        <li class="li-left">
          <span v-if="watering.start_time && watering.end_time">
            <router-link
              :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
            >
              <b>{{watering.name}} - {{ formatTime(watering.start_time) }} to {{ formatTime(watering.end_time) }} - {{ watering.days }}</b>
            </router-link>
          </span>
          <span v-else>
            <router-link
              :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
            >
              <b>{{ watering.name }} - As Needed</b>
            </router-link>
          </span>
        </li>
      </ul>
    </span>
    <p id="p-custom-link">
      <router-link :to="{ name: 'WateringCreate', params: { gardenId: garden.id } }">
        Add Watering to {{ garden.name }}
      </router-link>
    </p>
    <span v-if="garden.plants && garden.plants.length > 0">
      <router-link
        :to="{ name: 'Plants' }"
      >
        <p id="p-card-left">Plants:</p>
      </router-link>

      <span v-for="(plant, plantIndex) in garden.plants" :key="plantIndex ">
        <ul>
          <li class="li-left">
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
        :to="{ name: 'PlantCreate', params: { gardenId: garden.id } }"
      >
        Add Plant to {{ garden.name }}
      </router-link>
    </p>
    <br/>
    <div class="action-icons">
      <v-tooltip text="Edit Garden" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-pencil"
            size="small"
            color="primary"
            variant="text"
            :to="{ name: 'GardenEdit', params: { id: garden.id } }"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="View Details" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-eye"
            size="small"
            color="brown"
            variant="text"
            :to="{ name: 'GardenDetails', params: { id: garden.id } }"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Garden" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="handleDelete"
          />
        </template>
      </v-tooltip>
    </div>  </div>
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
async function handleDelete(garden) {
  if (confirm(`Are you sure you want to delete ${garden.name}? It cannot be undone.`)) {
    await store.dispatch("deleteGarden", garden);
    router.push({ name: "Gardens" });
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

