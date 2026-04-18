<template>
  <div id="required-to-prevent-vue-warning">
    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
    <div class="card">
      <p id="p-custom-left-u">{{ golf.course}}</p>
      <ul>
        <li class="li-left">Course: <b>{{ golf.course }}</b></li>
        <li class="li-left">Tees: <b>{{ golf.tees_played }}</b></li>
        <li class="li-left">Date Played: {{ formatYearDate(golf.date_played) }}</li>
        <li class="li-left">Holes Played: <b>{{ GolfCalculations.determineHolesPlayed(golf) }}</b></li>
        <li class="li-left">Par: <b>{{ GolfCalculations.calculateTotalPar(golf) }}</b></li>
        <li class="li-left">Score: <b>{{ GolfCalculations.calculateTotalScore(golf) }}</b></li>        
        <li class="li-left">URL to Course: <b> <a :href="golf.url_to_course" target="_blank">{{ golf.course }}</a></b></li>
        <li class="li-left">Notes:</li>
        <b class="li-left-none" v-for="(notes, idx) in splitList(golf, splitLength)" :key="idx">{{ notes }}</b>
      </ul>
      <br/>
      <span class="fa-stack">
        <router-link :to="{ name: 'GolfEdit', params: { id: `${golf.id}` } }">
          <i class="fa-solid fa-pen-to-square fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-if="currentUrl.includes('/golfs/')" class="fa-stack">
        <router-link :to="{ name: 'GolfList' }">
          <i class="fa-solid fa-backward fa-stack-1x"></i>
        </router-link>
      </span>
      <span v-else>
        <router-link :to="{ name: 'GolfDetails', params: { id: `${golf.id}` } }">
          <i class="fa-solid fa-eye fa-stack-1x"></i>
        </router-link>
      </span>
      <span class="fa-stack">
        <i @click="deleteGolf(golf)" class="fas fa-trash-alt fa-stack-1x">
        </i>
      </span>
      <br />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import DateFormatService from '@/services/DateFormatService.js'
import SplitStringService from '@/services/SplitStringService.js'
import GolfCalculations from '@/components/golfs/GolfCalculations.js'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  golf: {
    type: Object,
    default: () => ({}),
  },
  origin: {
    type: String,
    default: '',
  },
})

const router = useRouter()
const route = useRoute()
const golfStore = useGolfStore()
const confirmDialogue = ref(null)

const currentUrl = route.fullPath
const splitLength = 30

async function deleteGolf(golf) {
  const ok = await confirmDialogue.value.show({
    title: 'Delete Golf from List',
    message:
      'Are you sure you want to delete entry for ' +
      golf.course +
      '? It cannot be undone.',
    okButton: 'Delete',
  })
  if (ok) {
    const result = await golfStore.deleteGolf(golf)
    if (result.success) {
      router.push({ name: 'GolfList' })
    } else {
      alert('Error deleting golf round.')
    }
  }
}

function splitList(golfData, len) {
  return SplitStringService.splitList(golfData.notes, len)
}

function formatYearDate(value) {
  return DateFormatService.formatYearDatejs(value)
}
</script>

<style scoped>
</style>
