<template>
  <div class="group-wrap">

    <!-- ── Header ──────────────────────────────────────────────── -->
    <div class="group-header">
      <router-link :to="{ name: 'GolfList' }" class="back-link">← List</router-link>
      <h2 class="page-title">{{ isEditMode ? 'Edit Round' : 'New Round' }}</h2>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <v-progress-circular indeterminate color="green" />
      <p>Loading round…</p>
    </div>

    <div v-else>
      <!-- ── Round Meta ──────────────────────────────────────────── -->
      <div class="meta-card">
        <v-text-field v-model="meta.course" label="Course" density="compact" hide-details class="mb-2" />
        <v-text-field v-model="meta.course_location" label="Location" density="compact" hide-details class="mb-2" />
        <v-text-field v-model="meta.date_played" label="Date Played" type="date" density="compact" hide-details class="mb-2" />
        <div class="tees-row">
          <label class="tees-label">Tees</label>
          <select v-model="meta.tees_played" class="tees-select">
            <option value="" disabled>Select…</option>
            <option v-for="t in TEES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <v-text-field v-model="meta.url_to_course" label="Course URL" density="compact" hide-details class="mb-2" />
        <v-text-field v-model="meta.notes" label="Notes" density="compact" hide-details />
      </div>

      <!-- ── Players ────────────────────────────────────────────── -->
      <div class="players-header">
        <h3>Players</h3>
        <v-btn size="small" variant="outlined" @click="addPlayer" :disabled="players.length >= 4">+ Add Player</v-btn>
      </div>

      <div class="players-scoreline" v-if="players.some(p => playerTotal(p, 'scores') > 0)">
        <template v-for="(p, pi) in players" :key="`hdr-${pi}`">
          <div v-if="playerTotal(p, 'scores') > 0" class="players-scoreline-item">
            <span class="psl-name">{{ p.name || `P${pi + 1}` }}</span>
            <span class="psl-stat">Score <strong>{{ playerTotal(p, 'scores') }}</strong></span>
            <span class="psl-stat">Pts <strong>{{ stablefordTotal(p) }}</strong></span>
            <span v-if="has9Scores(p)" class="psl-stat">Net <strong>{{ playerNet(p) }}</strong></span>
          </div>
        </template>
      </div>

      <div class="players-grid">
        <div v-for="(p, pi) in players" :key="pi" class="player-card">
          <div class="player-name-row">
            <v-text-field
              v-model="p.name"
              :label="`Player ${pi + 1} Name`"
              density="compact"
              hide-details
              style="width: 160px; flex: 0 0 160px;"
            />
            <v-text-field
              v-model.number="p.courseHandicap"
              label="Hdcp"
              type="number"
              density="compact"
              hide-details
              style="max-width: 80px"
              class="ml-2"
            />
            <v-btn
              v-if="pi > 0"
              icon="mdi-close"
              size="x-small"
              variant="text"
              color="error"
              class="ml-1"
              @click="removePlayer(pi)"
            />
            <div class="player-inline-summary" v-if="playerTotal(p, 'scores') > 0">
              <span>{{ playerTotal(p, 'scores') }}</span>
              <span class="pis-label">Sc</span>
              <span>{{ stablefordTotal(p) }}</span>
              <span class="pis-label">Pts</span>
              <template v-if="has9Scores(p)">
                <span>{{ playerNet(p) }}</span>
                <span class="pis-label">Net</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Par Row ────────────────────────────────────────────── -->
      <div class="par-section">
        <h4 class="section-title">Par</h4>
        <div class="nine-label">Front 9 — {{ frontPar }}</div>
        <div class="grid-9">
          <div v-for="n in 9" :key="n" class="cell-col">
            <span class="hole-num">{{ n }}</span>
            <input type="number" v-model.number="par[n]" class="cell-input" min="3" max="5" />
          </div>
        </div>
        <template v-if="hasBack9">
          <div class="nine-label mt-1">Back 9 — {{ backPar }}</div>
          <div class="grid-9">
            <div v-for="n in 9" :key="n + 9" class="cell-col">
              <span class="hole-num">{{ n + 9 }}</span>
              <input type="number" v-model.number="par[n + 9]" class="cell-input" min="3" max="5" />
            </div>
          </div>
        </template>
        <div class="total-bar">Total Par: <strong>{{ totalPar }}</strong></div>
      </div>



      <!-- ── Score Grid per player ──────────────────────────────── -->
      <div v-for="(p, pi) in players" :key="`scores-${pi}`" class="score-section">
        <h4 class="section-title player-title">
          {{ p.name || `Player ${pi + 1}` }}
          <span class="player-summary">
            Score {{ playerTotal(p, 'scores') }} &nbsp;|&nbsp;
            Points {{ stablefordTotal(p) }}
            <template v-if="has9Scores(p)">&nbsp;|&nbsp; Net {{ playerNet(p) }}
            <span v-if="p.courseHandicap">(hdcp {{ p.courseHandicap }})</span></template>
            &nbsp;|&nbsp; Putts {{ playerTotal(p, 'putts') }}
          </span>
        </h4>

        <!-- Front 9 -->
        <div class="nine-label">Front 9 — {{ playerFront(p, 'scores') }}</div>
        <div class="grid-9">
          <div v-for="n in 9" :key="n" class="cell-col">
            <span class="hole-num">{{ n }}</span>
            <input type="number" v-model.number="p.scores[n]" class="cell-input score-main" :class="scoreCss(p.scores[n], par[n])" min="1" max="15" />
            <input type="number" v-model.number="p.hdcpStrokes[n]" class="cell-input hdcp-strokes-input" placeholder="H" min="0" max="2" title="Hdcp strokes" />
            <span class="cell-readonly net-cell" :class="scoreCss(p.scores[n] ? p.scores[n] - hdcpStrokesForHole(p, n) : null, par[n])">
              {{ p.scores[n] ? p.scores[n] - hdcpStrokesForHole(p, n) : '—' }}
            </span>
            <input type="number" v-model.number="p.putts[n]" class="cell-input putts-input" placeholder="P" min="0" max="6" />
          </div>
        </div>

        <!-- Back 9 -->
        <template v-if="hasBack9">
          <div class="nine-label mt-1">Back 9 — {{ playerBack(p, 'scores') }}</div>
          <div class="grid-9">
            <div v-for="n in 9" :key="n + 9" class="cell-col">
              <span class="hole-num">{{ n + 9 }}</span>
              <input type="number" v-model.number="p.scores[n + 9]" class="cell-input score-main" :class="scoreCss(p.scores[n + 9], par[n + 9])" min="1" max="15" />
              <input type="number" v-model.number="p.hdcpStrokes[n + 9]" class="cell-input hdcp-strokes-input" placeholder="H" min="0" max="2" title="Hdcp strokes" />
              <span class="cell-readonly net-cell" :class="scoreCss(p.scores[n + 9] ? p.scores[n + 9] - hdcpStrokesForHole(p, n + 9) : null, par[n + 9])">
                {{ p.scores[n + 9] ? p.scores[n + 9] - hdcpStrokesForHole(p, n + 9) : '—' }}
              </span>
              <input type="number" v-model.number="p.putts[n + 9]" class="cell-input putts-input" placeholder="P" min="0" max="6" />
            </div>
          </div>
        </template>

        <!-- Stableford recap -->
        <div class="stableford-grid">
          <div class="grid-9">
            <div v-for="n in 9" :key="n" class="cell-col">
              <span class="pts-chip" :class="stablefordCss(stablefordPts(p, n))">{{ stablefordPts(p, n) }}</span>
            </div>
          </div>
        </div>
        <template v-if="hasBack9">
          <div class="stableford-grid">
            <div class="grid-9">
              <div v-for="n in 9" :key="n + 9" class="cell-col">
                <span class="pts-chip" :class="stablefordCss(stablefordPts(p, n + 9))">{{ stablefordPts(p, n + 9) }}</span>
              </div>
            </div>
          </div>
        </template>
        <div class="pts-grand-total">Total: {{ stablefordTotal(p) }} pts</div>
      </div>

      <!-- ── Save status & actions ──────────────────────────────── -->
      <p v-if="saveStatus" class="save-status" :class="saveStatusCss">{{ saveStatus }}</p>

      <div class="action-row">
        <v-btn color="success" size="large" :loading="saving" @click="saveAndStay">
          {{ isEditMode ? '💾 Save' : '⛳ Create & Stay' }}
        </v-btn>
        <v-btn color="primary" size="large" :loading="saving" @click="saveAll">
          {{ isEditMode ? '✅ Save & Done' : '⛳ Create Round' }}
        </v-btn>
        <v-btn
          v-if="isEditMode"
          color="error"
          variant="outlined"
          :loading="saving"
          @click="deleteRound"
        >
          🗑 Delete Round
        </v-btn>
      </div>

    </div><!-- /v-else -->
  </div><!-- /group-wrap -->
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const route     = useRoute()
const router    = useRouter()
const store     = useStore()         // auth — email from Vuex
const golfStore = useGolfStore()

