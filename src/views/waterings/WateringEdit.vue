<template>
  <ConfirmDialogue ref="confirmDialogue"></ConfirmDialogue>
  <div class="edit">
    <h2>Edit Watering {{ watering.name }}</h2>
    
    <!-- Only show garden link if garden exists -->
    <router-link 
      v-if="watering.garden_id"
      :to="{ name: 'GardenDetails', params: { id: `${watering.garden_id}` } }"
    >
      <b>Garden Details</b>
    </router-link>
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
        <!-- Add Garden Selection -->
        <v-select
          v-model="watering.garden_id"
          :items="gardens"
          item-title="name"
          item-value="id"
          label="Select Garden (Optional)"
          clearable
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
                icon="mdi-close"
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
                icon="mdi-close"
                size="small"
                variant="text"
                color="error"
              />
            </template>
          </v-text-field>
        </div>
        <h3 id="p-custom-left">Last Updated: {{ formatStandardDateTime(watering.updated_at) }}</h3>
        <h3 id="p-custom-left">Current Status: {{ watering.status }}</h3>
        <v-select
          label="Select Status to Change"
          :items="ACTIVE_STATUSES"
          v-model="watering.status"
        >
          <option
            v-for="option in ACTIVE_STATUSES"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === watering.status"
          >
            {{ option }}
          </option>
        </v-select>
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
              router.push({ name: 'WateringDetails', params: { id: watering.id } }) : 
              router.push({ name: 'Waterings' })"
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
import { ACTIVE_STATUSES } from "@/services/constants";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const props = defineProps(["id"]);
const isMobile = ref(false);
// Refs
const confirmDialogue = ref(null);
//const displayStartTime = ref('');

// Computed
const watering = computed(() => store.state.watering);
const gardens = computed(() => store.state.gardens);

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

function formatStandardDateTime(value) {
  return DateFormatService.formatStandardDateTimejs(value);
}

//function formatFullYearDate(value) {
//  return DateFormatService.formatFullYearDatejs(value);
//}

async function updateWatering() {
  const ok = await confirmDialogue.value.show({
    title: "Update Watering ",
    message: "Are you sure you want to update " + watering.value.name,
    okButton: "Update",
  });
  
  if (ok) {
    const wateringData = {
      ...watering.value,
      status: watering.value.status,
      updated_at: store.state.created_by,
      updated_by: store.state.created_by,
    };
    
    try {
      const result = await store.dispatch("updateWatering", wateringData);
      if (result) {
        router.push({ name: "WateringDetails" });
      } else {
        console.error('❌ Update failed - no result returned');
        alert("Error in Watering Update");
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      alert("Error in Watering Update: " + error.message);
    }
  }
}// Lifecycle
onMounted(async () => {
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  await store.dispatch("fetchWatering", props.id);
  if (!store.state.gardens.length) {
    await store.dispatch("fetchGardens");
  }
});
</script>
<style>
</style>
