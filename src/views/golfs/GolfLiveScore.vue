<template>
  <div class="live-score-wrap">

    <!-- Header -->
    <div class="live-header">
      <router-link :to="{ name: 'GolfList' }" class="back-link">← List</router-link>
      <div class="course-info">
        <h2>{{ round.course || 'Loading…' }}</h2>
        <p v-if="round.tees_played" class="tees">{{ round.tees_played }} tees · {{ round.date_played }}</p>
      </div>
    </div>

    <!-- Player selector (for group rounds) -->
    <div v-if="playerScores.length > 1" class="player-tabs">
      <button
        v-for="(ps, i) in playerScores"
        :key="i"
        class="player-tab"
        :class="{ active: activePlayerIdx === i }"
        @click="activePlayerIdx = i"
      >
        {{ ps.player_name || `P${i + 1}` }}
      </button>
    </div>

    <!-- Running totals banner -->
    <div class="totals-banner">
      <div class="total-chip">
        <span class="chip-label">Score</span>
        <span class="chip-value">{{ totalScore || '—' }}</span>
      </div>
      <div class="total-chip">
        <span class="chip-label">Points</span>
        <span class="chip-value pts">{{ totalPoints }}</span>
      </div>
      <div class="total-chip">
        <span class="chip-label">Net</span>
        <span class="chip-value">{{ totalNet || '—' }}</span>
      </div>
      <div class="total-chip">
        <span class="chip-label">Putts</span>
        <span class="chip-value">{{ totalPutts || '—' }}</span>
      </div>
    </div>

    <!-- Hole navigation -->
    <div class="hole-nav">
      <button class="nav-btn" :disabled="currentHole === 1" @click="goToHole(currentHole - 1)">‹</button>
      <div class="hole-indicator">
        <span class="hole-label">Hole</span>
        <span class="hole-num">{{ currentHole }}</span>
        <span class="hole-of">of 18</span>
      </div>
      <button class="nav-btn" :disabled="currentHole === 18" @click="goToHole(currentHole + 1)">›</button>
    </div>

    <!-- Per-hole score entry -->
    <GolfScoreRow
      :holeNumber="currentHole"
      :par="round[parKey]"
      :score="activeScore[scoreKey]"
      :handicap="holeHdcpStrokes"
      :putts="activeScore[puttsKey]"
      @update:par="round[parKey] = $event"
      @update:score="activeScore[scoreKey] = $event"
      @update:putts="activeScore[puttsKey] = $event"
    />

    <!-- Save status -->
    <p v-if="saveStatus" class="save-status" :class="saveStatusCss">{{ saveStatus }}</p>

    <!-- Action buttons -->
    <div class="action-row">
      <v-btn v-if="currentHole < 18" color="success" size="large" block :loading="saving" @click="saveAndNext">
        Save &amp; Next Hole →
      </v-btn>
      <v-btn v-else color="primary" size="large" block :loading="saving" @click="finishRound">
        🏁 Finish Round
      </v-btn>
      <v-btn variant="outlined" class="mt-2" block :loading="saving" @click="saveHole">
        Save This Hole
      </v-btn>
    </div>

    <!-- Mini scorecard -->
    <div class="scorecard-section">
      <h3 class="sc-title">Scorecard</h3>
      <p class="nine-label">Front 9</p>
      <div class="scorecard-grid">
        <div
          v-for="h in 9"
          :key="h"
          class="sc-cell"
          :class="{ 'sc-active': h === currentHole, 'sc-completed': activeScore[`score_${h}_hole`] > 0 }"
          @click="goToHole(h)"
        >
          <span class="sc-hole-num">{{ h }}</span>
          <span class="sc-par-val">{{ round[`par_${h}_hole`] || '·' }}</span>
          <span class="sc-score-val" :class="holeScoreClass(h)">{{ activeScore[`score_${h}_hole`] || '·' }}</span>
        </div>
      </div>
      <p class="nine-label">Back 9</p>
      <div class="scorecard-grid">
        <div
          v-for="h in 9"
          :key="h + 9"
          class="sc-cell"
          :class="{ 'sc-active': (h + 9) === currentHole, 'sc-completed': activeScore[`score_${h + 9}_hole`] > 0 }"
          @click="goToHole(h + 9)"
        >
          <span class="sc-hole-num">{{ h + 9 }}</span>
          <span class="sc-par-val">{{ round[`par_${h + 9}_hole`] || '·' }}</span>
          <span class="sc-score-val" :class="holeScoreClass(h + 9)">{{ activeScore[`score_${h + 9}_hole`] || '·' }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import GolfScoreRow from '@/components/golfs/GolfScoreRow.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({ id: { type: String, default: '' } })

const router    = useRouter()
const store     = useStore()
const golfStore = useGolfStore()

const currentHole     = ref(1)
const saving          = ref(false)
const saveStatus      = ref('')
const saveStatusCss   = ref('')
const activePlayerIdx = ref(0)

const parKey     = computed(() => `par_${currentHole.value}_hole`)
const scoreKey   = computed(() => `score_${currentHole.value}_hole`)
const puttsKey   = computed(() => `putts_${currentHole.value}_hole`)


// Reactive round (meta + par + hole_hdcp)
const round = reactive({
  id: null, course: '', course_location: '', tees_played: null, date_played: null,
  ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`par_${i + 1}_hole`, null])),
  ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`hole_hdcp_${i + 1}`, null])),
})

