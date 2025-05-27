<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Plant to {{ garden.name }} System</h3>
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
        <v-text-field label="Location (North, South, Other like 1-A-1 for Vegetable Garden)"
          v-model="plant.yard_location"
          :rules="[requiredYardLocation]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field> 
        <br />
        <!--v-select
          label="Outlet Name:"
          :items="outletsGroup.outletsGroup"
          v-model="plant.outlet_id"
          :rules="[requiredOutletName]"
        >
          <option
            v-for="option in outletsGroup.outletsGroup"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === plant.outlet_id"
          >
            {{ option }}
          </option>
        </!--v-select>
        <v-text-field--
          v-model="plant.online_link"
          label="Online Link"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-link</v-icon>
          </template>
        </v-text-field-->
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
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {},
  mounted() {},
  data() {
    return {
      plant: {
        //garden_id: "",
        //outlet_id: "",
        plant_name: "",
        //outlet_name: "",
        yard_location: "",
        description: "",
        water_outlet: "",
        online_link: "",
        date_planted: "",
        date_harvested: "",
        duration: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      yard_locations: ["North", "South"],

      ifFormValid: false,
      isPlantNameValid: false,
      isOutletNameValid: false,
      isYardLocationValid: false,
    };
  },
  created() {
    this.$store.dispatch("fetchGarden", this.$route.params.id);
    //this.$store.dispatch("fetchOutletsDisplayGroup");
  },
  computed: {
    garden() {
      return this.$store.state.garden;
    },
    //outletsGroup() {
    //  return this.$store.state.outlets_group;
    //},
  },
  methods: {
    onSubmit() {
      //this.checkValidations();
      if (this.isFormValid) {
        const plant = {
          ...this.plant,
          id: uuidv4(),
          garden_id: this.garden.id,
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createPlant", plant)) {
          setTimeout(() => {
            this.$router.push({ name: 'GardenDetails', params: { id: this.garden.id}})
          }, 2500) 
        } else {
          alert("Error adding Plant " + this.plant.plant_name);
        } 
      } 
    },
    requiredPlantName: function (value) {
      if (value) {
          this.isPlantNameValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isPlantNameValid = false
          return 'Please enter Plant Name';
      }
    },
    //requiredOutletName: function (value) {
    //  if (value) {
    //      this.isOutletNameValid = true
    //      return true;
    //  } else {
    //      this.isFormValid = false
    //      this.isOutletNameValid = false
    //      return 'Please enter Outlet tName';
    //  }
    //},
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
      if (this.isPlantNameValid && this.isOutletNameValid && this.isYardLocationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
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
