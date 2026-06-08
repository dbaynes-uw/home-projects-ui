<template>
  <div>
    <h1>Add Plant{{ garden.id ? ` for ${garden.name}` : '' }}</h1>

    <div class="card">
      <router-link
        v-if="garden.id"
        :to="{ name: 'GardenDetails', params: { id: garden.id } }"
      >
        <h2><b>Back to {{ garden.name }}</b></h2>
      </router-link>
      <router-link v-else :to="{ name: 'Gardens' }">
        <h2><b>Back to Gardens</b></h2>
      </router-link>
    </div>

    <form @submit.prevent="createPlant" class="form-card-display">
      <div class="form-container">
        <BaseSelect
          v-if="!resolvedGardenId"
          v-model="plant.garden_id"
          :items="gardenOptions"
          label="Select Garden (Optional)"
          value-type="number"
          :include-empty-option="true"
          empty-option-label="No Garden (Standalone)"
        />

        <BaseTextField
          v-else
          :model-value="garden.name"
          label="Garden"
          readonly
        />

        <BaseSelect
          v-if="!resolvedWateringId"
          v-model="plant.watering_id"
          :items="wateringOptions"
          label="Select Watering System"
          value-type="number"
          :include-empty-option="true"
          :empty-option-label="wateringNoDataText"
          :error="fetchError"
          required
        />

        <BaseTextField
          v-else
          :model-value="watering.name"
          label="Watering System"
          readonly
        />

        <BaseTextField
          v-model="plant.plant_name"
          label="Plant Name"
          required
        />

        <BaseTextField
          v-model="plant.biological_name"
          label="Biological Name"
        />

        <div class="form-field">
          <label class="form-label">Description</label>
          <textarea v-model="plant.description" class="form-textarea" rows="3"></textarea>
        </div>

        <BaseTextField
          v-model="plant.online_link"
          label="URL to Research"
          type="url"
        />

        <BaseSelect
          v-model="plant.yard_location"
          :items="yardLocationOptions"
          label="Yard Location"
          hint="North, South, or specific location like 1-A-1 for Vegetable Garden"
          :include-empty-option="true"
          empty-option-label="Select Yard Location"
        />

        <BaseTextField
          v-model="plant.date_planted"
          label="Date Planted"
          type="date"
        />

        <BaseTextField
          v-model="plant.date_harvested"
          label="Date Harvested"
          type="date"
        />

        <BaseTextField
          v-model="plant.duration"
          label="Duration (days)"
          type="number"
          min="0"
        />

        <BaseSelect
          v-model="plant.frequency"
          :items="careFrequencyOptions"
          label="Select Frequency of Care"
          :include-empty-option="true"
          empty-option-label="Select Frequency"
        />

        <div class="form-field">
          <label class="form-label">Notes</label>
          <textarea v-model="plant.notes" class="form-textarea" rows="2"></textarea>
        </div>

        <div class="form-actions">
          <BaseButton variant="primary" type="submit">Create Plant</BaseButton>
          <BaseButton
            variant="secondary"
            @click="garden.id ? router.push({ name: 'GardenDetails', params: { id: garden.id } }) : router.push({ name: 'Gardens' })"
          >
            Cancel
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'
import { toRaw } from 'vue';
import { usePlantStore } from '@/stores/plants/PlantStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextField from '@/components/ui/BaseTextField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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
  if (!plant.value.plant_name || !plant.value.watering_id) {
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
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.form-textarea {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 0.6rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>