<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ golf.course }}</h1>
  <div class="details-nav">
    <router-link :to="{ name: 'GolfList' }">
      <b>← Golf List</b>
    </router-link>
    <router-link :to="{ name: 'GolfLiveScore', params: { id: String(golf.id) } }" class="live-score-btn">
      ⛳ Live Score
    </router-link>
  </div>
  <br/>
  <h3>{{ statusMessage }}</h3>
  <div class="card-display">
    <GolfCard
      :key="golf.id"
      :golf="golf"
      :origin="origin"
      class="card"
      @dblclick="editGolf(golf)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ConfirmDialogue from '@/components/ConfirmDialogue.vue'
import GolfCard from '@/components/golfs/GolfCard.vue'
import { useGolfStore } from '@/stores/golfs/GolfStore.js'

const props = defineProps({
  id: { type: String, default: '' },
})

const router = useRouter()
const route = useRoute()
const golfStore = useGolfStore()

const statusMessage = ref('')

const golf = computed(() => golfStore.currentGolf ?? {})
const origin = 'GolfDetails'

onMounted(() => {
  statusMessage.value = route.query.success ?? ''
  golfStore.fetchGolf(props.id)
})

function editGolf(g) {
  router.push({ name: 'GolfEdit', params: { id: `${g.id}` } })
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
.live-score-btn {
  background: #2d6a2d;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}
.live-score-btn:hover {
  background: #1b4a1b;
}
</style>