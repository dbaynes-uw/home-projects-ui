<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ round.course }}</p>
      <ul>
        <li class="li-left">Course: <b>{{ round.course }}</b></li>
        <li class="li-left">Location: <b>{{ round.course_location }}</b></li>
        <li class="li-left">Tees: <b>{{ round.tees_played }}</b></li>
        <li class="li-left">Date: {{ formatDate(round.date_played) }}</li>
        <li class="li-left">Players: <b>{{ playerCount }}</b></li>
        <li class="li-left">Par: <b>{{ totalPar }}</b></li>
        <li v-for="(ps, i) in round.player_scores" :key="i" class="li-left">
          {{ ps.player_name || `Player ${i + 1}` }}:
          <b>{{ playerScore(ps) }}</b>
          <span v-if="ps.course_handicap"> (hdcp {{ ps.course_handicap }})</span>
        </li>
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
<style scoped></style>
