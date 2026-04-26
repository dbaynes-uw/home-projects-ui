<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0" style="display:flex; align-items:center; justify-content:space-between;">
      <h2>Golf Rounds</h2>
      <div style="display:flex; gap:0.5rem; align-items:center;">
        <v-btn size="small" :variant="viewMode === 'cards' ? 'flat' : 'outlined'" color="primary" @click="viewMode = 'cards'">
          <i class="fa-solid fa-th-large" /> &nbsp;Cards
        </v-btn>
        <v-btn size="small" :variant="viewMode === 'table' ? 'flat' : 'outlined'" color="primary" @click="viewMode = 'table'">
          <i class="fa-solid fa-table" /> &nbsp;Table
        </v-btn>
        <router-link :to="{ name: 'GolfPlayers' }">
          <v-btn size="small" color="primary" variant="outlined">
            <i class="fa-solid fa-users" />&nbsp;Players
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'GolfGroupScorecard' }">
          <v-btn size="small" color="success">⛳ New Round</v-btn>
        </router-link>
      </div>
    </v-card-title>
    <br/>
  </v-card>
  <br/>

  <!-- ── Table view ──────────────────────────────────────────── -->
  <div v-if="viewMode === 'table'" style="padding: 0 0.5rem;">
    <GolfIndex :rounds="rounds" />
  </div>

  <!-- ── Cards view ──────────────────────────────────────────── -->
  <div v-else style="width: 100%">
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
  </div><!-- /v-else cards view -->
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfRoundCard from '@/components/golfs/GolfRoundCard.vue'
import GolfIndex from '@/components/golfs/GolfIndex.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const router    = useRouter()
const golfStore = useGolfStore()

const inputSearchText = ref('')
const filteredResults = ref([])
const viewMode        = ref('cards')

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
