<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card-text>
    <span v-if="this.action == 'edit'">
      <h2>Date of Occurrence - {{ med.date_of_occurrence }} </h2>
    </span>
    <!--v-form id="isFormValid"-->
      <v-container id="form-container">
        <v-text-field label="Date Of Occurrence"
          v-model="med.date_of_occurrence"
          :value="this.formatStandardDateTime(med.date_of_occurrence)"
          type="datetime"
        >
          <!--template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </!--template-->
        </v-text-field>
        <v-select
          id="select-box"
          class="text-style"
          label="Duration"
          :items="durations"
          v-model="med.duration"
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
        <v-text-field
          v-model="med.circumstances"
          label="Duration"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-btn type="submit" block class="mt-2" @click="updateMed">Update</v-btn>
      </v-container>
    <!--/v-form-->
  </v-card-text>
</template>
<script>
import axios from "axios";
//import { v4 as uuidv4 } from "uuid";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
export default {
  components: {
    ConfirmDialogue,
  },
  computed: {
  },
  async mounted() {
    console.log("PATHNAME: ", window.location.pathname)
    if (window.location.pathname.includes("/create")) {
      this.action = "create"
    } else {
      this.action = "edit"
      var work_url = ""
      if (window.location.port == "8080") {
        // or: "http://davids-macbook-pro.local:3000/api/v1/";
        work_url = "http://localhost:3000/api/v1/meds/";
      } else {
        work_url =
          "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/meds/";
      }
      console.log("Mounted: ", this.$route.params.id);
      this.api_url = work_url
      const result = await axios.get(this.api_url + this.$route.params.id);
      console.log("Result.Data: ", result.data)
      this.med = result.data;
    }
  },
  
  created () {},
  data() {
    return {
      med: {
        date_of_occurrence: "",
        duration: "",
        circumstances: "",
        created_by: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
      },
      durations: ["Long: > 2mins", "Medium: 1 to 2mins", "Short: < 1min"],
      action: "",
      tees_played: ["Black", "Blue", "Red", "White"],
      toggle1: false,
      toggle2: false,
      toggle3: false,
      isFormValid: false,
      isCourseValid: false,
      isCourseLocationValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {                     
    async updateMed() {
      console.log("UPDATE: ", this.med.date_of_occurrence)
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Med from List",
        message:
          "Are you sure you want to update this recored ",
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless //you surround it wil try/catch
      if (ok) {
        const med = {
          ...this.med,
          updated_by: this.$store.state.user.resource_owner.email ,
        };
        console.log("This api_url: ", this.api_url);
        console.log("This med to PUT: ", med);
        console.log("this.med.date_of_occurrence", this.med.date_of_occurrence)
        //console.log("Formated date: ", this.formatRubyDateTime(this.med.date_of_occurrence))

        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            date_of_occurrence: this.med.date_of_occurrence,
            duration: this.med.duration,
            circumstances: this.med.circumstances,
            updated_by: this.$store.state.user.resource_owner.email, 
          }
        );
        if (result.status >= 200) {
          alert("Med has been updated!!");
          this.$router.push({ name: "MedList" });
        } else {
          alert("Update Error Code ", result.status);
          console.log("ERROR Result Status: ", result.status);
        }
      }
    },
    requiredCourse: function (value) {
      console.log("requiredCourse: - this.isCourseValid: ", this.isCourseValid)
      console.log("VALUE: ", value)
      if (value) {
          this.isCourseValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isCourseValid = false
          return 'Please enter Course';
      }
    },
    requiredCourseLocation: function (value) {
      console.log("requiredCourseLocation: - this.isCourseLocationValid: ", this.isCourseLocationValid)
      console.log("VALUE: ", value)
      if (value) {
          this.isCourseLocationValid = true
          return true;
      } else {
          this.isFormValid = false
          this.isCourseLocationValid = false
          return 'Please enter Course Location';
      }
    },
    checkValidations() {
      if (this.isCourseValid && this.isCourseLocationValid) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },
    formatStandardDateTime(value) {
      return DateFormatService.formatStandardDateTime(value);
    },
  },
};
</script>
<style lang="css">
/*below to remove increment/decrement arrows for type=number*/
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.g-container {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-gap: .5rem;
  background-color: #fff;
}
.width-9 {
  grid-column: span 1;
  width: 2.5rem;
  border-style: solid;
  border-width: thin;
  text-align: center;
}
.g-container div {
  display: flex;
  flex-flow: row nowrap;
}
.container div input {
  flex-grow: 1;
  max-width: 100%;
}
.g-label {
  text-align: center;
  font-size: 1rem;
}
.text-style-select {
  width: 100%;
  background-color: #d3d3d330;
  border-style: groove;
  border-width: .5px;
}
/*.v-text-field input.v-field__input {
  font-size: .6rem !important;
}*/
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
