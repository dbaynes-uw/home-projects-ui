<template>
  <confirm-dialogue ref="confirmDialogue" />

  <div class="gi-toolbar">
    <v-text-field
      v-model="search"
      clearable
      clear-icon="fas fa-close"
      @click:clear="search = ''"
      placeholder="Search course, tees, player…"
      density="compact"
      hide-details
      class="gi-search"
    />
    <span class="gi-count">{{ visibleRounds.length }} round{{ visibleRounds.length !== 1 ? 's' : '' }}</span>
  </div>

  <div class="gi-wrap">
    <table class="gi-table">
      <thead>
        <tr>
          <th @click="sort('date_played')" class="sortable">Date {{ sortIcon('date_played') }}</th>
          <th @click="sort('course')" class="sortable">Course {{ sortIcon('course') }}</th>
          <th>Tees</th>
          <th class="num-col">Par</th>
          <th>Player</th>
          <th class="num-col">Hdcp</th>
          <th class="num-col">Score</th>
          <th class="num-col">Pts</th>
          <th class="num-col">Net</th>
          <th class="num-col">Holes</th>
          <th class="act-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="round in visibleRounds" :key="round.id">
          <tr
            v-for="(ps, pIdx) in roundPlayers(round)"
            :key="`${round.id}-${pIdx}`"
            :class="pIdx % 2 === 0 ? 'row-even' : 'row-odd'"
          >
            <td v-if="pIdx === 0" :rowspan="roundPlayers(round).length" class="td-date">
              {{ fmtDate(round.date_played) }}
            </td>
            <td v-if="pIdx === 0" :rowspan="roundPlayers(round).length" class="td-course">
              {{ round.course }}
              <div v-if="round.course_location" class="td-location">{{ round.course_location }}</div>
            </td>
            <td v-if="pIdx === 0" :rowspan="roundPlayers(round).length" class="td-center">
              {{ round.tees_played }}
            </td>
            <td v-if="pIdx === 0" :rowspan="roundPlayers(round).length" class="td-center num-col">
              {{ totalPar(round) || '—' }}
            </td>
            <td class="td-player">{{ ps.player_name || `Player ${pIdx + 1}` }}</td>
            <td class="td-center num-col">{{ ps.course_handicap ?? '—' }}</td>
            <td class="td-center num-col" :class="scoreClass(ps, round)">
              <strong>{{ totalScore(ps) || '—' }}</strong>
            </td>
            <td class="td-center num-col pts-col">
              <strong>{{ stablefordTotal(ps, round) }}</strong>
            </td>
            <td class="td-center num-col">{{ netScore(ps) }}</td>
            <td class="td-center num-col">{{ holesPlayed(ps) }}</td>
            <td v-if="pIdx === 0" :rowspan="roundPlayers(round).length" class="td-center act-col">
              <router-link :to="{ name: 'GolfGroupScorecard', params: { id: String(round.id) } }" title="Edit">
                <i class="fa-solid fa-pen-to-square act-icon" />
              </router-link>
              <router-link :to="{ name: 'GolfDetails', params: { id: String(round.id) } }" title="View">
                <i class="fa-solid fa-eye act-icon" />
              </router-link>
              <i @click="deleteRound(round)" class="fa-solid fa-trash-alt act-icon act-del" title="Delete" />
            </td>
          </tr>
        </template>
        <tr v-if="visibleRounds.length === 0">
          <td colspan="11" class="td-empty">No rounds found.</td>
        </tr>
      </tbody>
      <tfoot v-if="visibleRounds.length > 0">
        <tr>
          <td colspan="6" class="td-avg-label">Averages (9-hole / 18-hole):</td>
          <td class="td-center num-col td-avg">{{ avgScore9 }} / {{ avgScore18 }}</td>
          <td class="td-center num-col td-avg">{{ avgPts9 }} / {{ avgPts18 }}</td>
          <td colspan="3" />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  rounds: { type: Array, default: () => [] },
})

const golfStore       = useGolfStore()
const confirmDialogue = ref(null)
const search          = ref('')
const sortKey         = ref('date_played')
const sortAsc         = ref(false)

// ── Helpers ──────────────────────────────────────────────────────────────
function sumHoles(obj, field, from, to) {
  let t = 0
  for (let i = from; i <= to; i++) t += Number(obj[`${field}_${i}_hole`]) || 0
  return t
}

function totalPar(round)  { return sumHoles(round, 'par',   1, 18) }
function totalScore(ps)   { return sumHoles(ps,    'score', 1, 18) }

function holesPlayed(ps) {
  let c = 0
  for (let i = 1; i <= 18; i++) if (Number(ps[`score_${i}_hole`]) > 0) c++
  return c
}

