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
      <li class="li-left">
        <b>Start: 
          <span 
            :class="{ 'flashing-active': isCurrentlyActive }" 
            style="color: yellow"
          >
            {{ formatTime(watering.start_time) }}
          </span>
        </b>
      </li>
      <li class="li-left"><b>End: {{ formatTime(watering.end_time) }}</b></li>
      <!--li class="li-left"><b>Duration: {{ watering.duration}}</b></li-->
      <!-- ✅ REPLACE LINE 25 WITH CALCULATED DURATION -->
      <li class="li-left">
        <b>Duration: 
          <span :class="{ 'duration-calculated': calculatedDuration !== props.watering.duration }">
             <span style="color: yellow;">{{ calculatedDuration }}</span>
          </span>
        </b>
      </li>
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
      <p id="p-card-left">
        <router-link :to="{ name: 'Plants', query: { wateringId: watering.id } }">
          Plants ({{ plants.length }}):
        </router-link>
      </p>
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
      <p id="p-card-left">No plants assigned to this watering system.</p>
    </span>
    <br/>
      <p id="p-custom-link">
    <!-- ✅ ENHANCED - Pass watering context to plant creation -->
    <router-link
      :to="{ name: 'PlantCreate', query: { wateringId: watering.id } }"
    >
      Add Plant to {{ watering.name }}
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
    <div class="action-icons">
      <v-tooltip text="Edit Watering" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="fas fa-pencil"
            size="small"
            color="primary"
            variant="text"
            :to="{ name: 'WateringEdit', params: { id: watering.id } }"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="View Details" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="fas fa-eye"
            size="small"
            color="brown"
            variant="text"
            :to="{ name: 'WateringDetails', params: { id: watering.id } }"
          />
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Watering" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="fas fa-delete"
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
import { useStore } from 'vuex';
//import { useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from "vue";
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
//const router = useRouter();
const emit = defineEmits(['dblclick', 'delete']);

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
  }
  
  // Method 2: Also check store for plants with matching watering_id
  if (store.state.plants) {
    const storePlants = store.state.plants.filter(p => 
      parseInt(p.watering_id) === parseInt(props.watering.id)
    );
    
    // Merge without duplicates (in case plant exists in both places)
    storePlants.forEach(storePlant => {
      const exists = plantList.find(p => p.id === storePlant.id);
      if (!exists) {
        plantList.push(storePlant);
      }
    });
  }  
  return plantList;
});
// ✅ ADD CURRENT TIME TRACKING
const currentTime = ref(new Date());
let timeInterval = null;

// ✅ COMPUTED TO CHECK IF WATERING IS ACTIVE
const isCurrentlyActive = computed(() => {
  const startTime = props.watering.start_time;
  const endTime = props.watering.end_time;
  
  if (!startTime || !endTime) return false;
  
  try {
    const now = currentTime.value;
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    // For daily recurring times, we need to check today's schedule
    const todayStart = new Date();
    todayStart.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(end.getHours(), end.getMinutes(), end.getSeconds(), 0);
    
    // Handle overnight watering (end time is next day)
    if (todayEnd <= todayStart) {
      todayEnd.setDate(todayEnd.getDate() + 1);
    }
    
    // Check if current time is within the watering window
    return now >= todayStart && now <= todayEnd;
    
  } catch (error) {
    console.warn('Active time calculation error:', error);
    return false;
  }
});
// ✅ ADD COMPUTED DURATION
const calculatedDuration = computed(() => {
  const startTime = props.watering.start_time;
  const endTime = props.watering.end_time;
  
  // Return stored duration if calculation isn't possible
  if (!startTime || !endTime) {
    return props.watering.duration || 'Not set';
  }
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return props.watering.duration || 'Invalid dates';
    }
    
    // Calculate difference in minutes
    const diffMs = end - start;
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    
    // Handle negative duration (end before start)
    if (diffMinutes < 0) {
      return props.watering.duration || 'Invalid range';
    }
    
    // Format duration nicely
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    
  } catch (error) {
    console.warn('Duration calculation error:', error);
    return props.watering.duration || 'Error';
  }
});
async function handleDelete() {
  const confirmed = confirm(
    `Delete "${props.watering.name}"?\n\n` +
    `This will remove the watering system and may affect ${plants.value.length} plant(s).\n\n` +
    `This action cannot be undone.`
  );
  
  if (confirmed) {
    try {
      await store.dispatch("deleteWatering", props.watering);
      
      // Emit event to parent instead of direct navigation
      emit('delete', props.watering);
      
      // Alternative: Navigate back
      // router.push({ name: "Waterings" });
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete watering. Please try again.');
    }
  }
}
function formatTime(value) {
  if (!value) {
    return '';
  }
  return DateFormatService.formatTimejs(value);
}
onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 30000); // Update every minute
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
/* ✅ ADD FLASHING ANIMATION */
.flashing-active {
  animation: flash 1s infinite;
  font-weight: bold;
  color: #00ff00 !important; /* Bright green when active */
}

@keyframes flash {
  0%, 50% { 
    opacity: 1; 
    transform: scale(1);
  }
  25%, 75% { 
    opacity: 0.3; 
    transform: scale(1.1);
  }
}

/* ✅ ALTERNATIVE: PULSING GLOW EFFECT */
.flashing-active-glow {
  animation: pulse-glow 2s infinite;
  color: #00ff00 !important;
  text-shadow: 0 0 5px #00ff00;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 1; 
    text-shadow: 0 0 5px #00ff00;
  }
  50% { 
    opacity: 0.5; 
    text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00;
  }
}

/* ✅ ALTERNATIVE: SUBTLE BLINK */
.flashing-active-blink {
  animation: blink 1.5s infinite;
  color: #ffff00 !important; /* Bright yellow */
  font-weight: bold;
}

@keyframes blink {
  0%, 70% { opacity: 1; }
  85%, 100% { opacity: 0.2; }
}
</style>