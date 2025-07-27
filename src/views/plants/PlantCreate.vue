<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Plant to {{ garden.name }} System</h3>
      Garden Waterings: {{ garden.plants.length }}
    </v-card-title>
    <router-link :to="{ name: 'GardenList' }">
      <b>Back to Gardens</b>
    </router-link>
    <br/><br/>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-container id="form-container">
        <v-text-field
          v-model="garden.name"
          label="Garden"
          :readonly="true"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Plant Name"
          v-model="plant.plant_name"
          :rules="[requiredPlantName]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field> 
        <v-select
          v-model="plant.yard_location"
          :items="yard_locations"
          label="Location (North, South, Other like 1-A-1 for Vegetable Garden)"
          :rules="[requiredYardLocation]"
          clearable
        >
  <template v-slot:prepend-inner>
    <v-icon class="icon-css">mdi-target</v-icon>
  </template>
</v-select>
        <br />
        <v-text-field
          v-model="plant.description"
          label="Description"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>  
        <v-text-field label="Date Planted"
          v-model="plant.date_planted"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Date Harvested"
          v-model="plant.date_harvested"
          type="date"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Frequency" v-model="plant.frequency">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-clock</v-icon>
          </template>
        </v-text-field>
        <v-select
          v-model="plant.watering_id"
          :items="garden.waterings || []"
          item-value="id"
          item-title="name"
          label="Select Waterings for this Plant"
          clearable
        >
  <template v-slot:prepend-inner>
    <v-icon class="icon-css">mdi-water</v-icon>
  </template>
</v-select>
        <v-text-field label="Notes" v-model="plant.notes">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

const store = useStore()
const route = useRoute()
const router = useRouter()

const plant = reactive({
  user_id: store.state.user.resource_owner.id,
  garden_id: route.params.id,
  watering_id: "",
  //watering_ids: [], // For multiple waterings
  id: null,
  plant_name: "",
  yard_location: "",
  description: "",
  online_link: "",
  date_planted: "",
  date_harvested: "",
  duration: "",
  notes: "",
  created_by: computed(() => store.state.user.resource_owner.email),
  frequency: ""
})

const yard_locations = ref(["North", "South"])

const isFormValid = ref(false)
const isPlantNameValid = ref(false)
const isYardLocationValid = ref(false)

const garden = computed(() => store.state.garden)

onMounted(() => {
  store.dispatch("fetchGarden", route.params.id)
})

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

function requiredYardLocation(value) {
  if (value) {
    isYardLocationValid.value = true
    return true
  } else {
    isFormValid.value = false
    isYardLocationValid.value = false
    return 'Please enter Yard Location'
  }
}

function checkValidations() {
  if (isPlantNameValid.value && isYardLocationValid.value) {
    isFormValid.value = true
  } else {
    isFormValid.value = false
  }
}

function onSubmit() {
  checkValidations()
  if (isFormValid.value) {
    const newPlant = {
      ...plant,
      id: uuidv4(),
      garden_id: garden.value.id,
      created_by: store.state.user.resource_owner.email,
    }
    store.dispatch("createPlant", newPlant).then(() => {
      setTimeout(() => {
        router.push({ name: 'GardenDetails', params: { id: garden.value.id } })
      }, 2500)
    }).catch(() => {
      alert("Error adding Plant " + plant.plant_name)
    })
  }
}
</script>