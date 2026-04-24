<template>
  <div class="live-score-wrap">

    <!-- Header -->
    <div class="live-header">
      <router-link :to="{ name: 'GolfList' }" class="back-link">← List</router-link>
      <div class="course-info">
        <h2>{{ golf.course || 'Loading…' }}</h2>
        <p v-if="golf.tees_played" class="tees">{{ golf.tees_played }} tees · {{ golf.date_played }}</p>
      </div>
    </div>

    <!-- Running totals banner -->
    <div class="totals-banner">
      <div class="total-chip">
        <span class="chip-label">Score</span>
        <span class="chip-value">{{ totalScore || '—' }}</span>
      </div>
      <div class="total-chip">
        <span class="chip-label">Par</span>
        <span class="chip-value">{{ totalPar || '—' }}</span>
      </div>
      <div class="total-chip" v-if="totalPar > 0 && totalScore > 0">
        <span class="chip-label">+/−</span>
        <span class="chip-value" :class="scoreDiffCss">
          {{ scoreDiff > 0 ? '+' : '' }}{{ scoreDiff }}
        </span>
      </div>
      <div class="total-chip">
        <span class="chip-label">Putts</span>
        <span class="chip-value">{{ totalPutts || '—' }}</span>
      </div>
      <div class="total-chip" v-if="totalPenalty > 0">
        <span class="chip-label">Pen.</span>
        <span class="chip-value diff-over">{{ totalPenalty }}</span>
      </div>
      <div class="total-chip" v-if="totalHandicaps > 0">
        <span class="chip-label">Net</span>
        <span class="chip-value">{{ totalNetScore || '—' }}</span>
      </div>
    </div>

    <!-- Hole navigation -->
    <div class="hole-nav">
      <button
        class="nav-btn"
        :disabled="currentHole === 1"
        @click="goToHole(currentHole - 1)"
      >‹</button>
      <div class="hole-indicator">
        <span class="hole-label">Hole</span>
        <span class="hole-num">{{ currentHole }}</span>
        <span class="hole-of">of 18</span>
      </div>
      <button
        class="nav-btn"
        :disabled="currentHole === 18"
        @click="goToHole(currentHole + 1)"
      >›</button>
    </div>

    <!-- Per-hole score entry -->
    <GolfScoreRow
      :holeNumber="currentHole"
      :par="golf[parKey]"
      :score="golf[scoreKey]"
      :handicap="holeHandicaps[handicapKey]"
      :putts="golf[puttsKey]"
      :penalty="golf[penaltyKey]"
      @update:par="golf[parKey] = $event"
      @update:score="golf[scoreKey] = $event"
      @update:handicap="holeHandicaps[handicapKey] = $event"
      @update:putts="golf[puttsKey] = $event"
      @update:penalty="golf[penaltyKey] = $event"
    />

    <!-- Save status -->
    <p v-if="saveStatus" class="save-status" :class="saveStatusCss">{{ saveStatus }}</p>

    <!-- Action buttons -->
    <div class="action-row">
      <v-btn
        v-if="currentHole < 18"
        color="success"
        size="large"
        block
        :loading="saving"
        @click="saveAndNext"
      >
        Save &amp; Next Hole →
      </v-btn>
      <v-btn
        v-else
        color="primary"
        size="large"
        block
        :loading="saving"
        @click="finishRound"
      >
        🏁 Finish Round
      </v-btn>
      <v-btn
        variant="outlined"
        class="mt-2"
        block
        :loading="saving"
        @click="saveHole"
      >
        Save This Hole
      </v-btn>
    </div>

    <!-- Mini scorecard -->
    <div class="scorecard-section">
      <h3 class="sc-title">Scorecard <span class="sc-hint">(tap hole to jump)</span></h3>

      <!-- Front 9 -->
      <p class="nine-label">Front 9</p>
      <div class="scorecard-grid">
        <div
          v-for="h in 9"
          :key="h"
          class="sc-cell"
          :class="{
            'sc-active': h === currentHole,
            'sc-completed': golf[`score_${h}_hole`] > 0
          }"
          @click="goToHole(h)"
        >
          <span class="sc-hole-num">{{ h }}</span>
          <span class="sc-par-val">{{ golf[`par_${h}_hole`] || '·' }}</span>
          <span class="sc-score-val" :class="holeScoreClass(h)">
            {{ golf[`score_${h}_hole`] || '·' }}
          </span>
          <span v-if="holeHandicaps[h]" class="sc-net-val">
            {{ netHoleScore(h) }}
          </span>
        </div>
      </div>
      <!-- Front 9 totals row -->
      <div v-if="totalHandicaps > 0" class="nine-totals">
        <span>Front:</span>
        <span>Par {{ [1,2,3,4,5,6,7,8,9].reduce((s,h) => s + (golf[`par_${h}_hole`] || 0), 0) || '—' }}</span>
        <span>Gross {{ [1,2,3,4,5,6,7,8,9].reduce((s,h) => s + (golf[`score_${h}_hole`] || 0), 0) || '—' }}</span>
        <span class="net-total">Net {{ frontNetScore || '—' }}</span>
      </div>

      <!-- Back 9 -->
      <p class="nine-label">Back 9</p>
      <div class="scorecard-grid">
        <div
          v-for="h in 9"
          :key="h + 9"
          class="sc-cell"
          :class="{
            'sc-active': (h + 9) === currentHole,
            'sc-completed': golf[`score_${h + 9}_hole`] > 0
          }"
          @click="goToHole(h + 9)"
        >
          <span class="sc-hole-num">{{ h + 9 }}</span>
          <span class="sc-par-val">{{ golf[`par_${h + 9}_hole`] || '·' }}</span>
          <span class="sc-score-val" :class="holeScoreClass(h + 9)">
            {{ golf[`score_${h + 9}_hole`] || '·' }}
          </span>
          <span v-if="holeHandicaps[h + 9]" class="sc-net-val">
            {{ netHoleScore(h + 9) }}
          </span>
        </div>
      </div>
      <!-- Back 9 totals row -->
      <div v-if="totalHandicaps > 0" class="nine-totals">
        <span>Back:</span>
        <span>Par {{ [10,11,12,13,14,15,16,17,18].reduce((s,h) => s + (golf[`par_${h}_hole`] || 0), 0) || '—' }}</span>
        <span>Gross {{ [10,11,12,13,14,15,16,17,18].reduce((s,h) => s + (golf[`score_${h}_hole`] || 0), 0) || '—' }}</span>
        <span class="net-total">Net {{ backNetScore || '—' }}</span>
      </div>

    </div><!-- /scorecard-section -->
  </div><!-- /live-score-wrap -->
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import GolfScoreRow from '@/components/golfs/GolfScoreRow.vue'
import GolfCalculations from '@/components/golfs/GolfCalculations.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  id: { type: String, default: '' },
})

