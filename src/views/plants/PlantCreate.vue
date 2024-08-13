<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Plant to {{ garden.garden_name }} System</h3>
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
          v-model="garden.garden_name"
          label="Garden"
          :readonly="true"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Plant Name"
          v-model="plant.plant_name"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field> 
        <v-text-field label="Location (North, South, Other like 1-A-1 for Vegetable Garden)"
          v-model="plant.yard_location"
          :rules="[requiredYardLocation]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field> 
        <v-text-field label="Water Line"
          v-model="plant.water_line"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>  
        <v-text-field
          v-model="plant.online_link"
          label="Online Link"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
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
        <v-text-field label="Duration" v-model="plant.frequency">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-clock</v-icon>
          </template>
        </v-text-field>
       
        <v-text-field label="Notes" v-model="plant.notes">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>

        <v-btn type="submit" block class="mt-2">Submit</v-btn>
        <!--button type="submit" block class="mt-2">Submit</~button-->
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
export default {
  components: {
  },
  data() {
    return {
      plant: {
        garden_id: "",
        plant_name: "",
        yard_location: "",
        description: "",
        water_line: "",
        online_link: "",
        date_planted: "",
        date_harvested: "",
        duration: "",
        active: true,
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      yard_locations: ["North", "South"],

      ifFormValid: false,
      isYardLocationValid: false,
    };
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      this.plant.garden_id = this.garden.id
      if (this.isFormValid) {
        const plant = {
          ...this.plant,
          //?active: true,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createPlant", plant)) {
          this.$router.push({ name: 'GardenDetails', params: { id: this.garden.id}})
        } else {
          alert("Error adding Plant " + this.plant.plant_name);
        } 
      } 
    },
    requiredYardLocation: function (value) {
      if (value) {
          this.isYardLocationValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isYardLocationValid = false
          return 'Please enter Yard Location';
      }
    },
    checkValidations() {
      if (this.isYardLocationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
      console.log("Check Validations Form Valid? ", this.isFormValid)
    }
  },
};
</script>
<style scoped lang="css">
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 33%;
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
