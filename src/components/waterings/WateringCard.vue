<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <div class="card" v-bind="$attrs" @dblclick="emit('dblclick', watering)">
    <h4>
      <router-link :to="{ name: 'WateringEdit', params: { id: `${watering.id}` } }">
        {{ watering.name }} 
        </router-link>
    </h4>
    <ul>
      <li v-if="watering.garden_id && garden" class="li-left">
        <b>Garden: </b> 
        <router-link :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }">
          <b>{{ garden.name }}</b>
        </router-link>
      </li>
      <li v-else class="li-left">
        <b>Garden: TBD</b>
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
      <li class="li-left"><b>Notes:</b></li>
        <p class="li-left-none"><b>{{ watering.notes }}</b>
        </p>
    </ul>
    <br/>
    <!-- ✅ FIXED - Use computed plants instead of watering.plants -->
    <span v-if="plants && plants.length > 0">
      <p id="p-custom-left">Plants ({{ plants.length }}):</p>
      <span v-for="plant in plants" :key="plant.id">
        <ul>
          <li class="li-left">
            <router-link
              :to="{ name: 'PlantDetails', params: { id: `${plant.id}`} }"
            >
              <b>{{ plant.plant_name }}</b>
            </router-link>
          </li>
        </ul>          
      </span>
    </span>
      <!-- ✅ ENHANCED - Show when no plants -->
    <span v-else>
      <p id="p-custom-left">No plants assigned to this watering system.</p>
    </span>
    <br/>
      <p id="p-custom-link">
    <!-- ✅ ENHANCED - Pass watering context to plant creation -->
    <router-link
      :to="{ name: 'PlantCreate', query: { wateringId: watering.id } }"
    >
      Add Plant to This Watering System
    </router-link>
  </p>
    <p id="p-custom-link">
      <router-link
        :to="{ name: 'PlantCreate' }"
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
const router = useRouter();
const emit = defineEmits(['dblclick']);

const garden = computed(() => {
  if (!props.watering.garden_id) {
    return null;
  }
  return store.state.gardens.find(g => g.id === props.watering.garden_id);
});
const plants = computed(() => {
  let plantList = [];
  
  // Method 1: Check if plants are nested in watering object (from API)
  if (props.watering.plants && Array.isArray(props.watering.plants)) {
    plantList = [...props.watering.plants];
    console.log('🔍 Found plants in watering object:', plantList.length);
  }
  
  // Method 2: Also check store for plants with matching watering_id
  if (store.state.plants) {
    const storePlants = store.state.plants.filter(p => 
      parseInt(p.watering_id) === parseInt(props.watering.id)
    );
    console.log('🔍 Found plants in store:', storePlants.length);
    
    // Merge without duplicates (in case plant exists in both places)
    storePlants.forEach(storePlant => {
      const exists = plantList.find(p => p.id === storePlant.id);
      if (!exists) {
        plantList.push(storePlant);
      }
    });
  }
  
  console.log('🔍 Total plants for watering:', plantList.length);
  return plantList;
});
async function deleteWatering(watering) {
  if (confirm(`Are you sure you want to delete ${watering.name}? It cannot be undone.`)) {
    await store.dispatch("deleteWatering", watering);
    router.push({ name: "Waterings" });
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