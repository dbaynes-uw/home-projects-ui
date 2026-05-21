<template>
  <v-container>
    <h1>Add Watering System</h1>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-card-text>
            <router-link :to="{ name: 'Waterings' }">
              <h2><b>Back to Waterings</b></h2>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Existing waterings not yet linked to this garden -->
    <template v-if="props.gardenId">
      <v-row>
        <v-col cols="12">
          <v-text-field
            :model-value="selectedGarden?.name || 'Loading...'"
            label="Garden"
            outlined
            readonly
            aria-label="Garden name"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <label for="existing-watering-select" class="existing-watering-label">Add an Existing Watering</label>
          <select
            id="existing-watering-select"
            v-model="selectedExistingWatering"
            class="existing-watering-select"
            aria-label="Select an existing watering to add to this garden"
          >
            <option value="" disabled>Select a watering to add to this garden</option>
            <option v-for="item in wateringSelectItems" :key="item.value" :value="item.value">
              {{ item.title }}
            </option>
          </select>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            :disabled="!selectedExistingWatering"
            @click="addToGarden()"
            aria-label="Add selected watering to this garden"
          >
            Add to Garden
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-divider class="my-4" />
          <h2>Create a New Watering</h2>
        </v-col>
      </v-row>
    </template>

    <v-form @submit.prevent="createWatering" ref="form">
      <v-row>
        <!-- Garden Selection: shown only when NOT navigating from a garden card -->
        <v-col v-if="!props.gardenId" cols="12">
          <v-select
            v-model="watering.garden_ids"
            :items="gardenStore.allGardens"
            item-title="name"
            item-value="id"
            label="Select Gardens (Optional)"
            outlined
            clearable
            multiple
            aria-label="Select gardens for this watering system"
          ></v-select>
        </v-col>
        <!-- Watering Name Input -->
        <v-col cols="12">
          <v-text-field
            v-model="watering.name"
            :rules="[requiredWateringName]"
            label="Watering Name"
            outlined
            required
            aria-label="Enter the name of the watering system"
          ></v-text-field>
        </v-col>
        
        <!-- Location Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.location"
            label="Location"
            outlined
            aria-label="Enter the location of the watering system"
          ></v-text-field>
        </v-col>
        <!-- Line Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.line"
            label="Line"
            outlined
            aria-label="Enter the line of the watering system"
          ></v-text-field>
        </v-col>
        <!-- Target Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.target"
            label="Target"
            outlined
            aria-label="Enter the target of the watering system"
          ></v-text-field>
        </v-col>
        <!-- Start Time Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.start_time"
            label="Start Time"
            type="time"
            outlined
            aria-label="Enter the start time for the watering system"
          ></v-text-field>
        </v-col>
        <!-- End Time Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.end_time"
            label="End Time"
            type="time"
            outlined
            aria-label="Enter the end time for the watering system"
          ></v-text-field>
        </v-col>
        <!-- Days Input -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="watering.days"
            label="Days (e.g., Mon,Tue,Wed)"
            outlined
            aria-label="Enter the days for the watering system (e.g., Mon,Tue,Wed)"
          ></v-text-field>
        </v-col>
        <!-- Notes Input -->
        <v-col cols="12">
          <v-textarea label="Notes" v-model="watering.notes">
            <template v-slot:prepend-inner>
              <v-icon class="icon-css">mdi-note</v-icon>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
   <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" aria-label="Submit">
            Create
          </v-btn>
          &nbsp;
          <v-btn 
            color="secondary" 
            @click="props.gardenId ? router.push({ name: 'GardenDetails', params: { id: props.gardenId } }) : router.push({ name: 'Waterings' })"
            aria-label="Go back"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';

const router = useRouter();
const vuexStore = useStore();
const wateringStore = useWateringStore();
const gardenStore = useGardenStore();

const props = defineProps({
  gardenId: {
    type: String,
    default: null
  }
});

const watering = ref({
  garden_ids: [],
  name: "",
  location: "",
  target: "",
  line: "",
  start_time: "",
  end_time: "",
  duration: "",
  days: "",
  notes: "",
  created_by: '',
});

const isFormValid = ref(false);
const isWateringNameValid = ref(false);
const selectedExistingWatering = ref("");

const selectedGarden = computed(() =>
  gardenStore.allGardens.find(g => String(g.id) === String(props.gardenId))
);

const wateringsNotInGarden = computed(() => {
  if (!props.gardenId) return [];
  return wateringStore.allWaterings.filter(
    w => !Array.isArray(w.gardens) || !w.gardens.some(g => String(g.id) === String(props.gardenId))
  );
});

