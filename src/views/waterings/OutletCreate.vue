<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Outlet to {{ watering.name }} System</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-container id="form-container">
        <v-text-field
          v-model="watering.name"
          label="Name"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Yard Location" v-model="outlet.yard_location">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Faucet Location" v-model="outlet.faucet_location">
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
      outlet: {
        watering_name: "",
        yard_location: "",
        faucet_location: "",
        notes: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      toggle1: false,
      toggle2: false,
      toggle3: false,
      isFormValid: true,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  created() {
    this.$store.dispatch("fetchWateringOnly");
  },
  computed: {
    watering() {
      return this.$store.state.watering_only;
    },
  },
  methods: {
    onSubmit() {
      //this.checkValidations();
      this.outlet.watering_name = this.watering.name
      if (this.isFormValid) {
        const watering = {
          ...this.outlet,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createWateringOutlet", watering)) {
          this.$router.push({ name: "WateringDisplay" });
        } else {
          alert("Error adding Watering System " + watering.name);
        } 
      } else {
        alert("Please correct required fields and resubmit");
      }
    },
    checkValidations() {

      if (this.isNameValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    }
  },
};
</script>
<style lang="css">

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
