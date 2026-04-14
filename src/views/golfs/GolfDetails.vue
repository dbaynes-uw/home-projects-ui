<template>
  <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
  <h1>{{ golf.course }}</h1>
  <router-link :to="{ name: 'GolfList' }">
    <b>Back to Golf List</b>
  </router-link>
  <br/>
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