<template>
  <ConfirmDialogue ref="confirmDialogue" />
  <div class="edit">
    <h2>Edit Plant {{ plant.plant_name }}{{ garden.name ? ` for ${garden.name}` : '' }}</h2>
    
    <!-- Dynamic back link -->
    <router-link 
      v-if="garden.id" 
      :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }"
    >
      <b>Back to {{ garden.name }}</b>
    </router-link>
    <router-link v-else :to="{ name: 'Plants' }">
      <b>Back to Plants List</b>
    </router-link>
    <br/><br/>
    
    <form class="form-card-display" @submit.prevent="updatePlant">
      <div class="form-container">

        <BaseTextField
          label="Plant Name"
          v-model="plant.plant_name"
          required
        />
        <!-- Garden Selection -->
        <BaseSelect
          v-model="plant.garden_id"
          :items="gardenOptions"
          label="Select Garden"
          hint="Change garden assignment for this plant"
          value-type="number"
          :include-empty-option="true"
          empty-option-label="No Garden (Standalone)"
        />
        
        <!-- Dynamic Watering Selection -->
        <BaseSelect
          v-model="plant.watering_id"
          :items="wateringOptions"
          label="Select Watering System"
          hint="Choose watering system for this plant"
          value-type="number"
          :include-empty-option="true"
          empty-option-label="No Watering System"
        />
        
        <BaseTextField
          label="Biological Name"
          v-model="plant.biological_name"
        />

        <div class="form-field">
          <label class="form-label">Description</label>
          <textarea v-model="plant.description" rows="3" class="form-textarea"></textarea>
        </div>

        <BaseSelect
          label="Status"
          :items="statusOptions"
          v-model="plant.active"
          :include-empty-option="false"
        />

        <BaseTextField
          label="Yard Location"
          v-model="plant.yard_location"
        />

        <BaseTextField
          label="Duration (days)"
          v-model="plant.duration"
          type="number"
        />

        <BaseTextField
          label="Date Planted"
          v-model="plant.date_planted"
          type="date"
        />

        <BaseTextField
          label="Date Harvested"
          v-model="plant.date_harvested"
          type="date"
        />

        <BaseTextField
          label="Reference Link"
          v-model="plant.online_link"
        />

        <div class="form-field">
          <label class="form-label">Notes</label>
          <textarea v-model="plant.notes" rows="3" class="form-textarea"></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <BaseButton variant="primary" type="submit">Update Plant</BaseButton>
          <BaseButton
            variant="secondary"
            @click="router.push({ name: 'PlantDetails', params: { id: plant.id } })"
          >
            Cancel
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextField from '@/components/ui/BaseTextField.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { usePlantStore } from '@/stores/plants/PlantStore';
import { useGardenStore } from '@/stores/gardens/GardenStore';
import { useWateringStore } from '@/stores/waterings/WateringStore';

const { userEmail } = useAuth();
const plantStore = usePlantStore();
const gardenStore = useGardenStore();
const wateringStore = useWateringStore();
const router = useRouter();

const props = defineProps(["id"]);

// Computed properties
const plant = computed(() => plantStore.currentPlant || {});

const garden = computed(() => {
  const targetGardenId = Number(plant.value.garden_id || 0)
  if (targetGardenId) {
    const found = gardenStore.allGardens.find(g => Number(g.id) === targetGardenId);
    return found || { id: null, name: 'Garden not found' };
  }
  return { id: null, name: 'No Garden Assigned' };
});

// Available gardens for selection
const availableGardens = computed(() => {
  return [...gardenStore.allGardens];
});

const gardenOptions = computed(() => {
  return availableGardens.value
    .map(g => ({ value: Number(g?.id), title: g?.name || `Garden ${g?.id || ''}` }))
    .filter(opt => Number.isFinite(opt.value) && opt.value > 0)
})

// Available waterings based on selected garden
const availableWaterings = computed(() => {
  const allWaterings = [];
  const targetGardenId = Number(plant.value.garden_id || 0)
  
  if (targetGardenId) {
    // Use normalized getter (supports both garden_ids and nested gardens).
    const scoped = wateringStore.wateringsForGarden(targetGardenId) || []
    allWaterings.push(...scoped)
  } else {
    // If no garden selected, show all waterings with garden context
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
  }

  const seen = new Set()
  return allWaterings.filter(w => {
    const id = Number(w?.id)
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
});

const wateringOptions = computed(() => {
  return availableWaterings.value
    .map(w => ({ value: Number(w?.id), title: w?.name || `Watering ${w?.id || ''}` }))
    .filter(opt => Number.isFinite(opt.value) && opt.value > 0)
})
const confirmDialogue = ref(null); // Add ref declaration
const active_statuses = ["Active", "Inactive"];
const statusOptions = computed(() => active_statuses.map(status => ({ value: status, title: status })))

// Methods
async function updatePlant() {
  const ok = await confirmDialogue.value.show({
    title: "Update Plant",
    message: `Are you sure you want to update ${plant.value.plant_name}?`,
    okButton: "Update",
  });
  
  if (ok) {
    try {
      const plantData = {
        ...plant.value,
        id: props.id, // ✅ Explicitly set ID from route param
        updated_by: userEmail.value,
        updated_at: new Date().toISOString(), // ✅ Add timestamp
      };
            
      const result = await plantStore.updatePlant(plantData);
      
      if (result) {
        // Navigate based on garden assignment
        if (plantData.garden_id) {
          router.push({ 
            name: "GardenDetails", 
            params: { id: plantData.garden_id } 
          });
        } else {
          router.push({ name: "Plants" });
        }
      } else {
        alert("Plant update failed. Please try again.");
      }
    } catch (error) {
      console.error('Plant update error:', error);
      alert("Plant Update Error: " + error.message);
    }
  }
}
// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      plantStore.fetchPlant(props.id),
      gardenStore.allGardens.length ? Promise.resolve() : gardenStore.fetchGardens(),
      wateringStore.allWaterings.length ? Promise.resolve() : wateringStore.fetchWaterings()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});
</script><style>
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