// ── Constants ───────────────────────────────────────────────────────────
const TEES = ['Black', 'Blue', 'Silver', 'White', 'Gold', 'Green', 'Red']
const MAX_PLAYERS = 4

// ── Determine mode ──────────────────────────────────────────────────────
const isEditMode = computed(() => !!route.params.id)

// ── State ───────────────────────────────────────────────────────────────
const loading = ref(false)
const saving  = ref(false)
const saveStatus    = ref('')
const saveStatusCss = ref('')

const meta = reactive({
  course: '',
  course_location: '',
  date_played: '',
  tees_played: '',
  url_to_course: '',
  notes: '',
})

// par[1..18]
const par = reactive(Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, null])))

const WHITE_FRONT_PARS = [4, 4, 4, 4, 4, 4, 4, 3, 5]
const BLUE_FRONT_PARS  = [4, 4, 4, 4, 4, 3, 4, 3, 5]

watch(() => meta.tees_played, (tees) => {
  const anyFrontEntered = Array.from({ length: 9 }, (_, i) => par[i + 1]).some(v => v)
  if (!anyFrontEntered) {
    if (tees === 'White') {
      WHITE_FRONT_PARS.forEach((p, i) => { par[i + 1] = p })
    } else if (tees === 'Blue') {
      BLUE_FRONT_PARS.forEach((p, i) => { par[i + 1] = p })
    }
  }
})

