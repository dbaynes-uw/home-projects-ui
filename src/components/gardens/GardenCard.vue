<template>
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
    <p class="card-section-title">Status:</p>
    <GardenStatusBadge :status="garden.status" />
    <br/>
    
    <p class="card-section-title">Notes:</p>
    <b class="li-left-none">{{ garden.notes }}</b>
    <br/>
    <p class="card-section-title">
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
    <p class="text-link-emphasis card-custom-link">
      <router-link :to="{ name: 'WateringCreate', params: { gardenId: garden.id } }">
        Add Watering to {{ garden.name }}
      </router-link>
    </p>
    <br/>
    <span v-if="garden.plants && garden.plants.length > 0">
      <router-link
        :to="{ name: 'Plants' }"
      >
        <p class="card-section-title">Plants:</p>
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
    <p class="text-link-emphasis card-custom-link">
      <router-link
        :to="buildPlantCreateRoute(garden)"
      >
        Add Plant to {{ garden.name }}
      </router-link>
    </p>
    <br/>
    <div class="action-icons">
      <router-link
        :to="{ name: 'PlantCreate', params: { gardenId: garden.id } }"
        class="action-icon-btn action-icon-add"
        title="Add Plant"
        aria-label="Add Plant"
      >
        <i class="mdi mdi-sprout"></i>
      </router-link>

      <router-link
        :to="{ name: 'GardenEdit', params: { id: garden.id } }"
        class="action-icon-btn action-icon-edit"
        title="Edit Garden"
        aria-label="Edit Garden"
      >
        <i class="fas fa-pencil"></i>
      </router-link>

      <router-link
        :to="{ name: 'GardenDetails', params: { id: garden.id } }"
        class="action-icon-btn action-icon-view"
        title="View Details"
        aria-label="View Details"
      >
        <i class="fas fa-eye"></i>
      </router-link>

      <button
        type="button"
        class="action-icon-btn action-icon-delete"
        title="Delete Garden"
        aria-label="Delete Garden"
        @click="handleDelete"
      >
        <i class="fas fa-delete"></i>
      </button>
    </div>  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import DateFormatService from "@/services/DateFormatService.js";
import GardenStatusBadge from '@/components/gardens/GardenStatusBadge.vue';
const props = defineProps({
  garden: {
    type: Object,
    default: () => ({})
  }
});
const gardenStore = useGardenStore();
const router = useRouter();
const emit = defineEmits(['dblclick']);
async function handleDelete() {
  if (confirm(`Are you sure you want to delete ${props.garden.name}? It cannot be undone.`)) {
    await gardenStore.deleteGarden(props.garden);
    router.push({ name: "Gardens" });
  }
}  
function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
}

function buildPlantCreateRoute(garden) {
  const wateringsSnapshot = (garden?.waterings || []).map(w => ({ id: w.id, name: w.name }))
  return {
    name: 'PlantCreate',
    params: { gardenId: garden.id },
    query: {
      gardenName: garden.name || '',
      gardenWaterings: JSON.stringify(wateringsSnapshot)
    }
  }
}
</script>

