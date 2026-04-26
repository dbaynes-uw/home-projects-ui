<template>
  <div class="ghc-wrap">
    <!-- ── Tab bar ──────────────────────────────────────────────── -->
    <div class="ghc-tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        :class="['ghc-tab', activeTab === t.key ? 'active' : '']"
        @click="activeTab = t.key"
      >{{ t.label }}</button>
      <div class="ghc-nine-toggle">
        <button :class="['ghc-nine-btn', nine === 'front' ? 'active' : '']" @click="nine = 'front'">Front 9</button>
        <button :class="['ghc-nine-btn', nine === 'back' ? 'active' : '']"  @click="nine = 'back'" :disabled="!hasBack9">Back 9</button>
      </div>
    </div>

    <!-- ── Chart ────────────────────────────────────────────────── -->
    <div class="ghc-chart-wrap">
      <Bar  v-if="activeTab === 'pts'"   :data="ptsData"   :options="barOpts"  :key="`pts-${nine}`"  />
      <Line v-if="activeTab === 'score'" :data="scoreData" :options="lineOpts" :key="`score-${nine}`" />
      <Line v-if="activeTab === 'putts'" :data="puttsData" :options="lineOpts" :key="`putts-${nine}`" />
    </div>

    <!-- ── Legend note ──────────────────────────────────────────── -->
    <p class="ghc-note">Averages across {{ player.rounds.length }} round{{ player.rounds.length !== 1 ? 's' : '' }} · hole {{ holeRange[0] }}–{{ holeRange[holeRange.length-1] }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  player: { type: Object, required: true },
})

const activeTab = ref('pts')
const nine      = ref('front')

const tabs = [
  { key: 'pts',   label: 'Stableford Pts' },
  { key: 'score', label: 'Score vs Par'   },
  { key: 'putts', label: 'Putts'          },
]

// ── Helpers ──────────────────────────────────────────────────────────────
function sumHoles(obj, field, from, to) {
  let t = 0
  for (let i = from; i <= to; i++) t += Number(obj[`${field}_${i}_hole`]) || 0
  return t
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

// ── Hole range ────────────────────────────────────────────────────────────
const hasBack9 = computed(() =>
  props.player.rounds.some(r =>
    Array.from({ length: 9 }, (_, i) => Number(r.ps[`score_${i + 10}_hole`])).some(v => v > 0)
  )
)

const holeRange = computed(() =>
  nine.value === 'front'
    ? Array.from({ length: 9 }, (_, i) => i + 1)
    : Array.from({ length: 9 }, (_, i) => i + 10)
)

// ── Per-hole averages ─────────────────────────────────────────────────────
function avgPerHole(field, transform) {
  return holeRange.value.map(n => {
    const vals = props.player.rounds
      .map(r => transform ? transform(r, n) : Number(r.ps[`${field}_${n}_hole`]) || null)
      .filter(v => v !== null && v > 0)
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  })
}

function avgPar(n) {
  const vals = props.player.rounds
    .map(r => Number(r.round[`par_${n}_hole`]) || null)
    .filter(v => v !== null && v > 0)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 4
}

const avgParLine = computed(() => holeRange.value.map(n => avgPar(n)))

const avgScores = computed(() => avgPerHole('score'))
const avgPutts  = computed(() => avgPerHole('putts'))
const avgPts    = computed(() => avgPerHole(null, (r, n) => stablefordPts(r.ps, r.round, n)))

// ── Labels ────────────────────────────────────────────────────────────────
const labels = computed(() => holeRange.value.map(n => `H${n}`))

// ── Points bar chart data ─────────────────────────────────────────────────
const ptsData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Avg Pts',
      data: avgPts.value,
      backgroundColor: avgPts.value.map(v =>
        v >= 2.5 ? 'rgba(255,193,7,0.85)'   // eagle-ish
        : v >= 1.5 ? 'rgba(229,57,53,0.8)'  // birdie-ish
        : v >= 0.8 ? 'rgba(67,160,71,0.8)'  // par-ish
        : 'rgba(200,200,200,0.7)'            // below par
      ),
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}))

// ── Score line chart data ─────────────────────────────────────────────────
const scoreData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Avg Score',
      data: avgScores.value,
      borderColor: '#1565c0',
      backgroundColor: 'rgba(21,101,192,0.1)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'Par',
      data: avgParLine.value,
      borderColor: '#43a047',
      borderDash: [5, 4],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0,
    },
  ],
}))

// ── Putts line chart data ─────────────────────────────────────────────────
const puttsData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Avg Putts',
      data: avgPutts.value,
      borderColor: '#7b1fa2',
      backgroundColor: 'rgba(123,31,162,0.1)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}))

// ── Chart options ─────────────────────────────────────────────────────────
const commonOpts = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f0f0f0' } },
  },
}

const barOpts  = { ...commonOpts, scales: { ...commonOpts.scales, y: { ...commonOpts.scales.y, max: 3 } } }
const lineOpts = { ...commonOpts }
</script>

<style scoped>
.ghc-wrap { padding: 0.5rem 0.75rem 0.75rem; }

.ghc-tabs {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.ghc-tab {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}
.ghc-tab:hover  { background: #e3f2fd; border-color: #90caf9; }
.ghc-tab.active { background: #1565c0; border-color: #1565c0; color: #fff; }

.ghc-nine-toggle { display: flex; gap: 0.25rem; margin-left: auto; }
.ghc-nine-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s;
}
.ghc-nine-btn:disabled { opacity: 0.4; cursor: default; }
.ghc-nine-btn.active { background: #2d6a2d; border-color: #2d6a2d; color: #fff; }
.ghc-nine-btn:not(.active):not(:disabled):hover { background: #e8f5e9; border-color: #81c784; }

.ghc-chart-wrap { position: relative; height: 180px; }
.ghc-note { font-size: 0.65rem; color: #aaa; text-align: center; margin: 0.25rem 0 0; }
</style>
