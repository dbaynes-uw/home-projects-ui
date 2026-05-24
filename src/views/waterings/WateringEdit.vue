<template>
  <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
  <div class="edit">
    <h2>Edit Watering {{ watering.name }}</h2>
    
    <!-- Only show garden link if gardens exist -->
    <span v-if="watering.gardens && watering.gardens.length > 0">
      <span v-for="g in watering.gardens" :key="g.id">
        <router-link :to="{ name: 'GardenDetails', params: { id: `${g.id}` } }">
          <b>{{ g.name }} Details</b>
        </router-link><br/>
      </span>
    </span>
    <p v-else><b>Garden: Not Assigned</b></p>
    <br/>
    
    <router-link :to="{ name: 'WateringDetails', params: { id: `${watering.id}` } }">
      <b>Watering Details</b>
    </router-link>
    <br/>
    <router-link :to="{ name: 'WateringDetails' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
    
    <form class="form-card-display" @submit.prevent="updateWatering">
      <div class="form-container">

        <v-text-field
          label="Watering Name"
          v-model="watering.name"
        />
        <!-- Add Garden Selection (multi) -->
        <v-select
          v-model="selectedGardenIds"
          :items="gardens"
          item-title="name"
          item-value="id"
          label="Select Gardens (Optional)"
          clearable
          multiple
          outlined
        ></v-select>         
        <!-- Your existing fields -->   
        <v-text-field
          label="Location"
          v-model="watering.location"
        />
        <v-text-field
          label="Line"
          v-model="watering.line"
        />
        <v-text-field
          label="Target"
          v-model="watering.target"
        />
        <v-text-field
          label="Days"
          v-model="watering.days"
        />
        <v-text-field
          label="Duration"
          v-model="watering.duration"
          style="font-weight: bold"
          :hint="calculatedDuration ? `Auto-calculated: ${calculatedDuration}` : 'Set start & end time to auto-calculate'"
          persistent-hint
        />
        <div class="date-field-container">
          <v-text-field
            v-model="displayStartTime"
            type="time"
            label="Start Time"
          >
            <template v-slot:append-inner>
              <v-btn
                v-if="displayStartTime"
                @click="clearStartTime"
                icon="fas fa-close"
                size="small"
                variant="text"
                color="error"
              />
            </template>
          </v-text-field>
        </div>
      
        <div class="date-field-container">
          <v-text-field
            v-model="displayEndTime"
            type="time"
            label="End Time"
          >
            <template v-slot:append-inner>
              <v-btn
                v-if="displayEndTime"
                @click="clearEndTime"
                icon="fas fa-close"
                size="small"
                variant="text"
                color="error"
              />
            </template>
          </v-text-field>
        </div>
        <h3 id="p-custom-left">Last Updated: {{ formatStandardDateTime(watering.updated_at) }}</h3>
        <br/>
        <v-select
          label="Select Status to Change"
          :items="ACTIVE_STATUSES"
          v-model="watering.status"
          variant="outlined"
          class="status-select"
        />
        <br/>
        <label>Notes:</label>
        <textarea
          v-model="watering.notes"
          rows="3"
          cols="40"
          class="textarea-style"
        />
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Submit">
            Update
          </v-btn>
          &nbsp;
          <v-btn 
            color="secondary" 
            @click="watering.id ? 
              _router.push({ name: 'WateringDetails', params: { id: watering.id } }) : 
              _router.push({ name: 'Waterings' })"
            aria-label="Go back"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
      </div>
    </form>
  </div>
</template>
<script setup>
import { VSelect } from 'vuetify/components'
import { ACTIVE_STATUSES } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';

const wateringStore = useWateringStore();
const gardenStore = useGardenStore();
const _router = useRouter();

const props = defineProps(["id"]);
const isMobile = ref(false);
// Refs
const confirmDialogue = ref(null);
//const displayStartTime = ref('');

// Computed
const watering = computed(() => wateringStore.currentWatering || {});
const gardens = computed(() => gardenStore.allGardens);
const selectedGardenIds = ref([]);

// Methods
const displayStartTime = computed({
  get() {
    if (!watering.value.start_time) return '';
    
    // If it's a full datetime, extract just the time part
    if (watering.value.start_time.includes('T')) {
      return watering.value.start_time.split('T')[1].substring(0, 5); // "14:30"
    }
    
    // If it's already in HH:MM format, return as-is
    return watering.value.start_time;
  },
  set(value) {
    // Store the time value back to the watering object
    watering.value.start_time = value;
  }
});

const displayEndTime = computed({
  get() {
    if (!watering.value.end_time) return '';
    
    if (watering.value.end_time.includes('T')) {
      return watering.value.end_time.split('T')[1].substring(0, 5);
    }
    
    return watering.value.end_time;
  },
  set(value) {
    watering.value.end_time = value;
  }
});

function clearStartTime() {
  watering.value.start_time = '';
}

function clearEndTime() {
  watering.value.end_time = '';
}

const calculatedDuration = computed(() => {
  const start = displayStartTime.value;
  const end = displayEndTime.value;
  if (!start || !end) return '';

  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins <= startMins) endMins += 24 * 60; // handle crossing midnight

  const diff = endMins - startMins;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
});

watch(calculatedDuration, (val) => {
  if (val) watering.value.duration = val;
});

function formatStandardDateTime(value) {
  return DateFormatService.formatStandardDateTimejs(value);
}

//function formatFullYearDate(value) {
//  return DateFormatService.formatFullYearDatejs(value);
//}


async function updateWatering() {
  // ✅ ADD CONFIRMATION DIALOG
  const isConfirmed = await confirmDialogue.value.show({
    title: 'Confirm Update',
    message: `Are you sure you want to update '${watering.value.name}'?`,
    okButton: 'Update',
    cancelButton: 'Cancel'
  });

  // ✅ ONLY PROCEED IF CONFIRMED
  if (!isConfirmed) {
    console.log('❌ Update cancelled by user');
    return;
  }

  try {
    console.log('🔄 Updating watering:', watering.value.name);
    
    // Update the watering (include garden_ids from the select)
    const payload = { ...watering.value, garden_ids: selectedGardenIds.value };
    await wateringStore.updateWatering(payload);
    
    // ✅ REFRESH THE LIST DATA
    await wateringStore.fetchWaterings();
         
    // Navigate back
    _router.push({ name: 'WateringDetails', params: { id: watering.value.id } });
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    
    // ✅ OPTIONAL: Show error to user
    await confirmDialogue.value.show({
      title: 'Update Failed',
      message: `Failed to update ${watering.value.name}. Please try again.`,
      okButton: 'OK',
      cancelButton: null // Hide cancel button for error dialog
    });
  }
}
// Lifecycle
onMounted(async () => {
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  await wateringStore.fetchWatering(props.id);
  selectedGardenIds.value = (wateringStore.currentWatering?.gardens || []).map(g => g.id);
  if (!gardenStore.allGardens.length) {
    await gardenStore.fetchGardens();
  }
});
</script>
<style>
</style>