function blankPlayer() {
  return {
    id: null,           // existing player_score.id (null = new)
    name: '',
    courseHandicap: null,
    scores:      Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, null])),
    putts:       Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, null])),
    hdcpStrokes: Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 1, null])),
  }
}

const players = reactive([blankPlayer()])

// ── Player management ────────────────────────────────────────────────────
function addPlayer() {
  if (players.length < MAX_PLAYERS) players.push(blankPlayer())
}

function removePlayer(idx) {
  players.splice(idx, 1)
}

// ── Computed totals ──────────────────────────────────────────────────────
const frontPar = computed(() => Array.from({ length: 9 }, (_, i) => par[i + 1] || 0).reduce((a, b) => a + b, 0))
const backPar  = computed(() => Array.from({ length: 9 }, (_, i) => par[i + 10] || 0).reduce((a, b) => a + b, 0))
const totalPar = computed(() => frontPar.value + backPar.value)
const hasBack9 = computed(() => Array.from({ length: 9 }, (_, i) => par[i + 10]).some(v => v))

function playerFront(p, field) {
  if (!p?.[field]) return 0
  return Array.from({ length: 9 }, (_, i) => p[field][i + 1] || 0).reduce((a, b) => a + b, 0)
}
function playerBack(p, field) {
  if (!p?.[field]) return 0
  return Array.from({ length: 9 }, (_, i) => p[field][i + 10] || 0).reduce((a, b) => a + b, 0)
}
function playerTotal(p, field) {
  return playerFront(p, field) + playerBack(p, field)
}