const router  = useRouter()
const store   = useStore()      // user email — auth still lives in Vuex
const golfStore = useGolfStore()

const currentHole = ref(1)
const saving      = ref(false)
const saveStatus  = ref('')
const saveStatusCss = ref('')

// Dynamic field keys for the current hole
const parKey     = computed(() => `par_${currentHole.value}_hole`)
const scoreKey   = computed(() => `score_${currentHole.value}_hole`)
const puttsKey   = computed(() => `putts_${currentHole.value}_hole`)
const penaltyKey = computed(() => `penalty_${currentHole.value}_hole`)

// Handicap strokes per hole — local only, not persisted to DB
// e.g. hole index gives 1 stroke on the hardest holes
const holeHandicaps = reactive(Array(19).fill(0))  // index 1-18 used
const handicapKey = computed(() => currentHole.value)

const golf = reactive({
  id: null,
  course: '', course_location: '', url_to_course: '',
  date_played: null, tees_played: null, players: '', notes: '',
  par_1_hole: null,     par_2_hole: null,     par_3_hole: null,
  par_4_hole: null,     par_5_hole: null,     par_6_hole: null,
  par_7_hole: null,     par_8_hole: null,     par_9_hole: null,
  par_10_hole: null,    par_11_hole: null,    par_12_hole: null,
  par_13_hole: null,    par_14_hole: null,    par_15_hole: null,
  par_16_hole: null,    par_17_hole: null,    par_18_hole: null,
  score_1_hole: null,   score_2_hole: null,   score_3_hole: null,
  score_4_hole: null,   score_5_hole: null,   score_6_hole: null,
  score_7_hole: null,   score_8_hole: null,   score_9_hole: null,
  score_10_hole: null,  score_11_hole: null,  score_12_hole: null,
  score_13_hole: null,  score_14_hole: null,  score_15_hole: null,
  score_16_hole: null,  score_17_hole: null,  score_18_hole: null,
  putts_1_hole: null,   putts_2_hole: null,   putts_3_hole: null,
  putts_4_hole: null,   putts_5_hole: null,   putts_6_hole: null,
  putts_7_hole: null,   putts_8_hole: null,   putts_9_hole: null,
  putts_10_hole: null,  putts_11_hole: null,  putts_12_hole: null,
  putts_13_hole: null,  putts_14_hole: null,  putts_15_hole: null,
  putts_16_hole: null,  putts_17_hole: null,  putts_18_hole: null,
  penalty_1_hole: null, penalty_2_hole: null, penalty_3_hole: null,
  penalty_4_hole: null, penalty_5_hole: null, penalty_6_hole: null,
  penalty_7_hole: null, penalty_8_hole: null, penalty_9_hole: null,
  penalty_10_hole: null,penalty_11_hole: null,penalty_12_hole: null,
  penalty_13_hole: null,penalty_14_hole: null,penalty_15_hole: null,
  penalty_16_hole: null,penalty_17_hole: null,penalty_18_hole: null,
  created_by: '', updated_by: '',
})

