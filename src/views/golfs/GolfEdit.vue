<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h3>Edit Golf Round</h3>
      <router-link :to="{ name: 'GolfList' }">
        <b>Back to Golf Rounds</b>
      </router-link>
    </v-card-title>
  </v-card>  
  <br/>  
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
      <v-text-field
        label="Link to Site"
        v-model="golf.url_to_course"
        type="text"
        :maxlength="urlMaxLength"
      />
      <span>
        {{ urlMaxLength - golf.url_to_course.length }} / {{ urlMaxLength }}
      </span>
      <v-text-field
        label="Date Round Played"
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
      <v-btn type="submit" block class="mt-2" @click="updateGolf">Submit</v-btn>
    </div>
  </v-form>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfCalculations from '@/components/golfs/GolfCalculations.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  id: { type: String, default: '' },
})

const store = useStore()     // still needed for user email (auth lives in Vuex)
const golfStore = useGolfStore()
const confirmDialogue = ref(null)

const urlMaxLength = 255
const color_tees_played = ['Black', 'Blue', 'Red', 'White']

const isFormValid = ref(false)
const isCourseValid = ref(false)
const isCourseLocationValid = ref(false)
const isDatePlayedValid = ref(false)
const isTeesPlayedValid = ref(false)

const golf = reactive({
  course: '',
  course_location: '',
  url_to_course: '',
  date_played: null,
  tees_played: null,
  players: '',
  notes: '',
  par_1_hole: null, par_2_hole: null, par_3_hole: null, par_4_hole: null, par_5_hole: null,
  par_6_hole: null, par_7_hole: null, par_8_hole: null, par_9_hole: null,
  par_10_hole: null, par_11_hole: null, par_12_hole: null, par_13_hole: null, par_14_hole: null,
  par_15_hole: null, par_16_hole: null, par_17_hole: null, par_18_hole: null,
  score_1_hole: null, score_2_hole: null, score_3_hole: null, score_4_hole: null, score_5_hole: null,
  score_6_hole: null, score_7_hole: null, score_8_hole: null, score_9_hole: null,
  score_10_hole: null, score_11_hole: null, score_12_hole: null, score_13_hole: null, score_14_hole: null,
  score_15_hole: null, score_16_hole: null, score_17_hole: null, score_18_hole: null,
  putts_1_hole: null, putts_2_hole: null, putts_3_hole: null, putts_4_hole: null, putts_5_hole: null,
  putts_6_hole: null, putts_7_hole: null, putts_8_hole: null, putts_9_hole: null,
  putts_10_hole: null, putts_11_hole: null, putts_12_hole: null, putts_13_hole: null, putts_14_hole: null,
  putts_15_hole: null, putts_16_hole: null, putts_17_hole: null, putts_18_hole: null,
  penalty_1_hole: null, penalty_2_hole: null, penalty_3_hole: null, penalty_4_hole: null, penalty_5_hole: null,
  penalty_6_hole: null, penalty_7_hole: null, penalty_8_hole: null, penalty_9_hole: null,
  penalty_10_hole: null, penalty_11_hole: null, penalty_12_hole: null, penalty_13_hole: null, penalty_14_hole: null,
  penalty_15_hole: null, penalty_16_hole: null, penalty_17_hole: null, penalty_18_hole: null,
  created_by: '',
})

onMounted(async () => {
  await golfStore.fetchGolf(props.id)
  const loaded = golfStore.currentGolf
  if (loaded) Object.assign(golf, loaded)
})

async function updateGolf() {
  const ok = await confirmDialogue.value.show({
    title: 'Update Golf from List',
    message: 'Are you sure you want to update ' + golf.course,
    okButton: 'Update',
  })
  if (ok) {
    const payload = {
      ...golf,
      updated_by: store.state.user?.resource_owner?.email ?? '',
    }
    const result = await golfStore.updateGolf(payload)
    if (result.success) {
      alert('Golf has been updated!!')
      window.location.reload()
    } else {
      alert('Update error. Please try again.')
    }
  }
}

function requiredCourse(value) {
  if (value) { isCourseValid.value = true; return true }
  isFormValid.value = false; isCourseValid.value = false
  return 'Please enter Course'
}

function requiredCourseLocation(value) {
  if (value) { isCourseLocationValid.value = true; return true }
  isFormValid.value = false; isCourseLocationValid.value = false
  return 'Please enter Course Location'
}

function requiredDatePlayed(value) {
  if (value) { isDatePlayedValid.value = true; return true }
  isFormValid.value = false; isDatePlayedValid.value = false
  return 'Please enter Date Round Played'
}

function requiredTeesPlayed(value) {
  if (value) { isTeesPlayedValid.value = true; return true }
  isFormValid.value = false; isTeesPlayedValid.value = false
  return 'Please enter Tees Played'
}

function calculateFrontPar(g) { return GolfCalculations.calculateFrontPar(g) }
function calculateBackPar(g) { return GolfCalculations.calculateBackPar(g) }
function calculateTotalPar(g) { return GolfCalculations.calculateTotalPar(g) }
function calculateFrontScore(g) { return GolfCalculations.calculateFrontScore(g) }
function calculateBackScore(g) { return GolfCalculations.calculateBackScore(g) }
function calculateTotalScore(g) { return GolfCalculations.calculateTotalScore(g) }
function calculateFrontPutts(g) { return GolfCalculations.calculateFrontPutts(g) }
function calculateBackPutts(g) { return GolfCalculations.calculateBackPutts(g) }
function calculateTotalPutts(g) { return GolfCalculations.calculateTotalPutts(g) }
function calculateFrontPenalty(g) { return GolfCalculations.calculateFrontPenalty(g) }
function calculateBackPenalty(g) { return GolfCalculations.calculateBackPenalty(g) }
function calculateTotalPenalty(g) { return GolfCalculations.calculateTotalPenalty(g) }
</script>
<style>
select {
  border-color: darkgreen;
}
</style>
