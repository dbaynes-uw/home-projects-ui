<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Golf Rounds</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link :to="{ name: 'GolfGroupScorecard' }">⛳ New Round</router-link>
        </button>
      </li>
    </ul>
    <br/>
  </v-card>
  <br/>
  <div style="width: 100%">
    <div class="auto-search-container">
      <v-text-field
        clearable
        clear-icon="fas fa-close"
        @click:clear="showIndex"
        type="text"
        class="np-input-search"
        v-model="inputSearchText"
        placeholder="Search"
        autocomplete="off"
        v-on:keyup="searchColumns"
      />
    </div>
  </div>

  <div class="golf-list">
    <span v-if="filteredResults.length == 0">
      <span v-if="inputSearchText && inputSearchText.length >= 2">
        <h3 id="h3-left">No Search Results Returned</h3>
      </span>
      <span v-else>
        <h3 id="h3-left">&nbsp;&nbsp;Total: {{ rounds.length }}</h3>
        <span class="h3-left-total-child">Double click to edit</span>
        <div class="cards">
          <GolfRoundCard
            v-for="round in rounds"
            :key="round.id"
            :round="round"
            class="card"
            @dblclick="editRound(round)"
          />
          <br />
        </div>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
      <div class="cards">
        <GolfRoundCard
          v-for="round in filteredResults"
          :key="round.id"
          :round="round"
          class="card"
          @dblclick="editRound(round)"
        />
        <br />
      </div>
    </span>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfRoundCard from '@/components/golfs/GolfRoundCard.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const router    = useRouter()
const golfStore = useGolfStore()

const inputSearchText = ref('')
const filteredResults = ref([])

const rounds = computed(() => golfStore.allGolfRounds)

onMounted(() => {
  golfStore.fetchGolfRounds()
})

function editRound(round) {
  router.push({ name: 'GolfGroupScorecard', params: { id: String(round.id) } })
}

function showIndex() {
  filteredResults.value = []
}

function searchColumns() {
  filteredResults.value = []
  if (!inputSearchText.value || inputSearchText.value.length < 2) return
  rounds.value.forEach(r => {
    const hasCourse = r.course?.toLowerCase().includes(inputSearchText.value.toLowerCase())
    const hasTees   = r.tees_played?.toLowerCase().includes(inputSearchText.value.toLowerCase())
    const hasDate   = r.date_played && dayjs(r.date_played).format('MM-DD-YY').includes(inputSearchText.value)
    if (hasCourse || hasTees || hasDate) filteredResults.value.push(r)
  })
}
</script>
