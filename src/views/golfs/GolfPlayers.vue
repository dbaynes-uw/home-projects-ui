<template>
  <div class="gp-wrap">
    <div class="gp-header">
      <router-link :to="{ name: 'GolfList' }" class="back-link">← Rounds</router-link>
      <h2 class="gp-title">Player Profiles</h2>
    </div>

    <div v-if="loading" class="gp-loading">
      <v-progress-circular indeterminate color="primary" />
      <p>Loading rounds…</p>
    </div>

    <div v-else-if="players.length === 0" class="gp-empty">
      No player data found. Add some rounds first.
    </div>

    <div v-else>
      <!-- ── Summary bar ─────────────────────────────────────────── -->
      <div class="gp-summary">
        <span class="gp-pill"><strong>{{ players.length }}</strong> players</span>
        <span class="gp-pill"><strong>{{ totalRounds }}</strong> rounds</span>
        <span class="gp-pill">Top scorer: <strong>{{ topScorer }}</strong></span>
        <span class="gp-pill pts">Top pts: <strong>{{ topPts }}</strong></span>
      </div>

      <!-- ── Search / sort ──────────────────────────────────────── -->
      <div class="gp-toolbar">
        <v-text-field
          v-model="search"
          clearable
          @click:clear="search = ''"
          placeholder="Search player…"
          density="compact"
          hide-details
          style="max-width: 260px;"
        />
        <div class="gp-sort">
          Sort:
          <button v-for="s in sorts" :key="s.key"
            :class="['sort-btn', sortKey === s.key ? 'active' : '']"
            @click="setSort(s.key)">
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- ── Cards ─────────────────────────────────────────────── -->
      <div class="gp-cards">
        <GolfPlayerCard
          v-for="p in visiblePlayers"
          :key="p.name"
          :player="p"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'
import GolfPlayerCard from '@/components/golfs/GolfPlayerCard.vue'

const golfStore = useGolfStore()
const search    = ref('')
const sortKey   = ref('name')

const sorts = [
  { key: 'name',     label: 'Name'   },
  { key: 'rounds',   label: 'Rounds' },
  { key: 'avgScore', label: 'Avg Score' },
  { key: 'avgPts',   label: 'Avg Pts' },
]

const loading = computed(() => golfStore.loading)

onMounted(() => {
  if (!golfStore.golfRounds.length) golfStore.fetchGolfRounds()
})

// ── Helpers ────────────────────────────────────────────────────────────────
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
function stablefordTotal(ps, round) {
  let t = 0
  for (let i = 1; i <= 18; i++) t += stablefordPts(ps, round, i)
  return t
}

// ── Build player map from all rounds ──────────────────────────────────────
const players = computed(() => {
  const map = new Map()
  golfStore.golfRounds.forEach(round => {
    ;(round.player_scores || []).forEach(ps => {
      const name = ps.player_name?.trim() || 'Unknown'
      if (!map.has(name)) map.set(name, { name, rounds: [] })
      map.get(name).rounds.push({ ps, round })
    })
  })

  return Array.from(map.values()).map(p => {
    const scores = p.rounds.map(r => sumHoles(r.ps, 'score', 1, 18)).filter(v => v > 0)
    const pts    = p.rounds.map(r => stablefordTotal(r.ps, r.round))
    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : Infinity
    return { ...p, _avgScore: avg(scores), _avgPts: avg(pts) }
  })
})

const visiblePlayers = computed(() => {
  let list = [...players.value]
  if (search.value?.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  list.sort((a, b) => {
    if (sortKey.value === 'name')     return a.name.localeCompare(b.name)
    if (sortKey.value === 'rounds')   return b.rounds.length - a.rounds.length
    if (sortKey.value === 'avgScore') return a._avgScore - b._avgScore
    if (sortKey.value === 'avgPts')   return b._avgPts - a._avgPts
    return 0
  })
  return list
})

function setSort(key) { sortKey.value = key }

// ── Summary stats ─────────────────────────────────────────────────────────
const totalRounds = computed(() => golfStore.golfRounds.length)

const topScorer = computed(() => {
  const sorted = [...players.value].filter(p => p._avgScore < Infinity).sort((a, b) => a._avgScore - b._avgScore)
  if (!sorted.length) return '—'
  return `${sorted[0].name} (${sorted[0]._avgScore.toFixed(1)})`
})

const topPts = computed(() => {
  const sorted = [...players.value].filter(p => p._avgPts > 0).sort((a, b) => b._avgPts - a._avgPts)
  if (!sorted.length) return '—'
  return `${sorted[0].name} (${sorted[0]._avgPts.toFixed(1)})`
})
</script>

<style scoped>
.gp-wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.75rem 0.75rem 4rem;
}
.gp-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 0.75rem;
}
.back-link  { font-weight: 600; color: #1565c0; text-decoration: none; }
.gp-title   { margin: 0; font-size: 1.3rem; color: #1b1b1b; }

.gp-loading { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 3rem; color: #666; }
.gp-empty   { text-align: center; padding: 3rem; color: #aaa; }

/* Summary bar */
.gp-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 8px;
}
.gp-pill {
  font-size: 0.82rem;
  padding: 0.2rem 0.6rem;
  background: #fff;
  border: 1px solid #bbdefb;
  border-radius: 20px;
  color: #444;
}
.gp-pill.pts { border-color: #1565c0; color: #1565c0; }

/* Toolbar */
.gp-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.gp-sort { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: #666; }
.sort-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}
.sort-btn:hover  { background: #e3f2fd; border-color: #90caf9; }
.sort-btn.active { background: #1565c0; border-color: #1565c0; color: #fff; }

/* Cards grid */
.gp-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
</style>
