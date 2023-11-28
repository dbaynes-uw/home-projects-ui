<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Edit Golf Round  </h3>
      <h2>Current User: {{ this.$store.state.user.resource_owner.id}}</h2>
      <!--p>Current User: {{ this.user}}</p-->
    </v-card-title>
  </v-card>    
    <!--form class="add-form" @submit.prevent="updateBook"-->
      <GolfInput :golf="golf" />
    <!--form-->
</template>
<script>
//import axios from "axios";
import GolfInput from "@/components/golfs/GolfInput.vue";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
//import DateFormatService from "@/services/DateFormatService.js";
export default {
  props: ["id"],
  components: {
    GolfInput,
    ConfirmDialogue,
  },
  created() {
    //this.user = this.$store.dispatch("fetchUser", this.$store.state.user.resource_owner.id);
  },
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
        created_by: "dbaynes",
      },
      user: null,
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
      api_url: ""
    };
  },
  setup() {},
  methods: {
    //async updateGolf() {
    //  alert("UPDATE@@@@@@@@@")
    //  const ok = await this.$refs.confirmDialogue.show({
    //    title: "Update Golf from List",
    //    message:
    //      "Are you sure you want to update " +
    //      this.golf.title,
    //    okButton: "Update",
    //  });
    //  // If you throw an error, the method will terminate here unless //you surround it wil try/catch
    //  alert("OOOKKKK???????", ok)
    //  if (ok) {
    //    const golf = {
    //      ...this.golf,
    //      updated_by: this.$store.state.created_by,
    //    };
    //    console.log("This api_url: ", this.api_url);
    //    console.log("This golf to PUT: ", this.golf);
    //    const result = await axios.put(
    //        this.api_url + 
    //        this.$route.params.id,
    //      {
    //        course: this.golf.course,
    //        course_location: this.golf.course_location,
    //        date_played: this.golf.date_played,
    //        tees_played: this.golf.tees_played,
    //        par_1_hole: this.golf.par_1_hole,
    //        par_2_hole: this.golf.par_2_hole,
    //        par_3_hole: this.golf.par_3_hole,
    //        par_4_hole: this.golf.par_4_hole,
    //        par_5_hole: this.golf.par_5_hole,
    //        par_6_hole: this.golf.par_6_hole,
    //        par_7_hole: this.golf.par_7_hole,
    //        par_8_hole: this.golf.par_8_hole,
    //        par_9_hole: this.golf.par_9_hole,
    //        par_10_hole: this.golf.par_10_hole,
    //        par_11_hole: this.golf.par_11_hole,
    //        par_12_hole: this.golf.par_12_hole,
    //        par_13_hole: this.golf.par_13_hole,
    //        par_14_hole: this.golf.par_14_hole,
    //        par_15_hole: this.golf.par_15_hole,
    //        par_16_hole: this.golf.par_16_hole,
    //        par_17_hole: this.golf.par_17_hole,
    //        par_18_hole: this.golf.par_18_hole,
    //        score_1_hole: this.golf.score_1_hole,
    //        score_2_hole: this.golf.score_2_hole,
    //        score_3_hole: this.golf.score_3_hole,
    //        score_4_hole: this.golf.score_4_hole,
    //        score_5_hole: this.golf.score_5_hole,
    //        score_6_hole: this.golf.score_6_hole,
    //        score_7_hole: this.golf.score_7_hole,
    //        score_8_hole: this.golf.score_8_hole,
    //        score_9_hole: this.golf.score_9_hole,
    //        score_10_hole: this.golf.score_10_hole,
    //        score_11_hole: this.golf.score_11_hole,
    //        score_12_hole: this.golf.score_12_hole,
    //        score_13_hole: this.golf.score_13_hole,
    //        score_14_hole: this.golf.score_14_hole,
    //        score_15_hole: this.golf.score_15_hole,
    //        score_16_hole: this.golf.score_16_hole,
    //        score_17_hole: this.golf.score_17_hole,
    //        score_18_hole: this.golf.score_18_hole,
    //        putts_1_hole: this.golf.putts_1_hole,
    //        putts_2_hole: this.golf.putts_2_hole,
    //        putts_3_hole: this.golf.putts_3_hole,
    //        putts_4_hole: this.golf.putts_4_hole,
    //        putts_5_hole: this.golf.putts_5_hole,
    //        putts_6_hole: this.golf.putts_6_hole,
    //        putts_7_hole: this.golf.putts_7_hole,
    //        putts_8_hole: this.golf.putts_8_hole,
    //        putts_9_hole: this.golf.putts_9_hole,
    //        putts_10_hole: this.golf.putts_10_hole,
    //        putts_11_hole: this.golf.putts_11_hole,
    //        putts_12_hole: this.golf.putts_12_hole,
    //        putts_13_hole: this.golf.putts_13_hole,
    //        putts_14_hole: this.golf.putts_14_hole,
    //        putts_15_hole: this.golf.putts_15_hole,
    //        putts_16_hole: this.golf.putts_16_hole,
    //        putts_17_hole: this.golf.putts_17_hole,
    //        putts_18_hole: this.golf.putts_18_hole,
    //        penalty_1_hole: this.golf.penalty_1_hole,
    //        penalty_2_hole: this.golf.penalty_2_hole,
    //        penalty_3_hole: this.golf.penalty_3_hole,
    //        penalty_4_hole: this.golf.penalty_4_hole,
    //        penalty_5_hole: this.golf.penalty_5_hole,
    //        penalty_6_hole: this.golf.penalty_6_hole,
    //        penalty_7_hole: this.golf.penalty_7_hole,
    //        penalty_8_hole: this.golf.penalty_8_hole,
    //        penalty_9_hole: this.golf.penalty_9_hole,
    //        penalty_10_hole: this.golf.penalty_10_hole,
    //        penalty_11_hole: this.golf.penalty_11_hole,
    //        penalty_12_hole: this.golf.penalty_12_hole,
    //        penalty_13_hole: this.golf.penalty_13_hole,
    //        penalty_14_hole: this.golf.penalty_14_hole,
    //        penalty_15_hole: this.golf.penalty_15_hole,
    //        penalty_16_hole: this.golf.penalty_16_hole,
    //        penalty_17_hole: this.golf.penalty_17_hole,
    //        penalty_18_hole: this.golf.penalty_18_hole,
    //        players: this.golf.players,
    //        url_to_course: this.golf.url_to_course,
    //        notes: this.golf.notes,
    //        created_by: "dbaynes", 
    //      }
    //    );
    //    if (result.status >= 200) {
    //      alert("Golf has been updated");
    //      this.$router.push({ name: "GolfDetails", params: { id: golf.//id } });
    //    } else {
    //      alert("Update Error Code ", result.status);
    //      console.log("ERROR Result Status: ", result.status);
    //    }
    //  }
    //},
  },
  //formatFullYearDate(value) {
  //  return DateFormatService.formatFullYearDate(value);
  //},
  //calculateFrontPar() {
  //    this.front_nine_par = 0
  //    return this.front_nine_par = this.golf.par_1_hole + 
  //                                 this.golf.par_2_hole +
  //                                 this.golf.par_3_hole +
  //                                 this.golf.par_4_hole +
  //                                 this.golf.par_5_hole +
  //                                 this.golf.par_6_hole +
  //                                 this.golf.par_7_hole +
  //                                 this.golf.par_8_hole +
  //                                 this.golf.par_9_hole +
  //                                 this.golf.par_10_hole +
  //                                 this.golf.par_11_hole +
  //                                 this.golf.par_12_hole +
  //                                 this.golf.par_13_hole +
  //                                 this.golf.par_14_hole +
  //                                 this.golf.par_15_hole +
  //                                 this.golf.par_16_hole +
  //                                 this.golf.par_17_hole +
  //                                 this.golf.par_18_hole 
  //  },
  //  calculateFrontScore() {
  //    this.front_nine_score = 0
  //    return this.front_nine_score = this.golf.score_1_hole + 
  //                                   this.golf.score_2_hole +
  //                                   this.golf.score_3_hole +
  //                                   this.golf.score_4_hole +
  //                                   this.golf.score_5_hole +
  //                                   this.golf.score_6_hole +
  //                                   this.golf.score_7_hole +
  //                                   this.golf.score_8_hole +
  //                                   this.golf.score_9_hole 
  //  },
  //  calculateFrontPutts() {
  //    this.front_nine_putts = 0
  //    return this.front_nine_putts = this.golf.putts_1_hole + 
  //                                   this.golf.putts_2_hole +
  //                                   this.golf.putts_3_hole +
  //                                   this.golf.putts_4_hole +
  //                                   this.golf.putts_5_hole +
  //                                   this.golf.putts_6_hole +
  //                                   this.golf.putts_7_hole +
  //                                   this.golf.putts_8_hole +
  //                                   this.golf.putts_9_hole 
  //  },
  //  calculateFrontPenalty() {
  //    this.front_nine_penalty = 0
  //    return this.front_nine_penalty = this.golf.penalty_1_hole + 
  //                                     this.golf.penalty_2_hole +
  //                                     this.golf.penalty_3_hole +
  //                                     this.golf.penalty_4_hole +
  //                                     this.golf.penalty_5_hole +
  //                                     this.golf.penalty_6_hole +
  //                                     this.golf.penalty_7_hole +
  //                                     this.golf.penalty_8_hole +
  //                                     this.golf.penalty_9_hole 
  //  },   
//
  //golf() {
  //  return this.$store.state.golf;
  //},
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
