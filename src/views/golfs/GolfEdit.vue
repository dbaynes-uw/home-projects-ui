<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Edit Golf Round  </h3>
      <h2>Current User: {{ this.$store.state.user.resource_owner.id}}</h2>
      <router-link :to="{ name: 'GolfList' }">
        <b>Back to Golf Rounds</b>
      </router-link>
    </v-card-title>
  </v-card>    
  <v-form class="form-card-display" @submit.prevent="updateGolf">
    <div class="form-container">
      <v-text-field
        v-model="golf.course"
        :rules="[requiredCourse]"
        label="Course Played"
      >
        <template v-slot:prepend-inner>
          <v-icon class="icon-css">mdi-account-circle</v-icon>
        </template>
      </v-text-field>
      <v-text-field
          v-model="golf.course_location"
          :rules="[requiredCourseLocation]"
          label="Course Location"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <label>Reference</label>
        <v-text-field
          v-model="golf.url_to_course"
          type="text"
          :maxlength="urlMaxLength"
          class="text-style"
          placeholder="Link to Site"
        />
        <span>
          {{ urlMaxLength - golf.url_to_course.length }} / {{ urlMaxLength }}
        </span>
        <v-text-field label="Date Round Played"
          v-model="golf.date_played"
          type="date"
          :rules="[requiredDatePlayed]"
        >
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-calendar</v-icon>
          </template>
        </v-text-field>
        <br/>
        <label>Tees Played: &nbsp;&nbsp;</label>
        <v-select
          :items="color_tees_played"
          v-model="golf.tees_played"
          :rules="[requiredTeesPlayed]"
          >
          <option
            v-for="option in color_tees_played"
            :value="option"
            :key="option"
            :selected="option === golf.tees_played"
          >
            {{ option }}
          </option>
        </v-select>    
        <h3>Totals</h3>
        <h3>Par: {{ calculateTotalPar(golf) }}</h3>
        <h3>Score: {{ calculateTotalScore(golf) }} </h3>
        <h3>Putts: {{ calculateTotalPutts(golf) }} </h3>
        <h3>Penalty: {{ calculateTotalPenalty(golf) }} </h3>
        <br/>
        <br/>
        <h3>Front 9</h3>
        <div class="g-container">
          <label class="g-label">1</label>
          <label class="g-label">2</label>
          <label class="g-label">3</label>
          <label class="g-label">4</label>
          <label class="g-label">5</label>
          <label class="g-label">6</label>
          <label class="g-label">7</label>
          <label class="g-label">8</label>
          <label class="g-label">9</label>
        </div>
        <h3>Par: <!-- {{ calculateFrontPar(golf) }}--></h3>
        <div class="g-container" @change="calculateFrontPar(golf)">
          <input type="number" v-model="golf.par_1_hole" id="par_1_hole" class="width-9"  />
          <input type="number" v-model="golf.par_2_hole" id="par_2_hole" class="width-9"  />
          <input type="number" v-model="golf.par_3_hole" id="par_3_hole" class="width-9"  />
          <input type="number" v-model="golf.par_4_hole" id="par_4_hole" class="width-9"  />
          <input type="number" v-model="golf.par_5_hole" id="par_5_hole" class="width-9"  />
          <input type="number" v-model="golf.par_6_hole" id="par_6_hole" class="width-9"  />
          <input type="number" v-model="golf.par_7_hole" id="par_7_hole" class="width-9"  />
          <input type="number" v-model="golf.par_8_hole" id="par_8_hole" class="width-9"  />
          <input type="number" v-model="golf.par_9_hole" id="par_9_hole" class="width-9"  />
        </div>
        <h3><!--Score: {{ calculateFrontScore(golf) }}--></h3>
        <div class="g-container" @change="calculateFrontScore(golf)">
          <input type="number" v-model="golf.score_1_hole" id="par_1_hole" class="width-9"  />
          <input type="number" v-model="golf.score_2_hole" id="par_2_hole" class="width-9"  />
          <input type="number" v-model="golf.score_3_hole" id="par_3_hole" class="width-9"  />
          <input type="number" v-model="golf.score_4_hole" id="par_4_hole" class="width-9"  />
          <input type="number" v-model="golf.score_5_hole" id="par_5_hole" class="width-9"  />
          <input type="number" v-model="golf.score_6_hole" id="par_6_hole" class="width-9"  />
          <input type="number" v-model="golf.score_7_hole" id="par_7_hole" class="width-9"  />
          <input type="number" v-model="golf.score_8_hole" id="par_8_hole" class="width-9"  />
          <input type="number" v-model="golf.score_9_hole" id="par_9_hole" class="width-9"  />
        </div>
        <h3>Putts <!--{{ calculateFrontPutts(golf) }}--></h3>
        <div class="g-container" @change="calculateFrontPutts(golf)">
          <input type="number" v-model="golf.putts_1_hole" id="putts_1_hole" class="width-9" />
          <input type="number" v-model="golf.putts_2_hole" id="putts_2_hole" class="width-9" />
          <input type="number" v-model="golf.putts_3_hole" id="putts_3_hole" class="width-9" />
          <input type="number" v-model="golf.putts_4_hole" id="putts_4_hole" class="width-9" />
          <input type="number" v-model="golf.putts_5_hole" id="putts_5_hole" class="width-9" />
          <input type="number" v-model="golf.putts_6_hole" id="putts_6_hole" class="width-9" />
          <input type="number" v-model="golf.putts_7_hole" id="putts_7_hole" class="width-9" />
          <input type="number" v-model="golf.putts_8_hole" id="putts_8_hole" class="width-9" />
          <input type="number" v-model="golf.putts_9_hole" id="putts_9_hole" class="width-9" />
        </div>
        <h3>Penalties {{ calculateFrontPenalty(golf) }}</h3>
        <div class="g-container" @change="calculateFrontPenalty(golf)">
          <input type="number" v-model="golf.penalty_1_hole" id="penalty_1_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_2_hole" id="penalty_2_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_3_hole" id="penalty_3_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_4_hole" id="penalty_4_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_5_hole" id="penalty_5_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_6_hole" id="penalty_6_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_7_hole" id="penalty_7_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_8_hole" id="penalty_8_hole" class="width-9" />
          <input type="number" v-model="golf.penalty_9_hole" id="penalty_9_hole" class="width-9" />
        </div>
        <h3>Back 9</h3>
        <div class="g-container">
          <label class="g-label">10</label>
          <label class="g-label">11</label>
          <label class="g-label">12</label>
          <label class="g-label">13</label>
          <label class="g-label">14</label>
          <label class="g-label">15</label>
          <label class="g-label">16</label>
          <label class="g-label">17</label>
          <label class="g-label">18</label>
        </div>
        <h3>Par: {{ calculateBackPar(golf)}}</h3>
        <div class="g-container" @change="calculateBackPar(golf)">
          <input type="number" v-model="golf.par_10_hole" id="par_10_hole" class="width-9" />
          <input type="number" v-model="golf.par_11_hole" id="par_11_hole" class="width-9" />
          <input type="number" v-model="golf.par_12_hole" id="par_12_hole" class="width-9" />
          <input type="number" v-model="golf.par_13_hole" id="par_13_hole" class="width-9" />
          <input type="number" v-model="golf.par_14_hole" id="par_14_hole" class="width-9" />
          <input type="number" v-model="golf.par_15_hole" id="par_15_hole" class="width-9" />
          <input type="number" v-model="golf.par_16_hole" id="par_16_hole" class="width-9" />
          <input type="number" v-model="golf.par_17_hole" id="par_17_hole" class="width-9" />
          <input type="number" v-model="golf.par_18_hole" id="par_18_hole" class="width-9" />
        </div>
        <h3>Score: {{ calculateBackScore(golf) }}</h3>
        <div class="g-container" @change="calculateBackScore(golf)">
          <input type="number" v-model="golf.score_10_hole" id="score_10_hole" class="width-9" />
          <input type="number" v-model="golf.score_11_hole" id="score_11_hole" class="width-9" />
          <input type="number" v-model="golf.score_12_hole" id="score_12_hole" class="width-9" />
          <input type="number" v-model="golf.score_13_hole" id="score_13_hole" class="width-9" />
          <input type="number" v-model="golf.score_14_hole" id="score_14_hole" class="width-9" />
          <input type="number" v-model="golf.score_15_hole" id="score_15_hole" class="width-9" />
          <input type="number" v-model="golf.score_16_hole" id="score_16_hole" class="width-9" />
          <input type="number" v-model="golf.score_17_hole" id="score_17_hole" class="width-9" />
          <input type="number" v-model="golf.score_18_hole" id="score_18_hole" class="width-9" />
        </div>
        <h3>Putts: {{ calculateBackPutts(golf) }}</h3>
        <div class="g-container" @change="calculateBackPutts(golf)">
          <input type="number"  v-model="golf.putts_10_hole" id="score_10_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_11_hole" id="score_11_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_12_hole" id="score_12_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_13_hole" id="score_13_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_14_hole" id="score_14_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_15_hole" id="score_15_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_16_hole" id="score_16_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_17_hole" id="score_17_hole" class="width-9" />
          <input type="number"  v-model="golf.putts_18_hole" id="score_18_hole" class="width-9" />
        </div>
        <h3>Penalties: {{ calculateBackPenalty(golf) }}</h3>
        <div class="g-container" @change="calculateBackPenalty(golf)">
          <input type="number"  v-model="golf.penalty_10_hole" id="penalty_10_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_11_hole" id="penalty_11_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_12_hole" id="penalty_12_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_13_hole" id="penalty_13_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_14_hole" id="penalty_14_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_15_hole" id="penalty_15_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_16_hole" id="penalty_16_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_17_hole" id="penalty_17_hole" class="width-9" />
          <input type="number"  v-model="golf.penalty_18_hole" id="penalty_18_hole" class="width-9" />
        </div>        
        <v-text-field label="Players" v-model="golf.players">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-account-circle</v-icon>
          </template>
        </v-text-field>
        <v-text-field label="Notes" v-model="golf.notes">
          <template v-slot:prepend-inner>
            <v-icon class="icon-css">mdi-note</v-icon>
          </template>
        </v-text-field>
        <v-btn type="submit" block class="mt-2" @click="onSubmit">Submit</v-btn>
    </div>
  </v-form>
