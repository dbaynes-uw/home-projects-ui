<template>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Add Golf Round View</h3>
    </v-card-title>
    <h4>
      <router-link :to="{ name: 'GolfList' }">Back to Golf List</router-link>
    </h4>
  </v-card>
  <GolfInput :golf="golf" />
</template>
<script>
//import { v4 as uuidv4 } from "uuid";
import GolfInput from "@/components/golfs/GolfInput.vue";
export default {
  components: {
    GolfInput,
  },
  computed: {},
  data() {
    return {
      golf: {
        course: "",
        course_location: "",
        url_to_course: "",
        date_played: null,
        tees_played: null,
        players: "",
        notes: "",
        par_1_hole: null,
        par_2_hole: null,
        par_3_hole: null,
        par_4_hole: null,
        par_5_hole: null,
        par_6_hole: null,
        par_7_hole: null,
        par_8_hole: null,
        par_9_hole: null,
        par_10_hole: null,
        par_11_hole: null,
        par_12_hole: null,
        par_13_hole: null,
        par_14_hole: null,
        par_15_hole: null,
        par_16_hole: null,
        par_17_hole: null,
        par_18_hole: null, 
        score_1_hole: null,
        score_2_hole: null,
        score_3_hole: null,
        score_4_hole: null,
        score_5_hole: null,
        score_6_hole: null,
        score_7_hole: null,
        score_8_hole: null,
        score_9_hole: null,
        score_10_hole: null,
        score_11_hole: null,
        score_12_hole: null,
        score_13_hole: null,
        score_14_hole: null,
        score_15_hole: null,
        score_16_hole: null,
        score_17_hole: null,
        score_18_hole: null,
        putts_1_hole: null,
        putts_2_hole: null,
        putts_3_hole: null,
        putts_4_hole: null,
        putts_5_hole: null,
        putts_6_hole: null,
        putts_7_hole: null,
        putts_8_hole: null,
        putts_9_hole: null,
        putts_10_hole: null,
        putts_11_hole: null,
        putts_12_hole: null,
        putts_13_hole: null,
        putts_14_hole: null,
        putts_15_hole: null,
        putts_16_hole: null,
        putts_17_hole: null,
        putts_18_hole: null,
        penalty_1_hole: null,
        penalty_2_hole: null,
        penalty_3_hole: null,
        penalty_4_hole: null,
        penalty_5_hole: null,
        penalty_6_hole: null,
        penalty_7_hole: null,
        penalty_8_hole: null,
        penalty_9_hole: null,
        penalty_10_hole: null,
        penalty_11_hole: null,
        penalty_12_hole: null,
        penalty_13_hole: null,
        penalty_14_hole: null,
        penalty_15_hole: null,
        penalty_16_hole: null,
        penalty_17_hole: null,
        penalty_18_hole: null,       
        created_by: this.$store.state.user.resource_owner.email,
      },
      tees_played: ["Black", "Blue", "Red", "White"],
      front_nine_par: 0,
      front_nine_score: 0,
      front_nine_putts: 0,
      front_nine_penalty: 0,
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
    //onSubmit() {
    //  //this.checkValidations();
    //  console.log("CREATE@@@@@@@@@")
    //  this.isFormValid = true
    //  console.log("onSubmit - this.isFormValid: ", this.isFormValid)
    //  if (this.isFormValid) {
    //    const golf = {
    //      ...this.golf,
    //      id: uuidv4(),
    //      created_by: this.$store.state.user,
    //    };
    //    if (this.$store.dispatch("createGolf", golf)) {
    //      this.$router.push({ name: "GolfList" });
    //    } else {
    //      alert("Error adding Golf Course Location " + golf.course_location);
    //    }
    //  } else {
    //    alert("Please correct required fields and resubmit");
    //  }
    //},
    //requiredCourse: function (value) {
    //console.log("requiredCourse: - this.isCourseValid: ", this.isCourseValid)
    //console.log("VALUE: ", value)
    //if (value) {
    //    this.isCourseValid = true
    //    return true;
    //} else {
    //    this.isFormValid = false
    //    this.isCourseValid = false
    //    return 'Please enter Course';
    //}
    //},
    //requiredCourseLocation: function (value) {
     // console.log("requiredCourseLocation: - this.isCourseLocationValid: ", this.isCourseLocationValid)
     // console.log("VALUE: ", value)
     // if (value) {
     //     this.isCourseLocationValid = true
     //     return true;
     // } else {
     //     this.isFormValid = false
     //     this.isCourseLocationValid = false
     //     return 'Please enter Course Location';
     // }
    //},
    //checkValidations() {
    //  console.log("checkValidations - this.isFormValid: ", this.isFormValid)
    //  console.log("checkValidations - this.isCourseValid: ", this.isCourseValid)
    //  console.log("checkValidations - this.isCourseLocationValid: ", this.isCourseLocationValid)
//
    //  if (this.isCourseValid && this.isCourseLocationValid) {
    //    this.isFormValid = true
    //  } else {
    //    this.isFormValid = false
    //  }
    //  console.log("checkValidations Exit - this.isFormValid: ", this.isFormValid)
    //  console.log("checkValidations Exit - this.isCourseValid: ", this.isCourseValid)
    //  console.log("checkValidations Exit - this.isCourseLocationValid: ", this.isCourseLocationValid)

    //},
    //calculateFrontPar() {
    //  this.front_nine_par = 0
    //  return this.front_nine_par = this.golf.par_1_hole + 
    //                               this.golf.par_2_hole +
    //                               this.golf.par_3_hole +
    //                               this.golf.par_4_hole +
    //                               this.golf.par_5_hole +
    //                               this.golf.par_6_hole +
    //                               this.golf.par_7_hole +
    //                               this.golf.par_8_hole +
    //                               this.golf.par_9_hole +
    //                               this.golf.par_10_hole +
    //                               this.golf.par_11_hole +
    //                               this.golf.par_12_hole +
    //                               this.golf.par_13_hole +
    //                               this.golf.par_14_hole +
    //                               this.golf.par_15_hole +
    //                               this.golf.par_16_hole +
    //                               this.golf.par_17_hole +
    //                               this.golf.par_18_hole 
    //},
    //calculateFrontScore() {
    //  this.front_nine_score = 0
    //  return this.front_nine_score = this.golf.score_1_hole + 
    //                                 this.golf.score_2_hole +
    //                                 this.golf.score_3_hole +
    //                                 this.golf.score_4_hole +
    //                                 this.golf.score_5_hole +
    //                                 this.golf.score_6_hole +
    //                                 this.golf.score_7_hole +
    //                                 this.golf.score_8_hole +
    //                                 this.golf.score_9_hole 
    //},
    //calculateFrontPutts() {
    //  this.front_nine_putts = 0
    //  return this.front_nine_putts = this.golf.putts_1_hole + 
    //                                 this.golf.putts_2_hole +
    //                                 this.golf.putts_3_hole +
    //                                 this.golf.putts_4_hole +
    //                                 this.golf.putts_5_hole +
    //                                 this.golf.putts_6_hole +
    //                                 this.golf.putts_7_hole +
    //                                 this.golf.putts_8_hole +
    //                                 this.golf.putts_9_hole 
    //},
    //calculateFrontPenalty() {
    //  this.front_nine_penalty = 0
    //  return this.front_nine_penalty = this.golf.penalty_1_hole + 
    //                                   this.golf.penalty_2_hole +
    //                                   this.golf.penalty_3_hole +
    //                                   this.golf.penalty_4_hole +
    //                                   this.golf.penalty_5_hole +
    //                                   this.golf.penalty_6_hole +
    //                                   this.golf.penalty_7_hole +
    //                                   this.golf.penalty_8_hole +
    //                                   this.golf.penalty_9_hole 
    //},   
  //},
  //golf() {
  //  return this.$store.state.golf;
  },
};
</script>
<style lang="css">
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
