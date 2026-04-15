<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <v-card class="mx-auto mt-5">
    <v-card-title class="pb-0">
      <h2>Golf List</h2>
    </v-card-title>
    <ul>
      <li class="left">
        <button id="button-as-link">
          <router-link  :to="{ name: 'GolfCreate' }">Add Round</router-link>
        </button>
      </li>
      <li>
        <button id="button-as-link" @click="requestIndexDetail">
          <u>Card or Index View</u>
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
        <span v-if="requestIndexDetailFlag == false">
          <h3 id="h3-left">&nbsp;&nbsp;Total: {{ golfs.length }}</h3>
          <span class="h3-left-total-child">Double click Item Below to Edit</span>
          <div class="cards">
            <GolfCard
              v-for="golf in golfs"
              :key="golf.id"
              :golf="golf"
              class="card"
              @dblclick="editGolf(golf)"
            />
            <br />
          </div>
        </span>
        <span v-else>
          <GolfIndex :golfs="golfs" />
        </span>
      </span>
    </span>
    <span v-if="filteredResults.length > 0">
      <span v-if="requestIndexDetailFlag == true">
        <h3 id="h3-left">Total: {{ filteredResults.length }}</h3>
        <span>Double click to Edit</span>
        <div class="cards">
          <GolfCard
            v-for="golf in filteredResults"
            :key="golf.id"
            :golf="golf"
            class="card"
            @dblclick="editGolf(golf)"
          />
          <br />
        </div>
      </span>
      <span v-else>
        <GolfIndex :golfs="filteredResults" />
      </span>
    </span>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import DateFormatService from '@/services/DateFormatService.js'
import GolfIndex from '@/components/golfs/GolfIndex.vue'
import GolfCard from '@/components/golfs/GolfCard.vue'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const router = useRouter()
const golfStore = useGolfStore()

// Local state
const requestIndexDetailFlag = ref(false)
const inputSearchText = ref('')
const filteredResults = ref([])
const sortedbyASC = ref(false)

const golfs = computed(() => golfStore.allGolfs)

onMounted(() => {
  golfStore.fetchGolfs()
})

function editGolf(golf) {
  router.push({ name: 'GolfEdit', params: { id: `${golf.id}` } })
}

function showIndex() {
  filteredResults.value = []
}

function requestIndexDetail() {
  requestIndexDetailFlag.value = !requestIndexDetailFlag.value
}

function searchColumns() {
  filteredResults.value = []
  if (!inputSearchText.value || inputSearchText.value.length === 0) return
  if (golfs.value && golfs.value.length > 0 && inputSearchText.value.length >= 2) {
    golfs.value.forEach((golf) => {
      const searchHasCourse =
        golf.course &&
        golf.course.toLowerCase().includes(inputSearchText.value.toLowerCase())
      const searchHasTeesPlayed =
        golf.tees_played &&
        golf.tees_played.toLowerCase().includes(inputSearchText.value.toLowerCase())
      const searchHasDatePlayed =
        golf.date_played &&
        dayjs(golf.date_played).format('MM-DD-YY').includes(inputSearchText.value)
      if (searchHasCourse || searchHasTeesPlayed || searchHasDatePlayed) {
        filteredResults.value.push(golf)
      }
    })
  }
}

function formatFullYearDate(value) {
  return DateFormatService.formatFullYearDatejs(value)
}
</script>
<style></style>