onMounted(async () => {
  await golfStore.fetchGolf(props.id)
  const loaded = golfStore.currentGolf
  if (loaded) Object.assign(golf, loaded)

  // Jump to first unscored hole automatically
  for (let h = 1; h <= 18; h++) {
    if (!golf[`score_${h}_hole`]) {
      currentHole.value = h
      break
    }
  }
})

// Totals — delegated to shared GolfCalculations
const totalPar     = computed(() => GolfCalculations.calculateTotalPar(golf) || 0)
const totalScore   = computed(() => GolfCalculations.calculateTotalScore(golf) || 0)
const totalPutts   = computed(() => GolfCalculations.calculateTotalPutts(golf) || 0)
const totalPenalty = computed(() => GolfCalculations.calculateTotalPenalty(golf) || 0)
const scoreDiff    = computed(() => totalScore.value - totalPar.value)

const scoreDiffCss = computed(() => {
  if (scoreDiff.value < 0) return 'diff-under'
  if (scoreDiff.value === 0) return 'diff-even'
  return 'diff-over'
})

// Net score helpers — subtract holeHandicaps from each hole's score
function netHoleScore(h) {
  const s = golf[`score_${h}_hole`]
  if (!s) return null
  return s - (holeHandicaps[h] || 0)
}
const frontNetScore = computed(() =>
  [1,2,3,4,5,6,7,8,9].reduce((sum, h) => sum + (netHoleScore(h) || 0), 0) || null
)
const backNetScore = computed(() =>
  [10,11,12,13,14,15,16,17,18].reduce((sum, h) => sum + (netHoleScore(h) || 0), 0) || null
)
const totalNetScore = computed(() => {
  const f = frontNetScore.value
  const b = backNetScore.value
  if (!f && !b) return null
  return (f || 0) + (b || 0)
})
const totalHandicaps = computed(() => holeHandicaps.slice(1).reduce((sum, v) => sum + (v || 0), 0))

// Save current hole state to the API
async function saveHole() {
  saving.value = true
  saveStatus.value = ''
  const payload = {
    ...golf,
    updated_by: store.state.user?.resource_owner?.email ?? '',
  }
  const result = await golfStore.updateGolf(payload)
  saving.value = false
  if (result.success) {
    saveStatus.value = '✓ Saved'
    saveStatusCss.value = 'status-ok'
    setTimeout(() => { saveStatus.value = '' }, 2000)
  } else {
    saveStatus.value = 'Save failed — check connection'
    saveStatusCss.value = 'status-err'
  }
}

