<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <span class="h3-left-total-child">Double click Item Below to Edit</span>
  <div class="card" v-bind="$attrs" @dblclick="emit('dblclick', watering)">
    <h4>
      <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
        {{ watering.name }} 
        </router-link>
    </h4>
    <ul>
      <li class="li-left"><b>Garden: </b> 
        <router-link :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }">
          <b>{{ garden.name }}</b>
        </router-link>
      </li>
      <li class="li-left"><b>Location: {{ watering.location}}</b></li>
      <li class="li-left"><b>Line: {{ watering.line}}</b></li>
      <li class="li-left"><b>Target: {{ watering.target}}</b></li>
      <li class="li-left"><b>Days: {{ watering.days}}</b></li>
      <li class="li-left"><b>Start: {{ formatTime(watering.start_time) }}</b></li>
      <li class="li-left"><b>End: {{ formatTime(watering.end_time) }}</b></li>
      <li class="li-left"><b>Duration: {{ watering.duration}}</b></li>
      <li class="li-left">
        <b>Status: </b>
        <b :class="{ 'status-red': watering.status && watering.status.toLowerCase() !== 'active' }">
          {{ watering.status }}
        </b>
      </li>
      <li class="li-left">Notes:</li>
        <p class="li-left-none"><b>{{ watering.notes }}</b>
        </p>
    </ul>
    <br/>
    <span v-if="watering.plants && watering.plants.length > 0">
      <p id="p-custom-left">Plants:</p>
      <span v-for="(plant, plantIndex) in watering.plants" :key="plantIndex ">
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
        :to="{ name: 'PlantCreate', params: { id: `${garden.id}` } }"
      >
        Add Plant
      </router-link>
    </p>
    <br/>

    <div id="spread">
      <span class="fa-stack">
        <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
        <i class="fa-solid fa-backward fa-stack-1x"></i>
      </router-link>
      <span class="fa-stack">
        <i @click="deleteWatering(watering)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
//import SplitStringService from "@/services/SplitStringService.js";
//import { useRoute } from 'vue-router'
const props = defineProps({
  watering: {
    type: Object,
    default: () => ({})
  },
});
const store = useStore();
const garden = computed(() => store.state.gardens.find(g => g.id === props.watering.garden_id));
//const plants = computed(() => store.state.plants.filter(p => p.watering_id === props.watering.id));
const router = useRouter();
const emit = defineEmits(['dblclick']);
async function deleteWatering(watering) {
  if (confirm(`Are you sure you want to delete ${watering.name}? It cannot be undone.`)) {
    await store.dispatch("deleteWatering", watering);
    router.push({ name: "WateringList" });
  }
}
function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
}
</script>

<style scoped>
.watering-card {
  width: 100%;
  margin: 1em auto 1em auto;
  padding: 1em;
  border: solid 1px #2c3e50;
  cursor: pointer;
  transition: all 0.2s linear;
}
.watering-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.watering-card h4 {
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.3em;
}
.status-red {
  color: red;
}
</style>
