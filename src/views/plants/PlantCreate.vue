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
  <v-col v-if="!resolvedGardenId" cols="12">
    <BaseNativeSelect
      v-model="plant.garden_id"
      :options="gardenOptions"
      label="Select Garden (Optional)"
      value-type="number"
      :include-empty-option="true"
      empty-option-label="No Garden (Standalone)"
    />
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
  <!-- Watering Selection (only show if no watering pre-selected) -->
  <v-col v-if="!resolvedWateringId" cols="12">
    <BaseNativeSelect
      v-model="plant.watering_id"
      :options="wateringOptions"
      label="Select Watering System"
      value-type="number"
      :include-empty-option="true"
      :empty-option-label="wateringNoDataText"
      :error="fetchError"
      required
    />
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
          <BaseNativeSelect
            v-model="plant.yard_location"
            :options="yardLocationOptions"
            label="Yard Location"
            hint="North, South, or specific location like 1-A-1 for Vegetable Garden"
            :include-empty-option="true"
            empty-option-label="Select Yard Location"
          />
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
        <v-col cols="12">
          <BaseNativeSelect
            v-model="plant.frequency"
            :options="careFrequencyOptions"
            label="Select Frequency of Care"
            :include-empty-option="true"
            empty-option-label="Select Frequency"
          />
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
import { useRoute, useRouter } from 'vue-router'
import { toRaw } from 'vue';
import { usePlantStore } from '@/stores/plants/PlantStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import BaseNativeSelect from '@/components/ui/BaseNativeSelect.vue'

const { userEmail } = useAuth()
const plantStore = usePlantStore();
const gardenStore = useGardenStore();
const wateringStore = useWateringStore();
const route = useRoute()
const router = useRouter()
const fetchError = ref('')

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

const resolvedGardenId = computed(() => {
  return props.gardenId || route.query.gardenId || null
})

const resolvedWateringId = computed(() => {
  return props.wateringId || route.query.wateringId || null
})

// ✅ FIXED - No computed in data
const plant = ref({
  garden_id: resolvedGardenId.value || null,
  watering_id: resolvedWateringId.value || null,
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

const effectiveGardenId = computed(() => {
  return Number(plant.value.garden_id || resolvedGardenId.value || 0)
})

// ✅ FIXED - Added waterings array
const garden = computed(() => {
  if (effectiveGardenId.value) {
    const targetGardenId = effectiveGardenId.value
    const currentGarden = gardenStore.currentGarden
    if (currentGarden && currentGarden.id === targetGardenId) {
      return currentGarden
    }

    const foundGarden = gardenStore.allGardens.find(g => g.id === targetGardenId)
    if (foundGarden) {
      return foundGarden
    }
    
    return {
      id: targetGardenId,
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
  const targetGardenId = effectiveGardenId.value

  if (targetGardenId) {
    return wateringStore.wateringsForGarden(targetGardenId) || []
  }

  const allWaterings = []
  wateringStore.allWaterings.forEach(watering => {
    const hasGardenLinks = (watering.garden_ids || []).length > 0

    if (!hasGardenLinks) {
      allWaterings.push({
        ...watering,
        name: `${watering.name} (Standalone)`
      })
    } else {
      const gardenNames = (watering.gardens || []).map(g => g.name).filter(Boolean)
      const context = gardenNames.length ? ` (${gardenNames.join(', ')})` : ''
      allWaterings.push({
        ...watering,
        name: `${watering.name}${context}`
      })
    }
  })

  const seen = new Set()
  return allWaterings.filter(w => {
    const id = Number(w?.id)
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
})

const gardenOptions = computed(() => {
  return gardenStore.allGardens
    .map(g => ({ value: Number(g?.id), title: g?.name || `Garden ${g?.id || ''}` }))
    .filter(opt => Number.isFinite(opt.value) && opt.value > 0)
})

const wateringOptions = computed(() => {
  return availableWaterings.value
    .map(w => ({
      value: Number(w?.id),
      title: w?.name || `Watering ${w?.id || ''}`
    }))
    .filter(opt => Number.isFinite(opt.value) && opt.value > 0 && opt.title)
})

const watering = computed(() => {
  if (!resolvedWateringId.value) {
    return { id: null, name: 'No Watering Selected' }
  }
  const selectedId = parseInt(resolvedWateringId.value)
  const found = availableWaterings.value.find(w => Number(w.id) === selectedId)
  return found || { id: selectedId, name: 'Selected Watering' }
})

const yard_locations = ref(["North", "South","East", "West"])
const yardLocationOptions = computed(() => {
  return yard_locations.value.map(location => ({
    value: location,
    title: location
  }))
})
const care_frequencies = ref(["Daily", "Weekly", "Monthly"])
const careFrequencyOptions = computed(() => {
  return care_frequencies.value.map(frequency => ({
    value: frequency,
    title: frequency
  }))
})
const isFormValid = ref(false)
const isPlantNameValid = ref(false)
const isWateringValid = ref(false)

const wateringNoDataText = computed(() => {
  if (wateringOptions.value.length > 0) {
    return 'Select a watering system'
  }
  if (effectiveGardenId.value) {
    return `No waterings found for garden ${effectiveGardenId.value}.`
  }
  return 'No watering systems available.'
})

onMounted(async () => {
  fetchError.value = ''
  if (resolvedGardenId.value) {
    try {
      await gardenStore.fetchGarden(resolvedGardenId.value);
      // Keep form model in sync with route-scoped garden create.
      if (!plant.value.garden_id) {
        plant.value.garden_id = Number(resolvedGardenId.value)
      }
    } catch (error) {
      console.error("Error fetching garden:", error);
      fetchError.value = `Garden fetch failed: ${error?.response?.status || error?.message || 'Unknown error'}`
    }
  }
  
  try {
    await Promise.all([
      gardenStore.fetchGardens(),
      wateringStore.fetchWaterings()
    ])
  } catch (error) {
    console.error('PlantCreate fetch failure:', error)
    const details = error?.response?.status || error?.message || 'Unknown error'
    fetchError.value = fetchError.value
      ? `${fetchError.value}; Waterings/Gardens fetch failed: ${details}`
      : `Waterings/Gardens fetch failed: ${details}`
  }
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
    if (resolvedGardenId.value) {
      await gardenStore.fetchGarden(resolvedGardenId.value);
      router.push({ name: 'GardenDetails', params: { id: resolvedGardenId.value } });
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
  if (value) {
    isWateringValid.value = true
    return true
  } else {
    isFormValid.value = false
    isWateringValid.value = false
    return 'Please Select Watering Line'
  }
}

function checkValidations() {
  isWateringValid.value = Boolean(plant.value.watering_id)
  if (isPlantNameValid.value && isWateringValid.value) {
    isFormValid.value = true
  } else {
    isFormValid.value = false
  }
}
</script>

<style scoped>
</style>