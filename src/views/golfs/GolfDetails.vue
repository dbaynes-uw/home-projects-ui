<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ round.course || 'Loading…' }}</h1>
  <div class="details-nav">
    <router-link :to="{ name: 'GolfList' }"><b>← Golf List</b></router-link>
    <router-link
      :to="{ name: 'GolfGroupScorecard', params: { id: String(round.id) } }"
      class="edit-btn"
    >✏️ Edit Round</router-link>
  </div>
  <br/>

  <div v-if="round.id" class="card-display">
    <GolfRoundCard :round="round" class="card" @dblclick="editRound" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfRoundCard from '@/components/golfs/GolfRoundCard.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({ id: { type: String, default: '' } })

const router    = useRouter()
const golfStore = useGolfStore()

const round = computed(() => golfStore.currentRound ?? {})

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