function stablefordPts(ps, round, n) {
  const score    = Number(ps[`score_${n}_hole`])   || 0
  const holePar  = Number(round[`par_${n}_hole`])  || 0
  const strokes  = Number(ps[`penalty_${n}_hole`]) || 0
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

function scoreClass(ps, round) {
  const score = totalScore(ps)
  const par   = totalPar(round)
  if (!score || !par) return ''
  const d = score - par
  if (d < 0)   return 'score-under'
  if (d === 0) return 'score-even'
  if (d <= 5)  return 'score-over'
  return 'score-way-over'
}

function roundPlayers(round) {
  const ps = round.player_scores || []
  return ps.length ? ps : [{}]
}

function fmtDate(v) { return DateFormatService.formatYearDatejs(v) }

// ── Sort & filter ─────────────────────────────────────────────────────────
const visibleRounds = computed(() => {
  let list = [...props.rounds]
  if (search.value?.length >= 1) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.course?.toLowerCase().includes(q) ||
      r.course_location?.toLowerCase().includes(q) ||
      r.tees_played?.toLowerCase().includes(q) ||
      r.date_played?.includes(q) ||
      (r.player_scores || []).some(ps => ps.player_name?.toLowerCase().includes(q))
    )
  }
  list.sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    if (av < bv) return sortAsc.value ? -1 : 1
    if (av > bv) return sortAsc.value ?  1 : -1
    return 0
  })
  return list
})

function sort(key) {
  if (sortKey.value === key) { sortAsc.value = !sortAsc.value } else { sortKey.value = key; sortAsc.value = false }
}
function sortIcon(key) {
  return sortKey.value !== key ? '' : sortAsc.value ? '▲' : '▼'
}

// ── Averages ──────────────────────────────────────────────────────────────
function allPS(holeCount) {
  const out = []
  visibleRounds.value.forEach(r => {
    ;(r.player_scores || []).forEach(ps => {
      if (holesPlayed(ps) === holeCount) out.push({ ps, round: r })
    })
  })
  return out
}

const avgScore9  = computed(() => { const l = allPS(9);  if (!l.length) return '—'; return (l.reduce((s,{ps})=>s+sumHoles(ps,'score',1,9),0)/l.length).toFixed(1) })
const avgScore18 = computed(() => { const l = allPS(18); if (!l.length) return '—'; return (l.reduce((s,{ps})=>s+sumHoles(ps,'score',1,18),0)/l.length).toFixed(1) })
const avgPts9    = computed(() => { const l = allPS(9);  if (!l.length) return '—'; return (l.reduce((s,{ps,round})=>s+stablefordTotal(ps,round),0)/l.length).toFixed(1) })
const avgPts18   = computed(() => { const l = allPS(18); if (!l.length) return '—'; return (l.reduce((s,{ps,round})=>s+stablefordTotal(ps,round),0)/l.length).toFixed(1) })

// ── Delete ─────────────────────────────────────────────────────────────────
async function deleteRound(round) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Golf Round',
    message: `Delete round at ${round.course} (${fmtDate(round.date_played)})? This cannot be undone.`,
    okButton: 'Delete',
  })
  if (ok) {
    const result = await golfStore.deleteGolfRound(round.id)
    if (!result.success) alert('Error deleting round.')
  }
}
</script>

<style scoped>
.gi-toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
.gi-search  { max-width: 320px; }
.gi-count   { font-size: 0.85rem; color: #666; white-space: nowrap; }
.gi-wrap    { overflow-x: auto; }

.gi-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.gi-table thead th {
  background: #1565c0;
  color: #fff;
  padding: 0.45rem 0.6rem;
  text-align: left;
  white-space: nowrap;
  border-bottom: 2px solid #0d47a1;
}
.gi-table thead th.sortable { cursor: pointer; user-select: none; }
.gi-table thead th.sortable:hover { background: #1976d2; }
.gi-table tbody tr:hover td { background: #e3f2fd !important; }
.row-even td { background: #fff; }
.row-odd  td { background: #f5f9ff; }
.gi-table td {
  padding: 0.35rem 0.6rem;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.td-date     { white-space: nowrap; color: #555; font-size: 0.8rem; }
.td-course   { font-weight: 600; }
.td-location { font-size: 0.72rem; color: #888; font-weight: 400; }
.td-player   { padding-left: 0.75rem; }
.td-center   { text-align: center; }
.td-empty    { text-align: center; padding: 2rem; color: #aaa; }
.num-col     { text-align: center; width: 52px; }
.act-col     { text-align: center; width: 80px; }

.score-under strong    { color: #c62828; }
.score-even strong     { color: #2e7d32; }
.score-over strong     { color: #1565c0; }
.score-way-over strong { color: #6a1b9a; }
.pts-col strong        { color: #1565c0; }

.act-icon { color: #888; margin: 0 4px; cursor: pointer; font-size: 0.9rem; transition: color 0.15s; }
.act-icon:hover { color: #1565c0; }
.act-del:hover  { color: #c62828 !important; }

tfoot td { background: #e8f5e9; border-top: 2px solid #a5d6a7; font-size: 0.82rem; padding: 0.4rem 0.6rem; }
.td-avg-label { text-align: right; font-weight: 600; color: #2e7d32; }
.td-avg       { font-weight: 700; color: #1b5e20; }
</style>
