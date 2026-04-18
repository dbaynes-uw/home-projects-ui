<template>
  <ConfirmDialogue ref="confirmDialogue" />

  <div class="page-wrapper">
    <div class="golf-edit-container">

      <!-- ✅ HEADER CARD -->
      <v-card class="mx-auto mt-5">
        <v-card-title class="pb-0">
          <h3>⛳ Edit Golf Round</h3>
        </v-card-title>
        <v-card-text>
          <div class="navigation-flex">
            <v-btn variant="outlined" :to="{ name: 'GolfList' }" prepend-icon="mdi-format-list-bulleted" class="nav-button">
              Back to Golf Rounds
            </v-btn>
            <v-btn variant="outlined" :to="{ name: 'GolfDetails', params: { id: props.id } }" prepend-icon="mdi-eye" class="nav-button">
              View Details
            </v-btn>
            <v-btn variant="outlined" :to="{ name: 'GolfLiveScore', params: { id: props.id } }" prepend-icon="mdi-golf" class="nav-button" color="green">
              Live Score
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- ✅ LOADING STATE -->
      <div v-if="isLoading" class="loading-state">
        <v-progress-circular indeterminate color="primary" />
        <p>Loading round...</p>
      </div>

      <!-- ✅ FORM -->
      <v-card v-else class="mt-4">
        <v-card-text>
          <v-form @submit.prevent="updateGolf" ref="formRef">
            <v-container id="form-container">

              <v-text-field
                v-model="golf.course"
                :rules="[requiredCourse]"
                label="Course Played"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-golf</v-icon>
                </template>
              </v-text-field>

              <v-text-field
                v-model="golf.course_location"
                :rules="[requiredCourseLocation]"
                label="Course Location"
              >
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-map-marker</v-icon>
                </template>
              </v-text-field>

              <v-text-field
                label="Link to Site"
                v-model="golf.url_to_course"
                type="text"
                :maxlength="urlMaxLength"
              />
              <span class="char-count">{{ urlMaxLength - golf.url_to_course.length }} / {{ urlMaxLength }}</span>

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

              <!-- ✅ TEES PLAYED - native select (avoids Vuetify CSS conflicts) -->
              <div class="tees-field">
                <label class="tees-label">Tees Played</label>
                <select v-model="golf.tees_played" class="tees-select">
                  <option value="" disabled>Select tees...</option>
                  <option v-for="tee in color_tees_played" :key="tee" :value="tee">{{ tee }}</option>
                </select>
                <span v-if="submitAttempted && !golf.tees_played" class="tees-error">Please select tees played</span>
              </div>

              <!-- ✅ LIVE TOTALS -->
              <div class="totals-banner">
                <div class="total-item">
                  <span class="total-label">Par</span>
                  <span class="total-value">{{ GolfCalculations.calculateTotalPar(golf) }}</span>
                </div>
                <div class="total-item">
                  <span class="total-label">Score</span>
                  <span class="total-value">{{ GolfCalculations.calculateTotalScore(golf) }}</span>
                </div>
                <div class="total-item">
                  <span class="total-label">Putts</span>
                  <span class="total-value">{{ GolfCalculations.calculateTotalPutts(golf) }}</span>
                </div>
                <div class="total-item">
                  <span class="total-label">Penalties</span>
                  <span class="total-value">{{ GolfCalculations.calculateTotalPenalty(golf) }}</span>
                </div>
              </div>

              <!-- ✅ FRONT 9 -->
              <h3 class="nine-header">Front 9</h3>
              <div class="g-container hole-labels">
                <label v-for="n in 9" :key="n" class="g-label">{{ n }}</label>
              </div>

              <div class="section-row">
                <span class="row-label">Par <strong>{{ GolfCalculations.calculateFrontPar(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`par_${n}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Score <strong>{{ GolfCalculations.calculateFrontScore(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`score_${n}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Putts <strong>{{ GolfCalculations.calculateFrontPutts(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`putts_${n}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Penalties <strong>{{ GolfCalculations.calculateFrontPenalty(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`penalty_${n}_hole`]" class="width-9" />
                </div>
              </div>

              <!-- ✅ BACK 9 -->
              <h3 class="nine-header">Back 9</h3>
              <div class="g-container hole-labels">
                <label v-for="n in 9" :key="n" class="g-label">{{ n + 9 }}</label>
              </div>

              <div class="section-row">
                <span class="row-label">Par <strong>{{ GolfCalculations.calculateBackPar(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`par_${n + 9}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Score <strong>{{ GolfCalculations.calculateBackScore(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`score_${n + 9}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Putts <strong>{{ GolfCalculations.calculateBackPutts(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`putts_${n + 9}_hole`]" class="width-9" />
                </div>
              </div>

              <div class="section-row">
                <span class="row-label">Penalties <strong>{{ GolfCalculations.calculateBackPenalty(golf) }}</strong></span>
                <div class="g-container">
                  <input v-for="n in 9" :key="n" type="number" v-model="golf[`penalty_${n + 9}_hole`]" class="width-9" />
                </div>
              </div>

              <v-text-field label="Players" v-model="golf.players">
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-account-group</v-icon>
                </template>
              </v-text-field>

              <v-text-field label="Notes" v-model="golf.notes">
                <template v-slot:prepend-inner>
                  <v-icon class="icon-css">mdi-note-text</v-icon>
                </template>
              </v-text-field>

              <!-- ✅ ACTION BUTTONS -->
              <div class="action-buttons">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                  prepend-icon="mdi-content-save"
                >
                  Save Changes
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  :disabled="isSubmitting"
                  prepend-icon="mdi-delete"
                  @click="deleteGolf"
                >
                  Delete Round
                </v-btn>
              </div>

            </v-container>
          </v-form>
        </v-card-text>
      </v-card>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfCalculations from '@/components/golfs/GolfCalculations.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  id: { type: String, default: '' },
})

const store = useStore()     // auth only — store.state.user
const router = useRouter()
const golfStore = useGolfStore()
const confirmDialogue = ref(null)
const formRef = ref(null)

// ✅ CONSTANTS
const urlMaxLength = 255
const color_tees_played = ['Black', 'Blue', 'Silver', 'White', 'Gold', 'Green', 'Red']

// ✅ STATE
const isLoading = ref(true)
const isSubmitting = ref(false)
const submitAttempted = ref(false)

// ✅ FORM DATA
const golf = reactive({
  course: '',
  course_location: '',
  url_to_course: '',
  date_played: null,
  tees_played: '',
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

// ✅ LIFECYCLE
onMounted(async () => {
  await golfStore.fetchGolf(props.id)
  const loaded = golfStore.currentGolf
  if (loaded) Object.assign(golf, loaded)
  isLoading.value = false
})

// ✅ VALIDATION RULES
function requiredCourse(value) {
  return value ? true : 'Please enter a course name'
}
function requiredCourseLocation(value) {
  return value ? true : 'Please enter the course location'
}
function requiredDatePlayed(value) {
  return value ? true : 'Please enter the date played'
}

// ✅ UPDATE
function updateGolf() {
  submitAttempted.value = true
  if (!golf.tees_played) return

  confirmDialogue.value.show({
    title: 'Update Golf Round',
    message: `Are you sure you want to update ${golf.course}?`,
    okButton: 'Update',
  }).then(ok => {
    if (!ok) return
    isSubmitting.value = true
    const payload = {
      ...golf,
      updated_by: store.state.user?.resource_owner?.email ?? '',
    }
    golfStore.updateGolf(payload).then(result => {
      if (result.success) {
        router.push({ name: 'GolfDetails', params: { id: String(golf.id) } })
      } else {
        alert('Update error. Please try again.')
      }
    }).finally(() => {
      isSubmitting.value = false
    })
  })
}

// ✅ DELETE
function deleteGolf() {
  confirmDialogue.value.show({
    title: 'Delete Golf Round',
    message: `Are you sure you want to permanently delete the round at ${golf.course}? This cannot be undone.`,
    okButton: 'Delete',
  }).then(ok => {
    if (!ok) return
    isSubmitting.value = true
    golfStore.deleteGolf(golf.id).then(result => {
      if (result.success) {
        router.push({ name: 'GolfList' })
      } else {
        alert('Delete error. Please try again.')
      }
    }).finally(() => {
      isSubmitting.value = false
    })
  })
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.golf-edit-container {
  width: 100%;
  max-width: 900px;
  padding: 1rem;
  margin: 0 auto;
}

.navigation-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-button {
  min-width: 160px !important;
}

#form-container {
  text-align: left;
  width: 100%;
  padding: 1rem;
}

.icon-css {
  color: #1976d2 !important;
  top: -0.2rem;
}

.char-count {
  font-size: 0.8rem;
  color: #888;
  display: block;
  margin-bottom: 0.5rem;
}

/* ✅ TEES SELECT */
.tees-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.tees-label {
  font-size: 0.875rem;
  color: rgba(0,0,0,0.6);
  font-weight: 500;
}

.tees-select {
  height: 40px;
  border: 1px solid rgba(0,0,0,0.38);
  border-radius: 4px;
  padding: 0 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.tees-select:focus {
  outline: none;
  border-color: #1976d2;
  border-width: 2px;
}

.tees-error {
  color: #b00020;
  font-size: 0.75rem;
}

/* ✅ TOTALS BANNER */
.totals-banner {
  display: flex;
  gap: 1rem;
  justify-content: space-around;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin: 1rem 0 1.5rem;
  flex-wrap: wrap;
}

.total-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.total-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.05em;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
}

/* ✅ HOLE GRIDS */
.nine-header {
  margin: 1.5rem 0 0.5rem;
  color: #1565c0;
  border-bottom: 2px solid #1565c0;
  padding-bottom: 0.25rem;
}

.g-container {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.hole-labels {
  margin-bottom: 2px;
}

.g-label {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

.section-row {
  margin-bottom: 0.75rem;
}

.row-label {
  font-size: 0.8rem;
  color: #444;
  display: block;
  margin-bottom: 2px;
}

.width-9 {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 2px;
  font-size: 0.9rem;
}

.width-9:focus {
  outline: none;
  border-color: #1976d2;
}

/* ✅ ACTION BUTTONS */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 1.5rem;
}

/* ✅ LOADING */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #666;
}

/* ✅ RESPONSIVE */
@media (max-width: 600px) {
  .navigation-flex {
    flex-direction: column;
  }

  .nav-button {
    min-width: 100% !important;
  }

  .totals-banner {
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .v-btn {
    width: 100%;
  }
}
</style>
