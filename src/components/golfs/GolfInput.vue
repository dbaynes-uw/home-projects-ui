<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card-text>
    <span v-if="this.action == 'edit'">
      <h2>{{ golf.course}} on {{ formatStandardDate(golf.date_played) }} </h2>
    </span>
    <v-form id="isFormValid" @submit.prevent="onSubmit">
      <v-container id="form-container">
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
        <br/>
        <br />
        <h3>Totals</h3>
        <h3>Par: {{ calculateTotalPar(golf) }}</h3>
        <h3>Score: {{ calculateTotalScore(golf) }} </h3>
        <h3>Putts: {{ calculateTotalPutts(golf) }} </h3>
        <h3>Penalty: {{ calculateTotalPenalty(golf) }} </h3>
        <br/>
        <br />
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
        <h3>Par:: {{ calculateFrontPar(golf) }}</h3>
        <div class="g-container" @change="calculateFrontPar(golf)">
          <input type="number" @input="() => { if(golf.par_1_hole > 5) { golf.par_1_hole= 0 }}" v-model="golf.par_1_hole" id="par_1_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_2_hole > 5) { golf.par_2_hole= 0 }}" v-model="golf.par_2_hole" id="par_2_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_3_hole > 5) { golf.par_3_hole= 0 }}" v-model="golf.par_3_hole" id="par_3_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_4_hole > 5) { golf.par_4_hole= 0 }}" v-model="golf.par_4_hole" id="par_4_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_5_hole > 5) { golf.par_5_hole= 0 }}" v-model="golf.par_5_hole" id="par_5_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_6_hole > 5) { golf.par_6_hole= 0 }}" v-model="golf.par_6_hole" id="par_6_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_7_hole > 5) { golf.par_7_hole= 0 }}" v-model="golf.par_7_hole" id="par_7_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_8_hole > 5) { golf.par_8_hole= 0 }}" v-model="golf.par_8_hole" id="par_8_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.par_9_hole > 5) { golf.par_9_hole= 0 }}" v-model="golf.par_9_hole" id="par_9_hole" class="width-9"  />
        </div>
        <h3>Score: {{ calculateFrontScore(golf) }}</h3>
        <div class="g-container" @change="calculateFrontScore(golf)">
          <input type="number" @input="() => { if(golf.score_1_hole > 8) { golf.score_1_hole= 0 }}" v-model="golf.score_1_hole" id="par_1_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_2_hole > 8) { golf.score_2_hole= 0 }}" v-model="golf.score_2_hole" id="par_2_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_3_hole > 8) { golf.score_3_hole= 0 }}" v-model="golf.score_3_hole" id="par_3_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_4_hole > 8) { golf.score_4_hole= 0 }}" v-model="golf.score_4_hole" id="par_4_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_5_hole > 8) { golf.score_5_hole= 0 }}" v-model="golf.score_5_hole" id="par_5_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_6_hole > 8) { golf.score_6_hole= 0 }}" v-model="golf.score_6_hole" id="par_6_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_7_hole > 8) { golf.score_7_hole= 0 }}" v-model="golf.score_7_hole" id="par_7_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_8_hole > 8) { golf.score_8_hole= 0 }}" v-model="golf.score_8_hole" id="par_8_hole" class="width-9"  />
          <input type="number" @input="() => { if(golf.score_9_hole > 8) { golf.score_9_hole= 0 }}" v-model="golf.score_9_hole" id="par_9_hole" class="width-9"  />
        </div>
        <h3>Putts {{ calculateFrontPutts(golf) }}</h3>
        <div class="g-container" @change="calculateFrontPutts(golf)">
          <input type="number" @input="() => { if(golf.putts_1_hole > 4) { golf.putts_1_hole= 0 }}" v-model="golf.putts_1_hole" id="putts_1_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_2_hole > 4) { golf.putts_2_hole= 0 }}" v-model="golf.putts_2_hole" id="putts_2_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_3_hole > 4) { golf.putts_3_hole= 0 }}" v-model="golf.putts_3_hole" id="putts_3_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_4_hole > 4) { golf.putts_4_hole= 0 }}" v-model="golf.putts_4_hole" id="putts_4_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_5_hole > 4) { golf.putts_5_hole= 0 }}" v-model="golf.putts_5_hole" id="putts_5_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_6_hole > 4) { golf.putts_6_hole= 0 }}" v-model="golf.putts_6_hole" id="putts_6_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_7_hole > 4) { golf.putts_7_hole= 0 }}" v-model="golf.putts_7_hole" id="putts_7_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_8_hole > 4) { golf.putts_8_hole= 0 }}" v-model="golf.putts_8_hole" id="putts_8_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_9_hole > 4) { golf.putts_9_hole= 0 }}" v-model="golf.putts_9_hole" id="putts_9_hole" class="width-9" />
        </div>
        <h3>Penalties {{ calculateFrontPenalty(golf) }}</h3>
        <div class="g-container" @change="calculateFrontPenalty(golf)">
          <input type="number" @input="() => { if(golf.penalty_1_hole > 4) { golf.penalty_1_hole= 0 }}" v-model="golf.penalty_1_hole" id="penalty_1_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_2_hole > 4) { golf.penalty_2_hole= 0 }}" v-model="golf.penalty_2_hole" id="penalty_2_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_3_hole > 4) { golf.penalty_3_hole= 0 }}" v-model="golf.penalty_3_hole" id="penalty_3_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_4_hole > 4) { golf.penalty_4_hole= 0 }}" v-model="golf.penalty_4_hole" id="penalty_4_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_5_hole > 4) { golf.penalty_5_hole= 0 }}" v-model="golf.penalty_5_hole" id="penalty_5_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_6_hole > 4) { golf.penalty_6_hole= 0 }}" v-model="golf.penalty_6_hole" id="penalty_6_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_7_hole > 4) { golf.penalty_7_hole= 0 }}" v-model="golf.penalty_7_hole" id="penalty_7_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_8_hole > 4) { golf.penalty_8_hole= 0 }}" v-model="golf.penalty_8_hole" id="penalty_8_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_9_hole > 4) { golf.penalty_9_hole= 0 }}" v-model="golf.penalty_9_hole" id="penalty_9_hole" class="width-9" />
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
          <input type="number" @input="() => { if(golf.par_10_hole > 5) { golf.par_10_hole= 0 }}" v-model="golf.par_10_hole" id="par_10_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_11_hole > 5) { golf.par_11_hole= 0 }}" v-model="golf.par_11_hole" id="par_11_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_12_hole > 5) { golf.par_12_hole= 0 }}" v-model="golf.par_12_hole" id="par_12_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_13_hole > 5) { golf.par_13_hole= 0 }}" v-model="golf.par_13_hole" id="par_13_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_14_hole > 5) { golf.par_14_hole= 0 }}" v-model="golf.par_14_hole" id="par_14_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_15_hole > 5) { golf.par_15_hole= 0 }}" v-model="golf.par_15_hole" id="par_15_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_16_hole > 5) { golf.par_16_hole= 0 }}" v-model="golf.par_16_hole" id="par_16_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_17_hole > 5) { golf.par_17_hole= 0 }}" v-model="golf.par_17_hole" id="par_17_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.par_18_hole > 5) { golf.par_18_hole= 0 }}" v-model="golf.par_18_hole" id="par_18_hole" class="width-9" />
        </div>
        <h3>Score: {{ calculateBackScore(golf) }}</h3>
        <div class="g-container" @change="calculateBackScore(golf)">
          <input type="number" @input="() => { if(golf.score_10_hole > 8) { golf.score_10_hole= 0 }}" v-model="golf.score_10_hole" id="score_10_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_11_hole > 8) { golf.score_11_hole= 0 }}" v-model="golf.score_11_hole" id="score_11_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_12_hole > 8) { golf.score_12_hole= 0 }}" v-model="golf.score_12_hole" id="score_12_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_13_hole > 8) { golf.score_13_hole= 0 }}" v-model="golf.score_13_hole" id="score_13_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_14_hole > 8) { golf.score_14_hole= 0 }}" v-model="golf.score_14_hole" id="score_14_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_15_hole > 8) { golf.score_15_hole= 0 }}" v-model="golf.score_15_hole" id="score_15_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_16_hole > 8) { golf.score_16_hole= 0 }}" v-model="golf.score_16_hole" id="score_16_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_17_hole > 8) { golf.score_17_hole= 0 }}" v-model="golf.score_17_hole" id="score_17_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.score_18_hole > 8) { golf.score_18_hole= 0 }}" v-model="golf.score_18_hole" id="score_18_hole" class="width-9" />
        </div>
        <h3>Putts: {{ calculateBackPutts(golf) }}</h3>
        <div class="g-container" @change="calculateBackPutts(golf)">
          <input type="number" @input="() => { if(golf.putts_10_hole > 4) { golf.putts_10_hole= 0 }}" v-model="golf.putts_10_hole" id="score_10_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_11_hole > 4) { golf.putts_11_hole= 0 }}" v-model="golf.putts_11_hole" id="score_11_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_12_hole > 4) { golf.putts_12_hole= 0 }}" v-model="golf.putts_12_hole" id="score_12_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_13_hole > 4) { golf.putts_13_hole= 0 }}" v-model="golf.putts_13_hole" id="score_13_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_14_hole > 4) { golf.putts_14_hole= 0 }}" v-model="golf.putts_14_hole" id="score_14_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_15_hole > 4) { golf.putts_15_hole= 0 }}" v-model="golf.putts_15_hole" id="score_15_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_16_hole > 4) { golf.putts_16_hole= 0 }}" v-model="golf.putts_16_hole" id="score_16_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_17_hole > 4) { golf.putts_17_hole= 0 }}" v-model="golf.putts_17_hole" id="score_17_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.putts_18_hole > 4) { golf.putts_18_hole= 0 }}" v-model="golf.putts_18_hole" id="score_18_hole" class="width-9" />
        </div>
        <h3>Penalties: {{ calculateBackPenalty(golf) }}</h3>
        <div class="g-container" @change="calculateBackPenalty(golf)">
          <input type="number" @input="() => { if(golf.penalty_10_hole > 4) { golf.penalty_10_hole= 0 }}" v-model="golf.penalty_10_hole" id="penalty_10_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_11_hole > 4) { golf.penalty_11_hole= 0 }}" v-model="golf.penalty_11_hole" id="penalty_11_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_12_hole > 4) { golf.penalty_12_hole= 0 }}" v-model="golf.penalty_12_hole" id="penalty_12_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_13_hole > 4) { golf.penalty_13_hole= 0 }}" v-model="golf.penalty_13_hole" id="penalty_13_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_14_hole > 4) { golf.penalty_14_hole= 0 }}" v-model="golf.penalty_14_hole" id="penalty_14_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_15_hole > 4) { golf.penalty_15_hole= 0 }}" v-model="golf.penalty_15_hole" id="penalty_15_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_16_hole > 4) { golf.penalty_16_hole= 0 }}" v-model="golf.penalty_16_hole" id="penalty_16_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_17_hole > 4) { golf.penalty_17_hole= 0 }}" v-model="golf.penalty_17_hole" id="penalty_17_hole" class="width-9" />
          <input type="number" @input="() => { if(golf.penalty_18_hole > 4) { golf.penalty_18_hole= 0 }}" v-model="golf.penalty_18_hole" id="penalty_18_hole" class="width-9" />
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
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-container>
    </v-form>
  </v-card-text>