// player_scores as reactive array of score objects
const playerScores = reactive([])

// Active player's score object
const activeScore = computed(() => playerScores[activePlayerIdx.value] ?? {})

// Hole handicap strokes for active player (display only in GolfScoreRow)
const holeHdcpStrokes = computed(() => {
  const ch   = activeScore.value?.course_handicap || 0
  const rank = round[`hole_hdcp_${currentHole.value}`] || 0
  if (!rank || !ch) return 0
  let strokes = 0
  if (rank <= ch) strokes++
  if (rank <= (ch - 18)) strokes++
  return strokes
})

// Totals for active player
const totalPar   = computed(() => { let t = 0; for (let n = 1; n <= 18; n++) t += Number(round[`par_${n}_hole`]) || 0; return t })
const totalScore = computed(() => { let t = 0; for (let n = 1; n <= 18; n++) t += Number(activeScore.value[`score_${n}_hole`]) || 0; return t })
const totalPutts = computed(() => { let t = 0; for (let n = 1; n <= 18; n++) t += Number(activeScore.value[`putts_${n}_hole`]) || 0; return t })

const totalNet = computed(() => {
  let t = 0
  for (let n = 1; n <= 18; n++) {
    const s = Number(activeScore.value[`score_${n}_hole`]) || 0
    if (!s) continue
    const rank = round[`hole_hdcp_${n}`] || 0
    const ch   = activeScore.value?.course_handicap || 0
    let strokes = 0
    if (rank && ch) {
      if (rank <= ch) strokes++
      if (rank <= (ch - 18)) strokes++
    }
    t += s - strokes
  }
  return t || null
})

const totalPoints = computed(() => {
  let pts = 0
  for (let n = 1; n <= 18; n++) {
    const s   = Number(activeScore.value[`score_${n}_hole`])
    const par = Number(round[`par_${n}_hole`])
    if (!s || !par) continue
    const rank = round[`hole_hdcp_${n}`] || 0
    const ch   = activeScore.value?.course_handicap || 0
    let strokes = 0
    if (rank && ch) {
      if (rank <= ch) strokes++
      if (rank <= (ch - 18)) strokes++
    }
    const diff = (s - strokes) - par
    if (diff <= -2) pts += 3
    else if (diff === -1) pts += 2
    else if (diff === 0) pts += 1
  }
  return pts
})

function holeScoreClass(h) {
  const score = activeScore.value[`score_${h}_hole`]
  const par   = round[`par_${h}_hole`]
  if (!score || !par) return ''
  const diff = score - par
  if (diff <= -2) return 'sc-eagle'
  if (diff === -1) return 'sc-birdie'
  if (diff ===  0) return 'sc-par'
  if (diff ===  1) return 'sc-bogey'
  return 'sc-double'
}

function goToHole(h) {
  if (h >= 1 && h <= 18) currentHole.value = h
}

// Build full payload for saving
function buildPayload() {
  const userEmail = store.state.user?.resource_owner?.email ?? ''
  const payload = { ...round, updated_by: userEmail }
  payload.player_scores_attributes = playerScores.map(ps => {
    const obj = { player_name: ps.player_name, course_handicap: ps.course_handicap }
    if (ps.id) obj.id = ps.id
    for (let n = 1; n <= 18; n++) {
      obj[`score_${n}_hole`]   = ps[`score_${n}_hole`]   ?? null
      obj[`putts_${n}_hole`]   = ps[`putts_${n}_hole`]   ?? null
      obj[`penalty_${n}_hole`] = ps[`penalty_${n}_hole`] ?? null
    }
    return obj
  })
  return payload
}

