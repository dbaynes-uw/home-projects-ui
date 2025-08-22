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
          <span v-else>{{ garden?.name || 'TBD' }}</span>
        </u></b>
      </li>
      <li class="li-left">
        <b><u>Watering: 
          <router-link
            v-if="watering?.id"
            :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }"
          >
            {{ watering.name }}
          </router-link>
          <span v-else>{{ watering?.name || 'TBD' }}</span>
        </u></b>
      </li>      
      <li class="li-left"><b>Plant Name: {{ plant.plant_name }}</b></li>
      <li class="li-left"><b>Biological Name: {{ plant.biological_name }}</b></li>
      <li class="li-left"><b>Date Planted: {{ formatYearDate(plant.date_planted) }}</b></li>
      <li class="li-left"><b>Location: {{plant.yard_location }}</b></li>
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
    <div class="action-icons">
      <v-tooltip text="Edit Plant" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-pencil"
            size="small"
            color="primary"
            variant="text"
            :to="{ name: 'PlantEdit', params: { id: plant.id } }"
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
            :to="{ name: 'PlantDetails', params: { id: plant.id } }"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Plant" location="top">
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
    </div>  
  </div>
</template>
<script setup>
//let time = null;
import { useStore } from 'vuex';
import { computed } from "vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
const props = defineProps({
  plant: {
    type: Object,
    default: () => ({})
  }
});
const store = useStore();
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

async function handleDelete() {
  const confirmed = confirm(
    `Delete "${props.plant.plant_name}"?\n\n` +
    `This action cannot be undone.`
  );
  
  if (confirmed) {
    try {
      await store.dispatch("deletePlant", props.plant);
      
      // Emit event to parent instead of direct navigation
      emit('delete', props.plant);
      
      // Alternative: Navigate back
      // router.push({ name: "Waterings" });
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete plant. Please try again.');
    }
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
