<template>
  <div class="gpc-card">
    <!-- ── Card header ──────────────────────────────────────────── -->
    <div class="gpc-header">
      <div class="gpc-avatar">{{ initials }}</div>
      <div class="gpc-title">
        <h3 class="gpc-name">{{ player.name }}</h3>
        <span class="gpc-rounds">{{ player.rounds.length }} round{{ player.rounds.length !== 1 ? 's' : '' }}</span>
      </div>
      <button class="gpc-toggle" @click="showTable = !showTable" :title="showTable ? 'Show stats' : 'Show rounds'">
        <i :class="showTable ? 'fa-solid fa-chart-bar' : 'fa-solid fa-table-list'" />
      </button>
    </div>

    <!-- ── Stats grid ──────────────────────────────────────────── -->
    <div v-if="!showTable" class="gpc-stats">
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
        <span class="gpc-stat-val">{{ stats.bestScore }}</span>
        <span class="gpc-stat-label">Best Score</span>
      </div>
      <div class="gpc-stat">
        <span class="gpc-stat-val pts">{{ stats.bestPts }}</span>
        <span class="gpc-stat-label">Best Pts</span>
      </div>
    </div>

    <!-- ── Rounds table ─────────────────────────────────────────── -->
    <div v-else class="gpc-table-wrap">
      <table class="gpc-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Tees</th>
            <th>Hdcp</th>
            <th>Score</th>
            <th>Pts</th>
            <th>Net</th>
            <th>Putts</th>
            <th>Holes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in player.rounds" :key="i">
            <td class="tc nowrap">{{ fmtDate(r.round.date_played) }}</td>
            <td>
              <router-link :to="{ name: 'GolfDetails', params: { id: String(r.round.id) } }" class="gpc-link">
                {{ r.round.course }}
              </router-link>
            </td>
            <td class="tc">{{ r.round.tees_played }}</td>
            <td class="tc">{{ r.ps.course_handicap ?? '—' }}</td>
            <td class="tc" :class="scoreClass(r)"><strong>{{ totalScore(r.ps) || '—' }}</strong></td>
            <td class="tc pts-col"><strong>{{ stablefordTotal(r.ps, r.round) }}</strong></td>
            <td class="tc">{{ netScore(r.ps) }}</td>
            <td class="tc">{{ totalPutts(r.ps) || '—' }}</td>
            <td class="tc">{{ holesPlayed(r.ps) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DateFormatService from '@/services/DateFormatService.js'

const props = defineProps({
  // player: { name: String, rounds: [{ ps: PlayerScore, round: GolfRound }] }
  player: { type: Object, required: true },
})

const showTable = ref(false)

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
function totalScore(ps)  { return sumHoles(ps, 'score',  1, 18) }
function totalPutts(ps)  { return sumHoles(ps, 'putts',  1, 18) }
function holesPlayed(ps) {
  let c = 0
  for (let i = 1; i <= 18; i++) if (Number(ps[`score_${i}_hole`]) > 0) c++
  return c
}

function stablefordPts(ps, round, n) {
  const score   = Number(ps[`score_${n}_hole`])   || 0
  const holePar = Number(round[`par_${n}_hole`])  || 0
  const strokes = Number(ps[`penalty_${n}_hole`]) || 0
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
  const rounds = props.player.rounds
  if (!rounds.length) return { avgScore: '—', avgPts: '—', avgNet: '—', avgPutts: '—', bestScore: '—', bestPts: '—' }

  const scores = rounds.map(r => totalScore(r.ps)).filter(v => v > 0)
  const nets   = rounds.map(r => { const s = totalScore(r.ps); return s ? s - (r.ps.course_handicap || 0) : null }).filter(v => v !== null)
  const putts  = rounds.map(r => totalPutts(r.ps)).filter(v => v > 0)
  const pts    = rounds.map(r => stablefordTotal(r.ps, r.round))

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—'

  return {
    avgScore:  avg(scores),
    avgPts:    avg(pts),
    avgNet:    avg(nets),
    avgPutts:  avg(putts),
    bestScore: scores.length ? Math.min(...scores) : '—',
    bestPts:   pts.length    ? Math.max(...pts)    : '—',
  }
})
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

/* Stats grid */
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
.gpc-stat-val.pts { color: #1565c0; }
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
