<template>
  <v-container>
    <h1>Add Plant{{ garden.id ? ` for ${garden.name}` : '' }}</h1>
    <!--<template>
      <! Add this temporarily to see plant fields >
      <li class="li-left"><b>DEBUG - Plant fields: {{ Object.keys(plant) }}</b></li>
      <li class="li-left"><b>DEBUG - Full plant: {{ plant }}</b></li>
    </template-->
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto mt-5">
          <v-card-text>
            <!-- Back button logic -->
            <router-link 
              v-if="garden.id"
              :to="{ name: 'GardenDetails', params: { id: garden.id } }"
            >
              <h2><b>Back to {{ garden.name }}</b></h2>
            </router-link>
            <router-link v-else :to="{ name: 'Gardens' }">
              <h2><b>Back to Gardens</b></h2>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-form @submit.prevent="createPlant" ref="form">
      <v-row>
        <!-- Garden Selection (only show if no garden pre-selected) -->

  <!-- Garden Selection -->
  <v-col v-if="!gardenId" cols="12">
    <v-select
      v-model="plant.garden_id"
      :items="gardenStore.allGardens"
      item-title="name"
      item-value="id"
      label="Select Garden (Optional)"
      outlined
      clearable
    ></v-select>
  </v-col>
  
  <!-- Show selected garden if pre-selected -->
  <v-col v-else cols="12">
    <v-text-field
      v-model="garden.name"
      label="Garden"
      outlined
      readonly
    ></v-text-field>
  </v-col>

  <!-- ✅ ADD WATERING SELECTION LOGIC -->
  <!-- Watering Selection (only show if no watering pre-selected) -->
  <v-col v-if="!wateringId" cols="12">
    <v-select
      v-model="plant.watering_id"
      :items="availableWaterings"
      item-value="id"
      item-title="name"
      label="Select Watering System"
      outlined
      clearable
      :rules="[requiredWatering]"
    >
      <template v-slot:prepend-inner>
        <v-icon>mdi-water</v-icon>
      </template>
    </v-select>
  </v-col>
  
  <!-- Show selected watering if pre-selected -->
  <v-col v-else cols="12">
    <v-text-field
      v-model="watering.name"
      label="Watering System"
      outlined
      readonly
      prepend-inner-icon="fas fa-water"
    ></v-text-field>
  </v-col>
        <!-- Plant Name Input -->
        <v-col cols="12">
          <v-text-field
            v-model="plant.plant_name"
            :rules="[requiredPlantName]"
            label="Plant Name"
            outlined
            required
            aria-label="Enter the name of the plant"
          ></v-text-field>
        </v-col>

        <!-- Biological Name Input -->
        <v-col cols="12">
          <v-text-field
            v-model="plant.biological_name"
            label="Biological Name"
            outlined
            aria-label="Enter the biological/scientific name"
          ></v-text-field>
        </v-col>

        <!-- Description -->
        <v-col cols="12">
          <v-textarea
            v-model="plant.description"
            label="Description"
            rows="3"
            outlined
            aria-label="Enter a description of the plant"
          ></v-textarea>
        </v-col>

        <!-- Research Link -->
        <v-col cols="12">
          <v-text-field
            v-model="plant.online_link"
            label="URL to Research"
            prepend-inner-icon="fas fa-link"
            outlined
            aria-label="Link to plant research"
          ></v-text-field>
        </v-col>

        <!-- Yard Location -->
        <v-col cols="12">
          <v-select
            v-model="plant.yard_location"
            :items="yard_locations"
            label="Yard Location"
            hint="North, South, or specific location like 1-A-1 for Vegetable Garden"
            persistent-hint
            clearable
            outlined
            aria-label="Select yard location for the plant"
          ></v-select>
        </v-col>

        <!-- Date Planted -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="plant.date_planted"
            label="Date Planted"
            type="date"
            outlined
            aria-label="Select the date the plant was planted"
          >
            <template v-slot:prepend-inner>
              <v-icon>mdi-calendar</v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- Date Harvested -->
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="plant.date_harvested"
            label="Date Harvested"
            type="date"
            outlined
            aria-label="Select the date the plant was harvested"
          >
            <template v-slot:prepend-inner>
              <v-icon>mdi-calendar</v-icon>
            </template>
          </v-text-field>
        </v-col>

        <!-- Duration -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plant.duration"
            label="Duration (days)"
            type="number"
            min="0"
            outlined
            aria-label="Duration in days for the plant to mature"
          ></v-text-field>
        </v-col>

        <!-- Frequency -->
        <v-col cols="12" md="6">
          <v-select
            v-model="plant.frequency"
            :items="['Daily', 'Weekly', 'Monthly']"
            label="Frequency of Care"
            outlined
            clearable
            aria-label="Select frequency of care for the plant"
          ></v-select>
        </v-col>

        <!-- Notes -->
        <v-col cols="12">
          <v-textarea
            v-model="plant.notes"
            label="Notes"
            rows="2"
            outlined
            aria-label="Additional notes for the plant"
          ></v-textarea>
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" type="submit" width="auto" aria-label="Create plant">
            Create Plant
          </v-btn>
          &nbsp;
          <v-btn 
            color="secondary" 
            @click="garden.id ? 
              router.push({ name: 'GardenDetails', params: { id: garden.id } }) : 
              router.push({ name: 'Gardens' })"
            aria-label="Cancel and go back"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import { toRaw } from 'vue';