async function saveAndNext() {
  await saveHole()
  if (currentHole.value < 18) currentHole.value++
}

async function finishRound() {
  await saveHole()
  router.push({ name: 'GolfDetails', params: { id: String(golf.id) } })
}

function goToHole(h) {
  if (h >= 1 && h <= 18) currentHole.value = h
}

// Color class for mini scorecard cells
function holeScoreClass(h) {
  const score = golf[`score_${h}_hole`]
  const par   = golf[`par_${h}_hole`]
  if (!score || !par) return ''
  const diff = score - par
  if (diff <= -2) return 'sc-eagle'
  if (diff === -1) return 'sc-birdie'
  if (diff ===  0) return 'sc-par'
  if (diff ===  1) return 'sc-bogey'
  return 'sc-double'
}
</script>

<style scoped>
.live-score-wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 0.75rem 0.75rem 3rem;
}

/* Header */
.live-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0 0.75rem;
}
.back-link {
  font-weight: 600;
  color: #2d6a2d;
  text-decoration: none;
  flex-shrink: 0;
  font-size: 1rem;
  padding-top: 0.2rem;
}
.course-info h2 {
  margin: 0;
  font-size: 1.3rem;
  line-height: 1.2;
  color: #1b1b1b;
}
.tees {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

/* Totals banner */
.totals-banner {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  background: #f0f7f0;
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  margin-bottom: 0.75rem;
}
.total-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
}
.chip-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #888;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.chip-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b1b1b;
}
.diff-under { color: #e53935; }
.diff-even  { color: #43a047; }
.diff-over  { color: #1565c0; }

/* Hole navigation */
.hole-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.nav-btn {
  width: 54px;
  height: 54px;
  font-size: 2rem;
  border: 2px solid #2d6a2d;
  border-radius: 50%;
  background: white;
  color: #2d6a2d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}
.nav-btn:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: default;
}
.hole-indicator {
  text-align: center;
  flex: 1;
}
.hole-label { font-size: 0.75rem; color: #888; display: block; }
.hole-num   { font-size: 3rem; font-weight: 700; color: #2d6a2d; display: block; line-height: 1; }
.hole-of    { font-size: 0.75rem; color: #888; display: block; }

/* Save status */
.save-status {
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}
.status-ok  { color: #43a047; }
.status-err { color: #e53935; }

/* Action row */
.action-row {
  padding: 0.75rem 0 0.5rem;
  max-width: 480px;
  margin: 0 auto;
}

/* Scorecard */
.scorecard-section {
  margin-top: 1.25rem;
}
.sc-title {
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.1rem;
}
.sc-hint {
  font-size: 0.75rem;
  color: #999;
  font-weight: 400;
}
.nine-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  margin: 0.5rem 0 0.25rem;
}
.scorecard-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 4px;
}
.sc-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 0.1rem;
  border-radius: 6px;
  cursor: pointer;
  background: #f5f5f5;
  transition: background 0.15s;
  user-select: none;
}
.sc-cell:hover    { background: #e8f5e9; }
.sc-active        { background: #c8e6c9 !important; outline: 2px solid #2d6a2d; }
.sc-completed     { background: #efefef; }
.sc-hole-num      { font-size: 0.6rem; color: #999; }
.sc-par-val       { font-size: 0.65rem; color: #777; }
.sc-score-val     { font-size: 0.95rem; font-weight: 700; color: #333; }
.sc-net-val       { font-size: 0.7rem; font-weight: 600; color: #b8860b; border-top: 1px solid #e0d0a0; margin-top: 1px; padding-top: 1px; }
.sc-eagle         { color: #f9a825; }
.sc-birdie        { color: #e53935; }
.sc-par           { color: #43a047; }
.sc-bogey         { color: #1565c0; }
.sc-double        { color: #880e4f; }

.nine-totals {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffbf0;
  border: 1px solid #e0d0a0;
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  margin: 0.4rem 0 0.75rem;
  font-size: 0.8rem;
  color: #555;
}
.net-total { font-weight: 700; color: #b8860b; }
</style>
