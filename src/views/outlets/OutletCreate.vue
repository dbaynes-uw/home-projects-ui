<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Outlet to {{ watering.name }} System</h3>
    </v-card-title>
    <router-link :to="{ name: 'WateringDetails' }">
      <b>Back to Watering List</b>
    </router-link>
    <br/><br/>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-container id="form-container">
        <v-text-field
          v-model="watering.name"
          label="Watering System Name"
          :readonly="true"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Outlet Name" v-model="outlet.outlet_name">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-select
          label="Yard Location"
          :items="yard_locations"
          :rules="[requiredYardLocation]"
          v-model="outlet.yard_location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in yard_locations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.yard_location"
          >
            {{ option }}
          </option>
        </v-select>          
        <v-select
          label="Faucet Location"
          :items="faucet_locations"
          :rules="[requiredFaucetLocation]"
          v-model="outlet.faucet_location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in faucet_locations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.faucet_location"
          >
            {{ option }}
          </option>
        </v-select>   
        <v-select
          label="Line #"
          :items="line_numbers"
          v-model="outlet.line_number"
          :rules="[requiredLineNumber]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in line_number"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.line_number"
          >
            {{ option }}
          </option>
        </v-select>   
        <v-text-field label="Target" v-model="outlet.target">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-target</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Frequency" v-model="outlet.frequency">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-clock</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Start Time" v-model="outlet.start_time" type="time">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Duration" v-model="outlet.duration">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-clock</v-icon>
          </template>
        </v-text-field>
        <v-select
          label="Status"
          :items="active_statuses"
          v-model="outlet.active"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-list-status</v-icon>
          </template>
          <option
            v-for="option in active_statuses"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === outlet.active"
          >
            {{ option }}
          </option>
        </v-select>        
        <v-text-field label="Notes" v-model="outlet.notes">
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
    }
  },
  components: {},
  data() {
    return {
      outlet: {
        outlet_name: "",
        yard_location: "",
        faucet_location: "",
        line_number: "",
        target: "",
        frequency: "",
        start_time: "",
        duration: "",
        active: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      active_statuses: ["Active", "Inactive"],
      yard_locations: ["North", "South"],
      faucet_locations: ["East", "West"],
      line_numbers: ["1","2","3","4"],
      ifFormValid: false,
      isYardLocationValid: false,
      isFaucetLocationValid: false,
      isLineNumberValid: false,
    };
  },
  created() {
    this.$store.dispatch("fetchWatering", this.$route.params.id);
  },
  computed: {
    watering() {
      return this.$store.state.watering;
    },
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      //this.outlet.name = this.watering.name
      this.outlet.name = this.watering.name
      if (this.isFormValid) {
        const outlet = {
          ...this.outlet,
          id: uuidv4(),
          watering_id: this.watering.id,
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createWateringOutlet", outlet)) {
          this.$router.push({ name: "WateringDetails", params: { id: this.watering.id}})
        } else {
          alert("Error adding Outlet System " + outlet.outlet_name);
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
    requiredFaucetLocation: function (value) {
      if (value) {
          this.isFaucetLocationValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isFaucetLocationValid = false
          return 'Please enter Faucet Location';
      }
    },
    requiredLineNumber: function (value) {
      if (value) {
          this.isLineNumberValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isLineNumberValid = false
          return 'Please enter Line Number';
      }
    },
    checkValidations() {

      if (this.isYardLocationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
      if (this.isFaucetLocationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
      if (this.isLineNumberValid) {
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
