<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Med to Collection</h3>
    </v-card-title>
  </v-card>
  <v-card-text>
    <v-form id="isFormValid">
      <v-container id="form-container">
        <v-text-field label="Date of Occurrence"
          v-model="med.date_of_occurrence"
          type="datetime-local"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <v-select
          id="select-box"
          class="text-style"
          label="Duration"
          :items="durations"
          v-model="med.duration"
          required
        >
          <option
            v-for="option in durations"
            :value="option"
            :key="option"
            id="select-box"
            :selected="option === med.duration"
          >
            {{ option }}
          </option>
        </v-select>
        <v-text-field label="Circumstances: sugar, sleep, alcohol, etc..." v-model="med.circumstances">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
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
      med: {
        date_of_occurrence: null,
        duration: "",
        circumstance: null,
        created_by: this.$store.state.user.resource_owner.email,
      },
      durations: ["Long: > 2mins", "Medium: 1 to 2mins", "Short: < 1min"],
      toggle1: false,
      toggle2: false,
      toggle3: false,
      isFormValid: false,
      isAuthorValid: false,
      isTitleValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {
    onSubmit() {
      this.checkValidations();
      console.log("onSubmit - this.isFormValid: ", this.isFormValid)
      if (this.isFormValid) {
        const med = {
          ...this.med,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email,
        };
        if (this.$store.dispatch("createMed", med)) {
          this.$router.push({ name: "MedList" });
        } else {
          alert("Error adding Med Location " + med.title);
        }
      } else {
        alert("Please correct required fields and resubmit");
      }
    },
    requiredAuthor: function (value) {
      console.log("requiredAuthor: - this.isAuthorValid: ", this.isAuthorValid)
      console.log("VALUE: ", value)
      if (value) {
          this.isAuthorValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isAuthorValid = false
          return 'Please enter Author';
      }
    },
    requiredTitle: function (value) {
      console.log("requiredTitle: - this.isTitleValid: ", this.isTitleValid)
      console.log("VALUE: ", value)
      if (value) {
          this.isTitleValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isTitleValid = false
          return 'Please enter Title';
      }
    },
    checkValidations() {
      console.log("checkValidations - this.isFormValid: ", this.isFormValid)
      console.log("checkValidations - this.isAuthorValid: ", this.isAuthorValid)
      console.log("checkValidations - this.isTitleValid: ", this.isTitleValid)

      if (this.isAuthorValid && this.isTitleValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
      console.log("checkValidations Exit - this.isFormValid: ", this.isFormValid)
      console.log("checkValidations Exit - this.isAuthorValid: ", this.isAuthorValid)
      console.log("checkValidations Exit - this.isTitleValid: ", this.isTitleValid)

    }
  },
  med() {
    return this.$store.state.med;
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