const wateringSelectItems = ref([]);

watch(selectedExistingWatering, (newId) => {
  if (!newId) {
    watering.value.name = '';
    watering.value.location = '';
    watering.value.line = '';
    watering.value.target = '';
    watering.value.start_time = '';
    watering.value.end_time = '';
    watering.value.duration = '';
    watering.value.days = '';
    watering.value.notes = '';
    isWateringNameValid.value = false;
    return;
  }
  const found = wateringStore.allWaterings.find(w => w.id === newId);
  if (found) {
    watering.value.name = found.name || '';
    watering.value.location = found.location || '';
    watering.value.line = found.line || '';
    watering.value.target = found.target || '';
    watering.value.start_time = found.start_time || '';
    watering.value.end_time = found.end_time || '';
    watering.value.duration = found.duration || '';
    watering.value.days = found.days || '';
    watering.value.notes = found.notes || '';
    isWateringNameValid.value = true;
  }
});

onMounted(async () => {
  try {
    const fetches = [];
    if (!gardenStore.allGardens.length) {
      fetches.push(gardenStore.fetchGardens());
    }
    fetches.push(wateringStore.fetchWaterings());
    await Promise.all(fetches);
  } catch (e) {
    console.error('WateringCreate: fetch error', e);
  }

  watering.value.created_by = vuexStore.state.user?.resource_owner?.email || '';
  if (props.gardenId) {
    watering.value.garden_ids = [parseInt(props.gardenId)];
    wateringSelectItems.value = wateringStore.allWaterings
      .filter(w => !Array.isArray(w.gardens) || !w.gardens.some(g => String(g.id) === String(props.gardenId)))
      .map(w => ({ title: w.name, value: w.id }));
  }
});

function requiredWateringName(value) {
  if (value) {
    isWateringNameValid.value = true;
    return true;
  } else {
    isFormValid.value = false;
    isWateringNameValid.value = false;
    return 'Please enter Watering Name';
  }
}

function checkValidations() {
  isFormValid.value = isWateringNameValid.value;
}

async function addToGarden() {
  if (!selectedExistingWatering.value) return;
  const existingWatering = wateringStore.allWaterings.find(w => w.id === selectedExistingWatering.value);
  if (!existingWatering) return;
  const existingGardenIds = existingWatering.gardens?.map(g => g.id) || [];
  const updated = {
    ...existingWatering,
    garden_ids: [...existingGardenIds, parseInt(props.gardenId)]
  };
  await wateringStore.updateWatering(updated);
  router.push({ name: 'GardenDetails', params: { id: props.gardenId } });
}

async function createWatering() {
  checkValidations();
  if (!isFormValid.value) {
    alert("Please fill in all required fields.");
    return;
  }

  console.log('createWatering payload:', JSON.stringify(watering.value));
  await wateringStore.createWatering({ ...watering.value });
  if (props.gardenId) {
    router.push({ name: 'GardenDetails', params: { id: props.gardenId } });
  } else {
    router.push({ name: 'Waterings' });
  }
}
</script><style lang="css">

/* Create two equal columns that floats next to each other */
.column {
  float: left;
  /*width: 33%;*/
  padding: 10px;
  /*height: 300px; /* Should be removed. Only for demonstration */
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
.v-icon {
  color: darkslategrey;
  top: -0.2rem;
}
#form-container {
  text-align: left;
  width: 75% !important;
}
[type="checkbox"],
#notes {
  width: 100%;
  height: 4rem;
}
.button {
  margin: 30px;
  background-color: #39495c;
  border-radius: 5px;
  font-size: 18px;
  width: 160px;
  height: 60px;
  color: white;
  padding: 20px;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  text-align: center;
  cursor: pointer;
}
label {
  font-size: 20px;
  margin-bottom: 5px;
}
input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
select {
  border-color: darkgreen;
}
.existing-watering-label {
  display: block;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 6px;
}
.existing-watering-select {
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  cursor: pointer;
}
legend {
  font-size: 28px;
  font-weight: 700;
  margin-top: 20px;
}
.label-visible {
  top: -35px;
  left: 4px;
  visibility: visible;
}
.label-invisible {
  top: -10px;
  left: 4px;
  visibility: hidden;
}
.input-field {
  margin-top: 30px;
  position: relative;
}
.input-field > input {
  width: 100%;
}
.input-field > p {
  position: absolute;
  font-size: 14px;
  transition: 0.3s;
}
</style>