// Per-player hole hdcp strokes (entered directly)
function hdcpStrokesForHole(p, n) {
  return p.hdcpStrokes[n] || 0
}

function stablefordPts(p, n) {
  const score = p.scores[n]
  const holePar = par[n]
  if (!score || !holePar) return 0
  const net = score - hdcpStrokesForHole(p, n)
  const diff = net - holePar
  if (diff <= -2) return 3
  if (diff === -1) return 2
  if (diff ===  0) return 1
  return 0
}

function stablefordTotal(p) {
  return Array.from({ length: 18 }, (_, i) => stablefordPts(p, i + 1)).reduce((a, b) => a + b, 0)
}
function stablefordFront(p) {
  return Array.from({ length: 9 }, (_, i) => stablefordPts(p, i + 1)).reduce((a, b) => a + b, 0)
}
function stablefordBack(p) {
  return Array.from({ length: 9 }, (_, i) => stablefordPts(p, i + 10)).reduce((a, b) => a + b, 0)
}

function playerNet(p) {
  return playerTotal(p, 'scores') - (p.courseHandicap || 0)
}
function has9Scores(p) {
  return Array.from({ length: 9 }, (_, i) => p.scores?.[i + 1]).filter(v => v > 0).length === 9
}

// ── Score colour helper ──────────────────────────────────────────────────
function scoreCss(score, holePar) {
  if (!score || !holePar) return ''
  const d = score - holePar
  if (d <= -2) return 'eagle'
  if (d === -1) return 'birdie'
  if (d ===  0) return 'par'
  if (d ===  1) return 'bogey'
  return 'double'
}

function stablefordCss(pts) {
  if (pts >= 3) return 'pts-eagle'
  if (pts === 2) return 'pts-birdie'
  if (pts === 1) return 'pts-par'
  return 'pts-zero'
}

// ── Hydrate from existing round ──────────────────────────────────────────
function hydrateFromRound(round) {
  Object.assign(meta, {
    course:         round.course         || '',
    course_location: round.course_location || '',
    date_played:    round.date_played    || '',
    tees_played:    round.tees_played    || '',
    url_to_course:  round.url_to_course  || '',
    notes:          round.notes          || '',
  })
  for (let n = 1; n <= 18; n++) {
    par[n] = round[`par_${n}_hole`] ?? null
  }
  // hydrate players
  players.splice(0, players.length)
  const scores = round.player_scores || []
  if (scores.length === 0) {
    players.push(blankPlayer())
  } else {
    scores.forEach(ps => {
      const p = blankPlayer()
      p.id            = ps.id
      p.name          = ps.player_name       || ''
      p.courseHandicap = ps.course_handicap  ?? null
      for (let n = 1; n <= 18; n++) {
        p.scores[n]      = ps[`score_${n}_hole`]   ?? null
        p.putts[n]       = ps[`putts_${n}_hole`]   ?? null
        p.hdcpStrokes[n] = ps[`penalty_${n}_hole`] ?? null
      }
      players.push(p)
    })
  }
}

// ── Build payload ────────────────────────────────────────────────────────
function buildPayload() {
  const userEmail = store.state.user?.resource_owner?.email ?? ''
  const payload = {
    ...meta,
    created_by: userEmail,
    updated_by: userEmail,
    player_scores_attributes: players.map(p => {
      const ps = {
        player_name:      p.name,
        course_handicap:  p.courseHandicap,
      }
      if (p.id) ps.id = p.id
      for (let n = 1; n <= 18; n++) {
        ps[`score_${n}_hole`]   = p.scores[n]      ?? null
        ps[`putts_${n}_hole`]   = p.putts[n]       ?? null
        ps[`penalty_${n}_hole`] = p.hdcpStrokes[n] ?? null
      }
      return ps
    }),
  }
  for (let n = 1; n <= 18; n++) {
    payload[`par_${n}_hole`] = par[n] ?? null
  }
  return payload
}