</template>
<script>
//?import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ConfirmDialogue from "@/components/ConfirmDialogue.vue";
import DateFormatService from "@/services/DateFormatService.js";
import GolfCalculations from "@/components/golfs/GolfCalculations.js";
export default {
  components: {
    ConfirmDialogue
  },
  computed: {
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
        created_by: this.$store.state.user.resource_owner.email,
        updated_by: this.$store.state.user.resource_owner.email,
      },
      action: "",
      color_tees_played: ["Black", "Blue", "Red", "White"],
      toggle1: false,
      toggle2: false,
      toggle3: false,
      isFormValid: false,
      isCourseValid: false,
      isCourseLocationValid: false,
      isDatePlayedValid: false,
      isTeesPlayedValid: false,
      urlMaxLength: 255,
      num: 1,
    };
  },
  methods: {                     
    onSubmit() {
      this.checkValidations();
      //this.isFormValid = true
      if (this.isFormValid) {
        const golf = {
          ...this.golf,
          id: uuidv4(),
          created_by: this.$store.state.user.resource_owner.email, 
        };
        if (this.$store.dispatch("createGolf", golf)) {
          this.$router.push({ name: "GolfList" });
        } else {
          alert("Error adding Golf Course Location " + golf.course_location);
        }
      } else {
        alert("Please correct required fields and resubmit");
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
    formatStandardDate(value) {
      return DateFormatService.formatStandardDatejs(value);
    },
    capitalized(name) {
      const capitalizedFirst = name.toUpperCase();
      const  rest = name.slice(1);
      return capitalizedFirst[0] + rest;
      //WORKS for ALL CAPS: return name.toUpperCase();
    }             
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
