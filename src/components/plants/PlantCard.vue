<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card" v-bind="$attrs" @dblclick="emit('dblclick', plant)">
    <h4 id="p-custom-link">
      <router-link
        :to="{ name: 'PlantEdit', params: { id: `${plant.id}` } }"
      >
        {{ plant.plant_name }}
      </router-link>
    </h4>
    <ul>
      <li class="li-left"><b><u>Garden: 
  <router-link
    v-if="garden?.id"
    :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }"
  >
    {{ garden.name }}
  </router-link>
  <span v-else>{{ garden?.name || 'No Garden Assigned' }}</span>
</u></b></li>
      <li class="li-left"><b>Plant Name: {{ plant.plant_name }}</b></li>
      <li class="li-left"><b>Biological Name: {{ plant.biological_name }}</b></li>
      <li class="li-left"><b>Date Planted: {{ formatYearDate(plant.date_planted) }}</b></li>
      <li class="li-left"><b>Location: {{plant.yard_location }}</b></li>
  <li class="li-left">
    <b><u>Watering: 
      <router-link
        v-if="watering?.id"
        :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
      >
        {{ watering.name }}
      </router-link>
      <span v-else>{{ watering?.name || 'No Watering Assigned' }}</span>
    </u></b>
  </li>
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
        <!--td id="icon-block">
          <router-link :to="{ name: 'PlantDetails', params: { id: `${plant.id}` } }">
            <i
              id="card-medium-block-icon-eye"
              class="fa fa-eye"
            >
            </i>
          </router-link>
        </!--td-->
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
import { computed } from "vue";
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
const props = defineProps({
  plant: {
    type: Object,
    default: () => ({})
  }
});
const store = useStore();
const router = useRouter();
const emit = defineEmits(['dblclick']);

const garden = computed(() => {
  const found = store.state.gardens.find(g => g.id === props.plant.garden_id);
  return found || { id: null, name: 'No Garden Assigned' };
}); 

const watering = computed(() => {
  // First try direct watering_id relationship
  if (props.plant.watering_id) {
    const found = store.state.waterings.find(w => w.id === props.plant.watering_id);
    if (found) return found;
  }
  
  // If no direct relationship, check if watering is nested in garden
  if (props.plant.garden_id) {
    const garden = store.state.gardens.find(g => g.id === props.plant.garden_id);
    if (garden?.waterings?.length) {
      // You might need logic here to determine which watering system
      // For now, let's return the first one or find by some criteria
      const wateringInGarden = garden.waterings.find(w => 
        w.id === props.plant.watering_id || // Specific watering
        w.is_default === true || // Default watering for garden
        garden.waterings[0] // Or just first one
      );
      if (wateringInGarden) return wateringInGarden;
    }
  }
  
  return { id: null, name: 'No Watering Assigned' };
});

async function deletePlant(plant) {
  if (confirm(`Are you sure you want to delete ${plant.plant_name}? It cannot be undone.`)) {
    await store.dispatch("deletePlant", plant);
    router.push({ name: "Plants" });
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