// ── Save and stay on page ───────────────────────────────────────────────
async function saveAndStay() {
  if (!meta.course) { alert('Please enter a course name.'); return }
  if (!meta.date_played) { alert('Please enter the date played.'); return }

  saving.value = true
  saveStatus.value = ''

  const payload = buildPayload()

  let result
  if (isEditMode.value) {
    payload.id = parseInt(route.params.id)
    result = await golfStore.updateGolfRound(payload)
  } else {
    result = await golfStore.createGolfRound(payload)
    if (result.success) {
      // Switch to edit mode so subsequent saves update the same record
      router.replace({ name: 'GolfGroupScorecard', params: { id: String(result.data.id) } })
    }
  }

  saving.value = false

  if (result.success) {
    saveStatus.value = '✓ Saved! Continue entering scores.'
    saveStatusCss.value = 'status-ok'
    setTimeout(() => { saveStatus.value = '' }, 3000)
  } else {
    saveStatus.value = 'Save failed — check connection.'
    saveStatusCss.value = 'status-err'
  }
}

// ── Save all ─────────────────────────────────────────────────────────────
async function saveAll() {
  if (!meta.course) { alert('Please enter a course name.'); return }
  if (!meta.date_played) { alert('Please enter the date played.'); return }

  saving.value = true
  saveStatus.value = ''

  const payload = buildPayload()

  let result
  if (isEditMode.value) {
    payload.id = parseInt(route.params.id)
    result = await golfStore.updateGolfRound(payload)
  } else {
    result = await golfStore.createGolfRound(payload)
  }

  saving.value = false

  if (result.success) {
    saveStatus.value = '✓ Round saved!'
    saveStatusCss.value = 'status-ok'
    setTimeout(() => {
      router.push({ name: 'GolfDetails', params: { id: String(result.data.id) } })
    }, 800)
  } else {
    saveStatus.value = 'Save failed — check connection.'
    saveStatusCss.value = 'status-err'
  }
}