import { usePlantStore } from '@/stores/plants/PlantStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';

const { userEmail } = useAuth()
const plantStore = usePlantStore();
const gardenStore = useGardenStore();
const wateringStore = useWateringStore();
const router = useRouter()

const props = defineProps({
  gardenId: {
    type: String,
    default: null
  },
    wateringId: {
    type: String,
    default: null
  }
});

// ✅ FIXED - No computed in data
const plant = ref({
  garden_id: props.gardenId || null,
  watering_id: props.wateringId || null,
  plant_name: "",
  biological_name: "", // ✅ ADDED
  yard_location: "",
  description: "",
  online_link: "",
  date_planted: "",
  date_harvested: "",
  duration: "",
  notes: "",
  created_by: userEmail.value,
  frequency: ""
})

// ✅ FIXED - Added waterings array
const garden = computed(() => {
  if (props.gardenId) {
    const foundGarden = gardenStore.allGardens.find(g => g.id === parseInt(props.gardenId));
    if (foundGarden) {
      return foundGarden;
    }
    
    if (gardenStore.currentGarden && gardenStore.currentGarden.id === parseInt(props.gardenId)) {
      return gardenStore.currentGarden;
    }
    
    return {
      id: props.gardenId,
      name: 'Loading garden...',
      waterings: []
    };
  }
  return {
    id: null,
    name: 'No Garden Selected',
    waterings: []
  };
});

const availableWaterings = computed(() => {
  if (props.gardenId && garden.value.waterings) {
    return garden.value.waterings;
  } else {
    const allWaterings = [];
    
    gardenStore.allGardens.forEach(g => {
      if (g.waterings && g.waterings.length > 0) {
        g.waterings.forEach(watering => {
          allWaterings.push({
            ...watering,
            name: `${watering.name} (${g.name})`
          });
        });
      }
    });
    
    if (store.state.waterings) {
      wateringStore.allWaterings.forEach(watering => {
        if (!watering.garden_id) {
          allWaterings.push({
            ...watering,
            name: `${watering.name} (Standalone)`
          });
        }
      });
    }
    
    return allWaterings;
  }
});

const yard_locations = ref(["North", "South"])
const isFormValid = ref(false)
const isPlantNameValid = ref(false)
const isWateringValid = ref(false)

onMounted(async () => {
  if (props.gardenId) {
    try {
      await gardenStore.fetchGarden(props.gardenId);
    } catch (error) {
      console.error("Error fetching garden:", error);
    }
  }
  
  await Promise.all([
    gardenStore.allGardens.length ? Promise.resolve() : gardenStore.fetchGardens(),
    wateringStore.allWaterings.length ? Promise.resolve() : wateringStore.fetchWaterings()
  ]);
});

// ✅ FIXED - Safe navigation
async function createPlant() {
  checkValidations()
  if (!isFormValid.value) {
    alert("Please fill in all required fields.");
    return;
  }
  
  try {
    const plantData = {
      ...toRaw(plant.value),
      created_by: userEmail.value,
    };
    
    await plantStore.createPlant(plantData);
    
    // Navigate based on context
    if (props.gardenId) {
      await gardenStore.fetchGarden(props.gardenId);
      router.push({ name: 'GardenDetails', params: { id: props.gardenId } });
    } else if (plant.value.garden_id) {
      await gardenStore.fetchGarden(plant.value.garden_id);
      router.push({ name: 'GardenDetails', params: { id: plant.value.garden_id } });
    } else {
      router.push({ name: 'Plants' });
    }
  } catch (error) {
    console.error('Failed to create plant:', error);
    alert('Failed to create plant. Please try again.');
  }
}

function requiredPlantName(value) {
  if (value) {
    isPlantNameValid.value = true
    return true
  } else {
    isFormValid.value = false
    isPlantNameValid.value = false
    return 'Please enter Plant Name'
  }
}

function requiredWatering(value) {
  if (value >= 0) {
    isWateringValid.value = true
    return true
  } else {
    isFormValid.value = false
    isWateringValid.value = false
    return 'Please Select Watering Line'
  }
}

function checkValidations() {
  if (isPlantNameValid.value && isWateringValid.value) {
    isFormValid.value = true
  } else {
    isFormValid.value = false
  }
}
</script>