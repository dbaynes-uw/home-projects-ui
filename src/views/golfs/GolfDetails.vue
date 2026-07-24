<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ round.course || 'Loading…' }}</h1>
  <div class="details-nav">
    <div class="details-back-links">
      <router-link :to="backDestination"><b>{{ backLabel }}</b></router-link>
      <router-link v-if="playerBackDestination" :to="playerBackDestination" class="player-back-link">
        <b>← {{ playerBackLabel }}</b>
      </router-link>
    </div>
    <router-link
      :to="{ name: 'GolfGroupScorecard', params: { id: String(round.id) } }"
      class="edit-btn"
    >✏️ Edit Round</router-link>
  </div>
  <br/>

  <div v-if="round.id" class="card-display">
    <GolfRoundCard :round="round" class="card" @click="editRound" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfRoundCard from '@/components/golfs/GolfRoundCard.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({ id: { type: String, default: '' } })

const router    = useRouter()
const route     = useRoute()
const golfStore = useGolfStore()

const round = computed(() => golfStore.currentRound ?? {})

const returnPath = computed(() => {
  const from = route.query.from
  return typeof from === 'string' && from.startsWith('/') ? from : ''
})

const backDestination = computed(() =>
  returnPath.value || { name: 'GolfList' }
)

const backLabel = computed(() =>
  returnPath.value.includes('/golf/players') ? '← Player Profiles' : '← Golf List'
)

const returnPlayer = computed(() => {
  const player = route.query.player
  return typeof player === 'string' && player.trim() ? player.trim() : ''
})

const playerBackDestination = computed(() => {
  if (!returnPlayer.value) return null
  return {
    name: 'GolfPlayers',
    query: {
      q: returnPlayer.value,
      sort: typeof route.query.sort === 'string' ? route.query.sort : undefined,
    },
  }
})

const playerBackLabel = computed(() =>
  returnPlayer.value ? `Player: ${returnPlayer.value}` : 'Player'
)

onMounted(() => {
  golfStore.reloadGolfRound(props.id)
})

function editRound() {
  router.push({ name: 'GolfGroupScorecard', params: { id: String(round.value.id) } })
}
</script>

<style scoped>
.details-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 520px;
  margin: 0.25rem 0;
}
.details-back-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.player-back-link {
  color: #1565c0;
  text-decoration: none;
}
.player-back-link:hover { text-decoration: underline; }
.edit-btn {
  background: #1565c0;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.edit-btn:hover { background: #0d47a1; }
</style>