</template>
<script>
import axios from "axios";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import GolfCalculations from "@/components/golfs/GolfCalculations.js";

export default {
  props: ["id"],
  components: {
    ConfirmDialogue,
  },
  async mounted() {
    var work_url = ""
    if (window.location.port == "8080") {
      // or: "http://davids-macwatering-pro.local:3000/api/v1/";
      work_url = "http://localhost:3000/api/v1/golfs/";
    } else {
      work_url =
        "https://peaceful-waters-05327-b6d1df6b64bb.herokuapp.com/api/v1/golfs/";
    }
    this.api_url = work_url
    const result = await axios.get(this.api_url + +this.$route.params.id);
    this.golf = result.data;
  },
  created() {},
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
      user: null,
      color_tees_played: ["Black", "Blue", "Red", "White"],
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
    async updateGolf() {
      const ok = await this.$refs.confirmDialogue.show({
        title: "Update Golf from List",
        message:
          "Are you sure you want to update " +
          this.golf.course,
        okButton: "Update",
      });
      // If you throw an error, the method will terminate here unless //you surround it wil try/catch
      if (ok) {
        const golf = {
          ...this.golf,
          updated_by: this.$store.state.user.resource_owner.email ,
        };
        const result = await axios.put(
            this.api_url + 
            this.$route.params.id,
          {
            course: golf.course,
            course_location: golf.course_location,
            date_played: golf.date_played,
            tees_played: golf.tees_played,
            par_1_hole: golf.par_1_hole,
            par_2_hole: golf.par_2_hole,
            par_3_hole: golf.par_3_hole,
            par_4_hole: golf.par_4_hole,
            par_5_hole: golf.par_5_hole,
            par_6_hole: golf.par_6_hole,
            par_7_hole: golf.par_7_hole,
            par_8_hole: golf.par_8_hole,
            par_9_hole: golf.par_9_hole,
            par_10_hole: golf.par_10_hole,
            par_11_hole: golf.par_11_hole,
            par_12_hole: golf.par_12_hole,
            par_13_hole: golf.par_13_hole,
            par_14_hole: golf.par_14_hole,
            par_15_hole: golf.par_15_hole,
            par_16_hole: golf.par_16_hole,
            par_17_hole: golf.par_17_hole,
            par_18_hole: golf.par_18_hole,
            score_1_hole: golf.score_1_hole,
            score_2_hole: golf.score_2_hole,
            score_3_hole: golf.score_3_hole,
            score_4_hole: golf.score_4_hole,
            score_5_hole: golf.score_5_hole,
            score_6_hole: golf.score_6_hole,
            score_7_hole: golf.score_7_hole,
            score_8_hole: golf.score_8_hole,
            score_9_hole: golf.score_9_hole,
            score_10_hole: golf.score_10_hole,
            score_11_hole: golf.score_11_hole,
            score_12_hole: golf.score_12_hole,
            score_13_hole: golf.score_13_hole,
            score_14_hole: golf.score_14_hole,
            score_15_hole: golf.score_15_hole,
            score_16_hole: golf.score_16_hole,
            score_17_hole: golf.score_17_hole,
            score_18_hole: golf.score_18_hole,
            putts_1_hole: golf.putts_1_hole,
            putts_2_hole: golf.putts_2_hole,
            putts_3_hole: golf.putts_3_hole,
            putts_4_hole: golf.putts_4_hole,
            putts_5_hole: golf.putts_5_hole,
            putts_6_hole: golf.putts_6_hole,
            putts_7_hole: golf.putts_7_hole,
            putts_8_hole: golf.putts_8_hole,
            putts_9_hole: golf.putts_9_hole,
            putts_10_hole: golf.putts_10_hole,
            putts_11_hole: golf.putts_11_hole,
            putts_12_hole: golf.putts_12_hole,
            putts_13_hole: golf.putts_13_hole,
            putts_14_hole: golf.putts_14_hole,
            putts_15_hole: golf.putts_15_hole,
            putts_16_hole: golf.putts_16_hole,
            putts_17_hole: golf.putts_17_hole,
            putts_18_hole: golf.putts_18_hole,
            penalty_1_hole: golf.penalty_1_hole,
            penalty_2_hole: golf.penalty_2_hole,
            penalty_3_hole: golf.penalty_3_hole,
            penalty_4_hole: golf.penalty_4_hole,
            penalty_5_hole: golf.penalty_5_hole,
            penalty_6_hole: golf.penalty_6_hole,
            penalty_7_hole: golf.penalty_7_hole,
            penalty_8_hole: golf.penalty_8_hole,
            penalty_9_hole: golf.penalty_9_hole,
            penalty_10_hole: golf.penalty_10_hole,
            penalty_11_hole: golf.penalty_11_hole,
            penalty_12_hole: golf.penalty_12_hole,
            penalty_13_hole: golf.penalty_13_hole,
            penalty_14_hole: golf.penalty_14_hole,
            penalty_15_hole: golf.penalty_15_hole,
            penalty_16_hole: golf.penalty_16_hole,
            penalty_17_hole: golf.penalty_17_hole,
            penalty_18_hole: golf.penalty_18_hole,
            players: golf.players,
            url_to_course: golf.url_to_course,
            notes: golf.notes,
            updated_by: this.$store.state.user.resource_owner.email, 
          }
        );
        if (result.status >= 200) {
          alert("Golf has been updated!!");
          this.$router.push({ name: "GolfList" });
          //this.$router.push({ name: "GolfEdit", params: { id: golf.id } });
        } else {
          alert("Update Error Code ", result.status);
        }
      }
    },
    requiredCourse: function (value) {
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
      if (value) {
        this.isCourseLocationValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isCourseLocationValid = false
          return 'Please enter Course Location';
      }
    },
    requiredDatePlayed: function (value) {
      if (value) {
        this.isDatePlayedValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isDatePlayedValid = false
          return 'Please enter Date Round Played';
      }
    },
    requiredTeesPlayed: function (value) {
      if (value) {
        this.isTeesPlayedValid = true
        return true;
      } else {
          this.isFormValid = false
          this.isTeesPlayedValid = false
          return 'Please enter Tees Played';
      }
    },
    checkValidations() {
      if (this.isCourseValid &&
          this.isCourseLocationValid &&
          this.isDatePlayedValid &&
          this.isTeesPlayedValid
        ) 
      {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },
    calculateFrontPar(golf) {
      return GolfCalculations.calculateFrontPar(golf)
    },
    calculateBackPar(golf) {
      return GolfCalculations.calculateBackPar(golf)
    },
    calculateTotalPar(golf) {
      return GolfCalculations.calculateTotalPar(golf)
    },
    calculateFrontScore(golf) {
      return GolfCalculations.calculateFrontScore(golf)
    },
    calculateBackScore(golf) {
      return GolfCalculations.calculateBackScore(golf)
    },
    calculateTotalScore(golf) {
      return GolfCalculations.calculateTotalScore(golf)
    },
    calculateFrontPutts(golf) {
      return GolfCalculations.calculateFrontPutts(golf)
    },
    calculateBackPutts(golf) {
      return GolfCalculations.calculateBackPutts(golf)
    },
    calculateTotalPutts(golf) {
      return GolfCalculations.calculateTotalPutts(golf)
    },
    calculateFrontPenalty(golf) {
      return GolfCalculations.calculateFrontPenalty(golf)
    },
    calculateBackPenalty(golf) {
      return GolfCalculations.calculateBackPenalty(golf)
    },
    calculateTotalPenalty(golf) {
      return GolfCalculations.calculateTotalPenalty(golf)
    },
  }           
};
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
