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
                
        <v-text-field
          label="Plant Name"
          v-model="plant.plant_name"
          outlined
          required
        />        
        <!-- Garden Selection -->
        <v-select
          v-model="plant.garden_id"
          :items="availableGardens"
          item-value="id"
          item-title="name"
          label="Select Garden"
          outlined
          clearable
          hint="Change garden assignment for this plant"
          persistent-hint
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-sprout</v-icon>
          </template>
        </v-select>
        
        <!-- Dynamic Watering Selection -->
        <v-select
          v-model="plant.watering_id"
          :items="availableWaterings"
          item-value="id"
          item-title="name"
          label="Select Watering System"
          outlined
          clearable
          hint="Choose watering system for this plant"
          persistent-hint
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-water</v-icon>
          </template>
        </v-select>
        
        <v-text-field
          label="Biological Name"
          v-model="plant.biological_name"
          outlined
        />
        
        <v-textarea
          label="Description"
          v-model="plant.description"
          rows="3"
          outlined
        />        
        
        <v-select
          label="Status"
          :items="active_statuses"
          v-model="plant.active"
          outlined
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-list-status</v-icon>
          </template>
        </v-select>        
        
        <v-text-field
          label="Yard Location"
          v-model="plant.yard_location"
          outlined
        />
        
        <v-text-field
          label="Duration (days)"
          v-model="plant.duration"
          type="number"
          outlined
        />
        
        <v-text-field
          label="Date Planted"
          v-model="plant.date_planted"
          type="date"
          outlined
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-calendar</v-icon>
          </template>
        </v-text-field>
        
        <v-text-field
          label="Date Harvested"
          v-model="plant.date_harvested"
          type="date"
          outlined
        >
          <template v-slot:prepend-inner>
            <v-icon>mdi-calendar</v-icon>
          </template>
        </v-text-field>
        
        <v-text-field
          label="Reference Link"
          v-model="plant.online_link"
          outlined
        />           
        
        <v-textarea
          label="Notes"
          v-model="plant.notes"
          rows="3"
          outlined
        />
        
        <!-- Action Buttons -->
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" type="submit" width="auto" style="min-width: 120px;">
              Update Plant
            </v-btn>
            &nbsp;
            <v-btn 
              color="secondary" 
              size="large"
              style="min-width: 100px;"
              :to="{ name: 'PlantDetails', params: { id: plant.id } }"
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
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";

const store = useStore();
const router = useRouter();

const props = defineProps(["id"]);

// Computed properties
const plant = computed(() => store.state.plant);

const garden = computed(() => {
  if (plant.value.garden_id) {
    const found = store.state.gardens.find(g => g.id === plant.value.garden_id);
    return found || { id: null, name: 'Garden not found' };
  }
  return { id: null, name: 'No Garden Assigned' };
});

// Available gardens for selection
const availableGardens = computed(() => {
  return [
    { id: null, name: 'No Garden (Standalone)' },
    ...store.state.gardens
  ];
});

// Available waterings based on selected garden
const availableWaterings = computed(() => {
  const allWaterings = [
    { id: null, name: 'No Watering System' }
  ];
  
  if (plant.value.garden_id) {
    // If garden is selected, show that garden's waterings
    const selectedGarden = store.state.gardens.find(g => g.id === plant.value.garden_id);
    if (selectedGarden?.waterings?.length) {
      allWaterings.push(...selectedGarden.waterings);
    }
  } else {
    // If no garden selected, show all waterings with garden context
    store.state.gardens.forEach(g => {
      if (g.waterings?.length) {
        g.waterings.forEach(watering => {
          allWaterings.push({
            ...watering,
            name: `${watering.name} (${g.name})`
          });
        });
      }
    });
    
    // Add standalone waterings
    if (store.state.waterings) {
      store.state.waterings.forEach(watering => {
        if (!watering.garden_id) {
          allWaterings.push({
            ...watering,
            name: `${watering.name} (Standalone)`
          });
        }
      });
    }
  }
  
  return allWaterings;
});
const confirmDialogue = ref(null); // Add ref declaration
const active_statuses = ["Active", "Inactive"];

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
        updated_by: store.state.user.resource_owner.email,
        updated_at: new Date().toISOString(), // ✅ Add timestamp
      };
            
      const result = await store.dispatch("updatePlant", plantData);
      
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
      store.dispatch("fetchPlant", props.id),
      store.state.gardens.length ? Promise.resolve() : store.dispatch("fetchGardens"),
      store.state.waterings.length ? Promise.resolve() : store.dispatch("fetchWaterings")
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});
</script><style>
select {
  border-color: darkgreen;
}
</style>