async function saveHole() {
  saving.value = true
  saveStatus.value = ''
  const result = await golfStore.updateGolfRound(buildPayload())
  saving.value = false
  if (result.success) {
    saveStatus.value = '✓ Saved'
    saveStatusCss.value = 'status-ok'
    // sync back updated IDs for newly created player_scores
    const updated = result.data
    if (updated.player_scores) {
      updated.player_scores.forEach((ps, i) => {
        if (playerScores[i]) playerScores[i].id = ps.id
      })
    }
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
  router.push({ name: 'GolfDetails', params: { id: String(round.id) } })
}

onMounted(async () => {
  await golfStore.reloadGolfRound(props.id)
  const loaded = golfStore.currentRound
  if (!loaded) return

  // hydrate round meta + par + hole_hdcp
  Object.assign(round, loaded)

  // hydrate player scores
  playerScores.splice(0, playerScores.length)
  const scores = loaded.player_scores || []
  if (scores.length === 0) {
    // solo blank
    playerScores.push({ id: null, player_name: '', course_handicap: null,
      ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`score_${i + 1}_hole`, null])),
      ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`putts_${i + 1}_hole`, null])),
      ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`penalty_${i + 1}_hole`, null])),
    })
  } else {
    scores.forEach(ps => playerScores.push({ ...ps }))
  }

  // Jump to first unscored hole
  for (let h = 1; h <= 18; h++) {
    if (!activeScore.value[`score_${h}_hole`]) {
      currentHole.value = h
      break
    }
  }
})
</script>

<style scoped>
.live-score-wrap { max-width: 520px; margin: 0 auto; padding: 0.75rem 0.75rem 3rem; }

.live-header { display: flex; align-items: flex-start; gap: 1rem; padding: 0.5rem 0 0.75rem; }
.back-link { font-weight: 600; color: #2d6a2d; text-decoration: none; flex-shrink: 0; font-size: 1rem; padding-top: 0.2rem; }
.course-info h2 { margin: 0; font-size: 1.3rem; line-height: 1.2; }
.tees { margin: 0.2rem 0 0; font-size: 0.85rem; color: #666; }

.player-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.player-tab { padding: 0.35rem 0.9rem; border: 2px solid #ccc; border-radius: 20px; background: white; cursor: pointer; font-size: 0.85rem; }
.player-tab.active { border-color: #2d6a2d; background: #e8f5e9; font-weight: 700; color: #2d6a2d; }

.totals-banner { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; background: #f0f7f0; border-radius: 12px; padding: 0.75rem 0.5rem; margin-bottom: 0.75rem; }
.total-chip { display: flex; flex-direction: column; align-items: center; min-width: 52px; }
.chip-value.pts { color: #2d6a2d; font-weight: 800; }
.chip-label { font-size: 0.65rem; text-transform: uppercase; color: #888; font-weight: 700; letter-spacing: 0.05em; }
.chip-value { font-size: 1.5rem; font-weight: 700; color: #1b1b1b; }
.diff-under { color: #e53935; }
.diff-even  { color: #43a047; }
.diff-over  { color: #1565c0; }

.hole-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.nav-btn { width: 54px; height: 54px; font-size: 2rem; border: 2px solid #2d6a2d; border-radius: 50%; background: white; color: #2d6a2d; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.nav-btn:disabled { border-color: #ccc; color: #ccc; cursor: default; }
.hole-indicator { text-align: center; flex: 1; }
.hole-label { font-size: 0.75rem; color: #888; display: block; }
.hole-num { font-size: 3rem; font-weight: 700; color: #2d6a2d; display: block; line-height: 1; }
.hole-of { font-size: 0.75rem; color: #888; display: block; }

.save-status { text-align: center; font-weight: 600; font-size: 0.9rem; margin: 0.25rem 0; }
.status-ok  { color: #43a047; }
.status-err { color: #e53935; }

.action-row { padding: 0.75rem 0 0.5rem; max-width: 480px; margin: 0 auto; }

.scorecard-section { margin-top: 1.25rem; }
.sc-title { font-size: 1rem; font-weight: 600; color: #444; margin-bottom: 0.1rem; }
.nine-label { font-size: 0.75rem; font-weight: 700; color: #888; text-transform: uppercase; margin: 0.5rem 0 0.25rem; }
.scorecard-grid { display: grid; grid-template-columns: repeat(9, 1fr); gap: 4px; }
.sc-cell { display: flex; flex-direction: column; align-items: center; padding: 0.3rem 0.1rem; border-radius: 6px; cursor: pointer; background: #f5f5f5; }
.sc-cell:hover { background: #e8f5e9; }
.sc-active { background: #c8e6c9 !important; outline: 2px solid #2d6a2d; }
.sc-completed { background: #efefef; }
.sc-hole-num { font-size: 0.6rem; color: #999; }
.sc-par-val { font-size: 0.65rem; color: #777; }
.sc-score-val { font-size: 0.95rem; font-weight: 700; color: #333; }
.sc-eagle { color: #f9a825; }
.sc-birdie { color: #e53935; }
.sc-par { color: #43a047; }
.sc-bogey { color: #1565c0; }
.sc-double { color: #880e4f; }
</style>
