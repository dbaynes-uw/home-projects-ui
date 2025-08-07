<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <span class="h3-left-total-child">Double click Item Below to Edit</span>
  <div class="card" v-bind="$attrs" @dblclick="emit('dblclick', plant)">
    <h4 id="p-custom-link">
      <router-link
        :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
      >
        {{ plant.plant_name }}
      </router-link>
    </h4>
    <ul>
      <li class="li-left"><b>Biological Name: {{ plant.biological_name }}</b></li>
      <li class="li-left"><b>Date Planted: {{ formatYearDate(plant.date_planted) }}</b></li>
      <li class="li-left"><b>Location: {{plant.yard_location }}</b></li>
      <li class="li-left"><b><u>Water Line: 
        <router-link
          :to="{ name: 'WateringDetails', params: { id: `${plant.watering_id}` } }"
        >
          {{ watering.name}}
        </router-link>
         </u></b></li>    
      <span v-if="plant.date_harvest">
        <li class="li-left"><b>Date Harvest: {{ formatYearDate(plant.date_harvest) }}</b></li>
      </span>
      <span v-if="plant.actual_harvest">
        <li class="li-left"><b>Actual Harvest: {{ formatYearDate(plant.date_actual_harvest) }}</b></li>
      </span>
      <li class="li-left"><b><a :href="plant.online_link" target="_blank">Link to Review</a></b></li>
      <span v-if="plant.notes">
        <li class="li-left"><b>Notes: {{ plant.notes }}</b> </li>
      </span>
    </ul>
    <br/>
    <table>
      <thead>
      <tr>
        <td id="icon-block">
          <router-link
            :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
          >
          <i
            id="card-medium-block-icon-edit"
            class="fa-solid fa-pen-to-square fa-stack-1x"
          >
          </i>
        </router-link>
        </td>
        <td id="icon-block">
          <router-link :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }">
            <i
              id="card-medium-block-icon-eye"
              class="fa fa-eye"
            >
            </i>
          </router-link>
        </td>
        <td id="icon-block">
          <span class="fa-table-stack">
            <i
              @click="deletePlant(plant)"
              class="fas fa-trash-alt fa-stack-1x"
              id="card-medium-block-icon-delete"
            >
            </i>
          </span>
        </td>
      </tr>
      </thead>
    </table>
  </div>
</template>
<script setup>
//let time = null;
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
defineProps({
  plant: {
    type: Object,
    default: () => ({})
  },
  watering: {
    type: Object,
    default: () => ({})
  }
});
const store = useStore();
const router = useRouter();
const emit = defineEmits(['dblclick']);

async function deletePlant(plant) {
  if (confirm(`Are you sure you want to delete ${plant.plant_name}? It cannot be undone.`)) {
    await store.dispatch("deletePlant", plant);
    router.push({ name: "PlantList" });
  }
}
function formatYearDate(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatYearDatejs(value);
}
</script>

<style scoped>
</style>
