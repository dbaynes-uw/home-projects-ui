<template>
  <v-container>
    <h1>Add Watering System for {{ garden.name }}</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mx-auto mt-5">
          <v-card-text>
            <router-link :to="{ name: 'GardenDetails', params: { id: `${garden.id}` } }">
              <h2><b>Back to Garden</b></h2>
            </router-link>
            <router-link :to="{ name: 'Gardens' }">
              <h2><b>Back to Gardens</b></h2>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-form @submit.prevent="createWatering" ref="form">
      <v-row>   
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
          <v-btn color="secondary" :to="{ name: 'WateringDetails' }" aria-label="Go back to the Waterings list">
            Back to Waterings
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script setup>
//import { v4 as uuidv4 } from "uuid";
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
//import { f } from "vue-numeric-input";
const store = useStore();
const router = useRouter();
// Reactive variables for form inputs
const watering = ref({
  garden_id: null,
  name: "",
  location: "",
  target: "",
  line: "",
  start_time: "",
  end_time: "",
  duration: "",
  days: "",
  notes: "",
  created_by: store.state.user.resource_owner.email,
});
const isFormValid = ref(false);
const isWateringNameValid = ref(false);
const garden = computed(() => store.state.garden);

//xonMounted(() => {
//x  store.dispatch("fetchGarden", route.params.id)
//x})
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
  if (isWateringNameValid.value) {
    isFormValid.value = true;
  } else {
    isFormValid.value = false;
  }
}

async function createWatering() {
  checkValidations();
  if (!isFormValid.value) {
    alert("Please fill in all required fields.");
    return;
  }
  const newWatering = {
    ...watering.value,
    //id: uuidv4(),
    //Tgarden_id: garden.value.id,
    created_by: store.state.user.resource_owner.email,
  };
  await store.dispatch("createWatering", newWatering);
  //await store.dispatch("fetchGarden", garden.value.id);
  //router.push({ name: 'GardenDetails', params: { id: garden.value.id } });
  //router.push({ name: 'WateringDetails', params: { id: watering.value.id } });
  router.push({ name: 'Waterings' });
}
</script>
<style lang="css">

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