// ── Delete round ─────────────────────────────────────────────────────────
async function deleteRound() {
  if (!confirm(`Delete round at ${meta.course}? This cannot be undone.`)) return
  saving.value = true
  const result = await golfStore.deleteGolfRound(parseInt(route.params.id))
  saving.value = false
  if (result.success) {
    router.push({ name: 'GolfList' })
  } else {
    alert('Delete failed.')
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────────
onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    console.log('🏌️ Loading round id:', route.params.id)
    try {
      await golfStore.reloadGolfRound(route.params.id)
      const round = golfStore.currentRound
      console.log('🏌️ Round loaded:', round?.id, 'error:', golfStore.error)
      if (round) hydrateFromRound(round)
    } catch (err) {
      console.error('Failed to load round:', err)
      const status = err?.response?.status
      if (status === 401 || status === 500) {
        alert('Session expired — please log in again.')
        router.push({ name: 'Login' })
      }
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
.group-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.75rem 0.75rem 4rem;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 0.75rem;
}
.back-link { font-weight: 600; color: #2d6a2d; text-decoration: none; }
.page-title { margin: 0; font-size: 1.3rem; color: #1b1b1b; }

/* Meta card */
.meta-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.tees-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.tees-label { font-size: 0.875rem; font-weight: 600; color: #444; white-space: nowrap; }
.tees-select {
  flex: 1;
  height: 40px;
  border: 1px solid rgba(0,0,0,0.38);
  border-radius: 4px;
  padding: 0 10px;
  font-size: 0.95rem;
  background: white;
}

/* Players */
.players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.players-header h3 { margin: 0; }
.players-scoreline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.4rem 0.5rem;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
}
.players-scoreline-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  background: #fff;
  border: 1px solid #bbdefb;
  border-radius: 6px;
}
.psl-name { font-weight: 600; color: #1565c0; margin-right: 0.2rem; }
.psl-stat { color: #444; white-space: nowrap; }
.players-grid { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.player-card { background: #f0f7ff; border: 1px solid #90caf9; border-radius: 8px; padding: 0.5rem 0.75rem; }
.player-name-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

/* Hole grids */
.section-title { margin: 1rem 0 0.4rem; color: #1565c0; border-bottom: 2px solid #1565c0; padding-bottom: 0.2rem; font-size: 0.95rem; }
.player-title  { color: #2d6a2d; border-color: #2d6a2d; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.25rem; }
.player-summary { font-size: 0.75rem; font-weight: 400; color: #555; }
.player-inline-summary {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1565c0;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 6px;
  padding: 0.1rem 0.5rem;
  white-space: nowrap;
}
.pis-label { font-size: 0.68rem; font-weight: 400; color: #666; margin-right: 0.3rem; }

.nine-label { font-size: 0.72rem; font-weight: 700; color: #888; text-transform: uppercase; margin: 0.3rem 0 0.15rem; }
.mt-1 { margin-top: 0.4rem; }

.grid-9 {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 3px;
  margin-bottom: 0.25rem;
}
.cell-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.hole-num { font-size: 0.6rem; color: #888; font-weight: 600; }

.cell-input {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 3px 1px;
  font-size: 0.85rem;
  font-weight: 600;
  -webkit-appearance: none;
  appearance: none;
}
.cell-input::-webkit-inner-spin-button,
.cell-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

.score-main { border-color: #2d6a2d; background: #f0f7f0; font-size: 0.95rem; }
.putts-input { border-color: #90caf9; background: #e3f2fd; font-size: 0.75rem; }
.cell-readonly {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  padding: 0 3px;
}
.hdcp-strokes-input { border-color: #7b1fa2; background: #f3e5f5; color: #4a148c; font-size: 0.75rem; }
.net-cell { background: #e3f2fd; color: #0d47a1; min-width: 26px; }
.hdcp-input { border-color: #b8860b; background: #fffbf0; font-size: 0.75rem; }

/* Score colours */
.eagle  { background: #ffd700 !important; color: #333; }
.birdie { background: #ef9a9a !important; }
.par    { background: #a5d6a7 !important; }
.bogey  { background: #90caf9 !important; }
.double { background: #ce93d8 !important; }

/* Stableford */
.stableford-row { display: flex; flex-wrap: wrap; gap: 3px; margin: 0.4rem 0 0.75rem; align-items: center; }
.stableford-grid { display: flex; align-items: center; gap: 4px; margin-bottom: 0.2rem; }
.stableford-grid .grid-9 { flex: 1; margin-bottom: 0; }
.pts-chip { min-width: 22px; text-align: center; border-radius: 10px; padding: 1px 4px; font-size: 0.72rem; font-weight: 700; }
.pts-eagle  { background: #ffd700; color: #333; }
.pts-birdie { background: #e53935; color: #fff; }
.pts-par    { background: #43a047; color: #fff; }
.pts-zero   { background: #eee; color: #999; }
.pts-total  { font-size: 0.8rem; font-weight: 700; color: #2d6a2d; margin-left: 0.25rem; }
.pts-grand-total { font-size: 0.8rem; font-weight: 700; color: #1565c0; text-align: right; margin-bottom: 0.5rem; }

/* Totals */
.total-bar { font-size: 0.85rem; color: #444; margin: 0.25rem 0 0.5rem; }

/* Actions */
.action-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1.5rem; padding-bottom: 2rem; }
.save-status { text-align: center; font-weight: 700; font-size: 0.95rem; margin: 0.5rem 0; padding: 0.5rem; border-radius: 8px; }
.status-ok  { color: #2d6a2d; background: #e8f5e9; }
.status-err { color: #b71c1c; background: #ffebee; }

/* Loading */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem; color: #666; }

/* Sections */
.hdcp-section, .par-section, .score-section { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; }
.hdcp-rank-input { background: #f3e5f5; border-color: #7b1fa2; color: #4a148c; }
.hdcp-hint { font-size: 0.75rem; font-weight: normal; color: #7b1fa2; margin-left: 0.5rem; }
</style>
