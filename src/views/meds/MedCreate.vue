<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Med to Collection</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-container id="form-container">
        <v-text-field label="Date of Occurrence"
          v-model="med.date_of_occurrence"
          type="datetime-local"
          :rules="[requiredDateOccurrence]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-select
          label="Duration"
          :items="MED_DURATIONS"
          v-model="med.duration"
          :rules="[requiredDuration]"
        >
          <option
            v-for="option in MED_DURATIONS"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === med.duration"
          >
            {{ option }}
          </option>
        </v-select>
        <v-textarea
          label="Circumstances: sugar, sleep, alcohol, etc..."
          v-model="med.circumstances"
          clearable
          >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-textarea>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
import { MED_DURATIONS } from "@/services/constants";
</script>
<script>
export default {
  name: "MedCreate",
  components: {},
  computed: {},
  data() {
    return {
      med: {
        date_of_occurrence: "",
        duration: "",
        circumstances: "",
        created_by: this.$store.state.user.resource_owner.email,
      },
      isFormValid: false,
      isDateOccurrenceValid: false,
      isDurationValid: false,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      if (this.isFormValid) {
        const med = {
          ...this.med,
          id: uuidv4,
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createMed", med)) {
          alert("Med was successfully added for " + med.date_of_occurrence);
          this.$router.push({ name: "MedList" });
        } else {
          alert("Error adding Med Location " + med.title);
        }
      } else {
        alert("Please correct required fields and resubmit");
      }

    },
    requiredDateOccurrence: function (value) {
      if (value) {
          this.isDateOccurrenceValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isDateOccurrenceValid = false
          return 'Please enter Date of Occurrence';
      }
    },
    requiredDuration: function (value) {
      if (value) {
          this.isDurationValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isDurationValid = false
          return 'Please Select Duration';
      }
    },
    checkValidations() {
      if (this.isDateOccurrenceValid && this.isDurationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    }
  },
};
</script>
<style lang="css">
.v-field__clearable {
  padding: 1rem !important;
}
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
