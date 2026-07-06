<template>
  <div id="required-to-prevent-vue-warning">
    <ConfirmDialogue ref="confirmDialogue" />
    <div class="card">
      <p id="p-custom-left-u">{{ round.course }}</p>
      <ul class="golf-round-list">
        <li class="li-left">Course: <b>{{ round.course }}</b></li>
        <li class="li-left">Location: <b>{{ round.course_location }}</b></li>
        <li class="li-left">Tees: <b>{{ round.tees_played }}</b></li>
        <li class="li-left">Date: {{ formatDate(round.date_played) }}</li>
        <li class="li-left">Players: <b>{{ playerCount }}</b></li>
        <li class="li-left">Par: <b>{{ totalPar }}</b></li>
        <li v-if="(round.player_scores || []).length" class="player-grid-header">
          <span>Player</span>
          <span>Score (Hdcp)</span>
          <span>Pts</span>
          <span>Pens</span>
        </li>
        <li v-for="(ps, i) in round.player_scores" :key="i" class="player-grid-row">
          <span class="player-col player-name">{{ ps.player_name || `Player ${i + 1}` }}</span>
          <span class="player-col player-score">
            <b>{{ playerScore(ps) }}</b>
            <span class="player-hdcp"> (hdcp {{ ps.course_handicap ?? '—' }})</span>
          </span>
          <span class="player-col player-pts"><b>{{ playerPoints(ps) }}</b></span>
          <span class="player-col player-pen"><b>{{ playerPenalties(ps) }}</b></span>
        </li>
        <li class="li-left">Total Points: <b>{{ totalPoints }}</b></li>
        <li v-if="round.url_to_course" class="li-left">
          URL: <a :href="round.url_to_course" target="_blank">{{ round.course }}</a>
        </li>
        <li v-if="round.notes" class="li-left">Notes: {{ round.notes }}</li>
      </ul>
      <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'GolfGroupScorecard', params: { id: `${round.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <router-link :to="{ name: 'GolfDetails', params: { id: `${round.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteRound" class="fas fa-trash-alt fa-stack-1x"></i>
      </span>
      <br />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  round: { type: Object, default: () => ({}) },
})

const router    = useRouter()
const golfStore = useGolfStore()
const confirmDialogue = ref(null)

const playerCount = computed(() => (props.round.player_scores || []).length)

const totalPar = computed(() => {
  let total = 0
  for (let n = 1; n <= 18; n++) {
    total += Number(props.round[`par_${n}_hole`]) || 0
  }
  return total || '—'
})

function playerScore(ps) {
  let total = 0
  for (let n = 1; n <= 18; n++) {
    total += Number(ps[`score_${n}_hole`]) || 0
  }
  return total || '—'
}

function playerPoints(ps) {
  let pts = 0
  for (let n = 1; n <= 18; n++) {
    const score  = Number(ps[`score_${n}_hole`])
    const par    = Number(props.round[`par_${n}_hole`])
    const hdcp   = Number(ps[`handicap_${n}_hole`]) || 0
    if (score && par) {
      const netScore = score - hdcp
      const diff     = par - netScore
      pts += diff >= 2 ? 3 : diff === 1 ? 2 : diff === 0 ? 1 : 0
    }
  }
  return pts || '—'
}

function playerPenalties(ps) {
  let total = 0
  for (let n = 1; n <= 18; n++) {
    total += Number(ps[`penalty_${n}_hole`]) || 0
  }
  return total || '—'
}

const totalPoints = computed(() => {
  const players = props.round.player_scores || []
  if (!players.length) return '—'
  const sum = players.reduce((acc, ps) => {
    const p = playerPoints(ps)
    return acc + (p === '—' ? 0 : p)
  }, 0)
  return sum || '—'
})

function formatDate(value) {
  return DateFormatService.formatYearDatejs(value)
}

async function deleteRound() {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Golf Round',
    message: `Delete round at ${props.round.course}? This cannot be undone.`,
    okButton: 'Delete',
  })
  if (ok) {
    const result = await golfStore.deleteGolfRound(props.round.id)
    if (result.success) {
      router.push({ name: 'GolfList' })
    } else {
      alert('Error deleting round.')
    }
  }
}
</script>
<style scoped>
.golf-round-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.player-grid-header,
.player-grid-row {
  display: grid;
  grid-template-columns: minmax(120px, 1.6fr) minmax(120px, 1.2fr) 52px 52px;
  column-gap: 0.5rem;
  align-items: center;
}

.player-grid-header {
  margin-top: 0.35rem;
  padding: 0.2rem 0;
  border-top: 1px solid #e6ecf4;
  border-bottom: 1px solid #e6ecf4;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.player-grid-row {
  padding: 0.15rem 0;
}

.player-col {
  min-width: 0;
}

.player-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-score,
.player-pts,
.player-pen {
  text-align: center;
  white-space: nowrap;
}

.player-hdcp {
  color: #64748b;
  font-size: 0.78rem;
}

@media (max-width: 640px) {
  .player-grid-header,
  .player-grid-row {
    grid-template-columns: minmax(100px, 1.4fr) minmax(110px, 1.1fr) 44px 48px;
    column-gap: 0.35rem;
    font-size: 0.85rem;
  }

  .player-hdcp {
    font-size: 0.72rem;
  }
}
</style>
