<template>
  <div class="gpc-card">
    <!-- ── Card header ──────────────────────────────────────────── -->
    <div class="gpc-header">
      <div class="gpc-avatar">{{ initials }}</div>
      <div class="gpc-title">
        <h3 class="gpc-name">{{ player.name }}</h3>
        <span class="gpc-rounds">{{ filteredRounds.length }} round{{ filteredRounds.length !== 1 ? 's' : '' }}{{ selectedTees !== 'All' ? ` (${selectedTees})` : '' }}</span>
      </div>
      <button class="gpc-toggle" @click="cycleView" :title="toggleTitle">
        <i :class="toggleIcon" />
      </button>
    </div>

    <!-- ── Stats grid ──────────────────────────────────────────── -->
    <div v-if="viewMode === 'stats'" class="gpc-stats-wrap">
      <!-- Tees filter -->
      <div v-if="player.rounds?.length" class="gpc-tees-bar">
        <template v-if="availableTees.length > 1">
          <button
            v-for="t in ['All', ...availableTees]"
            :key="t"
            :class="['gpc-tee-btn', selectedTees === t ? 'active' : '']"
            :style="selectedTees === t && t !== 'All' ? teeStyle(t) : {}"
            @click="selectedTees = t"
          >{{ t }}</button>
        </template>
        <label class="gpc-rounds-filter-label" for="gpc-rounds-filter-stats">Rounds:</label>
        <select
          id="gpc-rounds-filter-stats"
          v-model.number="selectedRoundsLimit"
          class="gpc-rounds-select"
          :disabled="maxRoundCount === 0"
        >
          <option :value="0">All</option>
          <option v-for="n in roundLimitOptions" :key="`stats-${n}`" :value="n">Last {{ n }}</option>
        </select>
        <span class="gpc-tees-count">({{ filteredRounds.length }} round{{ filteredRounds.length !== 1 ? 's' : '' }})</span>
      </div>
      <div class="gpc-stats">
      <div class="gpc-stat">
        <span class="gpc-stat-val">{{ stats.avgScore }}</span>
        <span class="gpc-stat-label">Avg Score</span>
      </div>
      <div class="gpc-stat">
        <span class="gpc-stat-val pts">{{ stats.avgPts }}</span>
        <span class="gpc-stat-label">Avg Pts</span>
      </div>
      <div class="gpc-stat">
        <span class="gpc-stat-val">{{ stats.avgNet }}</span>
        <span class="gpc-stat-label">Avg Net</span>
      </div>
      <div class="gpc-stat">
        <span class="gpc-stat-val">{{ stats.avgPutts }}</span>
        <span class="gpc-stat-label">Avg Putts</span>
      </div>
      <div class="gpc-stat">
        <span class="gpc-stat-val pen">{{ stats.avgPenalties }}</span>
        <span class="gpc-stat-label">Avg Pen</span>
      </div>
      <div class="gpc-stat">
        <router-link
          v-if="bestScoreRound?.round?.id != null"
          :to="golfDetailsRoute(bestScoreRound.round.id)"
          class="gpc-stat-val gpc-stat-link"
          :title="roundLinkTitle(bestScoreRound, 'Best score')"
        >
          {{ stats.bestScore }}
        </router-link>
        <span v-else class="gpc-stat-val">{{ stats.bestScore }}</span>
        <span class="gpc-stat-label">Best Score</span>
      </div>
      <div class="gpc-stat">
        <router-link
          v-if="bestPtsRound?.round?.id != null"
          :to="golfDetailsRoute(bestPtsRound.round.id)"
          class="gpc-stat-val gpc-stat-link pts"
          :title="roundLinkTitle(bestPtsRound, 'Best points')"
        >
          {{ stats.bestPts }}
        </router-link>
        <span v-else class="gpc-stat-val pts">{{ stats.bestPts }}</span>
        <span class="gpc-stat-label">Best Pts</span>
      </div>
      </div>
    </div>

    <!-- ── Rounds table ─────────────────────────────────────────── -->
    <div v-else-if="viewMode === 'table'" class="gpc-table-wrap">
      <!-- Tees filter -->
      <div v-if="player.rounds?.length" class="gpc-tees-bar">
        <template v-if="availableTees.length > 1">
          <button
            v-for="t in ['All', ...availableTees]"
            :key="t"
            :class="['gpc-tee-btn', selectedTees === t ? 'active' : '']"
            :style="selectedTees === t && t !== 'All' ? teeStyle(t) : {}"
            @click="selectedTees = t"
          >{{ t }}</button>
        </template>
        <label class="gpc-rounds-filter-label" for="gpc-rounds-filter-table">Rounds:</label>
        <select
          id="gpc-rounds-filter-table"
          v-model.number="selectedRoundsLimit"
          class="gpc-rounds-select"
          :disabled="maxRoundCount === 0"
        >
          <option :value="0">All</option>
          <option v-for="n in roundLimitOptions" :key="`table-${n}`" :value="n">Last {{ n }}</option>
        </select>
        <span class="gpc-tees-count">({{ filteredRounds.length }} round{{ filteredRounds.length !== 1 ? 's' : '' }})</span>
      </div>
      <table class="gpc-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Tees</th>
            <th>Hdcp</th>
            <th>Score</th>
            <th>Pts</th>
            <th>Pen</th>
            <th>Net</th>
            <th>Putts</th>
            <th>Holes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in filteredRounds" :key="i">
            <td class="tc nowrap">{{ fmtDate(r.round.date_played) }}</td>
            <td>
              <router-link :to="golfDetailsRoute(r.round.id)" class="gpc-link">
                {{ r.round.course }}
              </router-link>
            </td>
            <td class="tc">{{ r.round.tees_played }}</td>
            <td class="tc">{{ r.ps.course_handicap ?? '—' }}</td>
            <td class="tc" :class="scoreClass(r)"><strong>{{ totalScore(r.ps) || '—' }}</strong></td>
            <td class="tc pts-col"><strong>{{ stablefordTotal(r.ps, r.round) }}</strong></td>
            <td class="tc pen-col">{{ totalPenalties(r.ps) || '—' }}</td>
            <td class="tc">{{ netScore(r.ps) }}</td>
            <td class="tc">{{ totalPutts(r.ps) || '—' }}</td>
            <td class="tc">{{ holesPlayed(r.ps) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Hole charts ──────────────────────────────────────────── -->
    <GolfPlayerHoleChart
      v-if="viewMode === 'chart'"
      :player="player"
      :tees-filter="selectedTees"
      :rounds="filteredRounds"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DateFormatService from '@/services/DateFormatService.js'
import GolfPlayerHoleChart from '@/components/golfs/GolfPlayerHoleChart.vue'

const props = defineProps({
  // player: { name: String, rounds: [{ ps: PlayerScore, round: GolfRound }] }
  player: { type: Object, required: true },
})

const route = useRoute()

// 'stats' | 'table' | 'chart'
const viewMode     = ref('stats')
const selectedTees = ref('All')
const selectedRoundsLimit = ref(0)

// ── Tees helpers ──────────────────────────────────────────────────────────
const TEE_COLOURS = {
  Black:  { bg: '#212121', text: '#fff' },
  Blue:   { bg: '#1565c0', text: '#fff' },
  Silver: { bg: '#9e9e9e', text: '#fff' },
  White:  { bg: '#f5f5f5', text: '#333', border: '#bbb' },
  Gold:   { bg: '#f9a825', text: '#333' },
  Green:  { bg: '#2e7d32', text: '#fff' },
  Red:    { bg: '#c62828', text: '#fff' },
}

function teeStyle(tee) {
  const c = TEE_COLOURS[tee]
  if (!c) return {}
  return { background: c.bg, color: c.text, borderColor: c.border || c.bg }
}

const availableTees = computed(() => {
  const set = new Set(sortedRounds.value.map(r => r.round.tees_played).filter(Boolean))
  return [...set].sort()
})

function dateMillis(v) {
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : 0
}

const sortedRounds = computed(() =>
  [...(props.player.rounds || [])].sort((a, b) => dateMillis(b?.round?.date_played) - dateMillis(a?.round?.date_played))
)

const teesFilteredRounds = computed(() =>
  selectedTees.value === 'All'
    ? sortedRounds.value
    : sortedRounds.value.filter(r => r.round.tees_played === selectedTees.value)
)

const maxRoundCount = computed(() => teesFilteredRounds.value.length)

const roundLimitOptions = computed(() =>
  Array.from({ length: maxRoundCount.value }, (_, i) => i + 1)
)

const filteredRounds = computed(() =>
  selectedRoundsLimit.value > 0
    ? teesFilteredRounds.value.slice(0, Math.min(selectedRoundsLimit.value, maxRoundCount.value))
    : teesFilteredRounds.value
)

function cycleView() {
  viewMode.value = viewMode.value === 'stats' ? 'table' : viewMode.value === 'table' ? 'chart' : 'stats'
}
const toggleTitle = computed(() =>
  viewMode.value === 'stats' ? 'Show rounds table' : viewMode.value === 'table' ? 'Show hole charts' : 'Show stats'
)
const toggleIcon = computed(() =>
  viewMode.value === 'stats' ? 'fa-solid fa-table-list' : viewMode.value === 'table' ? 'fa-solid fa-chart-bar' : 'fa-solid fa-chart-simple'
)

const initials = computed(() =>
  props.player.name
    .split(' ')
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('')
)

// ── Hole helpers ──────────────────────────────────────────────────────────
function sumHoles(obj, field, from, to) {
  let t = 0
  for (let i = from; i <= to; i++) t += Number(obj[`${field}_${i}_hole`]) || 0
  return t
}
function totalScore(ps)    { return sumHoles(ps, 'score',   1, 18) }
function totalPutts(ps)    { return sumHoles(ps, 'putts',   1, 18) }
function totalPenalties(ps){ return sumHoles(ps, 'penalty', 1, 18) }
function holesPlayed(ps) {
  let c = 0
  for (let i = 1; i <= 18; i++) if (Number(ps[`score_${i}_hole`]) > 0) c++
  return c
}

function stablefordPts(ps, round, n) {
  const score   = Number(ps[`score_${n}_hole`])   || 0
  const holePar = Number(round[`par_${n}_hole`])  || 0
  const strokes = Number(ps[`handicap_${n}_hole`]) || 0
  if (!score || !holePar) return 0
  const diff = (score - strokes) - holePar
  if (diff <= -2) return 3
  if (diff === -1) return 2
  if (diff ===  0) return 1
  return 0
}
function stablefordTotal(ps, round) {
  let t = 0
  for (let i = 1; i <= 18; i++) t += stablefordPts(ps, round, i)
  return t
}

function netScore(ps) {
  const score = totalScore(ps)
  if (!score) return '—'
  return score - (ps.course_handicap || 0)
}

function totalPar(round) { return sumHoles(round, 'par', 1, 18) }

function scoreClass(r) {
  const score = totalScore(r.ps)
  const par   = totalPar(r.round)
  if (!score || !par) return ''
  const d = score - par
  if (d < 0)   return 'score-under'
  if (d === 0) return 'score-even'
  if (d <= 5)  return 'score-over'
  return 'score-way-over'
}

function fmtDate(v) { return DateFormatService.formatYearDatejs(v) }

// ── Aggregated stats ──────────────────────────────────────────────────────
const stats = computed(() => {
  const rounds = filteredRounds.value
  if (!rounds.length) return { avgScore: '—', avgPts: '—', avgNet: '—', avgPutts: '—', avgPenalties: '—', bestScore: '—', bestPts: '—' }

  const scores    = rounds.map(r => totalScore(r.ps)).filter(v => v > 0)
  const nets      = rounds.map(r => { const s = totalScore(r.ps); return s ? s - (r.ps.course_handicap || 0) : null }).filter(v => v !== null)
  const putts     = rounds.map(r => totalPutts(r.ps))
  const pts       = rounds.map(r => stablefordTotal(r.ps, r.round))
  const penalties = rounds.map(r => totalPenalties(r.ps))

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—'

  return {
    avgScore:      avg(scores),
    avgPts:        avg(pts),
    avgNet:        avg(nets),
    avgPutts:      avg(putts),
    avgPenalties:  avg(penalties),
    bestScore:     scores.length ? Math.min(...scores) : '—',
    bestPts:       pts.length    ? Math.max(...pts)    : '—',
  }
})

const bestScoreRound = computed(() => {
  const scoredRounds = filteredRounds.value.filter(r => totalScore(r.ps) > 0)
  if (!scoredRounds.length) return null

  const minScore = Math.min(...scoredRounds.map(r => totalScore(r.ps)))
  return scoredRounds.find(r => totalScore(r.ps) === minScore) || null
})

const bestPtsRound = computed(() => {
  const rounds = filteredRounds.value
  if (!rounds.length) return null

  const maxPts = Math.max(...rounds.map(r => stablefordTotal(r.ps, r.round)))
  return rounds.find(r => stablefordTotal(r.ps, r.round) === maxPts) || null
})

function roundLinkTitle(entry, label) {
  if (!entry?.round) return ''
  const course = entry.round.course || 'round'
  const date = fmtDate(entry.round.date_played)
  return `${label}: ${course} (${date})`
}

function golfDetailsRoute(roundId) {
  return {
    name: 'GolfDetails',
    params: { id: String(roundId) },
    query: {
      from: route.fullPath,
      player: props.player.name,
    },
  }
}
</script>

<style scoped>
.gpc-card {
  background: #fff;
  border: 1px solid #90caf9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

/* Header */
.gpc-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
  color: #fff;
}
.gpc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}
.gpc-title   { flex: 1; }
.gpc-name    { margin: 0; font-size: 1rem; font-weight: 700; }
.gpc-rounds  { font-size: 0.75rem; opacity: 0.85; }
.gpc-toggle  {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  transition: background 0.15s;
}
.gpc-toggle:hover { background: rgba(255,255,255,0.35); }

/* Tees filter bar */
.gpc-stats-wrap { display: flex; flex-direction: column; }
.gpc-tees-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  background: #f9f9f9;
  border-bottom: 1px solid #e8e8e8;
}
.gpc-tee-btn {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 0.15rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  color: #444;
  transition: all 0.15s;
}
.gpc-tee-btn:hover  { border-color: #90caf9; background: #e3f2fd; }
.gpc-tee-btn.active { border-color: transparent; }
.gpc-rounds-filter-label { font-size: 0.7rem; color: #666; margin-left: 0.35rem; }
.gpc-rounds-select {
  border: 1px solid #ccc;
  border-radius: 18px;
  padding: 0.12rem 0.45rem;
  font-size: 0.72rem;
  background: #fff;
  color: #444;
}
.gpc-tees-count { font-size: 0.68rem; color: #aaa; margin-left: auto; white-space: nowrap; }
.gpc-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-top: 1px solid #e0e0e0;
}
.gpc-stat {
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0.25rem;
  gap: 2px;
}
.gpc-stat-val {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1b1b1b;
}
.gpc-stat-link { text-decoration: none; }
.gpc-stat-link:hover { text-decoration: underline; }
.gpc-stat-val.pts { color: #1565c0; }
.gpc-stat-val.pen { color: #e65100; }
.pen-col strong   { color: #e65100; }
.gpc-stat-label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Rounds table */
.gpc-table-wrap { overflow-x: auto; }
.gpc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}
.gpc-table thead th {
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.35rem 0.5rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  border-bottom: 2px solid #90caf9;
}
.gpc-table thead th:nth-child(2) { text-align: left; }
.gpc-table tbody tr:nth-child(even) td { background: #f5f9ff; }
.gpc-table tbody tr:hover td { background: #e3f2fd !important; }
.gpc-table td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #e8e8e8;
  vertical-align: middle;
}
.tc    { text-align: center; }
.nowrap { white-space: nowrap; }
.gpc-link { color: #1565c0; text-decoration: none; font-weight: 600; }
.gpc-link:hover { text-decoration: underline; }

.score-under strong    { color: #c62828; }
.score-even strong     { color: #2e7d32; }
.score-over strong     { color: #1565c0; }
.score-way-over strong { color: #6a1b9a; }
.pts-col strong        { color: #1565c0; }
</style>
